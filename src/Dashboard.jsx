import { useState, useEffect } from "react"
import { useRole } from "./hooks/useRole"
import AdminDashboard from "./components/Admin/AdminDashboard"
import RescueReports from "./components/Admin/RescueReports"
import Volunteers from "./components/Admin/Volunteers"
import RescuedAnimals from "./components/Admin/RescuedAnimals"
import AdoptionRequests from "./components/Admin/AdoptionRequests"
import Notifications from "./components/Admin/Notifications"
import Settings from "./components/Admin/Settings"
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard"
import AdminManagement from "./components/SuperAdmin/AdminManagement"
import ShelterManagement from "./components/SuperAdmin/ShelterManagement"
import SystemReports from "./components/SuperAdmin/SystemReports"
import AuditLogs from "./components/SuperAdmin/AuditLogs"
import SuperAdminSettings from "./components/SuperAdmin/SuperAdminSettings"
import "./css/Dashboard.css"

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { userRole, username, logout } = useRole()

  useEffect(() => {
    document.body.className = 'dashboard-page'
  }, [])

  // Menu items based on user role
  const getMenuItems = () => {
    if (userRole === "superadmin") {
      // Super admin menu items
      return [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "admin-management", label: "Admin Management", icon: "👤" },
        { id: "shelter-management", label: "Shelter/Partner Management", icon: "🏠" },
        { id: "system-reports", label: "System Reports", icon: "📈" },
        { id: "audit-logs", label: "Audit Logs", icon: "📋" },
        { id: "settings", label: "Settings", icon: "⚙️" }
      ]
    } else {
      // Admin menu items
      return [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "rescue-reports", label: "Rescue Reports", icon: "🆘" },
        { id: "volunteers", label: "Volunteers", icon: "👥" },
        { id: "rescued-animals", label: "Rescued Animals", icon: "🐕" },
        { id: "adoption-requests", label: "Adoption Requests", icon: "❤️" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
        { id: "settings", label: "Settings", icon: "⚙️" }
      ]
    }
  }

  const menuItems = getMenuItems()

  const renderContent = () => {
    // Handle content based on user role and active section
    if (userRole === "superadmin") {
      // SuperAdmin content based on active section
      switch(activeSection) {
        case "dashboard":
          return <SuperAdminDashboard />
        case "admin-management":
          return <AdminManagement />
        case "shelter-management":
          return <ShelterManagement />
        case "system-reports":
          return <SystemReports />
        case "audit-logs":
          return <AuditLogs />
        case "settings":
          return <SuperAdminSettings />
        default:
          return <SuperAdminDashboard />
      }
    } else {
      // For admin users, show appropriate component based on active section
      switch(activeSection) {
        case "dashboard":
          return <AdminDashboard userRole={userRole} />
        case "rescue-reports":
          return <RescueReports />
        case "volunteers":
          return <Volunteers />
        case "rescued-animals":
          return <RescuedAnimals />
        case "adoption-requests":
          return <AdoptionRequests />
        case "notifications":
          return <Notifications />
        case "settings":
          return <Settings />
        default:
          return <AdminDashboard userRole={userRole} />
      }
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Animal911 Admin</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {username || 'Admin'}</span>
          <span className={`role-indicator ${userRole}`}>
            ({userRole === "superadmin" ? "Super Admin" : "Admin"})
          </span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
