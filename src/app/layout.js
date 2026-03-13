import "./globals.css";

export const metadata = {
  title: "DIAG — Get Started",
  description: "Create your DIAG account in 4 easy steps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
