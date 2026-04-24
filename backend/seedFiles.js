/**
 * seedFiles.js — Upload sample GR document files to Cloudinary
 * and update the GRDocument records with real fileUrl + publicId.
 *
 * Usage: node seedFiles.js
 *
 * This creates small text-based placeholder files (no pdfkit dependency needed),
 * uploads them to Cloudinary under zp-schoolmonitor/gr-documents/,
 * and patches the GRDocument collection with the resulting URLs.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connect } = require('./mongoose');
const { GRDocument } = require('./models/index');
const cloudinary = require('./cloudinary');

// Each GR document gets a simple text file uploaded as a placeholder
const grFiles = [
    { grNumber: 'GR-2025-001', filename: 'academic_calendar_2025_26.txt',    content: generateContent('Revised Academic Calendar 2025-26', 'Academic') },
    { grNumber: 'GR-2025-002', filename: 'biometric_attendance_guidelines.txt', content: generateContent('New Biometric Attendance Guidelines', 'Administrative') },
    { grNumber: 'GR-2025-003', filename: 'midday_meal_guidelines.txt',        content: generateContent('Mid-Day Meal Scheme Guidelines', 'Welfare') },
    { grNumber: 'GR-2024-018', filename: 'sports_meet_budget.txt',            content: generateContent('Annual Sports Meet Budget Allocation', 'Financial') },
    { grNumber: 'GR-2024-017', filename: 'infrastructure_audit.txt',          content: generateContent('Quarterly Infrastructure Audit', 'Compliance') },
    { grNumber: 'GR-2024-010', filename: 'emergency_protocols_v2.txt',        content: generateContent('Emergency Protocols Update v2.1', 'Safety') },
];

function generateContent(title, category) {
    return `
═══════════════════════════════════════════════════
  ZILLA PARISHAD — CHHATRAPATI SAMBHAJINAGAR
  CLUSTER SCHOOL MONITORING SYSTEM (SCMS)
═══════════════════════════════════════════════════

  GOVERNMENT RESOLUTION / OFFICIAL NOTICE

  Title:     ${title}
  Category:  ${category}
  Issued By: Office of the Kendrapramuk
  Date:      ${new Date().toLocaleDateString('en-IN')}

═══════════════════════════════════════════════════

  SECTION 1: PURPOSE
  This document serves as an official directive from
  the Kendrapramuk's office regarding ${title.toLowerCase()}.

  All Mukhyadhyapaks across the 12 ZP Schools in
  Chhatrapati Sambhajinagar district are required
  to comply with the guidelines outlined herein.

  SECTION 2: SCOPE
  Applicable to: All Zilla Parishad schools
  Effective from: ${new Date().toLocaleDateString('en-IN')}
  Review period: Quarterly

  SECTION 3: KEY DIRECTIVES
  1. All headmasters must acknowledge receipt of this GR
     within 7 working days.
  2. Implementation reports are due within 30 days.
  3. Non-compliance will be reviewed in the next
     cluster-level meeting.

  SECTION 4: CONTACT
  For queries, contact the Kendrapramuk's office at:
  Email: kendrapramuk@zp.edu
  Phone: +91 800-123-4567

═══════════════════════════════════════════════════
  This is an auto-generated sample document for
  the SCMS platform demonstration.
═══════════════════════════════════════════════════
`.trim();
}

async function seedFiles() {
    await connect();

    const docs = await GRDocument.find({ fileUrl: null });
    if (docs.length === 0) {
        console.log('All GR documents already have files. Skipping.');
        process.exit(0);
    }

    console.log(`Found ${docs.length} GR documents without files. Uploading...`);
    const tmpDir = path.join(__dirname, '_tmp_seed');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    for (const grFile of grFiles) {
        const doc = docs.find(d => d.grNumber === grFile.grNumber);
        if (!doc) {
            console.log(`  ⊘ ${grFile.grNumber} not found in DB, skipping`);
            continue;
        }

        // Write temp file
        const filePath = path.join(tmpDir, grFile.filename);
        fs.writeFileSync(filePath, grFile.content, 'utf8');

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'zp-schoolmonitor/gr-documents',
                resource_type: 'raw',
                public_id: grFile.filename.replace('.txt', ''),
            });

            await GRDocument.findByIdAndUpdate(doc._id, {
                fileUrl: result.secure_url,
                publicId: result.public_id,
                fileType: 'text/plain',
                uploadedBy: 'Kendrapramuk Sharma',
            });

            console.log(`  ✓ ${grFile.grNumber} → ${result.secure_url}`);
        } catch (err) {
            console.error(`  ✗ ${grFile.grNumber} upload failed: ${err.message}`);
        }

        // Clean up temp file
        fs.unlinkSync(filePath);
    }

    // Remove temp dir
    fs.rmdirSync(tmpDir);

    console.log('\nCloudinary seed complete.');
    process.exit(0);
}

seedFiles().catch(err => { console.error(err); process.exit(1); });
