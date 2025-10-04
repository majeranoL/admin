import { useEffect } from "react"
import Dashboard from "./Dashboard"
import LoginForm from "./components/LoginForm"
import NotificationSystem from "./components/NotificationSystem"
import { RoleProvider } from "./contexts/RoleProvider"
import { DataProvider } from "./contexts/DataContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { useRole } from "./hooks/useRole"
import "./css/App.css"
import "./css/Admin/AdoptionRequests.css"
import "./css/EnhancedComponents.css"

// Main App Content (inside RoleProvider)
function AppContent() {
  const { isAuthenticated, isLoading } = useRole()

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
    // Set appropriate body class based on authentication state
    if (isAuthenticated) {
      document.body.className = 'dashboard-page';
    } else {
      document.body.className = 'login-page';
    }
  }, [isAuthenticated]);

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

  // Show appropriate component based on authentication
  return (
    <>
      {isAuthenticated ? (
        <>
          <Dashboard />
          <NotificationSystem />
        </>
      ) : (
        <LoginForm />
      )}
    </>
  )
}

// Main App Component (wraps with providers)
function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </RoleProvider>
    </ThemeProvider>
  )
}

export default App