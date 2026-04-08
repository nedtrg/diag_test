"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes of inactivity
const WARNING_BEFORE = 2 * 60 * 1000; // warn 2 minutes before logout

export default function useSessionTimeout({ onWarning, onLogout }) {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
  }, []);

  const logout = useCallback(async () => {
    clearTimers();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("diag_session")
        : null;
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: token }),
      });
    } catch {
      /* still proceed */
    }
    localStorage.removeItem("diag_session");
    localStorage.removeItem("diag_user");
    if (onLogout) onLogout();
    router.push("/login");
  }, [clearTimers, onLogout, router]);

  const resetTimer = useCallback(() => {
    clearTimers();

    // Warn user 2 minutes before logout
    warningRef.current = setTimeout(() => {
      if (onWarning) onWarning();
    }, TIMEOUT_DURATION - WARNING_BEFORE);

    // Auto logout after full duration
    timeoutRef.current = setTimeout(() => {
      logout();
    }, TIMEOUT_DURATION);
  }, [clearTimers, logout, onWarning]);

  useEffect(() => {
    // Events that count as activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "visibilitychange",
    ];

    const handleActivity = () => {
      // If tab becomes visible again, reset timer
      if (document.visibilitychange === "hidden") return;
      resetTimer();
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetTimer(); // start timer on mount

    return () => {
      clearTimers();
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [resetTimer, clearTimers]);

  return { resetTimer, logout };
}
