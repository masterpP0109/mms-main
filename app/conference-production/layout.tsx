import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Conferences and Events | MMS', description: 'End-to-end planning, coordination, technical production and management for conferences and corporate events in Victoria Falls and beyond.', alternates: { canonical: "/conference-production" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
