import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MilestonesPage from "./index";
import { vi, describe, it, expect } from "vitest";

interface MockMilestoneCardProps {
  title: string;
  dueDate: string;
  status: string;
}

interface MockUpsertMilestoneModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

// Mock the child components
vi.mock("../../components/features/milestones/MilestoneCard", () => {
  return function MockMilestoneCard({
    title,
    dueDate,
    status,
  }: MockMilestoneCardProps) {
    return (
      <div data-testid="milestone-card">
        <h3>{title}</h3>
        <p>{dueDate}</p>
        <span>{status}</span>
      </div>
    );
  };
});

jest.mock("../../components/features/milestones/UpsertMilestoneModal", () => {
  return function MockUpsertMilestoneModal({
    isOpen,
    handleClose,
  }: MockUpsertMilestoneModalProps) {
    return isOpen ? (
      <div data-testid="upsert-modal">
        <h2>Mock Modal</h2>
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null;
  };
});

describe("MilestonesPage", () => {
  it("renders the page title", () => {
    render(<MilestonesPage />);
    expect(screen.getByText("Milestones")).toBeInTheDocument();
  });

  it("renders the new milestone button", () => {
    render(<MilestonesPage />);
    expect(screen.getByText("+ New Milestone")).toBeInTheDocument();
  });

  it("renders all milestone cards", () => {
    render(<MilestonesPage />);
    const milestoneCards = screen.getAllByTestId("milestone-card");
    expect(milestoneCards).toHaveLength(5);
  });

  it("renders milestone card with correct data", () => {
    render(<MilestonesPage />);
    expect(screen.getByText("Launch Website")).toBeInTheDocument();
    expect(screen.getByText("Eat Pizza")).toBeInTheDocument();
    expect(screen.getAllByText("Drink Coke")).toHaveLength(3);
    expect(screen.getAllByText("2023-10-15")).toHaveLength(5);
    expect(screen.getAllByText("Completed")).toHaveLength(5);
  });

  it("opens modal when new milestone button is clicked", async () => {
    const user = userEvent.setup();
    render(<MilestonesPage />);

    const newMilestoneButton = screen.getByText("+ New Milestone");
    await user.click(newMilestoneButton);

    expect(screen.getByTestId("upsert-modal")).toBeInTheDocument();
    expect(screen.getByText("Mock Modal")).toBeInTheDocument();
  });

  it("closes modal when handleClose is called", async () => {
    const user = userEvent.setup();
    render(<MilestonesPage />);

    // Open modal
    const newMilestoneButton = screen.getByText("+ New Milestone");
    await user.click(newMilestoneButton);

    expect(screen.getByTestId("upsert-modal")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    expect(screen.queryByTestId("upsert-modal")).not.toBeInTheDocument();
  });

  it("modal is initially closed", () => {
    render(<MilestonesPage />);
    expect(screen.queryByTestId("upsert-modal")).not.toBeInTheDocument();
  });
});
