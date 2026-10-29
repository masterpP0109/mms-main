import { type PackageExperience } from "@/lib/packages";
import PackageExperiencePage from "./PackageExperiencePage";

export default function WeddingPackagePage({
  experience,
}: {
  experience: PackageExperience;
}) {
  return <PackageExperiencePage experience={experience} />;
}
