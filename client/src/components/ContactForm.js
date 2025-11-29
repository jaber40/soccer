// client/src/components/ContactForm.js
import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
     const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/contact`,
        form
      );
      if (res.data.success) {
        setStatus("Message sent!");
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setStatus("Failed to send message.");
      console.error(err);
    }
  };

  return (
    <div className="contact-form" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", minHeight: "100px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ContactForm;
