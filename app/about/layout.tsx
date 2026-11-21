import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Mosi Media Solutions | Conference & Event Organisers Victoria Falls",
  description: "Victoria Falls-based conference organisers, corporate event management and audiovisual production partner serving ministries, NGOs, international organisations and businesses across Zimbabwe and Southern Africa.",
  alternates: { canonical: "/about" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
