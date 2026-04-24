require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./mongoose');
const User = require('./models/User');
const School = require('./models/School');
const { Attendance, Event, Report, Notification, GRDocument } = require('./models/index');

const h = (p) => bcrypt.hashSync(p, 8);

const schools = [
    { id: 1,  name: 'ZP School Paithan',           district: 'Chh. Sambhajinagar', students: 420, teachers: 28, accessCode: 'ZPPT-2026' },
    { id: 2,  name: 'ZP School Kannad',             district: 'Chh. Sambhajinagar', students: 380, teachers: 24, accessCode: 'ZPKN-2026' },
    { id: 3,  name: 'ZP School Phulambri',           district: 'Chh. Sambhajinagar', students: 410, teachers: 26, accessCode: 'ZPPH-2026' },
    { id: 4,  name: 'ZP School Sillod',             district: 'Chh. Sambhajinagar', students: 360, teachers: 22, accessCode: 'ZPSL-2026' },
    { id: 5,  name: 'ZP School Vaijapur',           district: 'Chh. Sambhajinagar', students: 390, teachers: 25, accessCode: 'ZPVJ-2026' },
    { id: 6,  name: 'ZP School Gangapur',            district: 'Chh. Sambhajinagar', students: 370, teachers: 23, accessCode: 'ZPGP-2026' },
    { id: 7,  name: 'ZP School Khuldabad',          district: 'Chh. Sambhajinagar', students: 340, teachers: 21, accessCode: 'ZPKD-2026' },
    { id: 8,  name: 'ZP School Soegaon',            district: 'Chh. Sambhajinagar', students: 310, teachers: 20, accessCode: 'ZPSG-2026' },
    { id: 9,  name: 'ZP School Aurangabad City',    district: 'Chh. Sambhajinagar', students: 330, teachers: 21, accessCode: 'ZPAC-2026' },
    { id: 10, name: 'ZP School Jalna Road',         district: 'Chh. Sambhajinagar', students: 350, teachers: 22, accessCode: 'ZPJR-2026' },
    { id: 11, name: 'ZP School Begumpura',           district: 'Chh. Sambhajinagar', students: 320, teachers: 20, accessCode: 'ZPBG-2026' },
    { id: 12, name: 'ZP School Waluj',              district: 'Chh. Sambhajinagar', students: 300, teachers: 19, accessCode: 'ZPWL-2026' },
];

const hmNames   = ['Patil','Desai','Rao','Khan','Jadhav','More','Shinde','Kulkarni','Gaikwad','Pawar','Salve','Bhosale'];
const hmEmails  = ['paithan','kannad','phulambri','sillod','vaijapur','gangapur','khuldabad','soegaon','aurangabad','jalnaroad','begumpura','waluj'];

// ── Helper: generate a date string N days ago ──
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

// ── Helper: random int between min and max (inclusive) ──
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Generate 30 days of attendance per school ──
function generateAttendance() {
    const records = [];
    for (const school of schools) {
        for (let day = 0; day < 30; day++) {
            const date = daysAgo(day);
            const dayOfWeek = new Date(date).getDay();
            // Skip Sundays (0)
            if (dayOfWeek === 0) continue;
            const total = school.students;
            // Saturday = lower attendance, monsoon dips, random variation
            const baseRate = dayOfWeek === 6 ? 0.75 : 0.88;
            const variance = (Math.random() * 0.10) - 0.05; // ±5%
            const attendanceRate = Math.min(0.99, Math.max(0.60, baseRate + variance));
            const present = Math.round(total * attendanceRate);
            const absent = total - present;
            records.push({ schoolId: school.id, date, present, absent, total });
        }
    }
    return records;
}

// ── Generate diverse events ──
function generateEvents() {
    const eventTypes = [
        { title: 'Annual Sports Day',          desc: 'Inter-school sports competition with track & field events.', category: 'Sports' },
        { title: 'Science Exhibition',         desc: 'Student science project showcase and competition.', category: 'Academics' },
        { title: 'Cultural Fest',              desc: 'Annual cultural program featuring music, dance, and drama.', category: 'Arts & Culture' },
        { title: 'Republic Day Parade',        desc: 'Republic Day celebration with flag hoisting and march.', category: 'Administrative' },
        { title: 'Parent-Teacher Meeting',     desc: 'Quarterly meeting to discuss student progress.', category: 'Administrative' },
        { title: 'Independence Day Program',   desc: 'Independence Day celebration with patriotic performances.', category: 'Arts & Culture' },
        { title: 'Tree Plantation Drive',      desc: 'Environmental awareness tree planting event.', category: 'Administrative' },
        { title: 'Math Olympiad',              desc: 'Inter-school mathematics competition for all grades.', category: 'Academics' },
        { title: 'Annual Day Celebration',     desc: 'Year-end celebration showcasing student achievements.', category: 'Arts & Culture' },
        { title: 'Reading Week',               desc: 'Week-long reading promotion program.', category: 'Academics' },
        { title: 'Health Check-up Camp',       desc: 'Free health check-up for all students and staff.', category: 'Administrative' },
        { title: 'Career Guidance Workshop',   desc: 'Workshop for grade 8-10 students on career options.', category: 'Academics' },
    ];
    const statuses = ['approved', 'pending', 'rejected'];
    const events = [];
    for (const school of schools) {
        // 2-4 events per school
        const count = rand(2, 4);
        for (let i = 0; i < count; i++) {
            const evt = eventTypes[rand(0, eventTypes.length - 1)];
            events.push({
                title: evt.title,
                description: evt.desc,
                category: evt.category,
                date: daysAgo(rand(0, 60)),
                schoolId: school.id,
                status: statuses[rand(0, 2)],
            });
        }
    }
    return events;
}

// ── Generate diverse reports ──
function generateReports() {
    const reportTitles = [
        'Monthly Attendance Report',
        'Infrastructure Status Report',
        'Mid-Day Meal Compliance Report',
        'Quarterly Academic Progress',
        'Staff Attendance Summary',
        'Student Enrollment Update',
    ];
    const statuses = ['pending', 'submitted', 'reviewed', 'flagged'];
    const reports = [];
    for (let i = 0; i < schools.length; i++) {
        // 2-4 reports per school
        const count = rand(2, 4);
        for (let j = 0; j < count; j++) {
            const title = reportTitles[rand(0, reportTitles.length - 1)];
            const date = daysAgo(rand(0, 45));
            reports.push({
                schoolId: schools[i].id,
                title: `${title} - ${new Date(date).toLocaleString('en-US', { month: 'short', year: 'numeric' })}`,
                submittedBy: `Mukhyadhyapak ${hmNames[i]}`,
                status: statuses[rand(0, statuses.length - 1)],
                date,
            });
        }
    }
    return reports;
}

// ── Generate varied notifications ──
function generateNotifications() {
    const msgs = [
        { message: 'Attendance submitted by ZP School Paithan',              type: 'info' },
        { message: 'Event approval request from ZP School Kannad',           type: 'warning' },
        { message: 'Monthly report flagged for ZP School Phulambri',         type: 'error' },
        { message: 'New headmaster registered via Google — needs school assignment', type: 'warning' },
        { message: 'ZP School Sillod attendance below 80% today',           type: 'error' },
        { message: 'Science Exhibition approved for ZP School Kannad',       type: 'info' },
        { message: 'GR-2025-001 published by Kendrapramuk',                 type: 'info' },
        { message: 'Cultural Fest rejected — date conflict with board exam', type: 'warning' },
        { message: 'Staff meeting scheduled for all headmasters',            type: 'info' },
        { message: 'ZP School Vaijapur report reviewed and accepted',        type: 'info' },
    ];
    return msgs.map((m, i) => ({ ...m, read: i > 4 }));
}

// ── GR Documents (without Cloudinary URLs — seedFiles.js handles uploads) ──
function generateGRDocuments() {
    return [
        { grNumber: 'GR-2025-001', title: 'Revised Academic Calendar 2025-26',   category: 'Academic',       date: daysAgo(10), status: 'active' },
        { grNumber: 'GR-2025-002', title: 'New Biometric Attendance Guidelines', category: 'Administrative', date: daysAgo(15), status: 'active' },
        { grNumber: 'GR-2025-003', title: 'Mid-Day Meal Scheme Guidelines',      category: 'Welfare',        date: daysAgo(20), status: 'active' },
        { grNumber: 'GR-2024-018', title: 'Annual Sports Meet Budget Allocation',category: 'Financial',      date: daysAgo(45), status: 'active' },
        { grNumber: 'GR-2024-017', title: 'Quarterly Infrastructure Audit',      category: 'Compliance',     date: daysAgo(60), status: 'active' },
        { grNumber: 'GR-2024-010', title: 'Emergency Protocols Update v2.1',     category: 'Safety',         date: daysAgo(90), status: 'active' },
    ];
}

async function seed() {
    await connect();

    const userCount = await User.countDocuments();
    if (userCount === 0) {
        await User.create([
            { name: 'Kendrapramuk Sharma', email: 'kendrapramuk@zp.edu', password: h('admin123'), role: 'kendrapramuk' },
            ...hmNames.map((name, i) => ({
                name: `Mukhyadhyapak ${name}`,
                email: `hm.${hmEmails[i]}@zp.edu`,
                password: h('hm123'),
                role: 'mukhyadhyapak',
                schoolId: i + 1,
            })),
        ]);
        console.log('✓ Users seeded (1 Kendrapramuk + 12 Mukhyadhyapaks)');
    }

    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
        await School.insertMany(schools);
        console.log('✓ Schools seeded (12 schools)');
    }

    const attCount = await Attendance.countDocuments();
    if (attCount === 0) {
        const records = generateAttendance();
        await Attendance.insertMany(records);
        console.log(`✓ Attendance seeded (${records.length} records — ~26 days × 12 schools)`);
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
        const events = generateEvents();
        await Event.insertMany(events);
        console.log(`✓ Events seeded (${events.length} events across 12 schools)`);
    }

    const reportCount = await Report.countDocuments();
    if (reportCount === 0) {
        const reports = generateReports();
        await Report.insertMany(reports);
        console.log(`✓ Reports seeded (${reports.length} reports across 12 schools)`);
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
        const notifs = generateNotifications();
        await Notification.insertMany(notifs);
        console.log(`✓ Notifications seeded (${notifs.length} notifications)`);
    }

    const grCount = await GRDocument.countDocuments();
    if (grCount === 0) {
        const docs = generateGRDocuments();
        await GRDocument.insertMany(docs);
        console.log(`✓ GR Documents seeded (${docs.length} documents — run seedFiles.js to upload PDFs)`);
    }

    console.log('Seed complete.');
}

// Run directly: node seed.js
if (require.main === module) {
    seed().catch(err => { console.error(err); process.exit(1); });
}

module.exports = seed;
