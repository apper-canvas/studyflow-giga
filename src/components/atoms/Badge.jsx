import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800",
    warning: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800",
    error: "bg-gradient-to-r from-error-100 to-error-200 text-error-800",
    info: "bg-gradient-to-r from-info-100 to-info-200 text-info-800",
    high: "bg-gradient-to-r from-error-100 to-error-200 text-error-800",
    medium: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800",
    low: "bg-gradient-to-r from-success-100 to-success-200 text-success-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;