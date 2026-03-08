import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from "@/components/Providers";
import Script from "next/script";
import SoundController from "@/components/SoundController";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://patrickwingert.com"),
  title: "Patrick Wingert | Dare2tri Elite Team Athlete",
  description:
    "Life is Hard. Be Harder. Follow Patrick Wingert's journey as a Dare2tri Elite Team athlete, record-setting trekker, and unstoppable force in adaptive-sports.",
  keywords: [
    "Patrick Wingert",
    "Dare2tri",
    "adaptive-athlete",
    "elite athlete",
    "Bhutan trek",
    "adaptive sports",
  ],
  authors: [{ name: "Patrick Wingert" }],
  icons: {
    icon: "/pat-icon-orange.png",
    apple: "/pat-icon-orange.png",
  },
  openGraph: {
    title: "Patrick Wingert | Dare2tri Elite Team Athlete",
    description:
      "Life is Hard. Be Harder. Record-setting adaptive-athlete pushing limits and inspiring possibility.",
    type: "website",
    images: [
      {
        url: "/Pat_D2T.png",
        width: 1200,
        height: 630,
        alt: "Patrick Wingert - Dare2tri Elite Team Athlete",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Wingert | Dare2tri Elite Team Athlete",
    description:
      "Life is Hard. Be Harder. Record-setting adaptive-athlete pushing limits and inspiring possibility.",
    images: ["/Pat_D2T.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} ${bebasNeue.variable} antialiased bg-black`}
      >
        <Providers>
          <SmoothScroll>
            {children}
            <SoundController />
          </SmoothScroll>
        </Providers>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
