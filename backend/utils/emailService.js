export const sendPasswordResetEmail = async (email, newPassword) => {
  const formData = new FormData();
  formData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY);
  formData.append('email', process.env.EMAIL_TO); // Where to send
  formData.append('subject', 'Password Reset Request');
  formData.append('from_name', 'Fabrico Admin');
  formData.append('user_email', email); // User's email
  
  // Customize this HTML as needed
  formData.append('html', `
    <h2>Password Reset</h2>
    <p>A password reset was requested for ${email}</p>
    <p><strong>New Temporary Password:</strong> ${newPassword}</p>
    <p>Please contact the user and inform them of this new password.</p>
    <p>They should change it immediately after login.</p>
  `);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Web3Forms error:', error);
    return false;
  }
};