import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";

// GET /api/stats?token=sess_xxx
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await Session.findOne({ token });
    if (!session)
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );

    // Fetch real users from MongoDB for the signups table
    const allUsers = await User.find({}).sort({ createdAt: -1 }).limit(10);
    const activeCount = await User.countDocuments({ status: "Active" });

    const recentSignups = allUsers.map((u) => ({
      id: u.id,
      name: u.name || u.email.split("@")[0],
      email: u.email,
      plan: u.plan,
      joinedAgo: timeAgo(u.createdAt),
      status: u.status,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: 24000,
        churnedRevenue: 2000,
        activeUsers: activeCount || 400,
        revenueHistory: REVENUE_HISTORY,
        planBreakdown: PLAN_BREAKDOWN,
        countryBreakdown: COUNTRY_BREAKDOWN,
      },
      // Use real DB users if any exist, otherwise show demo data
      recentSignups: recentSignups.length > 0 ? recentSignups : DEMO_SIGNUPS,
    });
  } catch (err) {
    console.error("[MongoDB] /api/stats error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const REVENUE_HISTORY = [
  { date: "Oct 1", amount: 5000 },
  { date: "Oct 3", amount: 8000 },
  { date: "Oct 6", amount: 12000 },
  { date: "Oct 9", amount: 15000 },
  { date: "Oct 10", amount: 18000 },
  { date: "Oct 15", amount: 20000 },
  { date: "Oct 16", amount: 24000 },
  { date: "Oct 17", amount: 22000 },
  { date: "Oct 18", amount: 24000 },
];
const PLAN_BREAKDOWN = [
  { label: "Free", value: 290 },
  { label: "Pro", value: 190 },
  { label: "Business", value: 150 },
  { label: "Enterprise", value: 150 },
];
const COUNTRY_BREAKDOWN = [
  { country: "Nigeria", pct: 40, color: "#1e1b4b" },
  { country: "UK", pct: 20, color: "#4f46e5" },
  { country: "US", pct: 30, color: "#a5b4fc" },
  { country: "Others", pct: 10, color: "#86efac" },
];
const DEMO_SIGNUPS = [
  {
    id: "d1",
    name: "Adigwu Chinedum Hilary",
    email: "adigwu@gmail.com",
    plan: "Free",
    joinedAgo: "3 days ago",
    status: "Active",
  },
  {
    id: "d2",
    name: "Adebanjo Promise",
    email: "adebanjo@gmail.com",
    plan: "Free",
    joinedAgo: "3 days ago",
    status: "Active",
  },
  {
    id: "d3",
    name: "Daniel Ololade",
    email: "daniel@gmail.com",
    plan: "Premium",
    joinedAgo: "4 days ago",
    status: "Trial expire",
  },
  {
    id: "d4",
    name: "Chukwu Emeka",
    email: "emeka@gmail.com",
    plan: "Premium",
    joinedAgo: "4 days ago",
    status: "In-active",
  },
  {
    id: "d5",
    name: "Kemi Adesola",
    email: "kemi@gmail.com",
    plan: "Free",
    joinedAgo: "5 days ago",
    status: "Active",
  },
];
