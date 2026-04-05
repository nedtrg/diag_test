"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconLayoutDashboard,
  IconChartBar,
  IconChartLine,
  IconUsers,
  IconPlugConnected,
  IconSettings,
  IconBell,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";
import Image from "next/image";

/* ─── Responsive CSS ─────────────────────────────────────────────────────────  */
const DASH_CSS = `
  * { box-sizing: border-box; }

  .dash-shell { min-height: 100vh; background: #f0f2f5; display: flex; flex-direction: column; }

  /* Navbar */
  .dash-nav {
    background: white;
    border-bottom: 1px solid #f3f4f6;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 100px;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .nav-search {
    flex: 1;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 0.875rem;
    color: #9ca3af;
  }
  /* Hide search on small screens */
  @media (max-width: 480px) { .nav-search { display: none; } }

  /* Body layout */
  .dash-body { display: flex; flex: 1; overflow: hidden; }

  /* Sidebar — hidden on mobile, visible on desktop */
  .dash-sidebar {
    display: none;
    width: 200px;
    flex-shrink: 0;
    background: white;
    border-right: 1px solid #f3f4f6;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 0;
  }
  @media (min-width: 768px) { .dash-sidebar { display: flex; } }

  /* Mobile bottom nav */
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #f3f4f6;
    z-index: 40;
    padding: 8px 0 4px;
  }
  @media (min-width: 768px) { .mobile-nav { display: none; } }

  /* Main content */
  .dash-main {
    flex: 1;
    padding: 20px 16px 80px;
    overflow-y: auto;
  }
  @media (min-width: 768px) { .dash-main { padding: 28px 24px 28px; } }
  @media (min-width: 1024px) { .dash-main { padding: 32px; } }

  /* KPI cards grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  @media (min-width: 480px) { .kpi-grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 768px) { .kpi-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; } }

  /* Charts grid */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  @media (min-width: 768px) { .charts-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
  @media (min-width: 1024px) { .charts-grid { grid-template-columns: 1fr 1fr 260px; margin-bottom: 28px; } }

  /* Table — scrollable on mobile */
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .signups-table { width: 100%; border-collapse: collapse; min-width: 560px; }

  /* Hide less important columns on mobile */
  .col-joined { display: none; }
  @media (min-width: 640px) { .col-joined { display: table-cell; } }
`;

/* ─── Logo ───────────────────────────────────────────────────────────────────  */
function DiagLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Image
        src="/Ellipse-1.png" // Replace with your logo icon path
        alt="DIAG Logo"
        width={28}
        height={28}
        className="opacity-100"
      />
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: "1rem",
          color: "#1f2937",
          letterSpacing: "0.08em",
        }}
      >
        DIAG
      </span>
    </div>
  );
}

/* ─── Charts ─────────────────────────────────────────────────────────────────  */
function AreaChart() {
  const points = [
    [0, 80],
    [30, 75],
    [60, 65],
    [90, 55],
    [120, 30],
    [150, 20],
    [180, 10],
    [210, 25],
    [240, 35],
  ];
  const w = 340,
    h = 140;
  const scaleX = w / 240,
    scaleY = h / 100;
  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x * scaleX} ${y * scaleY}`)
    .join(" ");
  const areaD = pathD + ` L ${240 * scaleX} ${h} L 0 ${h} Z`;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y * scaleY}
            x2={w}
            y2={y * scaleY}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        <path d={areaD} fill="url(#areaGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={210 * scaleX} cy={25 * scaleY} r="5" fill="#4f46e5" />
        <rect
          x={180 * scaleX - 55}
          y={25 * scaleY - 32}
          width="100"
          height="40"
          rx="6"
          fill="#0E0697"
        />
        <text
          x={180 * scaleX - 5}
          y={25 * scaleY - 13}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="600"
        >
          16 Oct 2024
        </text>
        <text
          x={180 * scaleX - 5}
          y={25 * scaleY - 3}
          textAnchor="middle"
          fill="white"
          fontSize="9"
        >
          ₦24,000.00
        </text>
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        {[
          "Oct 1",
          "Oct 3",
          "Oct 6",
          "Oct 9",
          "Oct 10",
          "Oct 15",
          "Oct 16",
          "Oct 17",
          "Oct 18",
        ].map((l) => (
          <span key={l} style={{ fontSize: "0.6rem", color: "#9ca3af" }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const bars = [
    { label: "Free", value: 290 },
    { label: "Pro", value: 190 },
    { label: "Business", value: 150 },
    { label: "Enterprise", value: 150 },
  ];

  const maxVal = 300;
  const chartHeight = 200;
  const yLabels = [300, 200, 100, 0];
  const gridLines = [300, 200, 100];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "8px",
        width: "100%",
        paddingLeft: "20px",
      }}
    >
      {/* Rotated Y-axis label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            color: "#9ca3af",
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          Active users
        </span>
      </div>

      {/* Y-axis numbers */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: `${chartHeight}px`,
          paddingBottom: "24px",
          flexShrink: 0,
        }}
      >
        {yLabels.map((val) => (
          <span
            key={val}
            style={{ fontSize: "0.65rem", color: "#9ca3af", lineHeight: 1 }}
          >
            {val}
          </span>
        ))}
      </div>

      {/* Chart area */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Grid lines */}
        <div style={{ position: "relative", height: `${chartHeight - 24}px` }}>
          {gridLines.map((val) => (
            <div
              key={val}
              style={{
                position: "absolute",
                bottom: `${(val / maxVal) * 100}%`,
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "#e5e7eb",
                zIndex: 0,
              }}
            />
          ))}

          {/* Bottom baseline */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#e5e7eb",
            }}
          />

          {/* Bars */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              height: "100%",
              position: "relative",
              zIndex: 1,
              paddingBottom: "0px",
            }}
          >
            {bars.map((bar) => {
              const barHeight = (bar.value / maxVal) * (chartHeight - 24);
              return (
                <div
                  key={bar.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0px",
                    flex: 1,
                    maxWidth: "60px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${barHeight}px`,
                      background:
                        "linear-gradient(180deg, #c7d2fe 0%, #a5b4fc 100%)",
                      borderRadius: "10px 10px 0 0",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "8px",
          }}
        >
          {bars.map((bar) => (
            <span
              key={bar.label}
              style={{
                fontSize: "0.72rem",
                color: "#6b7280",
                flex: 1,
                maxWidth: "80px",
                textAlign: "center",
              }}
            >
              {bar.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutChart() {
  const segments = [
    { pct: 40, color: "#1e1b4b", label: "Nigeria", count: 160 },
    { pct: 20, color: "#4f46e5", label: "UK", count: 80 },
    { pct: 30, color: "#a5b4fc", label: "US", count: 120 },
    { pct: 10, color: "#4ade80", label: "Others", count: 40 },
  ];

  const r = 45,
    cx = 55,
    cy = 55,
    strokeW = 16;
  const circumference = 2 * Math.PI * r;
  const gapDegrees = 4;

  let offset = 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 110 110">
          {segments.map((seg, i) => {
            const segDegrees = (seg.pct / 100) * 360;
            const adjustedDegrees = segDegrees - gapDegrees;
            const dash = (adjustedDegrees / 360) * circumference;
            const emptyDash = circumference - dash;
            const rotate = (offset / 100) * 360 - 90 + gapDegrees / 2;
            offset += seg.pct;

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeW}
                strokeDasharray={`${dash} ${emptyDash}`}
                strokeLinecap="butt"
                transform={`rotate(${rotate} ${cx} ${cy})`}
              />
            );
          })}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="14"
            fontWeight="500"
            fill="#111827"
          >
            400
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontSize="7"
            fill="#9ca3af"
          >
            Total users
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 12px",
        }}
      >
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: seg.color,
                flexShrink: 0,
                marginTop: "3px",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "#6b7280",
                  lineHeight: 1.3,
                }}
              >
                {seg.label} ({seg.pct}%)
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {seg.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────────  */
const STATUS_STYLES = {
  Active: { backgroundColor: "#dcfce7", color: "#16a34a" },
  "Trial expire": { backgroundColor: "#fee2e2", color: "#dc2626" },
  "In-active": { backgroundColor: "#f3f4f6", color: "#6b7280" },
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: IconLayoutDashboard },
  { label: "Report", icon: IconChartBar },
  { label: "Analytics", icon: IconChartLine },
  { label: "Users", icon: IconUsers },
  { label: "Integrations", icon: IconPlugConnected },
  { label: "Settings", icon: IconSettings },
];

/* ─── Dashboard Page ─────────────────────────────────────────────────────────  */
export default function Dashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ── Data fetched from MongoDB via /api/me and /api/stats ──────────────────
  const [dashUser, setDashUser] = useState(null); // user from DB
  const [stats, setStats] = useState(null); // KPI + chart data
  const [signups, setSignups] = useState([]); // latest signups table
  const [fetchError, setFetchError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("diag_session")
        : null;

    if (!token) {
      // No session — redirect to onboarding
      router.replace("/");
      return;
    }

    async function loadDashboard() {
      setLoadingData(true);
      setFetchError(null);
      try {
        const [meRes, statsRes] = await Promise.all([
          fetch(`/api/me?token=${token}`),
          fetch(`/api/stats?token=${token}&page=${page}`),
        ]);

        if (meRes.status === 401 || statsRes.status === 401) {
          // Session expired — send back to onboarding
          localStorage.removeItem("diag_session");
          localStorage.removeItem("diag_user");
          router.replace("/");
          return;
        }

        const meData = await meRes.json();
        const statsData = await statsRes.json();

        if (meData.user) setDashUser(meData.user);
        if (statsData.stats) setStats(statsData.stats);
        if (statsData.recentSignups) setSignups(statsData.recentSignups);
        if (statsData.stats) setStats(statsData.stats);
        if (statsData.recentSignups) setSignups(statsData.recentSignups);
        if (statsData.pagination)
          setTotalPages(statsData.pagination.totalPages);
      } catch (err) {
        console.error("[Dashboard] fetch error:", err);
        setFetchError("Could not load dashboard data. Please refresh.");
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboard();
  }, [router, page]);

  const handleLogout = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("diag_session")
        : null;
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: token }),
      });
    } catch {
      /* still proceed */
    }
    localStorage.removeItem("diag_session");
    localStorage.removeItem("diag_user");
    router.push("/login");
  };

  // Derived display values — fall back to placeholders while loading
  const displayName =
    dashUser?.name || dashUser?.email?.split("@")[0] || "there";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const totalRevenue = stats
    ? `₦${stats.totalRevenue.toLocaleString()}.00`
    : "₦24,000.00";
  const churnedRevenue = stats
    ? `₦${stats.churnedRevenue.toLocaleString()}.00`
    : "₦2,000.00";
  const activeUsers = stats ? String(stats.activeUsers) : "400";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DASH_CSS }} />
      <div className="dash-shell">
        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <nav className="dash-nav">
          <DiagLogo />
          <div className="nav-search">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#9ca3af"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search anything...
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div style={{ position: "relative", cursor: "pointer" }}>
              <IconBell size={22} color="#6b7280" />
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  backgroundColor: "#4F46E5",
                  borderRadius: "50%",
                }}
              />
            </div>
            {/* User menu */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowUserMenu((m) => !m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(dashUser?.email || "user")}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`}
                  alt={displayName}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    flexShrink: 0,
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    display: "none",
                  }}
                  className="nav-name"
                >
                  {displayName}
                </span>
                <IconChevronDown size={14} color="#9ca3af" />
              </div>

              {showUserMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    minWidth: "180px",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {displayName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#9ca3af",
                        margin: "2px 0 0",
                      }}
                    >
                      {dashUser?.email || ""}
                    </p>
                  </div>
                  <div style={{ padding: "4px 0" }}>
                    <div
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 14px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        color: "#374151",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <IconSettings size={15} color="#6b7280" />
                      Settings
                    </div>
                    <div
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 14px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        color: "#dc2626",
                        borderTop: "1px solid #f3f4f6",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <IconLogout size={15} color="#dc2626" />
                      Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <style>{`@media(min-width:640px){.nav-name{display:inline!important}}`}</style>
        </nav>

        <div className="dash-body">
          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <aside className="dash-sidebar">
            <div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.label === "Dashboard";
                return (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 18px",
                      cursor: "pointer",
                      borderLeft: `3px solid ${active ? "#4f46e5" : "transparent"}`,
                      backgroundColor: active ? "#f5f3ff" : "transparent",
                      color: active ? "#4f46e5" : "#6b7280",
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </div>
                );
              })}
            </div>
            {/* Trial card */}
            <div
              style={{
                margin: "16px",
                padding: "20px",
                backgroundColor: "#f5f3ff",
                borderRadius: "12px",
              }}
            >
              <div className="trial-icon" style={{ marginBottom: "12px" }}>
                <Image src="/Vector2.png" alt="Gift" width={32} height={32} />
              </div>

              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "12px",
                }}
              >
                You're on a 7-day free trial
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  lineHeight: 1.5,
                  marginBottom: "12px",
                }}
              >
                Enjoy full access to all features , no limits, no commitments
                (yet).
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Choose a Plan
              </button>
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <main className="dash-main">
            {fetchError && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                }}
              >
                {fetchError}
              </div>
            )}

            <h1
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                color: "#111827",
                marginBottom: "20px",
              }}
            >
              {loadingData ? "Loading…" : `Welcome ${displayName} 👋`}
            </h1>

            {/* KPI Cards */}
            <div className="kpi-grid">
              {[
                {
                  label: "TOTAL REVENUE",
                  value: totalRevenue,
                  change: "+20%",
                  positive: true,
                },
                {
                  label: "CHURNED REVENUE",
                  value: churnedRevenue,
                  change: "-5%",
                  positive: false,
                },
                {
                  label: "ACTIVE USERS",
                  value: activeUsers,
                  change: "+20%",
                  positive: true,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "18px 20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    {card.label}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        fontWeight: 700,
                        color: "#3A3A3AE5",
                      }}
                    >
                      {card.value}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: card.positive ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              {/* Revenue Over Time */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                    }}
                  >
                    REVENUE OVER TIME
                  </p>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.68rem",
                      color: "#4f46e5",
                      fontWeight: 500,
                    }}
                  >
                    THIS MONTH <IconChevronDown size={30} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      paddingBottom: "20px",
                      fontSize: "0.6rem",
                      color: "#9ca3af",
                      flexShrink: 0,
                    }}
                  >
                    <span>₦60k</span>
                    <span>₦40k</span>
                    <span>₦20k</span>
                    <span>₦0</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <AreaChart />
                  </div>
                </div>
              </div>

              {/* Top Performing Plans */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                    }}
                  >
                    TOP PERFORMING PLANS
                  </p>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.68rem",
                      color: "#4f46e5",
                      fontWeight: 500,
                    }}
                  >
                    THIS MONTH <IconChevronDown size={30} />
                  </button>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <BarChart />
                  </div>
                </div>
              </div>

              {/* Donut — full width on mobile/tablet, sidebar on large screens */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    color: "#9ca3af",
                    letterSpacing: "0.05em",
                    marginBottom: "12px",
                  }}
                >
                  USER DISTRIBUTION BY COUNTRY
                </p>
                <DonutChart />
              </div>
            </div>

            {/* Latest Signups Table */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: "20px",
                    color: "#3A3A3AE5",
                  }}
                >
                  Latest Signups
                </h2>
              </div>
              <div className="table-wrap">
                <table className="signups-table">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      {["NAME", "EMAIL", "PLAN", "JOINED", "STATUS"].map(
                        (h, i) => (
                          <th
                            key={h}
                            className={i === 3 ? "col-joined" : ""}
                            style={{
                              padding: "15px 18px",
                              textAlign: "left",
                              fontSize: "14px",
                              lineHeight: "18px",
                              fontWeight: 700,
                              color: "#9ca3af",
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap",
                              backgroundColor: "#f9fafb",
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingData ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "24px",
                            textAlign: "center",
                            fontSize: "0.875rem",
                            color: "#9ca3af",
                            fontWeight: 500,
                          }}
                        >
                          Loading signups…
                        </td>
                      </tr>
                    ) : signups.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "24px",
                            textAlign: "center",
                            fontSize: "0.875rem",
                            color: "#9ca3af",
                            fontWeight: 500,
                          }}
                        >
                          No signups yet.
                        </td>
                      </tr>
                    ) : (
                      signups.map((row, i) => {
                        const initials2 = (row.name || row.email || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                          <tr
                            key={row.id || i}
                            style={{
                              borderBottom:
                                i < signups.length - 1
                                  ? "1px solid #f9fafb"
                                  : "none",
                            }}
                          >
                            <td style={{ padding: "13px 18px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "9px",
                                }}
                              >
                                <img
                                  src={`https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(row.email)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`}
                                  alt={row.name}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    objectFit: "cover",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "#374151",
                                    whiteSpace: "nowrap",
                                    fontWeight: 500,
                                  }}
                                >
                                  {row.name || "—"}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: "0.8rem",
                                color: "#374151",
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                              }}
                            >
                              {row.email}
                            </td>
                            <td
                              style={{
                                padding: "13px 18px",
                                fontSize: "0.8rem",
                                color: "#374151",
                                fontWeight: 500,
                              }}
                            >
                              {row.plan}
                            </td>
                            <td
                              className="col-joined"
                              style={{
                                padding: "13px 18px",
                                fontSize: "0.8rem",
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                              }}
                            >
                              {row.joinedAgo}
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  ...(STATUS_STYLES[row.status] ||
                                    STATUS_STYLES["In-active"]),
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "10px",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: "none",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    color: page === 1 ? "#d1d5db" : "#374151",
                  }}
                >
                  <IconChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: "none",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    color: page === totalPages ? "#d1d5db" : "#374151",
                  }}
                >
                  <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* ── Mobile Bottom Navigation ──────────────────────────────────── */}
        <nav className="mobile-nav">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = item.label === "Dashboard";
            return (
              <div
                key={item.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "4px 0",
                  cursor: "pointer",
                  color: active ? "#4f46e5" : "#9ca3af",
                }}
              >
                <Icon size={20} />
                <span
                  style={{ fontSize: "0.6rem", fontWeight: active ? 600 : 400 }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
