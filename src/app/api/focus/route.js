import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionToken, focus } = await request.json();

    if (!focus)
      return NextResponse.json(
        { error: "Please select a focus area" },
        { status: 400 },
      );

    const session = await Session.findOne({ token: sessionToken });
    if (!session)
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const user = await User.findOneAndUpdate(
      { email: session.email },
      { focus },
      { new: true },
    );

    const { password, verificationCode, ...safeUser } = user.toObject();

    return NextResponse.json({
      success: true,
      message: "Setup complete. Welcome to DIAG!",
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
