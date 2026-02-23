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
  metadataBase: new URL('https://patrickwingert.com'),
  title: "Patrick Wingert | Dare2tri Elite Team Athlete",
  description: "Life is Hard. Be Harder. Follow Patrick Wingert's journey as a Dare2tri Elite Team athlete, record-setting trekker, and unstoppable force in adaptive-sports.",
  keywords: ["Patrick Wingert", "Dare2tri", "adaptive-athlete", "elite athlete", "Bhutan trek", "adaptive sports"],
  authors: [{ name: "Patrick Wingert" }],
  icons: {
    icon: '/pat-icon-orange.png',
    apple: '/pat-icon-orange.png',
  },
  openGraph: {
    title: "Patrick Wingert | Dare2tri Elite Team Athlete",
    description: "Life is Hard. Be Harder. Record-setting adaptive-athlete pushing limits and inspiring possibility.",
    type: "website",
    images: [
      {
        url: '/Pat_D2T.png',
        width: 1200,
        height: 630,
        alt: 'Patrick Wingert - Dare2tri Elite Team Athlete',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrick Wingert | Dare2tri Elite Team Athlete',
    description: "Life is Hard. Be Harder. Record-setting adaptive-athlete pushing limits and inspiring possibility.",
    images: ['/Pat_D2T.png'],
  },
};

import SoundController from "@/components/SoundController";
import { Analytics } from "@vercel/analytics/next";

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
        <Analytics />
      </body>
    </html>
  );
}
