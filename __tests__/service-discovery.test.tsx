import { render, screen } from "@testing-library/react";
import ServicesView from "@/app/services/ServicesView";
import ConferencesAndEventsPage from "@/app/conference-production/page";

jest.unmock("lucide-react");
jest.mock("next/navigation", () => ({ usePathname: () => "/services" }));
jest.mock("@/app/components/Navbar", () => ({ __esModule: true, default: () => null }));
jest.mock("@/app/components/Footer", () => ({ __esModule: true, default: () => null }));

it("links the catalogue drone card without nested controls and keeps weddings feature on conference-production", () => {
  const { container } = render(<ServicesView catalog={[]} />);
  expect(screen.getByRole("link", { name: "Explore Drone Services" })).toHaveAttribute("href", "/services/drone");
  expect(screen.getAllByRole("link", { name: /Talk to Our Team/i }).length).toBeGreaterThanOrEqual(3);
  expect(container.querySelector("a a, a button, button a")).toBeNull();

  const { container: confContainer } = render(<ConferencesAndEventsPage />);
  expect(screen.getByRole("link", { name: "Explore weddings & elopements" })).toHaveAttribute("href", "/services/weddings-elopements");
  expect(screen.getByRole("link", { name: "Discover Weddings & Elopements coverage" })).toHaveAttribute("href", "/services/weddings-elopements");
  expect(confContainer.querySelector("a a, a button, button a")).toBeNull();
});
