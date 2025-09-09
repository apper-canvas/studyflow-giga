import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Calendar = ({ assignments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get assignments for a specific date
  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get priority color for assignment
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-error-500";
      case "medium": return "bg-warning-500";
      case "low": return "bg-success-500";
      default: return "bg-primary-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card variant="premium" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Academic Calendar & Assignment Due Dates
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={goToPreviousMonth}
              className="p-2"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </Button>
            
            <Button
              variant="primary"
              onClick={goToToday}
              className="px-4 py-2"
            >
              Today
            </Button>
            
            <Button
              variant="outline"
              onClick={goToNextMonth}
              className="p-2"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day) => {
            const dayAssignments = getAssignmentsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelectedDay = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "p-2 text-left rounded-lg transition-all duration-200 min-h-[80px] border-2",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  isSelectedDay && "border-primary-300 bg-primary-50",
                  !isSelectedDay && "border-transparent hover:border-gray-200 hover:bg-gray-50",
                  isTodayDate && "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200"
                )}
              >
                <div className="font-medium text-sm mb-1">
                  {format(day, "d")}
                </div>
                
                {/* Assignment Indicators */}
                <div className="space-y-1">
                  {dayAssignments.slice(0, 2).map((assignment) => (
                    <div
                      key={assignment.Id}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getPriorityColor(assignment.priority)
                      )}
                      title={assignment.title}
                    />
                  ))}
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayAssignments.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Date Details */}
      <Card variant="premium" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          {isToday(selectedDate) && (
            <Badge variant="primary">Today</Badge>
          )}
        </div>

        {/* Assignments for Selected Date */}
        <div className="space-y-3">
          {getAssignmentsForDate(selectedDate).length > 0 ? (
            getAssignmentsForDate(selectedDate).map((assignment) => (
              <div
                key={assignment.Id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div
                  className={cn("w-3 h-3 rounded-full", getPriorityColor(assignment.priority))}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={cn(
                      "font-medium",
                      assignment.completed ? "line-through text-gray-500" : "text-gray-900"
                    )}>
                      {assignment.title}
                    </h4>
                    <Badge variant={assignment.priority}>
                      {assignment.priority}
                    </Badge>
                    {assignment.completed && (
                      <Badge variant="success">
                        <ApperIcon name="Check" size={12} className="mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Due at {format(new Date(assignment.dueDate), "h:mm a")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No assignments due on this date</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Calendar;