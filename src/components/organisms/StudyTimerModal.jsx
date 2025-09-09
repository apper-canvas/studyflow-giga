import { useState, useEffect, useCallback } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { studyTimerService } from "@/services/api/studyTimerService";
import { toast } from "react-toastify";

const StudyTimerModal = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await courseService.getAll();
        setCourses(courseData);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("Failed to load courses");
      }
    };
    
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Format time to MM:SS
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const handleStart = () => {
    if (!selectedCourseId) {
      toast.error("Please select a subject to study");
      return;
    }

    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    
    // Create new study session
    const newSession = studyTimerService.create({
      courseId: parseInt(selectedCourseId),
      startTime: now.toISOString(),
      duration: 0,
      status: 'active'
    });
    setSessionId(newSession.Id);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = async () => {
    if (sessionId && startTime) {
      const endTime = new Date();
      const duration = elapsedTime;
      
      // Update the session with end time and duration
      studyTimerService.update(sessionId, {
        endTime: endTime.toISOString(),
        duration: duration,
        status: 'completed'
      });

      const selectedCourse = courses.find(c => c.Id === parseInt(selectedCourseId));
      toast.success(`Study session completed! You studied ${selectedCourse?.name} for ${formatTime(duration)}.`);
    }

    // Reset timer state
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setStartTime(null);
    setSessionId(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setStartTime(null);
    if (sessionId) {
      studyTimerService.delete(sessionId);
      setSessionId(null);
    }
  };

  const handleClose = () => {
    if (isRunning) {
      if (window.confirm("You have an active study session. Stopping will end the session. Are you sure?")) {
        handleStop();
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Study Timer</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <Select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={isRunning}
            >
              <option value="">Choose a subject...</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary-600 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-gray-500">
              {isRunning && isPaused && "Paused"}
              {isRunning && !isPaused && "Running"}
              {!isRunning && "Ready to start"}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-3">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                variant="primary"
                size="lg"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Play" size={20} />
                <span>Start</span>
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    variant="secondary"
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Pause" size={20} />
                    <span>Pause</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    variant="primary"
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Play" size={20} />
                    <span>Resume</span>
                  </Button>
                )}
                
                <Button
                  onClick={handleStop}
                  variant="success"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Square" size={20} />
                  <span>Stop</span>
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RotateCcw" size={20} />
                  <span>Reset</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudyTimerModal;