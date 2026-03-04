import type { Metadata } from "next";
import { Geist_Mono, Golos_Text, Montserrat } from "next/font/google";
import "./globals.css";
import "@/src/content/qyzmet-components.global.css";
import "@/src/content/qyzmet-auth.global.css";
import { HomeExactFooter } from "@/src/components/home/HomeExactFooter";
import { HomeExactHeader } from "@/src/components/home/HomeExactHeader";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
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
      <body className={`${golosText.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}>
        <div className="wrapper">
          <HomeExactHeader />
          {children}
          <HomeExactFooter />
        </div>
      </body>
    </html>
  );
}
