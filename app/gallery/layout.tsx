import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Gallery | MMS', description: 'Photography and event production by Mosi Media Solutions.', alternates: { canonical: "/gallery" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
