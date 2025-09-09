import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const GoalSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [courses, setCourses] = useState([]);
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  const loadCourses = async () => {
    try {
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
      
      // Initialize goals with current values or default to 85%
      const initialGoals = {};
      coursesData.forEach(course => {
        initialGoals[course.Id] = course.gradeGoal || 85;
      });
      setGoals(initialGoals);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const handleGoalChange = (courseId, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
    
    setGoals(prev => ({
      ...prev,
      [courseId]: numValue
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update each course with its goal
      const updatePromises = Object.entries(goals).map(([courseId, goal]) => {
        return courseService.update(parseInt(courseId), { gradeGoal: goal });
      });
      
      await Promise.all(updatePromises);
      
      toast.success("Grade goals updated successfully!");
      onSave && onSave(goals);
      onClose();
    } catch (error) {
      console.error("Error saving goals:", error);
      toast.error("Failed to save grade goals");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="premium" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Grade Goals</h2>
                <p className="text-sm text-gray-600">Set target grades for each course</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.Id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`goal-${course.Id}`} className="text-sm font-medium">
                      Goal:
                    </Label>
                    <div className="flex items-center space-x-1">
                      <Input
                        id={`goal-${course.Id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={goals[course.Id] || 85}
                        onChange={(e) => handleGoalChange(course.Id, e.target.value)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm font-medium text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Goals"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GoalSettingsModal;