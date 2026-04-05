"use client";

import { useOnboarding } from "@/context/OnboardingContext";

const STEPS = [
  { id: 1, label: "Create Your Account" },
  { id: 2, label: "Tell Us About You" },
  { id: 3, label: "Set Up Your Workspace" },
  { id: 4, label: "Choose Your Focus" },
];

export default function StepSidebar() {
  const { step } = useOnboarding();

  return (
    <div className="w-full md:w-96 flex-shrink-0 px-8 py-10">
      <h1
        className="text-3xl font-semibold text-gray-800 leading-tight mb-3"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Let's get you set up in just 4 steps
      </h1>
      <p className="text-sm text-gray-400 mb-10 leading-relaxed">
        We'll keep it short and simple , just what we need to personalize your
        experience.
      </p>

      <div className="flex flex-col">
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          const isUpcoming = step < s.id;

          return (
            <div key={s.id}>
              <div className="flex items-center gap-3">
                {/* Circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor:
                      isActive || isDone ? "#4F46E5" : "transparent",
                    border: isUpcoming ? "1.5px solid #d1d5db" : "none",
                    color: isActive || isDone ? "white" : "#9ca3af",
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-sm font-medium transition-colors duration-300"
                  style={{
                    color: isActive
                      ? "#4F46E5"
                      : isDone
                        ? "#4F46E5"
                        : "#9ca3af",
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="transition-all duration-300"
                  style={{
                    width: "1px",
                    height: "28px",
                    marginLeft: "17px",
                    backgroundColor: isDone ? "#4F46E5" : "#e5e7eb",
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
