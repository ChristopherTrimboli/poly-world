import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "poly-world",
  description: "A simple world to have fun in.",
  openGraph: {
    title: "poly-world",
    description: "A simple world to have fun in.",
    url: "https://poly-world.vercel.app/",
    locale: "en_US",
    type: "website",
  },
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
