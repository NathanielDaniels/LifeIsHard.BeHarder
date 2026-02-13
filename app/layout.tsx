import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Patrick Wingert | Dare2tri Elite Team Athlete",
  description: "Life is Hard. Be Harder. Follow Patrick Wingert's journey as a Dare2tri Elite Team athlete, record-setting trekker, and unstoppable force in para-triathlon.",
  keywords: ["Patrick Wingert", "Dare2tri", "para-triathlon", "elite athlete", "Bhutan trek", "adaptive sports"],
  authors: [{ name: "Patrick Wingert" }],
  openGraph: {
    title: "Patrick Wingert | Dare2tri Elite Team Athlete",
    description: "Life is Hard. Be Harder. Record-setting para-triathlete pushing limits and inspiring possibility.",
    type: "website",
  },
};

import SoundController from "@/components/SoundController";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${bebasNeue.variable} antialiased bg-black`}>
        <Providers>
          <SmoothScroll>
            {children}
            <SoundController />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
