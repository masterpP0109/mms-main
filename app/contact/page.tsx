import ContactExperience from "./ContactExperience";

export default async function ContactPage({ searchParams }: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const query = await searchParams;
  const service = (Array.isArray(query.service) ? query.service[0] : query.service)?.trim().slice(0, 160) || "";
  return <ContactExperience key={service} initialService={service} />;
}
