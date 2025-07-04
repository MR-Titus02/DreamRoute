import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using a template type and dynamic data
 * @param {string} to - Recipient email
 * @param {string} type - Template type ('register', 'login', etc.)
 * @param {object} data - Dynamic data to inject in the template
 */
export const sendTemplateEmail = async (to, type, data) => {
  let subject = '';
  let html = '';

  switch (type) {
    case 'register':
      subject = 'Registration Successful';
      html = `
        <h3>Welcome ${data.name},</h3>
        <p>Your account has been created successfully on Career Guidance.</p>
        <p>You can now explore and get personalized recommendations!</p>
      `;
      break;

    case 'login':
      subject = 'Login Successful';
      html = `
        <h3>Hello ${data.name},</h3>
        <p>You have successfully logged in to your Career Guidance account.</p>
        <p>If this wasn't you, please reset your password immediately.</p>
      `;
      break;

    case 'resetPassword':
      subject = 'Reset Your Password';
      html = `
        <h3>Hello ${data.name},</h3>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${data.resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `;
      break;

      case 'institutionApproved':
        subject = 'Your Institution Account Has Been Approved';
        html = `
          <h3>Hello ${data.name},</h3>
          <p>Your institution application has been approved! 🎉</p>
          <p>You can now log in as an institution using the following credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Password:</strong> ${data.password}</li>
          </ul>
          <p>Please log in and change your password after your first login.</p>
          <p><a href="${data.loginUrl}" style="color:#00ADB5;">Login Now</a></p>
        `;
        break;

    default:
      console.error('Unknown email type:', type);
      return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Career Guidance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
