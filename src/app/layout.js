import "./globals.css";
import AOSInit from "@/components/AOSInit";

export const metadata = {
  title: "DIAG — Get Started",
  description: "Create your DIAG account in 4 easy steps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AOSInit />
        {children}
      </body>
    </html>
  );
}
