import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Grades from "@/components/pages/Grades";
import CalendarPage from "@/components/pages/CalendarPage";
import AddCourseModal from "@/components/organisms/AddCourseModal";
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal";
import AddGradeModal from "@/components/organisms/AddGradeModal";

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const handleAddClick = () => {
    const path = window.location.pathname;
    if (path.startsWith("/courses")) {
      setActiveModal("course");
    } else if (path.startsWith("/assignments")) {
      setActiveModal("assignment");
    } else if (path.startsWith("/grades")) {
      setActiveModal("grade");
    }
  };

  const handleModalSave = (data) => {
    console.log("Modal save:", activeModal, data);
    // This would normally trigger a refresh of the current page's data
    setActiveModal(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header onAddClick={handleAddClick} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>

        {/* Global Modals */}
        <AddCourseModal
          isOpen={activeModal === "course"}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
        
        <AddAssignmentModal
          isOpen={activeModal === "assignment"}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
        
        <AddGradeModal
          isOpen={activeModal === "grade"}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;