import nodemailer from 'nodemailer';

// Create transporter (using Gmail as example - you can use any SMTP service)
const createTransporter = () => {
  // For development, you can use ethereal.email for testing
  // For production, use a real email service like SendGrid, AWS SES, or Gmail
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendOTPEmail = async (email, otp, name) => {
  try {
    // Validate email is Gmail
    if (!email.endsWith('@gmail.com')) {
      return { success: false, error: 'Only Gmail addresses are supported' };
    }

    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: `"InterviewPrepAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - InterviewPrepAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #ea580c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #ea580c; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to InterviewPrepAI!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 InterviewPrepAI. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      return { success: false, error: 'Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD in .env' };
    } else if (error.code === 'EENVELOPE' || error.responseCode === 550) {
      return { success: false, error: 'Invalid recipient email address' };
    }
    
    return { success: false, error: error.message };
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};