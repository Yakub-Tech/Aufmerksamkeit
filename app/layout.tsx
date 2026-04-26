import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Aufmerksamkeit",
  description: "Interaktive Webanwendung zur Aufmerksamkeitsökonomie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${serif.variable} ${mono.variable} scroll-smooth`}>
      <body className="bg-[#F5F1EA] text-[#0F0F0E] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
