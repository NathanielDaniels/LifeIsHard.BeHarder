import type { Metadata } from "next";
import Home from "./home-client";

export const metadata: Metadata = {
  title: "Patrick Wingert | Life is Hard. Be Harder.",
  description:
    "Patrick Wingert. Dare2Tri Elite Team para-triathlete, first below-knee amputee to thru-hike the Trans Bhutan Trail. Life is Hard. Be Harder.",
};

export default function HomePage() {
  return <Home />;
}
