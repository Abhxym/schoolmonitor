const baseStyle = `font-family:'Inter',Arial,sans-serif;background:#fcfaf0;padding:40px 20px;`;
const cardStyle = `max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,33,71,0.08);`;
const headerStyle = `background:#002147;padding:28px 40px;text-align:center;`;
const bodyStyle = `padding:32px 40px;color:#2d3748;line-height:1.6;`;
const footerStyle = `padding:16px 40px;background:#f7fafc;text-align:center;font-size:12px;color:#a0aec0;border-top:1px solid #e2e8f0;`;
const badgeStyle = (color) => `display:inline-block;background:${color};color:white;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;`;

exports.eventSubmittedTemplate = ({ schoolName, eventTitle, eventDate, submittedBy }) => ({
    subject: `[SchoolMonitor] New Event Approval Request — ${eventTitle}`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:22px;">🏫 SchoolMonitor</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Event Approval Required</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#002147;margin-top:0;">New Event Submitted</h2>
      <p>A Mukhyadhyapak has submitted a new event for your approval.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#718096;width:130px;">Event Title</td><td style="padding:8px 0;font-weight:600;">${eventTitle}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">School</td><td style="padding:8px 0;">${schoolName}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Date</td><td style="padding:8px 0;">${eventDate}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Submitted By</td><td style="padding:8px 0;">${submittedBy}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Status</td><td style="padding:8px 0;"><span style="${badgeStyle('#d69e2e')}">Pending Approval</span></td></tr>
      </table>
      <p style="font-size:13px;color:#718096;">Log in to the Kendrapramuk portal to approve or reject this event.</p>
    </div>
    <div style="${footerStyle}">© ${new Date().getFullYear()} Zilla Parishad Maharashtra — SchoolMonitor</div>
  </div>
</div>`,
});

exports.reportSubmittedTemplate = ({ schoolName, reportTitle, submittedBy, period }) => ({
    subject: `[SchoolMonitor] New Report Submitted — ${schoolName}`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:22px;">🏫 SchoolMonitor</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Report Submission</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#002147;margin-top:0;">New Report Submitted</h2>
      <p>A Mukhyadhyapak has submitted a report for your review.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#718096;width:130px;">Report</td><td style="padding:8px 0;font-weight:600;">${reportTitle}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">School</td><td style="padding:8px 0;">${schoolName}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Submitted By</td><td style="padding:8px 0;">${submittedBy}</td></tr>
        ${period ? `<tr><td style="padding:8px 0;color:#718096;">Period</td><td style="padding:8px 0;">${period}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#718096;">Status</td><td style="padding:8px 0;"><span style="${badgeStyle('#3182ce')}">Submitted</span></td></tr>
      </table>
      <p style="font-size:13px;color:#718096;">Log in to the Kendrapramuk portal to review this report.</p>
    </div>
    <div style="${footerStyle}">© ${new Date().getFullYear()} Zilla Parishad Maharashtra — SchoolMonitor</div>
  </div>
</div>`,
});

exports.eventStatusTemplate = ({ mukhyadhyapakName, eventTitle, status, reason }) => ({
    subject: `[SchoolMonitor] Your event "${eventTitle}" has been ${status}`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:22px;">🏫 SchoolMonitor</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Event Status Update</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#002147;margin-top:0;">Event ${status === 'approved' ? '✅ Approved' : '❌ Rejected'}</h2>
      <p>Namaskar <strong>${mukhyadhyapakName}</strong>,</p>
      <p>Your event <strong>"${eventTitle}"</strong> has been <strong>${status}</strong> by the Kendrapramuk.</p>
      ${reason ? `<div style="background:#f7fafc;border-left:4px solid #d4af37;padding:12px 16px;border-radius:0 6px 6px 0;margin:16px 0;font-size:14px;">${reason}</div>` : ''}
      <p style="font-size:13px;color:#718096;">Log in to your portal for more details.</p>
    </div>
    <div style="${footerStyle}">© ${new Date().getFullYear()} Zilla Parishad Maharashtra — SchoolMonitor</div>
  </div>
</div>`,
});
