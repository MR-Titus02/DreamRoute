import nodemailer from 'nodemailer';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,  
  }
});

export const handleContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  // Email content setup
  const mailOptions = {
    from: email,
    to: 'dreamrouteofficial@gmail.com', 
    subject: `New Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully', info });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};
