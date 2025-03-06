
import { useToast as useShadcnToast, toast as shadcnToast } from "@/hooks/use-toast";

export const useToast = useShadcnToast;

// Wrapper for toast to allow for a loading state that will be updated once the operation completes
export const toast = {
  ...shadcnToast,
  promise: (
    promise: Promise<any>,
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
          id: toastId,
          title: "Success",
          description: success,
          variant: "default",
        });
      })
      .catch(() => {
        shadcnToast({
          id: toastId,
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });

    return promise;
  },
};
