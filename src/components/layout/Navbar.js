export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center">
      <div className="flex items-center gap-2">
        {/* Logo icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="#4F46E5" opacity="0.15" />
          <path
            d="M8 14 C8 10 11 7 14 7 C17 7 18 9 17 12 C16 15 13 15 14 18 C15 21 18 21 20 19"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="9" cy="17" r="2.5" fill="#38bdf8" />
        </svg>
        <span
          className="font-semibold text-gray-800 text-base tracking-wide"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          DIAG
        </span>
      </div>
    </nav>
  );
}
