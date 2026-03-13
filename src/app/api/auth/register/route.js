import { NextResponse } from "next/server";
import { createUser, saveVerificationCode } from "@/lib/store";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 },
      );
    if (password.length < 8)
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 },
      );

    const result = createUser({ email, password });
    if (result.error)
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 409 },
      );

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    saveVerificationCode(email, code);

    // In production: send email via Resend/SendGrid
    console.log(`[DIAG] Verification code for ${email}: ${code}`);

    return NextResponse.json({
      success: true,
      message: "Account created. Verification code sent.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
