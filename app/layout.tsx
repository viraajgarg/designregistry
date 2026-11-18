import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Registry | Legal Thread",
  description: "Search and manage registered designs with the Design Registry.",
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
