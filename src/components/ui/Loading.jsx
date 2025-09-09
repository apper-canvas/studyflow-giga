import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  const skeletonClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] rounded-lg";

  if (variant === "card") {
    return (
      <div className={cn("p-6 space-y-4", className)}>
        <div className={cn(skeletonClass, "h-6 w-3/4")} />
        <div className={cn(skeletonClass, "h-4 w-1/2")} />
        <div className="space-y-2">
          <div className={cn(skeletonClass, "h-4 w-full")} />
          <div className={cn(skeletonClass, "h-4 w-5/6")} />
        </div>
        <div className="flex space-x-2 pt-2">
          <div className={cn(skeletonClass, "h-8 w-20")} />
          <div className={cn(skeletonClass, "h-8 w-16")} />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className={cn(skeletonClass, "h-4 w-4 rounded-full")} />
            <div className="flex-1 space-y-2">
              <div className={cn(skeletonClass, "h-4 w-3/4")} />
              <div className={cn(skeletonClass, "h-3 w-1/2")} />
            </div>
            <div className={cn(skeletonClass, "h-6 w-16")} />
            <div className={cn(skeletonClass, "h-8 w-8 rounded")} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;