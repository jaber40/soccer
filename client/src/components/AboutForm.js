import React from "react";

const AboutForm = ({ onClose }) => {
  return (
    <div
      className="about-form"
      style={{
        position: "relative",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#3a3a3a",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
      }}
    >
      <h2 style={{ color: "white", marginTop: "0" }}>About</h2>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          backgroundColor: "#4a4a4a",
          color: "#a0a0a0",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#333")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4a4a4a")}
      >
        X
      </button>

      <div style={{ color: "#e0e0e0", lineHeight: "1.5" }}>
        <p>
          This website is an independent project—here to kick around geographic data, pass along player info, and occasionally score a fact or two.
        </p>

        <h4 style={{ color: "white", marginTop: "20px" }}>Disclaimer</h4>

        <p>
          This website is not affiliated with, endorsed by, or sponsored by FIFA (FIFA World Cup), UEFA (UEFA European Championship), or CONMEBOL (Copa América).

        </p>

        <p>
          FIFA World Cup® is a registered trademark of FIFA.  UEFA European Championship® and EURO marks are registered trademarks of UEFA.  
          CONMEBOL Copa América® is a registered trademark of CONMEBOL.
        </p>
        <p>
          All club names, logos, and related marks are trademarks of their respective owners and are used on this site for identification and informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default AboutForm;
