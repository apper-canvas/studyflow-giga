import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AssignmentCard = ({ 
  assignment, 
  course, 
  onComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
const isOverdue = new Date(assignment.due_date_c) < new Date() && !assignment.completed_c;
const isDueSoon = new Date(assignment.due_date_c) < new Date(Date.now() + 24 * 60 * 60 * 1000) && !assignment.completed_c;

  const priorityColors = {
    high: "error",
    medium: "warning",
    low: "success"
  };

  return (
    <Card 
      variant="premium" 
      className={cn(
"p-4 transition-all duration-300",
        assignment.completed_c && "opacity-75",
        isOverdue && "ring-2 ring-error-200",
        className
      )}
    >
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={cn(
"font-semibold text-gray-900 truncate",
              assignment.completed_c && "line-through text-gray-500"
            )}>
              {assignment.title}
            </h3>
<Badge variant={priorityColors[assignment.priority_c || 'medium']}>
              {assignment.priority_c}
            </Badge>
{assignment.completed_c && (
              <Badge variant="success">
                <ApperIcon name="Check" size={12} className="mr-1" />
                Complete
              </Badge>
            )}
          </div>
          
{assignment.description_c && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span className={cn(
                isOverdue && "text-error-600 font-medium",
                isDueSoon && "text-warning-600 font-medium"
              )}>
Due {format(new Date(assignment.due_date_c), "MMM dd, yyyy")}
              </span>
            </div>
            
            {course && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full"
style={{ backgroundColor: course?.color_c || course?.color }}
                />
                <span>{course.name}</span>
              </div>
            )}
            
{assignment.grade_c !== null && assignment.grade_c !== undefined && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Star" size={14} />
                <span className="font-medium text-primary-600">
                  {assignment.grade}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
{!assignment.completed_c && (
            <Button
              size="sm"
              variant="success"
              onClick={() => onComplete?.(assignment.Id)}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Check" size={14} />
              <span className="hidden sm:inline">Complete</span>
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(assignment)}
            className="flex items-center space-x-1"
          >
            <ApperIcon name="Edit" size={14} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(assignment.Id)}
            className="text-error-600 hover:text-error-700 hover:bg-error-50"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;