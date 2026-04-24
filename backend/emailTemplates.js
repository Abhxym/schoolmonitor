const baseStyle = `
  font-family: 'Inter', Arial, sans-serif;
  background: #fcfaf0;
  padding: 40px 20px;
`;

const cardStyle = `
  max-width: 560px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,33,71,0.08);
`;

const headerStyle = `
  background: #002147;
  padding: 32px 40px;
  text-align: center;
`;

const bodyStyle = `
  padding: 36px 40px;
  color: #2d3748;
  line-height: 1.6;
`;

const footerStyle = `
  padding: 20px 40px;
  background: #f7fafc;
  text-align: center;
  font-size: 12px;
  color: #a0aec0;
  border-top: 1px solid #e2e8f0;
`;

const btnStyle = `
  display: inline-block;
  background: #d4af37;
  color: #002147;
  font-weight: 700;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 6px;
  font-size: 15px;
  margin: 24px 0;
`;

exports.passwordResetTemplate = ({ name, resetUrl }) => ({
    subject: 'SCMS — Password Reset Request',
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:24px;letter-spacing:1px;">🏫 SCMS</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:13px;">Zilla Parishad Maharashtra</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#002147;margin-top:0;">Password Reset Request</h2>
      <p>Namaskar <strong>${name || 'User'}</strong>,</p>
      <p>We received a request to reset your SCMS portal password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <div style="text-align:center;">
        <a href="${resetUrl}" style="${btnStyle}">Reset My Password</a>
      </div>
      <p style="font-size:13px;color:#718096;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p style="font-size:13px;color:#718096;">Or copy this link into your browser:<br>
        <a href="${resetUrl}" style="color:#002147;word-break:break-all;">${resetUrl}</a>
      </p>
    </div>
    <div style="${footerStyle}">
      © ${new Date().getFullYear()} Zilla Parishad Maharashtra — SCMS. All rights reserved.
    </div>
  </div>
</div>`,
});

exports.contactConfirmTemplate = ({ firstName, topic, message }) => ({
    subject: 'SCMS — We received your message',
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:24px;letter-spacing:1px;">🏫 SCMS</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:13px;">Zilla Parishad Maharashtra</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#002147;margin-top:0;">Message Received</h2>
      <p>Namaskar <strong>${firstName}</strong>,</p>
      <p>Thank you for contacting the Kendrapramuk Administration. We have received your inquiry and will respond within <strong>2 working days</strong>.</p>
      <div style="background:#f7fafc;border-left:4px solid #d4af37;padding:16px 20px;border-radius:0 6px 6px 0;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:0.5px;">Your message</p>
        <p style="margin:0;font-size:14px;color:#2d3748;"><strong>Topic:</strong> ${topic || 'General'}</p>
        <p style="margin:8px 0 0;font-size:14px;color:#2d3748;">${message}</p>
      </div>
      <p style="font-size:13px;color:#718096;">For urgent matters, call us at <strong>+91 240-261-3456</strong> (Mon–Fri, 9am–5pm).</p>
    </div>
    <div style="${footerStyle}">
      © ${new Date().getFullYear()} Zilla Parishad Maharashtra — SCMS. All rights reserved.
    </div>
  </div>
</div>`,
});

exports.contactAdminTemplate = ({ firstName, lastName, email, topic, message }) => ({
    subject: `[SCMS Contact] ${topic || 'General'} — from ${firstName} ${lastName}`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <h1 style="color:#d4af37;margin:0;font-size:20px;">New Contact Form Submission</h1>
    </div>
    <div style="${bodyStyle}">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#718096;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${firstName} ${lastName}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#002147;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#718096;">Topic</td><td style="padding:8px 0;">${topic || 'General'}</td></tr>
        <tr><td style="padding:8px 0;color:#718096;vertical-align:top;">Message</td><td style="padding:8px 0;">${message}</td></tr>
      </table>
    </div>
  </div>
</div>`,
});
