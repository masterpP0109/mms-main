import { render, screen } from "@testing-library/react";
import ServicesView from "@/app/services/ServicesView";

jest.unmock("lucide-react");
jest.mock("next/navigation", () => ({ usePathname: () => "/services" }));
jest.mock("@/app/components/Navbar", () => ({ __esModule: true, default: () => null }));
jest.mock("@/app/components/Footer", () => ({ __esModule: true, default: () => null }));

it("links the catalogue drone card and both wedding entry points without nested controls", () => {
  const { container } = render(<ServicesView catalog={[]} />);
  expect(screen.getByRole("link", { name: "Explore Drone Services" })).toHaveAttribute("href", "/services/drone");
  expect(screen.getByRole("link", { name: "Explore weddings & elopements" })).toHaveAttribute("href", "/services/weddings-elopements");
  expect(screen.getByRole("link", { name: "Discover Weddings & Elopements coverage" })).toHaveAttribute("href", "/services/weddings-elopements");
  expect(container.querySelector("a a, a button, button a")).toBeNull();
});
