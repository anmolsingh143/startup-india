import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Startup India 2026 | AI-Powered Career Ecosystem",
  description: "Empowering India’s Future with AI-Powered Skill Development & Internships.",
};

import { ClerkProvider } from "@clerk/nextjs";
import { FloatingSupport } from "@/components/support/FloatingSupport";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
        suppressHydrationWarning
      >
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
