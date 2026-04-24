/**
 * Re-seed script — drops ALL collections and re-seeds from scratch.
 * Usage: node reseed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('./mongoose');
const seed = require('./seed');

async function reseed() {
    await connect();
    console.log('Dropping all collections...');

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
        await mongoose.connection.db.dropCollection(col.name);
        console.log(`  Dropped: ${col.name}`);
    }

    console.log('All collections dropped. Re-seeding...\n');
    await seed();

    console.log('\nRe-seed complete!');
    process.exit(0);
}

reseed().catch(err => { console.error('Re-seed failed:', err); process.exit(1); });
