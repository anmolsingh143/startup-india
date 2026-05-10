import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Startup India 2026 | AI-Powered Career Ecosystem",
  description: "Empowering India’s Future with AI-Powered Skill Development & Internships.",
};

import { ClerkProvider } from "@clerk/nextjs";
import { FloatingSupport } from "@/components/support/FloatingSupport";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
        suppressHydrationWarning
      >
        <head>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </head>
        <body 
          className="min-h-full flex flex-col font-sans bg-background text-foreground"
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            {children}
            <FloatingSupport />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
