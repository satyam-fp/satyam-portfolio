import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neural Space - ML Engineer Portfolio",
  description: "Interactive 3D portfolio showcasing Machine Learning and AI projects with a focus on 3D applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
