import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/store";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code)
      return NextResponse.json(
        { success: false, message: "Email and code required" },
        { status: 400 },
      );

    // Accept '000000' as a demo bypass code
    const valid = code === "000000" || verifyCode(email, code);
    if (!valid)
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 },
      );

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
