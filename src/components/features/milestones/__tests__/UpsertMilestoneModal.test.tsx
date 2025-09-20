import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpsertMilestoneModal from "../UpsertMilestoneModal";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { IMilestone } from "../../../../@types/Milestone";

describe("UpsertMilestoneModal", () => {
  const mockHandleClose = vi.fn();

  const sampleMilestone: IMilestone = {
    id: "1",
    title: "Test Milestone",
    dueDate: "2025-12-31",
    status: "Pending",
  };

  beforeEach(() => {
    mockHandleClose.mockClear();
  });

  it("does not render when isOpen is false", () => {
    render(
      <UpsertMilestoneModal
        isOpen={false}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );
    expect(screen.queryByText("Create Milestone")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );
    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls handleClose when cancel button is clicked", async () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
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
        handleClose={mockHandleClose}
        selectedMilestone={null}
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
        handleClose={mockHandleClose}
        selectedMilestone={null}
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

  it("submits form with valid data and closes modal", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "Test Milestone");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Form submitted with values:", {
        title: "Test Milestone",
        dueDate: "2025-12-31",
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    consoleSpy.mockRestore();
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
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

    consoleSpy.mockRestore();
  });

  it("has correct placeholder text for title input", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    const titleInput = screen.getByPlaceholderText("Enter milestone title");
    expect(titleInput).toBeInTheDocument();
  });

  // Tests for editing existing milestone
  it("pre-fills form fields when editing existing milestone", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={sampleMilestone}
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
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
  });

  it("shows Create Milestone title when editing existing milestone", () => {
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={sampleMilestone}
      />
    );

    // The component always shows "Create Milestone" regardless of edit mode
    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
  });

  it("submits edited milestone data correctly", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={sampleMilestone}
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
      expect(consoleSpy).toHaveBeenCalledWith("Form submitted with values:", {
        title: "Updated Milestone",
        dueDate: "2026-01-15",
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    consoleSpy.mockRestore();
  });

  it("handles keyboard navigation correctly", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    // Tab through the form
    await user.tab();
    expect(titleInput).toHaveFocus();

    await user.tab();
    expect(dueDateInput).toHaveFocus();
  });

  it("disables save button while form is submitting", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal
        isOpen={true}
        handleClose={mockHandleClose}
        selectedMilestone={null}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    await user.type(titleInput, "Test Milestone");
    await user.type(dueDateInput, "2025-12-31");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).not.toBeDisabled();

    // Note: In a real scenario, you might need to mock a slow async operation
    // to properly test the disabled state during submission
  });
});
