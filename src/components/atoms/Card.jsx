import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-md hover:shadow-lg",
    premium: "bg-gradient-to-br from-white to-gray-50 shadow-premium hover:shadow-premium-lg backdrop-blur-sm border border-gray-100",
    glass: "bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-300 transform hover:scale-[1.02]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;