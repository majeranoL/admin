import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Dashboard from "./Dashboard"
import LoginForm from "./components/LoginForm"
import LandingPage from "./components/LandingPage"
import ShelterRegistration from "./components/ShelterRegistration"
import NotificationSystem from "./components/NotificationSystem"
import { RoleProvider } from "./contexts/RoleProvider"
import { DataProvider } from "./contexts/DataContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { FirebaseProvider } from "./contexts/FirebaseContext"
import { useRole } from "./hooks/useRole"
import "./css/App.css"
import "./css/Admin/AdoptionRequests.css"
import "./css/EnhancedComponents.css"

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])
  
  return null
}

// Main App Content (inside RoleProvider)
function AppContent() {
  const { isAuthenticated, isLoading } = useRole()
  const location = useLocation()

  useEffect(() => {
    // Add Font Awesome CSS if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(link);
    }
    
    // Add Bootstrap Icons CSS if not already present
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    // Set appropriate body class based on current route
    if (location.pathname === '/') {
      document.body.className = 'landing-page-body';
    } else if (location.pathname === '/login') {
      document.body.className = 'login-page';
    } else if (location.pathname === '/register-shelter') {
      document.body.className = 'registration-page';
    } else if (location.pathname === '/dashboard') {
      document.body.className = 'dashboard-page';
    } else {
      document.body.className = '';
    }
  }, [location.pathname]);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="app loading-app">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Animal911 Admin...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show appropriate component based on authentication and route
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        <Route 
          path="/register-shelter" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ShelterRegistration />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <>
                <Dashboard />
                <NotificationSystem />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

// Main App Component (wraps with providers and router)
function App() {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <RoleProvider>
          <DataProvider>
            <Router>
              <AppContent />
            </Router>
          </DataProvider>
        </RoleProvider>
      </ThemeProvider>
    </FirebaseProvider>
  )
}

export default App