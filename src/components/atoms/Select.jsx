import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children, 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        error 
          ? "border-error-300 focus:border-error-500 focus:ring-error-500/20" 
          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 hover:border-gray-400",
        "shadow-sm hover:shadow-md focus:shadow-md appearance-none bg-no-repeat bg-right",
        "bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>')] bg-[length:12px] bg-[right_12px_center]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;