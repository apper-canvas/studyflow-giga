import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorVariants = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600",
    info: "from-info-500 to-info-600"
  };

  const trendColors = {
    up: "text-success-600",
    down: "text-error-600",
    neutral: "text-gray-600"
  };

  return (
    <Card variant="premium" className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"}
                size={16}
                className={trendColors[trend]}
              />
              <span className={cn("text-sm font-medium", trendColors[trend])}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-r shadow-lg",
          colorVariants[color]
        )}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;