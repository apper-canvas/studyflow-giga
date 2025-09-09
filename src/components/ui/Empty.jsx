import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  actionIcon = "Plus",
  onAction, 
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          className="flex items-center space-x-2"
        >
          <ApperIcon name={actionIcon} size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;