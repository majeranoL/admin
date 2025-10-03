import React from 'react'
import '../../css/SuperAdmin/SuperAdminDashboard.css'

function SuperAdminDashboard() {
  return (
    <div className="super-admin-dashboard">
      <h2>Super Admin Dashboard</h2>
      <p>Super Admin specific features will be implemented here.</p>
      
      <div className="dashboard-cards-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Total Admins</h3>
            <span className="card-icon">👤</span>
          </div>
          <div className="card-content">
            <p className="card-number">5</p>
            <p className="card-description">Active admin accounts</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>System Users</h3>
            <span className="card-icon">👥</span>
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
