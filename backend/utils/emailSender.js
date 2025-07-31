import nodemailer from 'nodemailer';

// Verify email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Email credentials are not configured in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordResetEmail = async (email, newPassword) => {
  try {
    console.log(`Attempting to send email to ${email}`);

    const info = await transporter.sendMail({
      from: `"Fabrico Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your New Temporary Password",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset</h2>
          <p>Your new temporary password is:</p>
          <p style="font-size: 18px; font-weight: bold;">${newPassword}</p>
          <p>Please login and change it immediately at:</p>
          <p><a href="${process.env.FRONTEND_URL}/login">Login Page</a></p>
          <p><em>This password will expire in 1 hour.</em></p>
        </div>
      `
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};