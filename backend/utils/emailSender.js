import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
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
    from: `Fabrico Admin <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your New Password',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>Your new temporary password: <strong>${newPassword}</strong></p>
        <p>Please <a href="${process.env.FRONTEND_URL}/login">login</a> to change it immediately.</p>
      </div>
    `
  };

  try {
    await transporter.verify(); // Verify connection first
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};