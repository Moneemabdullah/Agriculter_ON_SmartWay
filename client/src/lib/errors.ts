import { toast } from "sonner";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: {
    code?: string;
    details?: unknown;
  };
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: ApiErrorResponse; status?: number } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.status === 401) return "Session expired. Please log in again.";
    if (axiosError.response?.status === 403) return "You don't have permission for this action.";
    if (axiosError.response?.status === 404) return "Resource not found.";
    if (axiosError.response?.status === 429) return "Too many requests. Please try again later.";
    if (axiosError.response?.status && axiosError.response.status >= 500) return "Server error. Please try again later.";
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

export function showErrorToast(error: unknown): void {
  toast.error(getErrorMessage(error));
}

export function showSuccessToast(message: string): void {
  toast.success(message);
}
