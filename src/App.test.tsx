import { render, screen } from "@testing-library/react";
import App from "./App";
import { vi, describe, it, expect } from "vitest";

// Mock the MilestonesPage component
vi.mock("./pages/milestones", () => {
  return function MockMilestonesPage() {
    return <div data-testid="milestones-page">Milestones Page</div>;
  };
});

// Mock react-toastify
jest.mock("react-toastify", () => ({
  ToastContainer: () => (
    <div data-testid="toast-container">Toast Container</div>
  ),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("milestones-page")).toBeInTheDocument();
  });

  it("renders the milestones page on root route", () => {
    render(<App />);
    expect(screen.getByText("Milestones Page")).toBeInTheDocument();
  });

  it("renders the toast container", () => {
    render(<App />);
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });
});
