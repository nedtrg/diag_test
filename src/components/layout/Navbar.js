import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-5 flex items-center">
      <div className="flex items-center gap-2">
        {/* Logo icon */}
        <Image
          src="/Ellipse-1.png" // Replace with your logo icon path
          alt="DIAG Logo"
          width={28}
          height={28}
          className="opacity-100"
        />
        <span
          className="font-semibold text-gray-800 text-base tracking-wide"
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
    </nav>
  );
}
