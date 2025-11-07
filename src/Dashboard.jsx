import { useState, useEffect } from "react"
import { useRole } from "./hooks/useRole"
import { useData } from "./contexts/DataContext"
import AdminDashboard from "./components/Admin/AdminDashboard"
import RescueReports from "./components/Admin/RescueReports"
import Rescuers from "./components/Admin/Rescuers"
import RescuedAnimals from "./components/Admin/RescuedAnimals"
import AdoptionRequests from "./components/Admin/AdoptionRequests"
import Settings from "./components/Admin/Settings"
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard"
import AccountManagement from "./components/SuperAdmin/AccountManagement"
import ShelterManagement from "./components/SuperAdmin/ShelterManagement"
import SystemReports from "./components/SuperAdmin/SystemReports"
import AuditLogs from "./components/SuperAdmin/AuditLogs"
import SuperAdminSettings from "./components/SuperAdmin/SuperAdminSettings"
import logo from "./assets/animal911logo.png"
import "./css/Dashboard.css"

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showNotifications, setShowNotifications] = useState(false)
  const { userRole, username, logout } = useRole()
  const { notifications, markNotificationAsRead } = useData()

  useEffect(() => {
    document.body.className = 'dashboard-page'
  }, [])

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length

  // Get recent notifications (last 5)
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id)
    }
    setShowNotifications(false)
    
    // Navigate based on notification type
    if (notification.type === 'report' || notification.type === 'rescue') {
      setActiveSection('rescue-reports')
    } else if (notification.type === 'rescuer' || notification.type === 'account') {
      setActiveSection('rescuers')
    } else if (notification.type === 'adoption') {
      setActiveSection('adoption-requests')
    }
  }

  // Menu items based on user role
  const getMenuItems = () => {
    if (userRole === "superadmin") {
      // Super admin menu items
      return [
        { id: "dashboard", label: "Dashboard", icon: "bi bi-speedometer2" },
        { id: "account-management", label: "Account Management", icon: "bi bi-person-gear" },
        { id: "shelter-management", label: "Shelter/Partner Management", icon: "bi bi-buildings" },
        { id: "system-reports", label: "System Reports", icon: "bi bi-bar-chart" },
        { id: "audit-logs", label: "Audit Logs", icon: "bi bi-journal-text" },
        { id: "settings", label: "Settings", icon: "bi bi-gear" }
      ]
    } else {
      // Admin menu items (removed notifications from sidebar)
      return [
        { id: "dashboard", label: "Dashboard", icon: "bi bi-speedometer2" },
        { id: "rescue-reports", label: "Rescue Reports", icon: "bi bi-exclamation-triangle" },
        { id: "rescuers", label: "Rescuer Management", icon: "bi bi-people-fill" },
        { id: "rescued-animals", label: "Rescued Animals", icon: "bi bi-heart" },
        { id: "adoption-requests", label: "Adoption Requests", icon: "bi bi-house-heart" },
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
          return <SuperAdminDashboard onNavigate={setActiveSection} />
        case "account-management":
          return <AccountManagement />
        case "shelter-management":
          return <ShelterManagement />
        case "system-reports":
          return <SystemReports />
        case "audit-logs":
          return <AuditLogs />
        case "settings":
          return <SuperAdminSettings />
        default:
          return <SuperAdminDashboard onNavigate={setActiveSection} />
      }
    } else {
      // For admin users, show appropriate component based on active section
      switch(activeSection) {
        case "dashboard":
          return <AdminDashboard userRole={userRole} onNavigate={setActiveSection} />
        case "rescue-reports":
          return <RescueReports />
        case "rescuers":
          return <Rescuers />
        case "rescued-animals":
          return <RescuedAnimals />
        case "adoption-requests":
          return <AdoptionRequests />
        case "settings":
          return <Settings />
        default:
          return <AdminDashboard userRole={userRole} onNavigate={setActiveSection} />
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
          {/* Notification Bell */}
          <div className="notification-bell-container">
            <button 
              className="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="bi bi-bell-fill"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <h3>Notifications</h3>
                  <span className="unread-count">{unreadCount} unread</span>
                </div>
                
                <div className="notification-dropdown-body">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-icon">
                          <i className={`bi ${
                            notification.type === 'report' ? 'bi-exclamation-triangle-fill' :
                            notification.type === 'rescue' ? 'bi-truck' :
                            notification.type === 'adoption' ? 'bi-house-heart-fill' :
                            'bi-bell-fill'
                          }`}></i>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            {notification.animalType && `${notification.animalType} Report`}
                            {notification.urgencyLevel && (
                              <span className={`urgency-badge urgency-${notification.urgencyLevel.toLowerCase()}`}>
                                {notification.urgencyLevel}
                              </span>
                            )}
                          </div>
                          <div className="notification-message">{notification.message}</div>
                          {notification.locationAddress && (
                            <div className="notification-location">
                              <i className="bi bi-geo-alt-fill"></i> {notification.locationAddress.substring(0, 50)}...
                            </div>
                          )}
                          <div className="notification-time">{formatTimestamp(notification.timestamp)}</div>
                        </div>
                        {!notification.isRead && (
                          <div className="unread-dot"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <i className="bi bi-inbox"></i>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="notification-dropdown-footer">
                    <button onClick={() => { setShowNotifications(false); /* Navigate to full notifications page if needed */ }}>
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <span className={`role-indicator ${userRole}`}>
            {userRole === "superadmin" ? "Super Admin" : "Admin"}
          </span>
          <button className="logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      {/* Click outside to close notification dropdown */}
      {showNotifications && (
        <div 
          className="notification-overlay" 
          onClick={() => setShowNotifications(false)}
        ></div>
      )}

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
