import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateUserId() {
  return `uid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(request) {
  try {
    await connectDB();
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword)
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );

    if (password.length < 8)
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );

    if (password !== confirmPassword)
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );

    const verificationCode = generateOTP();
    const userId = generateUserId();

    await User.create({
      id: userId,
      email: email.toLowerCase(),
      password, // ⚠️ hash with bcrypt in production
      verificationCode,
      verified: false,
      plan: "Free",
      status: "Active",
    });

    console.log(`[MongoDB] User created: ${email}`);
    console.log(`[MongoDB] OTP for ${email}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: "Account created. Verification code sent.",
      devCode: verificationCode, // Remove in production
    });
  } catch (err) {
    console.error("[MongoDB] Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
