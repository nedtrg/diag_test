"use client";

import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Step1Create() {
  const { data, updateData, setSubStep } = useOnboarding();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.email || !data.password)
      return setError("Please fill in all fields.");
    if (data.password !== data.confirmPassword)
      return setError("Passwords do not match.");
    if (data.password.length < 8)
      return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (result.success) {
        setSubStep("verify");
      } else {
        setError(result.message || "Something went wrong.");
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
        <div />
        <span className="text-sm text-gray-400">1/4</span>
      </div>

      <h2
        className="text-3xl font-semibold text-gray-800 mb-2"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Let's start with the basics
      </h2>
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        Enter your email and set a secure password. This helps us keep your
        account safe and ready for future logins.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            type="email"
            placeholder="Your email address"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Create password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create your password"
              value={data.password || ""}
              onChange={(e) => updateData({ password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={data.confirmPassword || ""}
              onChange={(e) => updateData({ confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 mt-2"
          style={{ backgroundColor: "#4F46E5" }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="#" className="font-medium" style={{ color: "#4F46E5" }}>
            Login
          </a>
        </p>

        <p className="text-center text-xs text-gray-400">
          By creating an account, I agree to MayK AI's{" "}
          <a href="#" style={{ color: "#4F46E5" }}>
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "#4F46E5" }}>
            Privacy Policy
          </a>
        </p>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          className="w-full py-3.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
            />
          </svg>
          Continue with google
        </button>
      </form>
    </div>
  );
}
