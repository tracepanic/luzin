import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/utils/provider";
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
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
