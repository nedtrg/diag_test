import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionToken } = await request.json();

    if (sessionToken) {
      await Session.deleteOne({ token: sessionToken });
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    // Still return success — client must clear localStorage regardless
    return NextResponse.json({ success: true, message: "Logged out" });
  }
}
