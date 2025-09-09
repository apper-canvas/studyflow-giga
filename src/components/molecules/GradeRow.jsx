import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const GradeRow = ({ 
  grade, 
  course, 
  assignment,
  onEdit, 
  onDelete,
  className 
}) => {
const percentage = grade.max_points_c > 0 ? (grade.points_c / grade.max_points_c) * 100 : 0;
  
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-success-600";
    if (percentage >= 80) return "text-info-600";
    if (percentage >= 70) return "text-warning-600";
    if (percentage >= 60) return "text-warning-700";
    return "text-error-600";
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">
{assignment ? (assignment.title_c || assignment.title) : "Manual Grade Entry"}
            </h4>
<Badge variant="secondary">{grade.category_c}</Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {course && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full"
style={{ backgroundColor: course?.color_c || course?.color }}
                />
                <span>{course.name}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
<span>{format(new Date(grade.date_c), "MMM dd, yyyy")}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <ApperIcon name="Percent" size={14} />
<span>Weight: {grade.weight_c}%</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
{grade.points_c} / {grade.max_points_c}
            </span>
            <span className={cn("text-lg font-bold", getGradeColor(percentage))}>
              {percentage.toFixed(1)}%
            </span>
            <Badge variant={percentage >= 70 ? "success" : percentage >= 60 ? "warning" : "error"}>
              {getLetterGrade(percentage)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(grade)}
          className="flex items-center space-x-1"
        >
          <ApperIcon name="Edit" size={14} />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete?.(grade.Id)}
          className="text-error-600 hover:text-error-700 hover:bg-error-50"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default GradeRow;