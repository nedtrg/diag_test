"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      mirror: false,
      easing: "ease-out-cubic",
      startEvent: "DOMContentLoaded",
    });

    window.addEventListener("load", () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener("load", () => {
        AOS.refresh();
      });
    };
  }, []);

  return null;
}
