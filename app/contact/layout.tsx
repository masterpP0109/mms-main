import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Contact MMS', description: 'Tell MMS about your conference, event or media production needs.', alternates: { canonical: "/contact" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
