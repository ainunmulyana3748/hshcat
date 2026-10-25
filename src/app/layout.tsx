import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royal Rasa Catering & Event | Catering Pernikahan & Jamuan Premium",
  description:
    "Penyedia layanan boga dan katering premium untuk resepsi pernikahan elegan, jamuan korporat prestisius, dan private dining di Jakarta & Jabodetabek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C1917] font-sans selection:bg-[#B38E5D]/20 selection:text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}
