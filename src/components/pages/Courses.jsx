import { useState, useEffect } from "react";
import CourseCard from "@/components/molecules/CourseCard";
import AddCourseModal from "@/components/organisms/AddCourseModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCourseStats = (courseId) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId.toString());
    const courseGrades = grades.filter(g => g.courseId === courseId.toString());
    
    const completed = courseAssignments.filter(a => a.completed).length;
    const gradesWithScores = courseGrades.filter(g => g.points !== null && g.maxPoints > 0);
    const averageGrade = gradesWithScores.length > 0 
      ? gradesWithScores.reduce((sum, grade) => sum + (grade.points / grade.maxPoints) * 100, 0) / gradesWithScores.length
      : null;

    return {
      assignments: courseAssignments.length,
      completed,
      averageGrade: averageGrade ? Math.round(averageGrade) : null
    };
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.Id, courseData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.create(courseData);
        toast.success("Course added successfully!");
      }
      
      loadData();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(editingCourse ? "Failed to update course" : "Failed to add course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This will also remove all associated assignments and grades.")) {
      return;
    }

    try {
      await courseService.delete(courseId);
      toast.success("Course deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleViewCourse = (course) => {
    // Future enhancement: navigate to detailed course view
    console.log("View course:", course);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Loading key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your academic courses and track progress
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              stats={getCourseStats(course.Id)}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onView={handleViewCourse}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="BookOpen"
          title="No courses yet"
          description="Get started by adding your first course to begin tracking your academic progress."
          actionLabel="Add Course"
          onAction={handleAddCourse}
        />
      )}

      {/* Add/Edit Course Modal */}
      <AddCourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
};

export default Courses;