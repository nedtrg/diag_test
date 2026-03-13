import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionToken, workspaceName } = await request.json();

    if (!workspaceName || workspaceName.trim().length < 2)
      return NextResponse.json(
        { error: "Workspace name must be at least 2 characters" },
        { status: 400 },
      );

    const session = await Session.findOne({ token: sessionToken });
    if (!session)
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const user = await User.findOne({ email: session.email });
    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    const workspace = await Workspace.create({
      name: workspaceName.trim(),
      ownerId: user.id,
      members: [user.id],
    });

    user.workspaceId = workspace._id.toString();
    await user.save();

    const { password, verificationCode, ...safeUser } = user.toObject();

    return NextResponse.json({
      success: true,
      message: "Workspace created",
      workspace,
      user: safeUser,
    });
  } catch (err) {
    console.error("[MongoDB] Workspace error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
