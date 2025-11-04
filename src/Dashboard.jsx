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
import logo from "./assets/animal911logo.png"
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
        { id: "dashboard", label: "Dashboard", icon: "bi bi-speedometer2" },
        { id: "admin-management", label: "Admin Management", icon: "bi bi-people" },
        { id: "shelter-management", label: "Shelter/Partner Management", icon: "bi bi-buildings" },
        { id: "system-reports", label: "System Reports", icon: "bi bi-bar-chart" },
        { id: "audit-logs", label: "Audit Logs", icon: "bi bi-journal-text" },
        { id: "settings", label: "Settings", icon: "bi bi-gear" }
      ]
    } else {
      // Admin menu items
      return [
        { id: "dashboard", label: "Dashboard", icon: "bi bi-speedometer2" },
        { id: "rescue-reports", label: "Rescue Reports", icon: "bi bi-exclamation-triangle" },
        { id: "volunteers", label: "Volunteers", icon: "bi bi-people-fill" },
        { id: "rescued-animals", label: "Rescued Animals", icon: "bi bi-heart" },
        { id: "adoption-requests", label: "Adoption Requests", icon: "bi bi-house-heart" },
        { id: "notifications", label: "Notifications", icon: "bi bi-bell" },
        { id: "settings", label: "Settings", icon: "bi bi-gear" }
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
          <img src={logo} alt="Animal 911 Logo" className="dashboard-logo" />
          <h1>Admin</h1>
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
                <i className={`nav-icon ${item.icon}`}></i>
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
