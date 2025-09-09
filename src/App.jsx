import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
import { ToastContainer } from "react-toastify";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import Header from "@/components/organisms/Header";
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal";
import AddCourseModal from "@/components/organisms/AddCourseModal";
import StudyTimerModal from "@/components/organisms/StudyTimerModal";
import AddGradeModal from "@/components/organisms/AddGradeModal";
import CalendarPage from "@/components/pages/CalendarPage";
import Courses from "@/components/pages/Courses";
import Dashboard from "@/components/pages/Dashboard";
import Grades from "@/components/pages/Grades";
import Assignments from "@/components/pages/Assignments";

// Create auth context
export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize authentication
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [navigate, dispatch]);
const handleAddClick = () => {
    const location = window.location.pathname;
    if (location === "/courses") setActiveModal("course");
    else if (location === "/assignments") setActiveModal("assignment");
    else if (location === "/grades") setActiveModal("grade");
  };

  const handleModalSave = (data) => {
    // Modal save logic handled by individual modals
    setActiveModal(null);
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        {isAuthenticated ? (
          <>
            <Route path="/" element={
              <div>
                <Header onAddClick={handleAddClick} onTimerClick={() => setIsTimerModalOpen(true)} />
                <main>
                  <Dashboard />
                </main>
              </div>
            } />
            <Route path="/courses" element={
              <div>
                <Header onAddClick={handleAddClick} onTimerClick={() => setIsTimerModalOpen(true)} />
                <main>
                  <Courses />
                </main>
              </div>
            } />
            <Route path="/assignments" element={
              <div>
                <Header onAddClick={handleAddClick} onTimerClick={() => setIsTimerModalOpen(true)} />
                <main>
                  <Assignments />
                </main>
              </div>
            } />
            <Route path="/grades" element={
              <div>
                <Header onAddClick={handleAddClick} onTimerClick={() => setIsTimerModalOpen(true)} />
                <main>
                  <Grades />
                </main>
              </div>
            } />
            <Route path="/calendar" element={
              <div>
                <Header onAddClick={handleAddClick} onTimerClick={() => setIsTimerModalOpen(true)} />
                <main>
                  <CalendarPage />
                </main>
              </div>
            } />
            {/* Global Modals */}
            <AddCourseModal isOpen={activeModal === "course"} onClose={() => setActiveModal(null)} onSave={handleModalSave} />
            <AddAssignmentModal isOpen={activeModal === "assignment"} onClose={() => setActiveModal(null)} onSave={handleModalSave} />
            <AddGradeModal isOpen={activeModal === "grade"} onClose={() => setActiveModal(null)} onSave={handleModalSave} />
            {/* Study Timer Modal */}
            <StudyTimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;