import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MilestoneCard from "../MilestoneCard";
import type { IMilestone } from "../../../../@types/Milestone";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("MilestoneCard", () => {
  const mockOnEditMilestone = vi.fn();

  const pendingMilestone: IMilestone = {
    id: 1,
    title: "Test Milestone",
    dueDate: "2025-09-30",
    status: "Pending",
  };

  const completedMilestone: IMilestone = {
    id: 2,
    title: "Completed Task",
    dueDate: "2025-08-15",
    status: "Completed",
  };

  beforeEach(() => {
    mockOnEditMilestone.mockClear();
  });

  it("renders milestone title, due date, and status", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );
    expect(screen.getByText("Test Milestone")).toBeInTheDocument();
    expect(screen.getByText("Due: 2025-09-30")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders completed milestone correctly", () => {
    render(
      <MilestoneCard
        {...completedMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );
    expect(screen.getByText("Completed Task")).toBeInTheDocument();
    expect(screen.getByText("Due: 2025-08-15")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders edit button with correct accessibility label", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );
    const editButton = screen.getByLabelText("Edit milestone");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute("type", "button");
  });

  it("calls onEditMilestone when edit button is clicked", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const editButton = screen.getByLabelText("Edit milestone");
    fireEvent.click(editButton);

    expect(mockOnEditMilestone).toHaveBeenCalledTimes(1);
    expect(mockOnEditMilestone).toHaveBeenCalledWith(pendingMilestone);
  });

  it("calls onEditMilestone with user event", async () => {
    const user = userEvent.setup();
    render(
      <MilestoneCard
        {...completedMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const editButton = screen.getByLabelText("Edit milestone");
    await user.click(editButton);

    expect(mockOnEditMilestone).toHaveBeenCalledTimes(1);
    expect(mockOnEditMilestone).toHaveBeenCalledWith(completedMilestone);
  });

  it("has correct CSS classes for styling", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    // Get the main card container (outermost div)
    const cardContainer = screen
      .getByText("Test Milestone")
      .closest("div")?.parentElement;
    expect(cardContainer).toHaveClass(
      "w-full",
      "max-w-md",
      "rounded-xl",
      "shadow-md",
      "border",
      "border-gray-200",
      "p-4",
      "bg-white",
      "flex",
      "flex-col",
      "gap-2"
    );
  });

  it("displays title with correct styling classes", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const titleElement = screen.getByText("Test Milestone");
    expect(titleElement).toHaveClass(
      "text-lg",
      "font-semibold",
      "text-gray-800"
    );
  });

  it("displays due date with correct formatting and styling", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const dueDateElement = screen.getByText("Due: 2025-09-30");
    expect(dueDateElement).toHaveClass("text-sm", "text-gray-500");
  });

  it("displays status with correct styling classes", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const statusElement = screen.getByText("Pending");
    expect(statusElement).toHaveClass(
      "px-3",
      "py-1",
      "rounded-full",
      "text-sm",
      "font-medium",
      "w-fit",
      "bg-gray-100",
      "text-gray-700"
    );
  });

  it("edit button has correct hover classes", () => {
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const editButton = screen.getByLabelText("Edit milestone");
    expect(editButton).toHaveClass(
      "p-1",
      "rounded-full",
      "text-gray-500",
      "hover:text-indigo-600",
      "hover:bg-gray-100",
      "transition",
      "cursor-pointer"
    );
  });

  it("renders with long title without breaking layout", () => {
    const longTitleMilestone: IMilestone = {
      id: 3,
      title:
        "This is a very long milestone title that should still render properly without breaking the card layout",
      dueDate: "2025-12-25",
      status: "Pending",
    };

    render(
      <MilestoneCard
        {...longTitleMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    expect(screen.getByText(longTitleMilestone.title)).toBeInTheDocument();
    expect(screen.getByLabelText("Edit milestone")).toBeInTheDocument();
  });

  it("handles different date formats correctly", () => {
    const milestone: IMilestone = {
      id: 4,
      title: "Date Test",
      dueDate: "2025-01-01",
      status: "Completed",
    };

    render(
      <MilestoneCard {...milestone} onEditMilestone={mockOnEditMilestone} />
    );
    expect(screen.getByText("Due: 2025-01-01")).toBeInTheDocument();
  });

  it("ensures edit button is keyboard accessible", async () => {
    const user = userEvent.setup();
    render(
      <MilestoneCard
        {...pendingMilestone}
        onEditMilestone={mockOnEditMilestone}
      />
    );

    const editButton = screen.getByLabelText("Edit milestone");

    // Focus the button using keyboard navigation
    await user.tab();
    expect(editButton).toHaveFocus();

    // Activate button with Enter key
    await user.keyboard("{Enter}");
    expect(mockOnEditMilestone).toHaveBeenCalledTimes(1);
  });
});
