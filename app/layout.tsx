import { ConvexProviderClient } from "@/components/providers/convex-provider";
import CulturalPattern from "@/components/site/CulturalPattern";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThreeScoreDB",
  description: "Data Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexProviderClient>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
              <CulturalPattern />
              <main className='min-h-[70vh]'>{children}</main>
            </ThemeProvider>
          </ConvexProviderClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
