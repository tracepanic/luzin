import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import "./globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
