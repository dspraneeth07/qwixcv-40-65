
import * as React from "react";
import { cn } from "@/lib/utils";

interface FormValidatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | undefined;
  required?: boolean;
  errorMessage?: string;
  showMessage?: boolean;
  highlightOnly?: boolean;
}

const FormValidator = React.forwardRef<HTMLDivElement, FormValidatorProps>(
  ({ 
    className, 
    value, 
    required = false, 
    errorMessage = "This field is required", 
    showMessage = false,
    highlightOnly = false,
    ...props 
  }, ref) => {
    const isEmpty = required && (!value || value.trim() === "");

    return (
      <div ref={ref} className={cn("text-xs text-destructive min-h-5", className)} {...props}>
        {isEmpty && showMessage && !highlightOnly && errorMessage}
      </div>
    );
  }
);

FormValidator.displayName = "FormValidator";

export { FormValidator };
