// client/src/components/ContactForm.js
import React, { useState } from "react";
import axios from "axios";

const ContactForm = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "" // Honeypot field
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/contact`,
        form
      );

      if (res.data.success) {
        setStatus("Message sent!");
        setForm({ name: "", email: "", message: "", website: "" });
      } else {
        setStatus("Failed to send message.");
      }

    } catch (err) {
      console.error(err);
      setStatus("Failed to send message.");
    }
  };

  return (
    <div
      className="contact-form"
      style={{
        position: "relative",       // needed for close button positioning
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#3a3a3a",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#3a3a3a",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#4a4a4a"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3a3a3a"}
      >
        X
      </button>

      <h2 style={{ color: "white", marginTop: "0" }}>Contact</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>

        {/* Honeypot Field (hidden from human users) */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={handleChange}
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        <input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={form.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            minHeight: "100px",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "2px solid green",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send
        </button>

      </form>

      {status && <p style={{ color: "white", marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default ContactForm;
