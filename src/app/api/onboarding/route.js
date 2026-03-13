import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionToken, name, role, teamSize } = await request.json();

    if (!name || !role || !teamSize)
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );

    const session = await Session.findOne({ token: sessionToken });
    if (!session)
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 },
      );

    const user = await User.findOneAndUpdate(
      { email: session.email },
      { name: name.trim(), role: role.trim(), teamSize },
      { new: true },
    );

    const { password, verificationCode, ...safeUser } = user.toObject();

    return NextResponse.json({
      success: true,
      message: "Profile saved",
      user: safeUser,
    });
  } catch (err) {
    console.error("[MongoDB] Onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
