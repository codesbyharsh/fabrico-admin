import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Add this function
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${token}`;
  
  await transporter.sendMail({
    from: `"Fabrico Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Link expires in 24 hours</p>
      </div>
    `
  });
};

// Keep existing reset email function
export const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  await transporter.sendMail({
    from: `"Fabrico Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>Link expires in 1 hour</p>
      </div>
    `
  });
};