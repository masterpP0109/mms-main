import { notFound } from "next/navigation";
import { getPackageExperience, packageExperiences } from "@/lib/packages";
import { packageMetadata, packageStructuredData } from "@/lib/package-seo";
import PackageExperiencePage from "@/app/components/packages/PackageExperiencePage";

export const dynamicParams = false;
export function generateStaticParams() {
  return packageExperiences.map(experience => ({ category: experience.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const experience = getPackageExperience((await params).category);
  if (!experience) notFound();
  return packageMetadata(experience);
}
export default async function PackagePage({ params }: { params: Promise<{ category: string }> }) {
  const experience = getPackageExperience((await params).category);
  if (!experience) notFound();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageStructuredData(experience)).replace(/</g, "\\u003c") }} />
    <PackageExperiencePage experience={experience} />
  </>;
}
