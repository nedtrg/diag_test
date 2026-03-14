"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconEye,
  IconEyeOff,
  IconChevronLeft,
  IconInfoCircle,
  IconCheck,
  IconBrandGoogle,
} from "@tabler/icons-react";

/* ─── Responsive styles ─────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  input, button { font-family: Inter, sans-serif; }

  .onboarding-shell { min-height: 100vh; background: #f0f2f5; display: flex; flex-direction: column; }

  .onboarding-layout {
    flex: 1; display: flex; flex-direction: column;
    width: 100%; max-width: 1100px; margin: 0 auto;
    padding: 24px 16px 40px; gap: 24px;
  }
  @media (min-width: 768px) {
    .onboarding-layout { flex-direction: row; align-items: center; padding: 40px 32px; gap: 48px; }
  }

  .step-sidebar { width: 100%; }
  @media (min-width: 768px) { .step-sidebar { width: 300px; flex-shrink: 0; } }

  .steps-mobile { display: flex; align-items: center; }
  .steps-desktop { display: none; flex-direction: column; }
  @media (min-width: 768px) {
    .steps-mobile { display: none; }
    .steps-desktop { display: flex; }
  }

  .form-card {
    flex: 1; background: white; border-radius: 16px;
    padding: 28px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    min-height: 480px;
  }
  @media (min-width: 480px) { .form-card { padding: 36px 32px; } }
  @media (min-width: 768px) { .form-card { padding: 44px 48px; min-height: 540px; } }

  .step-heading { font-family: Inter, sans-serif; font-weight: 700; font-size: clamp(1.35rem, 4vw, 1.75rem); color: #111827; margin-bottom: 8px; }

  .otp-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .otp-input { width: 46px; height: 52px; text-align: center; font-size: 1.2rem; font-weight: 600; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; color: #111827; flex-shrink: 0; outline: none; }
  @media (min-width: 400px) { .otp-input { width: 52px; height: 56px; font-size: 1.25rem; } }

  .focus-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 28px; }
  @media (min-width: 480px) { .focus-grid { grid-template-columns: 1fr 1fr 1fr; gap: 12px; } }
  @media (max-width: 360px) { .focus-grid { grid-template-columns: 1fr; } }

  .step-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
`;

/* ─── Logo ──────────────────────────────────────────────────────────────────── */
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

/* ─── Step Sidebar ──────────────────────────────────────────────────────────── */
const STEPS = [
  { number: 1, label: "Create Your Account" },
  { number: 2, label: "Tell Us About You" },
  { number: 3, label: "Set Up Your Workspace" },
  { number: 4, label: "Choose Your Focus" },
];

function StepCircle({ isCompleted, isActive, number, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        border: isActive || isCompleted ? "none" : "1.5px solid #d1d5db",
        backgroundColor: isActive || isCompleted ? "#4f46e5" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
      }}
    >
      {isCompleted ? (
        <IconCheck
          size={size === 36 ? 14 : 12}
          color="white"
          strokeWidth={2.5}
        />
      ) : (
        <span
          style={{
            color: isActive ? "white" : "#9ca3af",
            fontSize: size === 36 ? "0.8rem" : "0.7rem",
            fontWeight: 600,
          }}
        >
          {number}
        </span>
      )}
    </div>
  );
}

function StepSidebar({ currentStep }) {
  return (
    <div className="step-sidebar">
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#111827",
            lineHeight: 1.25,
            marginBottom: "10px",
          }}
        >
          Let's get you set up in just 4 steps
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6 }}>
          We'll keep it short and simple — just what we need to personalize your
          experience.
        </p>
      </div>

      {/* Mobile: horizontal dots + active label */}
      <div className="steps-mobile" style={{ gap: "0" }}>
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          return (
            <div
              key={step.number}
              style={{ display: "flex", alignItems: "center" }}
            >
              <StepCircle
                isCompleted={isCompleted}
                isActive={isActive}
                number={step.number}
                size={28}
              />
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    width: 28,
                    height: 2,
                    backgroundColor: isCompleted ? "#4f46e5" : "#e5e7eb",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </div>
          );
        })}
        <span
          style={{
            marginLeft: 12,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#4f46e5",
          }}
        >
          Step {currentStep}: {STEPS[currentStep - 1]?.label}
        </span>
      </div>

      {/* Desktop: full vertical list */}
      <div className="steps-desktop">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isLast = idx === STEPS.length - 1;
          return (
            <div key={step.number}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <StepCircle
                  isCompleted={isCompleted}
                  isActive={isActive}
                  number={step.number}
                  size={36}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive || isCompleted ? "#4f46e5" : "#9ca3af",
                    transition: "all 0.3s ease",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  style={{
                    width: 1,
                    height: 28,
                    marginLeft: 17,
                    backgroundColor: isCompleted ? "#4f46e5" : "#e5e7eb",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Shared primitives ─────────────────────────────────────────────────────── */
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showToggle,
  onToggle,
  showPassword,
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "12px 16px",
            paddingRight: showToggle ? "48px" : "16px",
            border: "1.5px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "0.875rem",
            color: "#374151",
            backgroundColor: "white",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
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
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        padding: "10px 14px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        color: "#dc2626",
        fontSize: "0.8rem",
        marginBottom: "16px",
      }}
    >
      {message}
    </div>
  );
}

function StepHeader({ onBack, backLabel, step }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "0.875rem",
            padding: 0,
          }}
        >
          <IconChevronLeft size={16} stroke={2} />
          {backLabel || "Back"}
        </button>
      ) : (
        <div />
      )}
      <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{step}/4</span>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: "100%",
        padding: "14px",
        backgroundColor: disabled || loading ? "#a5b4fc" : "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        marginBottom: "16px",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) e.target.style.backgroundColor = "#4338ca";
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) e.target.style.backgroundColor = "#4f46e5";
      }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

/* ─── Step 1: Create Account ────────────────────────────────────────────────── */
function Step1({ onNext, formData, setFormData }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      // Store devCode from DB response for display on verify screen
      if (data.devCode) setFormData((f) => ({ ...f, devCode: data.devCode }));
      onNext();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader step={1} />
      <h2 className="step-heading">Let's start with the basics</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        Enter your email and set a secure password. This helps us keep your
        account safe and ready for future logins.
      </p>
      <ErrorMsg message={error} />
      <Input
        label="Email address"
        type="email"
        placeholder="Your email address"
        value={formData.email}
        onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
      />
      <Input
        label="Create password"
        placeholder="Min. 8 characters"
        value={formData.password}
        onChange={(e) =>
          setFormData((f) => ({ ...f, password: e.target.value }))
        }
        showToggle
        showPassword={showPw}
        onToggle={() => setShowPw((p) => !p)}
      />
      <Input
        label="Confirm password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData((f) => ({ ...f, confirmPassword: e.target.value }))
        }
        showToggle
        showPassword={showConfirm}
        onToggle={() => setShowConfirm((p) => !p)}
      />
      <PrimaryButton onClick={handleSubmit} loading={loading}>
        Create Account
      </PrimaryButton>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#6b7280",
          marginBottom: "10px",
        }}
      >
        Already have an account?{" "}
        <a
          href="/login"
          style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}
        >
          Login
        </a>
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9ca3af",
          marginBottom: "18px",
        }}
      >
        By creating an account, I agree to DIAG's{" "}
        <a href="#" style={{ color: "#4f46e5", textDecoration: "none" }}>
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" style={{ color: "#4f46e5", textDecoration: "none" }}>
          Privacy Policy
        </a>
      </p>
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
        }}
      >
        <IconBrandGoogle size={18} color="#EA4335" />
        Continue with Google
      </button>
    </div>
  );
}

/* ─── Step 1b: Verify Email ─────────────────────────────────────────────────── */
function Step1Verify({ onNext, onBack, formData, setFormData }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0)
      inputRefs.current[idx - 1]?.focus();
  };
  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      // ✅ Store sessionToken from MongoDB — passed to all future steps
      setFormData((f) => ({
        ...f,
        sessionToken: data.sessionToken,
        user: data.user,
      }));
      onNext();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader onBack={onBack} backLabel="Back" step={1} />
      <h2 className="step-heading">Verify Email address</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "8px",
        }}
      >
        A six digit verification code has been sent to your email address, enter
        it here to verify your account.
      </p>
      {formData.devCode && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "6px",
            marginBottom: "18px",
            fontSize: "0.8rem",
            color: "#1d4ed8",
          }}
        >
          <strong>Demo code:</strong> {formData.devCode}
        </div>
      )}
      <ErrorMsg message={error} />
      <div className="otp-row">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            className="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        ))}
      </div>
      <div
        style={{
          textAlign: "right",
          marginBottom: "28px",
          fontSize: "0.8rem",
          color: "#6b7280",
        }}
      >
        Didn't get Code?{" "}
        {countdown > 0 ? (
          <span style={{ color: "#4f46e5" }}>
            Resend code in {countdown} sec
          </span>
        ) : (
          <button
            onClick={() => setCountdown(60)}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              cursor: "pointer",
              fontWeight: 500,
              padding: 0,
            }}
          >
            Resend code
          </button>
        )}
      </div>
      <PrimaryButton onClick={handleVerify} loading={loading}>
        Verify
      </PrimaryButton>
    </div>
  );
}

/* ─── Step 2: Tell Us About You ─────────────────────────────────────────────── */
function Step2({ onNext, formData, setFormData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const teamOptions = [
    "Just me",
    "2–10 teammates",
    "11–50 teammates",
    "50+ teammates",
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.role || !formData.teamSize) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ sessionToken lets API find the user in MongoDB
        body: JSON.stringify({
          sessionToken: formData.sessionToken,
          name: formData.name,
          role: formData.role,
          teamSize: formData.teamSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setFormData((f) => ({ ...f, user: data.user }));
      onNext();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader step={2} />
      <h2 className="step-heading">Who's joining us?</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        We'd love to know your name and role so we can tailor the experience to
        how you work best , whether you're solo or with a team.
      </p>
      <ErrorMsg message={error} />
      <Input
        label="What should we call you?"
        placeholder="eg., Orimadegun Promise"
        value={formData.name || ""}
        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
      />
      <Input
        label="What's your role?"
        placeholder="eg., Product designer"
        value={formData.role || ""}
        onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
      />
      <div style={{ marginBottom: "28px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "14px",
          }}
        >
          Are you working solo or with a team?
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {teamOptions.map((opt) => (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                }}
              >
                <input
                  type="radio"
                  name="teamSize"
                  value={opt}
                  checked={formData.teamSize === opt}
                  onChange={() => setFormData((f) => ({ ...f, teamSize: opt }))}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    inset: 0,
                    cursor: "pointer",
                    margin: 0,
                  }}
                />
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${formData.teamSize === opt ? "#4f46e5" : "#d1d5db"}`,
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {formData.teamSize === opt && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#4f46e5",
                      }}
                    />
                  )}
                </div>
              </div>
              <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      </div>
      <PrimaryButton onClick={handleSubmit} loading={loading}>
        Continue
      </PrimaryButton>
    </div>
  );
}

/* ─── Step 3a: Create Workspace ─────────────────────────────────────────────── */
function Step3Workspace({ onNext, onBack, formData, setFormData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.workspaceName) {
      setError("Please enter a workspace name");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: formData.sessionToken,
          workspaceName: formData.workspaceName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setFormData((f) => ({
        ...f,
        workspace: data.workspace,
        user: data.user,
      }));
      onNext();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader onBack={onBack} backLabel="Tell us about you" step={3} />
      <h2 className="step-heading">Create your workspace</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        Name your workspace and invite teammates (if you'd like). You can always
        add more later , we'll keep things flexible.
      </p>
      <ErrorMsg message={error} />
      <Input
        label="What's the name of your workspace?"
        placeholder="eg., Nexa team"
        value={formData.workspaceName || ""}
        onChange={(e) =>
          setFormData((f) => ({ ...f, workspaceName: e.target.value }))
        }
      />
      <PrimaryButton onClick={handleSubmit} loading={loading}>
        Continue
      </PrimaryButton>
    </div>
  );
}

/* ─── Step 3b: Invite Teammates ─────────────────────────────────────────────── */
function Step3Invite({ onNext, onBack, formData }) {
  const [inviteInput, setInviteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    const emails = inviteInput
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: formData.sessionToken, emails }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      onNext();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader onBack={onBack} backLabel="Back" step={3} />
      <h2 className="step-heading">Invite teammates by email</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        Add their email addresses so they can join your workspace right away.
        You can skip this and invite them later.
      </p>
      <ErrorMsg message={error} />
      <Input
        label="Enter Email Address"
        placeholder="eg., Adebanjo@gmail.com"
        value={inviteInput}
        onChange={(e) => setInviteInput(e.target.value)}
      />
      <div
        style={{
          padding: "14px 16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "10px",
          }}
        >
          <IconInfoCircle size={16} color="#6b7280" />
          <span
            style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6b7280" }}
          >
            Quick Tips
          </span>
        </div>
        {[
          "Separate multiple emails with commas",
          "Press Enter or comma to add each teammate",
          "They won't receive an invite until you've completed your setup.",
          "You can skip this step and invite teammates later",
        ].map((tip, i) => (
          <p
            key={i}
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "5px",
            }}
          >
            {i + 1}. {tip}
          </p>
        ))}
      </div>
      <div className="step-footer">
        <button
          onClick={onNext}
          style={{
            background: "none",
            border: "none",
            color: "#4f46e5",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Skip for later
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            padding: "12px 28px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Choose Focus ───────────────────────────────────────────────────── */
const FOCUS_OPTIONS = [
  {
    id: "projects",
    icon: "📝",
    title: "Manage projects or tasks",
    desc: "Plan, track, and complete work efficiently.",
  },
  {
    id: "collaborate",
    icon: "💬",
    title: "Collaborate with my team",
    desc: "Share updates, files, and feedback all in one place.",
  },
  {
    id: "kpis",
    icon: "📈",
    title: "Track performance or KPIs",
    desc: "Build dashboards to monitor growth and goals",
  },
  {
    id: "workflows",
    icon: "🔧",
    title: "Design workflows or systems",
    desc: "Create reusable templates and internal tools",
  },
  {
    id: "explore",
    icon: "👀",
    title: "Just exploring for now",
    desc: "Show me around , I'll decide later",
  },
];

function Step4({ onBack, formData, setFormData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const goToDashboard = (user) => {
    // ✅ Save session + user to localStorage so dashboard can fetch from MongoDB
    if (typeof window !== "undefined") {
      localStorage.setItem("diag_session", formData.sessionToken);
      if (user) localStorage.setItem("diag_user", JSON.stringify(user));
    }
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    if (!formData.focus) {
      setError("Please select a focus area");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: formData.sessionToken,
          focus: formData.focus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      goToDashboard(data.user);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepHeader onBack={onBack} backLabel="Set up your workspace" step={4} />
      <h2 className="step-heading">What do you want to achieve?</h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: "24px",
        }}
      >
        Choose a use case so we can recommend the right tools and templates to
        get you started faster. You can always change this later.
      </p>
      <ErrorMsg message={error} />
      <div className="focus-grid">
        {FOCUS_OPTIONS.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setFormData((f) => ({ ...f, focus: opt.id }))}
            style={{
              padding: "14px",
              border: `1.5px solid ${formData.focus === opt.id ? "#4f46e5" : "#e5e7eb"}`,
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: formData.focus === opt.id ? "#eef2ff" : "white",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                fontSize: "1.2rem",
                display: "block",
                marginBottom: "6px",
              }}
            >
              {opt.icon}
            </span>
            <p
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px",
                lineHeight: 1.3,
              }}
            >
              {opt.title}
            </p>
            <p
              style={{ fontSize: "0.7rem", color: "#9ca3af", lineHeight: 1.4 }}
            >
              {opt.desc}
            </p>
          </div>
        ))}
      </div>
      <div className="step-footer">
        <button
          onClick={() => goToDashboard(formData.user)}
          style={{
            background: "none",
            border: "none",
            color: "#4f46e5",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Skip for later
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px 28px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main shell ─────────────────────────────────────────────────────────────── */
const SUB_STEP_TO_MAIN = {
  create: 1,
  verify: 1,
  about: 2,
  workspace: 3,
  invite: 3,
  focus: 4,
};

export default function OnboardingPage() {
  const [subStep, setSubStep] = useState("create");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
    teamSize: "",
    workspaceName: "",
    focus: "",
    devCode: "",
    sessionToken: null, // ← set after /api/verify, passed to all subsequent steps
    user: null,
    workspace: null,
  });
  const currentStep = SUB_STEP_TO_MAIN[subStep];

  const renderStep = () => {
    switch (subStep) {
      case "create":
        return (
          <Step1
            onNext={() => setSubStep("verify")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "verify":
        return (
          <Step1Verify
            onNext={() => setSubStep("about")}
            onBack={() => setSubStep("create")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "about":
        return (
          <Step2
            onNext={() => setSubStep("workspace")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "workspace":
        return (
          <Step3Workspace
            onNext={() => setSubStep("invite")}
            onBack={() => setSubStep("about")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "invite":
        return (
          <Step3Invite
            onNext={() => setSubStep("focus")}
            onBack={() => setSubStep("workspace")}
            formData={formData}
          />
        );
      case "focus":
        return (
          <Step4
            onBack={() => setSubStep("invite")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="onboarding-shell">
        <nav
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #f3f4f6",
            padding: "14px 20px",
          }}
        >
          <DiagLogo />
        </nav>
        <div className="onboarding-layout">
          <StepSidebar currentStep={currentStep} />
          <div className="form-card">{renderStep()}</div>
        </div>
      </div>
    </>
  );
}
