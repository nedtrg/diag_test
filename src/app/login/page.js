"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconBrandGoogle } from "@tabler/icons-react";

const LOGIN_CSS = `
  * { box-sizing: border-box; }
  input, button { font-family: Inter, sans-serif; }

  .login-shell {
    min-height: 100vh;
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
  }
  .login-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }
  .login-card {
    background: white;
    border-radius: 16px;
    padding: 36px 28px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  }
  @media (min-width: 480px) {
    .login-card { padding: 44px 48px; }
  }
`;

function DiagLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#4f46e5" />
        <path d="M8 14 Q14 6 20 14 Q14 22 8 14Z" fill="white" opacity="0.9" />
        <circle cx="14" cy="14" r="3" fill="#818cf8" />
      </svg>
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#1f2937",
          letterSpacing: "0.08em",
        }}
      >
        DIAG
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      localStorage.setItem("diag_session", data.sessionToken);
      localStorage.setItem("diag_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LOGIN_CSS }} />
      <div className="login-shell">
        <nav
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #f3f4f6",
            padding: "14px 20px",
          }}
        >
          <DiagLogo />
        </nav>
        <div className="login-body">
          <div className="login-card">
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <DiagLogo />
              </div>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#111827",
                  marginBottom: "8px",
                }}
              >
                Welcome back
              </h1>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Sign in to your DIAG account
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  color: "#dc2626",
                  fontSize: "0.8rem",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            {/* Email field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  color: "#374151",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    color: "#374151",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPw ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <a
                href="#"
                style={{
                  fontSize: "0.8rem",
                  color: "#4f46e5",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#a5b4fc" : "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "16px",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = "#4338ca";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = "#4f46e5";
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
              <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>OR</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
            </div>

            <button
              style={{
                width: "100%",
                padding: "12px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                fontFamily: "Inter, sans-serif",
                marginBottom: "24px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <IconBrandGoogle size={18} color="#EA4335" />
              Continue with Google
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Don't have an account?{" "}
              <a
                href="/"
                style={{
                  color: "#4f46e5",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Create one free
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
