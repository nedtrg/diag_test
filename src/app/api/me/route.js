import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";
import Workspace from "@/models/Workspace";

// GET /api/me?token=sess_xxx
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json(
        { error: "No session token provided" },
        { status: 401 },
      );

    const session = await Session.findOne({ token });
    if (!session || session.expiresAt < new Date())
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 },
      );

    const user = await User.findOne({ email: session.email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    let workspace = null;
    if (user.workspaceId) {
      workspace = await Workspace.findById(user.workspaceId).catch(() => null);
    }

    const { password, verificationCode, ...safeUser } = user.toObject();

    return NextResponse.json({ success: true, user: safeUser, workspace });
  } catch (err) {
    console.error("[MongoDB] /api/me error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
