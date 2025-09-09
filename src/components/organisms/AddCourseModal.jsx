import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AddCourseModal = ({ isOpen, onClose, onSave, editingCourse = null }) => {
  const [formData, setFormData] = useState({
name: editingCourse?.name_c || editingCourse?.name || "",
    instructor: editingCourse?.instructor_c || editingCourse?.instructor || "",
    schedule: editingCourse?.schedule_c || editingCourse?.schedule || "",
    credits: editingCourse?.credits_c || editingCourse?.credits || 3,
    color: editingCourse?.color_c || editingCourse?.color || "#7c3aed",
    semester: editingCourse?.semester_c || editingCourse?.semester || "Fall 2024"
  });

  const [errors, setErrors] = useState({});

  const colorOptions = [
    { value: "#7c3aed", label: "Purple" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#ef4444", label: "Red" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#84cc16", label: "Lime" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "credits" ? parseInt(value) || 0 : value
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

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    if (!formData.schedule.trim()) {
      newErrors.schedule = "Schedule is required";
    }

    if (formData.credits < 1 || formData.credits > 10) {
      newErrors.credits = "Credits must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      instructor: "",
      schedule: "",
      credits: 3,
      color: "#7c3aed",
      semester: "Fall 2024"
    });
    setErrors({});
    onClose();
  };

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
            className="relative w-full max-w-md bg-white rounded-xl shadow-premium border border-gray-200 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCourse ? "Edit Course" : "Add New Course"}
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
                  label="Course Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                  placeholder="e.g., Introduction to Computer Science"
                />

                <FormField
                  label="Instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  error={errors.instructor}
                  required
                  placeholder="e.g., Dr. Smith"
                />

                <FormField
                  label="Schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  error={errors.schedule}
                  required
                  placeholder="e.g., MWF 10:00-11:00 AM"
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Credits"
                    name="credits"
                    type="number"
                    value={formData.credits}
                    onChange={handleInputChange}
                    error={errors.credits}
                    required
                    min="1"
                    max="10"
                  />

                  <FormField
                    label="Semester"
                    name="semester"
                    type="select"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2024">Summer 2024</option>
                  </FormField>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-error-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={cn(
                          "w-12 h-12 rounded-lg border-2 transition-all duration-200 transform hover:scale-105",
                          formData.color === color.value
                            ? "border-gray-800 shadow-lg"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
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
                    <ApperIcon name={editingCourse ? "Save" : "Plus"} size={16} />
                    <span>{editingCourse ? "Update" : "Add"} Course</span>
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

export default AddCourseModal;