"use client";

import { useState, useRef, useEffect } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import Image from "next/image";

export default function Step1Verify() {
  const { data, setSubStep, nextStep } = useOnboarding();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6)
      return setError("Please enter the full 6-digit code.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, code: fullCode }),
      });
      const result = await res.json();
      if (result.success) {
        nextStep();
      } else {
        setError(result.message || "Invalid code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-slide">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setSubStep("create")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Image
            src="/Vector.png" // Replace with your logo icon path
            alt="DIAG Logo"
            width={40}
            height={40}
            className="opacity-100"
          />
          Back
        </button>
        <span className="text-sm text-gray-400">1/4</span>
      </div>

      <h2
        className="text-3xl font-semibold text-gray-800 mb-2"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Verify Email addresss
      </h2>
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        A six digit verification code has been sent to your email address, enter
        it here to verify your accound
      </p>

      {/* OTP inputs */}
      <div className="flex gap-3 mb-3">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-14 text-center text-lg font-semibold rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        ))}
      </div>

      <p className="text-right text-xs text-gray-400 mb-6">
        Didn't get Code?{" "}
        {countdown > 0 ? (
          <span style={{ color: "#4F46E5" }}>
            Resend code in {countdown} sec
          </span>
        ) : (
          <button
            onClick={() => setCountdown(10)}
            style={{ color: "#4F46E5" }}
            className="font-medium"
          >
            Resend now
          </button>
        )}
      </p>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-3.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
        style={{ backgroundColor: "#4F46E5" }}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
