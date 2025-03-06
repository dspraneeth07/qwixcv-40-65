
import * as React from "react";
import { cn } from "@/lib/utils";

interface FormValidatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | undefined;
  required?: boolean;
  errorMessage?: string;
  showMessage?: boolean;
  highlightOnly?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
}

const FormValidator = React.forwardRef<HTMLDivElement, FormValidatorProps>(
  ({ 
    className, 
    value, 
    required = false, 
    errorMessage = "This field is required", 
    showMessage = false,
    highlightOnly = false,
    pattern,
    patternMessage = "Invalid format",
    ...props 
  }, ref) => {
    const isEmpty = required && (!value || value.trim() === "");
    const isInvalidPattern = pattern && value && !pattern.test(value);
    const hasError = isEmpty || isInvalidPattern;
    const displayMessage = isInvalidPattern ? patternMessage : errorMessage;

    return (
      <div ref={ref} className={cn("text-xs text-destructive min-h-5", className)} {...props}>
        {hasError && showMessage && !highlightOnly && displayMessage}
      </div>
    );
  }
);

FormValidator.displayName = "FormValidator";

export { FormValidator };
