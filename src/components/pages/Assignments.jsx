import { useState, useEffect } from "react";
import { format, isAfter, isBefore } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    course: "",
    status: "all", // all, pending, completed, overdue
    priority: "all", // all, high, medium, low
    sortBy: "dueDate" // dueDate, title, priority, created
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assignments, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...assignments];
    const now = new Date();

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchLower) ||
        assignment.description.toLowerCase().includes(searchLower)
      );
    }

    // Course filter
    if (filters.course) {
      filtered = filtered.filter(assignment => assignment.courseId === filters.course);
    }

    // Status filter
    if (filters.status !== "all") {
      switch (filters.status) {
        case "completed":
          filtered = filtered.filter(assignment => assignment.completed);
          break;
        case "pending":
          filtered = filtered.filter(assignment => 
            !assignment.completed && isAfter(new Date(assignment.dueDate), now)
          );
          break;
        case "overdue":
          filtered = filtered.filter(assignment =>
            !assignment.completed && isBefore(new Date(assignment.dueDate), now)
          );
          break;
      }
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(assignment => assignment.priority === filters.priority);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "dueDate":
        default:
          return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

    setFilteredAssignments(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      course: "",
      status: "all",
      priority: "all",
      sortBy: "dueDate"
    });
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setModalOpen(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, assignmentData);
        toast.success("Assignment updated successfully!");
      } else {
        await assignmentService.create(assignmentData);
        toast.success("Assignment added successfully!");
      }
      
      loadData();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error(editingAssignment ? "Failed to update assignment" : "Failed to add assignment");
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await assignmentService.markComplete(assignmentId);
      toast.success("Assignment marked as complete!");
      loadData();
    } catch (error) {
      console.error("Error completing assignment:", error);
      toast.error("Failed to complete assignment");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      await assignmentService.delete(assignmentId);
      toast.success("Assignment deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    }
  };

  const getStatusCounts = () => {
    const now = new Date();
    return {
      all: assignments.length,
      pending: assignments.filter(a => !a.completed && isAfter(new Date(a.dueDate), now)).length,
      completed: assignments.filter(a => a.completed).length,
      overdue: assignments.filter(a => !a.completed && isBefore(new Date(a.dueDate), now)).length
    };
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <Loading variant="table" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your academic assignments
          </p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total</p>
              <p className="text-2xl font-bold text-primary-800">{statusCounts.all}</p>
            </div>
            <ApperIcon name="FileText" className="text-primary-600" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-info-50 to-info-100 p-4 rounded-lg border border-info-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info-600">Pending</p>
              <p className="text-2xl font-bold text-info-800">{statusCounts.pending}</p>
            </div>
            <ApperIcon name="Clock" className="text-info-600" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-success-50 to-success-100 p-4 rounded-lg border border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600">Completed</p>
              <p className="text-2xl font-bold text-success-800">{statusCounts.completed}</p>
            </div>
            <ApperIcon name="CheckCircle" className="text-success-600" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-error-50 to-error-100 p-4 rounded-lg border border-error-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-error-600">Overdue</p>
              <p className="text-2xl font-bold text-error-800">{statusCounts.overdue}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="text-error-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Input
              placeholder="Search assignments..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full"
            />
          </div>

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
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>

          <div>
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="flex-1"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </Select>
            
            <Button
              variant="outline"
              onClick={clearFilters}
              className="px-3"
              title="Clear filters"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const course = courses.find(c => c.Id.toString() === assignment.courseId);
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onComplete={handleCompleteAssignment}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            );
          })}
        </div>
      ) : assignments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No assignments yet"
          description="Get started by adding your first assignment to begin tracking your work."
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
        />
      ) : (
        <Empty
          icon="Search"
          title="No assignments found"
          description="Try adjusting your filters to see more results."
          actionLabel="Clear Filters"
          actionIcon="X"
          onAction={clearFilters}
        />
      )}

      {/* Add/Edit Assignment Modal */}
      <AddAssignmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAssignment}
        editingAssignment={editingAssignment}
      />
    </div>
  );
};

export default Assignments;