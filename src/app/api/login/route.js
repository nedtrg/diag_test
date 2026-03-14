import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";

function generateSessionToken() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 },
      );

    // ⚠️ Plain comparison for demo — use bcrypt.compare() in production
    if (user.password !== password)
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );

    if (!user.verified)
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 },
      );

    const token = generateSessionToken();
    await Session.create({
      token,
      email: user.email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const {
      password: _pw,
      verificationCode: _vc,
      ...safeUser
    } = user.toObject();

    return NextResponse.json({
      success: true,
      message: "Login successful",
      sessionToken: token,
      user: safeUser,
    });
  } catch (err) {
    console.error("[MongoDB] Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
