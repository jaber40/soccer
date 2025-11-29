// server/src/routes/contactRoutes.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic input validation
  if (!email || !message || message.length > 2000) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Soccer Site Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL, // send to yourself
      subject: `New Contact Form Message from ${name || "Anonymous"}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
