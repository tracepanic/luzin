import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
