import React from 'react'
import '../../css/SuperAdmin/SuperAdminDashboard.css'
import '../../css/EnhancedComponents.css'

function SuperAdminDashboard() {
  return (
    <div className="super-admin-dashboard">
      <h2><i className="bi bi-shield-check me-2"></i>Super Admin Dashboard</h2>
      <p>Super Admin specific features will be implemented here.</p>
      
      <div className="dashboard-cards-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Total Admins</h3>
            <span className="card-icon"><i className="bi bi-person-circle"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">5</p>
            <p className="card-description">Active admin accounts</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>System Users</h3>
            <span className="card-icon"><i className="bi bi-people"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">156</p>
            <p className="card-description">Registered users</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
