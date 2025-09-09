import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import GradeRow from "@/components/molecules/GradeRow";
import GradeChart from "@/components/molecules/GradeChart";
import StatCard from "@/components/molecules/StatCard";
import AddGradeModal from "@/components/organisms/AddGradeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    course: "",
    category: "all",
    sortBy: "date" // date, course, grade, category
  });

  const [stats, setStats] = useState({
    overallGPA: 0,
    averageGrade: 0,
    totalGrades: 0,
    highestGrade: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [grades, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [gradesData, coursesData, assignmentsData] = await Promise.all([
        gradeService.getAll(),
        courseService.getAll(),
        assignmentService.getAll()
      ]);

      setGrades(gradesData);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...grades];

    // Course filter
    if (filters.course) {
      filtered = filtered.filter(grade => grade.courseId === filters.course);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(grade => grade.category === filters.category);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "course":
          const courseA = courses.find(c => c.Id.toString() === a.courseId)?.name || "";
          const courseB = courses.find(c => c.Id.toString() === b.courseId)?.name || "";
          return courseA.localeCompare(courseB);
        case "grade":
          const percentageA = (a.points / a.maxPoints) * 100;
          const percentageB = (b.points / b.maxPoints) * 100;
          return percentageB - percentageA;
        case "category":
          return a.category.localeCompare(b.category);
        case "date":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredGrades(filtered);
  };

  const calculateStats = async () => {
    if (grades.length === 0) return;

    try {
      const gpa = await gradeService.calculateGPA();
      const gradesWithScores = grades.filter(g => g.points !== null && g.maxPoints > 0);
      
      if (gradesWithScores.length > 0) {
        const totalPercentage = gradesWithScores.reduce((sum, grade) => {
          return sum + (grade.points / grade.maxPoints) * 100;
        }, 0);
        
        const averageGrade = totalPercentage / gradesWithScores.length;
        const highestGrade = Math.max(...gradesWithScores.map(g => (g.points / g.maxPoints) * 100));

        setStats({
          overallGPA: gpa,
          averageGrade: averageGrade,
          totalGrades: gradesWithScores.length,
          highestGrade: highestGrade
        });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      course: "",
      category: "all",
      sortBy: "date"
    });
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setModalOpen(true);
  };

  const handleSaveGrade = async (gradeData) => {
    try {
      if (editingGrade) {
        await gradeService.update(editingGrade.Id, gradeData);
        toast.success("Grade updated successfully!");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully!");
      }
      
      loadData();
    } catch (error) {
      console.error("Error saving grade:", error);
      toast.error(editingGrade ? "Failed to update grade" : "Failed to add grade");
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }

    try {
      await gradeService.delete(gradeId);
      toast.success("Grade deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting grade:", error);
      toast.error("Failed to delete grade");
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(grades.map(grade => grade.category))];
    return categories.sort();
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Loading key={i} variant="card" />
          ))}
        </div>
        <Loading variant="table" />
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
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance and GPA
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall GPA"
          value={stats.overallGPA.toFixed(2)}
          icon="TrendingUp"
          color="primary"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade.toFixed(1)}%`}
          icon="Award"
          color="success"
        />
        <StatCard
          title="Total Grades"
          value={stats.totalGrades}
          icon="FileText"
          color="info"
        />
        <StatCard
          title="Highest Grade"
          value={`${stats.highestGrade.toFixed(1)}%`}
          icon="Star"
          color="warning"
        />
      </div>

      {/* Grade Chart */}
      {grades.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GradeChart grades={grades} title="Grade Distribution" />
          
          {/* GPA by Course */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA by Course</h3>
            <div className="space-y-3">
              {courses.slice(0, 5).map(course => {
                const courseGrades = grades.filter(g => g.courseId === course.Id.toString());
                if (courseGrades.length === 0) return null;

                const totalWeightedPoints = courseGrades.reduce((sum, grade) => {
                  const percentage = (grade.points / grade.maxPoints) * 100;
                  return sum + (percentage * grade.weight) / 100;
                }, 0);
                
                const totalWeight = courseGrades.reduce((sum, grade) => sum + grade.weight, 0);
                const courseAverage = totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;

                return (
                  <div key={course.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                    <span className="text-lg font-bold text-primary-600">
                      {courseAverage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.Id} value={course.Id.toString()}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="course">Sort by Course</option>
              <option value="grade">Sort by Grade</option>
              <option value="category">Sort by Category</option>
            </Select>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ApperIcon name="X" size={16} />
              <span>Clear Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grades List */}
      {filteredGrades.length > 0 ? (
        <div className="space-y-4">
          {filteredGrades.map((grade) => {
            const course = courses.find(c => c.Id.toString() === grade.courseId);
            const assignment = assignments.find(a => a.Id.toString() === grade.assignmentId);
            
            return (
              <GradeRow
                key={grade.Id}
                grade={grade}
                course={course}
                assignment={assignment}
                onEdit={handleEditGrade}
                onDelete={handleDeleteGrade}
              />
            );
          })}
        </div>
      ) : grades.length === 0 ? (
        <Empty
          icon="Award"
          title="No grades recorded"
          description="Start tracking your academic performance by adding your first grade."
          actionLabel="Add Grade"
          onAction={handleAddGrade}
        />
      ) : (
        <Empty
          icon="Search"
          title="No grades found"
          description="Try adjusting your filters to see more results."
          actionLabel="Clear Filters"
          actionIcon="X"
          onAction={clearFilters}
        />
      )}

      {/* Add/Edit Grade Modal */}
      <AddGradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGrade}
        editingGrade={editingGrade}
      />
    </div>
  );
};

export default Grades;