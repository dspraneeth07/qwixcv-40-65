
import { useToast as useShadcnToast, toast as shadcnToast } from "@/hooks/use-toast";

export const useToast = useShadcnToast;

// Correctly type the toast function and extend it with a promise method
type ToastFunction = typeof shadcnToast & {
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string;
      error: string;
    }
  ) => Promise<T>;
};

// Create a properly typed toast object
export const toast: ToastFunction = Object.assign(
  shadcnToast, 
  {
    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      const toastId = shadcnToast({
        title: "Processing",
        description: loading,
      });

      promise
        .then(() => {
          shadcnToast({
            title: "Success",
            description: success,
            variant: "default",
          });
        })
        .catch(() => {
          shadcnToast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        });

      return promise;
    },
  }
);
