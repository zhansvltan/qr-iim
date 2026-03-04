import type { Metadata } from "next";
import { Geist_Mono, Golos_Text } from "next/font/google";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Сервис по приему в Академию внутренних дел",
  description: "Сервис по приему в Академию внутренних дел",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${golosText.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
