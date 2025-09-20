import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpsertMilestoneModal from "../UpsertMilestoneModal";
import { vi, describe, it, expect } from "vitest";

describe("UpsertMilestoneModal", () => {
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    mockHandleClose.mockClear();
  });

  it("does not render when isOpen is false", () => {
    render(
      <UpsertMilestoneModal isOpen={false} handleClose={mockHandleClose} />
    );
    expect(screen.queryByText("Create Milestone")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
    );
    expect(screen.getByText("Create Milestone")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls handleClose when cancel button is clicked", async () => {
    render(
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
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
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
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
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
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
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
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
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
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
      <UpsertMilestoneModal isOpen={true} handleClose={mockHandleClose} />
    );

    const titleInput = screen.getByPlaceholderText("Enter milestone title");
    expect(titleInput).toBeInTheDocument();
  });
});
