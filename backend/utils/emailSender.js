import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendPasswordResetEmail = async (email, newPassword) => {
  const mailOptions = {
    from: `"Fabrico Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your New Password',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Password Reset</h2>
        <p>Your new temporary password:</p>
        <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace;">
          ${newPassword}
        </div>
        <p>Please <a href="${process.env.FRONTEND_URL}/login">login</a> to change it immediately.</p>
      </div>
    `
  };

  try {
    // Verify connection first
    await transporter.verify();
    console.log('SMTP connection verified');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};