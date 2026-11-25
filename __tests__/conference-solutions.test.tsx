import { fireEvent, render, screen } from "@testing-library/react";
import LayoutExplorer from "@/app/components/conference/LayoutExplorer";
import TechnologyStageExplorer from "@/app/components/conference/TechnologyStageExplorer";
import PlanningPhasesExplorer from "@/app/components/conference/PlanningPhasesExplorer";
import ConferenceEnquiryPlanner from "@/app/components/conference/ConferenceEnquiryPlanner";
import {
  CONFERENCE_SOLUTIONS,
  getSolutionEquipment,
} from "@/lib/conference-solutions";

jest.unmock("lucide-react");

describe("Conference & Corporate Events Redesign", () => {
  it("provides 8 event solutions linked only to verified equipment", () => {
    expect(CONFERENCE_SOLUTIONS).toHaveLength(8);
    for (const sol of CONFERENCE_SOLUTIONS) {
      const eq = getSolutionEquipment(sol);
      expect(eq.length).toBeGreaterThan(0);
      expect(eq.every((item) => item.published)).toBe(true);
    }
  });

  it("switches room layouts and triggers layout prefill", () => {
    const onSelect = jest.fn();
    render(<LayoutExplorer onSelectLayout={onSelect} />);

    expect(screen.getByRole("heading", { name: "Theatre layout" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "U-shape" }));
    expect(screen.getByRole("heading", { name: "U-shape layout" })).toBeInTheDocument();
    expect(screen.getByText(/Illustrative arrangement, not a venue-specific capacity/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Use U-shape in my enquiry/i }));
    expect(onSelect).toHaveBeenCalledWith("U-shape");
  });

  it("switches stage technology hotspots and links to equipment catalogue", () => {
    render(<TechnologyStageExplorer />);
    expect(screen.getByRole("link", { name: /Explore LED Screens & Displays/i })).toHaveAttribute(
      "href",
      "/services/led-screen-rental"
    );

    fireEvent.click(screen.getByRole("tab", { name: /Digital Podium/i }));
    expect(screen.getByRole("link", { name: /Explore Digital Podiums/i })).toHaveAttribute(
      "href",
      "/services/digital-podiums"
    );
  });

  it("organizes all 11 stages into 4 phases with full process toggle", () => {
    render(<PlanningPhasesExplorer />);
    fireEvent.click(screen.getByRole("tab", { name: /Phase 02/i }));
    expect(screen.getByText("Branding & Design")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /View Full 11-Stage Process/i }));
    expect(screen.getByText("Stage 11")).toBeInTheDocument();
  });

  it("supports guided planner steps and quick enquiry toggle", () => {
    render(<ConferenceEnquiryPlanner />);
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Quick Enquiry" }));
    expect(screen.getByRole("button", { name: /Request an Event Proposal/i })).toBeInTheDocument();
  });
});
