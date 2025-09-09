import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CourseCard = ({ 
  course, 
  stats,
  onEdit, 
  onDelete, 
  onView,
  className 
}) => {
  return (
    <Card 
      variant="premium" 
      className={cn("p-6 cursor-pointer", className)}
      onClick={() => onView?.(course)}
    >
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div 
className="w-4 h-4 rounded-full"
              style={{ backgroundColor: course.color_c || course.color }}
            />
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {course.name_c || course.name}
            </h3>
            <Badge variant="secondary">
              {course.credits} {course.credits === 1 ? "credit" : "credits"}
            </Badge>
          </div>
<div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="User" size={16} />
              <span>{course.instructor_c || course.instructor}</span>
            </div>
            
<div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Clock" size={16} />
              <span>{course.schedule_c || course.schedule}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Calendar" size={16} />
<span>{course.semester_c || course.semester}</span>
            </div>
          </div>
          
          {stats && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {stats.assignments || 0}
                </p>
                <p className="text-xs text-gray-500">Assignments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">
                  {stats.completed || 0}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning-600">
                  {stats.averageGrade ? `${stats.averageGrade}%` : "--"}
                </p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(course);
          }}
          className="flex items-center space-x-1"
        >
          <ApperIcon name="Edit" size={14} />
          <span>Edit</span>
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(course.Id);
          }}
          className="text-error-600 hover:text-error-700 hover:bg-error-50"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;