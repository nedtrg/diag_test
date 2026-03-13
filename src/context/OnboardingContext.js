"use client";
import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function OnboardingProvider({ children }) {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState("create");
  const [workspaceSubStep, setWorkspaceSubStep] = useState("name");
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
    teamSize: "just-me",
    workspace: "",
    inviteEmails: "",
    focus: "",
  });
  const updateData = (fields) => setData((prev) => ({ ...prev, ...fields }));
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  return (
    <Ctx.Provider
      value={{
        step,
        setStep,
        subStep,
        setSubStep,
        workspaceSubStep,
        setWorkspaceSubStep,
        data,
        updateData,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useOnboarding = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOnboarding outside provider");
  return ctx;
};
