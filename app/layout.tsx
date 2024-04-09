import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "poly-world",
  description: "A simple world to have fun in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
