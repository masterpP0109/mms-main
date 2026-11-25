import { fireEvent, render, screen } from "@testing-library/react";
import ServicesView from "@/app/services/ServicesView";
import CategoryCatalogueClient from "@/app/components/services/CategoryCatalogueClient";
import EquipmentDetailView from "@/app/components/services/EquipmentDetailView";
import {
  getDraftEquipment,
  getEquipmentForCategory,
  getEquipmentItem,
} from "@/lib/technology-catalog";
import type { ServiceCardData } from "@/lib/content-types";

jest.unmock("lucide-react");
jest.mock("next/navigation", () => ({ usePathname: () => "/services" }));
jest.mock("@/app/components/Navbar", () => ({ __esModule: true, default: () => null }));
jest.mock("@/app/components/Footer", () => ({ __esModule: true, default: () => null }));

const sampleCatalog: ServiceCardData[] = [
  {
    slug: "conference-microphone-interpretation-equipment",
    title: "Conference Microphone & Interpretation Equipment",
    tag: "Audio & Interpretation",
    desc: "Conference audio and interpretation.",
    image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    gallery: [],
    features: ["Microphone Systems"],
    cta: "Plan Your Conference",
    href: "/conference-production",
  },
  {
    slug: "led-screen-rental",
    title: "LED Screen Rental",
    tag: "Visual Display",
    desc: "High-brightness LED screens.",
    image: "/services%20images/LED%20Screen%20Rental.jpg",
    gallery: [],
    features: ["LED Screens"],
    cta: "Build Your Event",
    href: "/contact",
  },
];

describe("Services & Technology catalogue", () => {
  it("filters services by technology category without nested controls", () => {
    const { container } = render(<ServicesView catalog={sampleCatalog} />);
    expect(screen.getByRole("link", { name: /Conference & Interpretation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LED Screens & Displays/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Visual Displays" }));
    expect(screen.queryByRole("link", { name: /Conference & Interpretation/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LED Screens & Displays/i })).toBeInTheDocument();

    expect(container.querySelector("a a, a button, button a")).toBeNull();
  });

  it("keeps unverified draft equipment models hidden from public queries", () => {
    const drafts = getDraftEquipment();
    expect(drafts.length).toBeGreaterThan(0);
    for (const draft of drafts) {
      expect(getEquipmentItem(draft.parentCategorySlug, draft.slug)).toBeUndefined();
      const publishedForCat = getEquipmentForCategory(draft.parentCategorySlug);
      expect(publishedForCat.some((item) => item.slug === draft.slug)).toBe(false);
    }
  });

  it("filters equipment by type and compares same-category models", () => {
    const ledItems = getEquipmentForCategory("led-screen-rental");
    expect(ledItems.length).toBe(2);

    render(<CategoryCatalogueClient items={ledItems} pixelPitchNote="Smaller pixel pitch gives finer detail." />);

    // Filter by Outdoor LED
    fireEvent.click(screen.getByRole("button", { name: "Outdoor LED" }));
    expect(screen.queryByText("Indoor LED Video Walls")).not.toBeInTheDocument();
    expect(screen.getByText("Outdoor LED Displays")).toBeInTheDocument();

    // Reset filter and compare both LED items
    fireEvent.click(screen.getByRole("button", { name: "All Equipment" }));
    const compareButtons = screen.getAllByRole("button", { name: "Compare" });
    fireEvent.click(compareButtons[0]);
    fireEvent.click(compareButtons[1]);

    expect(screen.getByRole("heading", { name: "Compare Selected Equipment" })).toBeInTheDocument();
    expect(screen.getByText("Indoor")).toBeInTheDocument();
    expect(screen.getByText("Outdoor")).toBeInTheDocument();
  });

  it("renders equipment details, interactive demo, specs accordion and prefilled enquiry CTA", () => {
    const podium = getEquipmentItem("digital-podiums", "smart-digital-podium");
    expect(podium).toBeDefined();

    render(<EquipmentDetailView item={podium!} />);

    expect(screen.getByRole("heading", { name: "Digital Podium" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What does it do?" })).toBeInTheDocument();

    const enquiry = screen.getByRole("link", { name: /Enquire About This Technology/i });
    expect(enquiry).toHaveAttribute(
      "href",
      "/contact?service=Digital%20Podiums%20%E2%80%94%20Digital%20Podium&origin=%2Fservices%2Fdigital-podiums%2Fsmart-digital-podium"
    );

    fireEvent.click(screen.getByRole("button", { name: "Awards" }));
    expect(screen.getByText("EXCELLENCE AWARDS GALA")).toBeInTheDocument();

    const specsToggle = screen.getByRole("button", { name: /Specifications & Scoping Details/i });
    expect(specsToggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(specsToggle);
    expect(specsToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Front Display")).toBeInTheDocument();
  });
});
