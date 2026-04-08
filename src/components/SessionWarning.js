"use client";

import { useState, useEffect } from "react";

export default function SessionWarning({
  visible,
  onStayLoggedIn,
  onLogoutNow,
  secondsLeft = 120,
}) {
  const [countdown, setCountdown] = useState(secondsLeft);

  useEffect(() => {
    if (!visible) {
      setCountdown(secondsLeft);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, secondsLeft]);

  if (!visible) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "1.5rem",
          }}
        >
          ⏱️
        </div>

        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Still there?
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            marginBottom: "8px",
          }}
        >
          You've been inactive for a while. For your security, you'll be
          automatically signed out in:
        </p>

        {/* Countdown */}
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: countdown <= 30 ? "#dc2626" : "#4f46e5",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: "24px",
            transition: "color 0.3s",
          }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onLogoutNow}
            style={{
              flex: 1,
              padding: "11px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f9fafb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            Sign out now
          </button>
          <button
            onClick={onStayLoggedIn}
            style={{
              flex: 1,
              padding: "11px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#4f46e5",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
}
