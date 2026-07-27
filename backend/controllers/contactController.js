const asyncHandler = require('express-async-handler');
const sendEmail    = require('../utils/sendEmail');
const { sendResponse, sendError } = require('../utils/sendResponse');

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message)
    return sendError(res, 400, 'All fields are required');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6B2D8B; border-bottom: 2px solid #00A99D; padding-bottom: 8px;">
        New Contact Form Submission — IEEE EMBS
      </h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 100px;">Name</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding: 8px; font-weight: bold;">Email</td>
          <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Subject</td>
          <td style="padding: 8px;">${subject}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td>
          <td style="padding: 8px; white-space: pre-line;">${message}</td>
        </tr>
      </table>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        Sent from the IEEE EMBS website contact form.
      </p>
    </div>
  `;

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `[EMBS Contact] ${subject}`,
    html,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  });

  sendResponse(res, 200, null, 'Message sent successfully');
});
