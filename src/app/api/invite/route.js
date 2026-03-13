import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionToken, emails } = await request.json();

    if (!emails || emails.length === 0)
      return NextResponse.json({
        success: true,
        message: "Skipped — no invites sent",
      });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter((e) => !emailRegex.test(e));
    if (invalid.length > 0)
      return NextResponse.json(
        { error: `Invalid emails: ${invalid.join(", ")}` },
        { status: 400 },
      );

    const session = await Session.findOne({ token: sessionToken });
    if (session) {
      const user = await User.findOne({ email: session.email });
      if (user?.workspaceId) {
        await Workspace.findByIdAndUpdate(user.workspaceId, {
          $addToSet: { invites: { $each: emails } },
        });
      }
    }

    console.log(`[MongoDB] Invites queued: ${emails.join(", ")}`);

    return NextResponse.json({
      success: true,
      message: `${emails.length} invite(s) sent`,
      invited: emails,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
