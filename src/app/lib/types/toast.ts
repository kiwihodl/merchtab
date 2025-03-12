export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
