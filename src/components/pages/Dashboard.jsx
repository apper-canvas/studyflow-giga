import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isAfter, isBefore, addDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
averageGrade: 0,
    gpa: 0,
    goalProgress: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      // Calculate stats
      const completedCount = assignmentsData.filter(a => a.completed).length;
const gradesWithScores = gradesData.filter(g => g.points !== null && g.maxPoints > 0);
      const averageGrade = gradesWithScores.length > 0 
        ? gradesWithScores.reduce((sum, grade) => sum + (grade.points / grade.maxPoints) * 100, 0) / gradesWithScores.length
        : 0;

      const gpa = await gradeService.calculateGPA();
      const goalProgress = await gradeService.calculateGoalProgress(coursesData);

      setStats({
        totalCourses: coursesData.length,
        totalAssignments: assignmentsData.length,
        completedAssignments: completedCount,
        averageGrade: averageGrade,
        gpa: gpa,
        goalProgress: goalProgress
      });

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await assignmentService.markComplete(assignmentId);
      toast.success("Assignment marked as complete!");
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error completing assignment:", error);
      toast.error("Failed to complete assignment");
    }
  };

  // Get upcoming assignments (due within next 7 days)
  const getUpcomingAssignments = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    
    return assignments
      .filter(assignment => 
        !assignment.completed && 
        isAfter(new Date(assignment.dueDate), now) &&
        isBefore(new Date(assignment.dueDate), nextWeek)
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  // Get overdue assignments
  const getOverdueAssignments = () => {
    const now = new Date();
    return assignments
      .filter(assignment => 
        !assignment.completed && 
        isBefore(new Date(assignment.dueDate), now)
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  // Get recent grades
  const getRecentGrades = () => {
    return grades
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Loading key={i} variant="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading variant="card" />
          <Loading variant="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const upcomingAssignments = getUpcomingAssignments();
  const overdueAssignments = getOverdueAssignments();
  const recentGrades = getRecentGrades();
  const completionRate = stats.totalAssignments > 0 ? (stats.completedAssignments / stats.totalAssignments) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
          Welcome to StudyFlow
        </h1>
        <p className="text-gray-600">
          Stay organized and track your academic progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon="BookOpen"
          color="primary"
        />
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon="FileText"
          color="info"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade.toFixed(1)}%`}
          icon="Award"
          color="success"
        />
<StatCard
          title="Current GPA"
          value={stats.gpa.toFixed(2)}
          icon="TrendingUp"
          color="warning"
          goalProgress={stats.goalProgress.length > 0 ? {
            progress: (stats.averageGrade / (stats.goalProgress.reduce((sum, g) => sum + g.goalGrade, 0) / stats.goalProgress.length)) * 100
          } : null}
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="premium" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Progress</h3>
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={completionRate}
              size={120}
              color="primary"
              label="Completed"
              value={`${completionRate.toFixed(1)}%`}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {stats.completedAssignments} of {stats.totalAssignments} assignments completed
            </p>
          </div>
        </Card>

        <Card variant="premium" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {recentGrades.slice(0, 3).map(grade => {
              const course = courses.find(c => c.Id.toString() === grade.courseId);
              const percentage = (grade.points / grade.maxPoints) * 100;
              return (
                <div key={grade.Id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course?.color || "#7c3aed" }}
                    />
                    <span className="text-sm text-gray-600 truncate">
                      {course?.name || "Unknown Course"}
                    </span>
                  </div>
                  <span className="font-semibold text-primary-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          
          {recentGrades.length === 0 && (
            <div className="text-center py-4">
              <ApperIcon name="Award" size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No grades yet</p>
            </div>
          )}
        </Card>

        <Card variant="premium" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/courses")}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add New Course
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/assignments")}
            >
              <ApperIcon name="FileText" size={16} className="mr-2" />
              Create Assignment
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/grades")}
            >
              <ApperIcon name="Award" size={16} className="mr-2" />
              Record Grade
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/calendar")}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              View Calendar
            </Button>
          </div>
        </Card>
      </div>

      {/* Overdue Assignments Alert */}
      {overdueAssignments.length > 0 && (
        <Card variant="premium" className="p-6 border-l-4 border-error-500 bg-gradient-to-r from-error-50 to-error-100">
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="AlertTriangle" size={24} className="text-error-600" />
            <h3 className="text-lg font-semibold text-error-800">
              Overdue Assignments ({overdueAssignments.length})
            </h3>
          </div>
          <div className="space-y-3">
            {overdueAssignments.slice(0, 3).map(assignment => {
              const course = courses.find(c => c.Id.toString() === assignment.courseId);
              return (
                <div key={assignment.Id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-error-200">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">
                      {course?.name} • Due {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleCompleteAssignment(assignment.Id)}
                  >
                    Complete
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Upcoming Assignments */}
      <Card variant="premium" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h3>
          <Button
            variant="outline"
            onClick={() => navigate("/assignments")}
            className="flex items-center space-x-2"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>

        {upcomingAssignments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAssignments.map(assignment => {
              const course = courses.find(c => c.Id.toString() === assignment.courseId);
              return (
                <AssignmentCard
                  key={assignment.Id}
                  assignment={assignment}
                  course={course}
                  onComplete={handleCompleteAssignment}
                  onEdit={(assignment) => navigate("/assignments", { state: { editAssignment: assignment } })}
                />
              );
            })}
          </div>
        ) : (
          <Empty
            icon="Calendar"
            title="No upcoming assignments"
            description="You're all caught up! Check back later or add new assignments."
            actionLabel="Add Assignment"
            onAction={() => navigate("/assignments")}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;