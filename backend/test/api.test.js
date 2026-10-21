// End-to-end API tests: boots the real server against an in-memory MongoDB,
// lets it auto-seed, then exercises auth, RBAC and the public endpoints over HTTP.
// Run with: npm test   (first run downloads a MongoDB binary, ~600 MB, then it's cached)
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { spawn } = require('child_process');
const { MongoMemoryServer } = require('mongodb-memory-server');

const PORT = 5055;
const base = `http://localhost:${PORT}/api`;
let mongo, server, adminToken, hmToken;

const call = async (method, url, body, token) => {
    const res = await fetch(base + url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch { /* empty body */ }
    return { status: res.status, data };
};

before(async () => {
    mongo = await MongoMemoryServer.create();
    server = spawn('node', ['index.js'], {
        cwd: path.join(__dirname, '..'),
        env: {
            ...process.env, PORT, NODE_ENV: 'test',
            MONGODB_URI: mongo.getUri('schoolmonitor'),
            JWT_SECRET: 'test-secret', GOOGLE_CLIENT_ID: 'test-client',
        },
    });
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('server did not start in 30s')), 30_000);
        server.stdout.on('data', d => { if (String(d).includes('Seed complete')) { clearTimeout(timer); resolve(); } });
        server.on('exit', code => reject(new Error(`server exited with ${code}`)));
    });
    adminToken = (await call('POST', '/auth/login', { email: 'kendrapramuk@zp.edu', password: 'admin123' })).data.token;
    hmToken    = (await call('POST', '/auth/login', { email: 'hm.paithan@zp.edu',  password: 'hm123' })).data.token;
});

after(async () => {
    server?.kill();
    await mongo?.stop();
});

test('seeded demo accounts can log in', () => {
    assert.ok(adminToken, 'kendrapramuk login failed');
    assert.ok(hmToken, 'hm.paithan login failed');
});

test('public school directory hides access codes', async () => {
    const list = await call('GET', '/schools');
    assert.equal(list.data.length, 12);
    assert.ok(list.data.every(s => !('accessCode' in s)));
    const one = await call('GET', '/schools/3');
    assert.equal(one.status, 200);
    assert.ok(!('accessCode' in one.data));
});

test('public visitors only see approved events', async () => {
    const all = await call('GET', '/events');
    const pending = await call('GET', '/events?status=pending');
    assert.ok(all.data.length > 0);
    assert.ok([...all.data, ...pending.data].every(e => e.status === 'approved'));
});

test('Google endpoint ignores identity sent in the body', async () => {
    const forged = await call('POST', '/auth/google', { email: 'kendrapramuk@zp.edu', name: 'x' });
    assert.equal(forged.status, 400);
    assert.equal(forged.data.token, undefined);
    const bad = await call('POST', '/auth/google', { idToken: 'not-a-real-token' });
    assert.equal(bad.status, 401);
});

test('registration uses the access code stored on the school', async () => {
    const codes = await call('GET', '/schools/admin/access-codes', null, adminToken);
    const kannad = codes.data.find(s => s.id === 2).accessCode;
    const wrong = await call('POST', '/auth/register', { name: 'A', email: 'a@x.in', password: 'secret1', schoolId: 2, accessCode: 'WRONG' });
    assert.equal(wrong.status, 400);
    const ok = await call('POST', '/auth/register', { name: 'New HM', email: 'new.hm@x.in', password: 'secret1', schoolId: 2, accessCode: kannad.toLowerCase() });
    assert.equal(ok.status, 201);
    assert.equal(ok.data.user.schoolId, 2);
});

test('access codes are Kendrapramuk-only', async () => {
    assert.equal((await call('GET', '/schools/admin/access-codes', null, hmToken)).status, 403);
});

test('Mukhyadhyapak attendance is scoped to their own school', async () => {
    const own = await call('POST', '/attendance', { schoolId: 1, date: '2026-01-05', present: 400, absent: 20, total: 420 }, hmToken);
    assert.equal(own.status, 201);
    const other = await call('POST', '/attendance', { schoolId: 5, date: '2026-01-05', present: 1, absent: 1, total: 2 }, hmToken);
    assert.equal(other.status, 403);
    const view = await call('GET', '/attendance?schoolId=5', null, hmToken);
    assert.ok(view.data.every(r => r.schoolId === 1));
});

test('report status only accepts known values', async () => {
    const reports = await call('GET', '/reports', null, adminToken);
    const id = reports.data[0]._id;
    assert.equal((await call('PATCH', `/reports/${id}/status`, { status: 'hacked' }, adminToken)).status, 400);
    const ok = await call('PATCH', `/reports/${id}/status`, { status: 'reviewed' }, adminToken);
    assert.equal(ok.data.status, 'reviewed');
});

test('password reset rejects unknown tokens', async () => {
    assert.equal((await call('POST', '/auth/forgot-password', { email: 'nobody@x.in' })).status, 200);
    assert.equal((await call('POST', '/auth/reset-password', { token: 'deadbeef', password: 'whatever1' })).status, 400);
});

test('RBAC: protected routes need the right role', async () => {
    assert.equal((await call('GET', '/reports')).status, 401);
    assert.equal((await call('GET', '/users', null, hmToken)).status, 403);
    assert.equal((await call('GET', '/users', null, adminToken)).status, 200);
});
