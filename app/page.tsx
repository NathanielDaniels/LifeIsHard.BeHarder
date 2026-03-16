import type { Metadata } from "next";
import ComingSoonClient from "./coming-soon-client";
// import Home from './page.full-site';

export const metadata: Metadata = {
  title: "Patrick Wingert | Coming Soon",
  description:
    "Something epic is coming. Patrick Wingert. Dare2tri Elite Team athlete, record-setting trekker. Life is Hard. Be Harder.",
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
  // return <Home />;
}
