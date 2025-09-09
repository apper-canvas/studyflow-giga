import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-all duration-200",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1",
        error 
          ? "border-error-300 focus:border-error-500 focus:ring-error-500/20" 
          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 hover:border-gray-400",
        "shadow-sm hover:shadow-md focus:shadow-md",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;