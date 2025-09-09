import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const AddAssignmentModal = ({ isOpen, onClose, onSave, editingAssignment = null }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: editingAssignment?.courseId || "",
    title: editingAssignment?.title || "",
    description: editingAssignment?.description || "",
    dueDate: editingAssignment?.dueDate || "",
    priority: editingAssignment?.priority || "medium",
    completed: editingAssignment?.completed || false,
    grade: editingAssignment?.grade || ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(formData.dueDate);
      if (dueDate < new Date().setHours(0, 0, 0, 0)) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    if (formData.grade && (formData.grade < 0 || formData.grade > 100)) {
      newErrors.grade = "Grade must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const assignmentData = {
      ...formData,
      grade: formData.grade ? parseFloat(formData.grade) : null
    };

    onSave(assignmentData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      courseId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      completed: false,
      grade: ""
    });
    setErrors({});
    onClose();
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Set initial due date if editing
  useEffect(() => {
    if (editingAssignment && isOpen) {
      setFormData({
        courseId: editingAssignment.courseId || "",
        title: editingAssignment.title || "",
        description: editingAssignment.description || "",
        dueDate: formatDateForInput(editingAssignment.dueDate),
        priority: editingAssignment.priority || "medium",
        completed: editingAssignment.completed || false,
        grade: editingAssignment.grade ? editingAssignment.grade.toString() : ""
      });
    }
  }, [editingAssignment, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-xl shadow-premium border border-gray-200 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Course"
                  name="courseId"
                  type="select"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  error={errors.courseId}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.Id} value={course.Id}>
                      {course.name}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Assignment Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  required
                  placeholder="e.g., Midterm Exam, Project Report"
                />

                <FormField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description or notes"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Due Date"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    error={errors.dueDate}
                    required
                  />

                  <FormField
                    label="Priority"
                    name="priority"
                    type="select"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Grade (optional)"
                    name="grade"
                    type="number"
                    value={formData.grade}
                    onChange={handleInputChange}
                    error={errors.grade}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0-100"
                  />

                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="completed"
                      name="completed"
                      checked={formData.completed}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                      Mark as completed
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name={editingAssignment ? "Save" : "Plus"} size={16} />
                    <span>{editingAssignment ? "Update" : "Add"} Assignment</span>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddAssignmentModal;