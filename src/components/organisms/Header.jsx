import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ onAddClick, onTimerClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Courses", path: "/courses", icon: "BookOpen" },
    { name: "Assignments", path: "/assignments", icon: "FileText" },
    { name: "Grades", path: "/grades", icon: "Award" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" }
  ];

  const currentPage = navigation.find(item => 
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );

  const getAddButtonText = () => {
    switch (location.pathname) {
      case "/courses":
        return "Add Course";
      case "/assignments":
        return "Add Assignment";
      case "/grades":
        return "Add Grade";
      default:
        return "Add Item";
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  StudyFlow
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = item.path === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.path);
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

{/* Actions */}
          <div className="flex items-center space-x-3">
            {onTimerClick && (
              <Button
                variant="outline"
                onClick={onTimerClick}
                className="hidden sm:flex items-center space-x-2"
              >
                <ApperIcon name="Clock" size={16} />
                <span>Study Timer</span>
              </Button>
            )}
            {onAddClick && (
              <Button
                variant="primary"
                onClick={onAddClick}
                className="hidden sm:flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>{getAddButtonText()}</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = item.path === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.path);
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                    isActive
                      ? "text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            {onAddClick && (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    onAddClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span>{getAddButtonText()}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;