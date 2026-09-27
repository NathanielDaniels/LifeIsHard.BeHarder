import type { Metadata } from "next";
import TokyoCampaign from "./TokyoCampaign";

const title = "One Leg. Two Stars. | Patrick Wingert: Tokyo Marathon 2027";
const description =
  "In 2020 Patrick Wingert lost his right leg. In 2025 he finished the Chicago Marathon. On March 7, 2027 he runs Tokyo, his second World Marathon Major. Help get him to the start line.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tokyo" },
  openGraph: {
    title: "One Leg. Two Stars. Tokyo is up next.",
    description,
    url: "/tokyo",
    type: "website",
    images: [
      {
        url: "/tokyo/og.jpg",
        width: 1200,
        height: 630,
        alt: "Patrick Wingert running out of a rising red sun above a heartbeat horizon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Leg. Two Stars. Tokyo is up next.",
    description,
    images: ["/tokyo/og.jpg"],
  },
};

export default function TokyoPage() {
  return <TokyoCampaign />;
}
