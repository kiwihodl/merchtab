import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { useToast } from "../hooks/useToast";
import { ToastProvider } from "../components/toast/ToastProvider";
import { renderHook } from "@testing-library/react";

describe("Toast Notification System", () => {
  describe("useToast Hook", () => {
    it("should add a toast notification", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      await act(async () => {
        result.current.addToast({
          type: "success",
          message: "Test toast message",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe("Test toast message");
    });

    it("should remove a toast notification", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      await act(async () => {
        result.current.addToast({
          type: "success",
          message: "Test toast message",
        });
      });

      const toastId = result.current.toasts[0].id;

      await act(async () => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it("should clear all toasts", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), { wrapper });

      await act(async () => {
        result.current.addToast({
          type: "success",
          message: "Toast 1",
        });
        result.current.addToast({
          type: "error",
          message: "Toast 2",
        });
      });

      expect(result.current.toasts).toHaveLength(2);

      await act(async () => {
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe("Toast Components", () => {
    it("should render toast with correct message and type", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText("Add Toast"));
      });

      expect(screen.getByText("Test success message")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveClass("bg-green-500");
    });

    it("should auto-dismiss toast after duration", async () => {
      vi.useFakeTimers();

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText("Add Toast"));
      });

      expect(screen.getByText("Test success message")).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      expect(
        screen.queryByText("Test success message")
      ).not.toBeInTheDocument();

      vi.useRealTimers();
    });

    it("should handle toast actions", async () => {
      const actionHandler = vi.fn();

      render(
        <ToastProvider>
          <TestComponent onAction={actionHandler} />
        </ToastProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText("Add Action Toast"));
      });

      await act(async () => {
        fireEvent.click(screen.getByText("Retry"));
      });

      expect(actionHandler).toHaveBeenCalled();
    });
  });
});

// Test helper component
function TestComponent({ onAction = () => {} }) {
  const { addToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          addToast({
            type: "success",
            message: "Test success message",
            duration: 3000,
          })
        }
      >
        Add Toast
      </button>
      <button
        onClick={() =>
          addToast({
            type: "error",
            message: "Test error message",
            action: {
              label: "Retry",
              onClick: onAction,
            },
          })
        }
      >
        Add Action Toast
      </button>
    </div>
  );
}
