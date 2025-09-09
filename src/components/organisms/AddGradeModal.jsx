import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const AddGradeModal = ({ isOpen, onClose, onSave, editingGrade = null }) => {
const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    courseId: editingGrade?.course_id_c?.Id || editingGrade?.courseId || "",
    assignmentId: editingGrade?.assignment_id_c?.Id || editingGrade?.assignmentId || "",
    category: editingGrade?.category_c || editingGrade?.category || "Assignment",
    points: editingGrade?.points_c || editingGrade?.points || "",
    maxPoints: editingGrade?.max_points_c || editingGrade?.maxPoints || "",
    weight: editingGrade?.weight_c || editingGrade?.weight || 10,
    date: editingGrade?.date_c || editingGrade?.date || new Date().toISOString().slice(0, 10)
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCourses();
      loadAssignments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.courseId) {
      loadAssignmentsByCourse();
    }
  }, [formData.courseId]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (error) {
      console.error("Error loading assignments:", error);
    }
  };

const loadAssignmentsByCourse = async () => {
    try {
      const data = await assignmentService.getAll();
      const filteredAssignments = data.filter(assignment => 
        (assignment.course_id_c?.Id == formData.courseId) || (assignment.course_id_c == formData.courseId)
      );
      setAssignments(filteredAssignments);
    } catch (error) {
      console.error("Error loading assignments by course:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.points || formData.points < 0) {
      newErrors.points = "Points earned must be 0 or greater";
    }

    if (!formData.maxPoints || formData.maxPoints <= 0) {
      newErrors.maxPoints = "Maximum points must be greater than 0";
    }

    if (parseFloat(formData.points) > parseFloat(formData.maxPoints)) {
      newErrors.points = "Points earned cannot exceed maximum points";
    }

    if (!formData.weight || formData.weight < 0 || formData.weight > 100) {
      newErrors.weight = "Weight must be between 0 and 100";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const gradeData = {
      ...formData,
      points: parseFloat(formData.points),
      maxPoints: parseFloat(formData.maxPoints),
      weight: parseFloat(formData.weight),
      assignmentId: formData.assignmentId || null
    };

    onSave(gradeData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      courseId: "",
      assignmentId: "",
      category: "Assignment",
      points: "",
      maxPoints: "",
      weight: 10,
      date: new Date().toISOString().slice(0, 10)
    });
    setErrors({});
    onClose();
  };

  const categories = [
    "Assignment",
    "Exam",
    "Quiz",
    "Project",
    "Lab",
    "Participation",
    "Other"
  ];

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
                  {editingGrade ? "Edit Grade" : "Add New Grade"}
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
                      {course.name_c || course.name}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Assignment (Optional)"
                  name="assignmentId"
                  type="select"
                  value={formData.assignmentId}
                  onChange={handleInputChange}
                >
                  <option value="">Select an assignment (optional)</option>
{assignments.map((assignment) => (
                    <option key={assignment.Id} value={assignment.Id}>
                      {assignment.title_c || assignment.title}
                    </option>
                  ))}
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Category"
                    name="category"
                    type="select"
                    value={formData.category}
                    onChange={handleInputChange}
                    error={errors.category}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    label="Weight (%)"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    error={errors.weight}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Points Earned"
                    name="points"
                    type="number"
                    value={formData.points}
                    onChange={handleInputChange}
                    error={errors.points}
                    required
                    min="0"
                    step="0.1"
                    placeholder="e.g., 85"
                  />

                  <FormField
                    label="Maximum Points"
                    name="maxPoints"
                    type="number"
                    value={formData.maxPoints}
                    onChange={handleInputChange}
                    error={errors.maxPoints}
                    required
                    min="0.1"
                    step="0.1"
                    placeholder="e.g., 100"
                  />
                </div>

                <FormField
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  error={errors.date}
                  required
                />

                {/* Grade Preview */}
                {formData.points && formData.maxPoints && (
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-700">
                        Grade Preview:
                      </span>
                      <span className="text-lg font-bold text-primary-800">
                        {((parseFloat(formData.points) / parseFloat(formData.maxPoints)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

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
                    <ApperIcon name={editingGrade ? "Save" : "Plus"} size={16} />
                    <span>{editingGrade ? "Update" : "Add"} Grade</span>
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

export default AddGradeModal;