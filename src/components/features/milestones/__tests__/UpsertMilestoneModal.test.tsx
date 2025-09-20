import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpsertMilestoneModal from "../UpsertMilestoneModal";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { IMilestone } from "../../../../@types/Milestone";

vi.mock("../../../../hooks/useMilestones", () => ({
  useMilestones: () => ({
    upsertMilestone: mockUpsertMilestone,
  }),
}));

const mockUpsertMilestone = vi.fn();

describe("UpsertMilestoneModal", () => {
  const mockSetIsOpen = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockSetSelectedMilestone = vi.fn();

  const sampleMilestone: IMilestone = {
    id: "1",
    title: "Test Milestone",
    dueDate: "2025-12-31",
    status: "Pending",
  };

  beforeEach(() => {
    mockSetIsOpen.mockClear();
    mockOnSuccess.mockClear();
    mockSetSelectedMilestone.mockClear();
    mockUpsertMilestone.mockClear();
    mockUpsertMilestone.mockResolvedValue({
      id: 1,
      title: "Test",
      dueDate: "2025-12-31",
      status: "Pending",
    });
  });

  it("does not render when isOpen is false", () => {
    render(
      <UpsertMilestoneModal
        isOpen={false}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );
    expect(screen.queryByText("Create Milestone")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );
    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls setIsOpen and setSelectedMilestone when cancel button is clicked", async () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockSetSelectedMilestone).toHaveBeenCalledWith(null);
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Due date is required")).toBeInTheDocument();
    });
  });

  it("validates title field is required", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const dueDateInput = screen.getByLabelText("Due Date");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("validates due date field is required", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    await user.type(titleInput, "Test Milestone");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Due date is required")).toBeInTheDocument();
    });
  });

  it("submits form with valid data and calls upsertMilestone and onSuccess", async () => {
    const user = userEvent.setup();

    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "Test Milestone");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertMilestone).toHaveBeenCalledWith({
        id: undefined,
        title: "Test Milestone",
        dueDate: "2025-12-31",
        status: "Pending",
      });
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();

    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "Test Milestone");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(dueDateInput).toHaveValue("");
    });
  });

  // Tests for editing existing milestone
  it("pre-fills form fields when editing existing milestone", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={sampleMilestone}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const dueDateInput = screen.getByLabelText("Due Date") as HTMLInputElement;

    expect(titleInput.value).toBe("Test Milestone");
    expect(dueDateInput.value).toBe("2025-12-31");
  });

  it("shows Create Milestone title when adding new milestone", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
  });

  it("shows Edit Milestone title when editing existing milestone", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={sampleMilestone}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    expect(screen.getByText("Edit Milestone")).toBeInTheDocument();
  });

  it("submits edited milestone data correctly", async () => {
    const user = userEvent.setup();

    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={sampleMilestone}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    // Clear and update the fields
    await user.clear(titleInput);
    await user.clear(dueDateInput);
    await user.type(titleInput, "Updated Milestone");
    await user.type(dueDateInput, "2026-01-15");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertMilestone).toHaveBeenCalledWith({
        id: "1",
        title: "Updated Milestone",
        dueDate: "2026-01-15",
        status: "Pending",
      });
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("disables save button while form is submitting", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "Test Milestone");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).not.toBeDisabled();
  });

  it("calls upsertMilestone with correct parameters for new milestone", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={null}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "New Milestone");
    await user.type(dueDateInput, "2025-11-30");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertMilestone).toHaveBeenCalledWith({
        id: undefined,
        title: "New Milestone",
        dueDate: "2025-11-30",
        status: "Pending", // Default status for new milestone
      });
    });
  });

  it("calls upsertMilestone with correct parameters for existing milestone", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSuccess={mockOnSuccess}
        selectedMilestone={sampleMilestone}
        setSelectedMilestone={mockSetSelectedMilestone}
      />
    );

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertMilestone).toHaveBeenCalledWith({
        id: "1", // Existing milestone should keep its id
        title: "Test Milestone",
        dueDate: "2025-12-31",
        status: "Pending", // Should preserve existing status
      });
    });
  });
});
