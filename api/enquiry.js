const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const data = req.body || {};

  // Verify Hostinger SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'enquiries@probizuae.com',
      pass: 'Ham15081978$',
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; background: #ffffff; border-radius: 8px;">
      <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 14px; margin-bottom: 20px;">
        <h2 style="color: #0A1128; margin: 0; font-size: 20px; font-weight: bold;">New Client Enquiry — Pro Biz UAE</h2>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Received through probizuae.com web portal</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 9px 0; color: #64748b; width: 150px; font-weight: 600;">Client Name:</td><td style="font-weight: bold; color: #0A1128;">${data.name || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Company:</td><td style="color: #0A1128;">${data.company || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Email Address:</td><td><a href="mailto:${data.email}" style="color: #D4AF37; font-weight: bold; text-decoration: none;">${data.email || 'N/A'}</a></td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Phone Number:</td><td style="color: #0A1128;">${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Country of Residence:</td><td style="color: #0A1128;">${data.country || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Current Location:</td><td style="color: #0A1128;">${data.current_location || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Business Activity:</td><td style="color: #0A1128;">${data.business_activity || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Service Required:</td><td style="font-weight: bold; color: #0A1128;">${data.service_required || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Investment Size:</td><td style="color: #0A1128;">${data.investment_size || 'N/A'}</td></tr>
        <tr><td style="padding: 9px 0; color: #64748b; font-weight: 600;">Lead Source:</td><td style="color: #0A1128;">${data.source || 'website'}</td></tr>
      </table>
      ${data.message ? `
        <div style="margin-top: 22px; padding: 16px; background: #f8fafc; border-left: 4px solid #D4AF37; font-size: 14px; color: #1e293b; line-height: 1.6;">
          <strong style="color: #0A1128; display: block; margin-bottom: 6px;">Client Message / Specific Objectives:</strong>
          ${data.message.replace(/\n/g, '<br/>')}
        </div>
      ` : ''}
      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
        Pro Biz UAE Corporate Advisory · M11, Ibn Battuta Gate, Jebel Ali, Dubai, United Arab Emirates
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Pro Biz UAE Web Portal" <enquiries@probizuae.com>',
      to: 'enquiries@probizuae.com',
      replyTo: data.email || 'enquiries@probizuae.com',
      subject: `New Lead: ${data.name || 'Prospective Client'} — ${data.service_required || 'Corporate Services'}`,
      html,
    });

    return res.status(200).json({ success: true, emailSent: true });
  } catch (err) {
    console.error('SMTP Email Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
