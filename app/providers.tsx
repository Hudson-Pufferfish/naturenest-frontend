"use client";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./query-provider";
import { type ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
export default Providers;
