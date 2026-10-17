import type { Metadata } from "next";
export const metadata: Metadata = { title: 'About MMS', description: 'Mosi Media Solutions conference, event and creative production expertise.', alternates: { canonical: "/about" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
