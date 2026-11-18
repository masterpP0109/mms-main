import React from "react";
import type { Metadata } from "next";
import { getOperationsDashboardData } from "@/lib/admin-intelligence";
import OperationsConsole from "./OperationsConsole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations & CRM Console | Mosi Media Solutions",
  description:
    "Executive operations console for managing enquiries, conference RFPs, signature package demand, notification delivery telemetry, and client reviews.",
};

export default async function AdminOverviewPage() {
  const initialData = await getOperationsDashboardData();
  return <OperationsConsole initialData={initialData} />;
}
