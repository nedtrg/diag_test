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
    const { email, code } = await request.json();

    if (!email || !code)
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );

    if (code.length !== 6)
      return NextResponse.json(
        { error: "Code must be 6 digits" },
        { status: 400 },
      );

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });

    // Demo: accept any 6-digit code
    // Production: check code === user.verificationCode with expiry

    user.verified = true;
    await user.save();

    const token = generateSessionToken();
    await Session.create({ token, email: email.toLowerCase() });

    const { password, verificationCode, ...safeUser } = user.toObject();

    console.log(`[MongoDB] User verified: ${email}`);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      sessionToken: token,
      user: safeUser,
    });
  } catch (err) {
    console.error("[MongoDB] Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
