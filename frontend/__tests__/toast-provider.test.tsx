import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "@/components/ToastProvider";

function ToastHarness() {
  const { showSuccess, showError } = useToast();
  return (
    <div>
      <button type="button" onClick={() => showSuccess("Saved")}>
        Show success
      </button>
      <button type="button" onClick={() => showError("Failed")}>
        Show error
      </button>
    </div>
  );
}

describe("ToastProvider", () => {
  it("shows success and error variants with manual dismiss", () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show success" }));
    expect(screen.getByRole("status")).toHaveTextContent("Saved");

    fireEvent.click(screen.getByRole("button", { name: "Show error" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss notification" })[0]);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it("auto-dismisses toasts", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Show success" }).click();
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("manual close does not interfere with auto-dismiss timing", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Show success" }).click();
      screen.getByRole("button", { name: "Show error" }).click();
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Manually close the success toast
    act(() => {
      fireEvent.click(screen.getAllByRole("button", { name: "Dismiss notification" })[0]);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Error toast should still auto-dismiss at correct time
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("maintains consistent dismiss timeout across multiple toasts", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    // Show first toast
    act(() => {
      screen.getByRole("button", { name: "Show success" }).click();
    });

    // Wait 1 second, then show second toast
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      screen.getByRole("button", { name: "Show error" }).click();
    });

    // First toast should dismiss at 3.5s
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Second toast should dismiss 1s later (at 4.5s total)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
