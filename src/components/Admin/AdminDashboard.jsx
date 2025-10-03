import React from 'react'

function AdminDashboard({ userRole }) {
  return (
    <div className="content-section">
      <h2>Admin Dashboard</h2>
      <div className="role-indicator">
        <span className={`role-badge ${userRole}`}>
          {userRole === "superadmin" ? "Super Admin" : "Admin"}
        </span>
      </div>
      
      <div className="dashboard-cards-grid">
        <div className="dashboard-card pending">
          <div className="card-header">
            <h3>Pending Reports</h3>
            <span className="card-icon">📋</span>
          </div>
          <div className="card-content">
            <p className="card-number">12</p>
            <p className="card-description">Reports awaiting review</p>
          </div>
        </div>

        <div className="dashboard-card ongoing">
          <div className="card-header">
            <h3>Ongoing Rescues</h3>
            <span className="card-icon">🚑</span>
          </div>
          <div className="card-content">
            <p className="card-number">5</p>
            <p className="card-description">Active rescue operations</p>
          </div>
        </div>

        <div className="dashboard-card volunteers">
          <div className="card-header">
            <h3>Available Volunteers</h3>
            <span className="card-icon">👥</span>
          </div>
          <div className="card-content">
            <p className="card-number">18</p>
            <p className="card-description">Ready for assignments</p>
          </div>
        </div>

        <div className="dashboard-card adoption">
          <div className="card-header">
            <h3>Pending Adoption Requests</h3>
            <span className="card-icon">❤️</span>
          </div>
          <div className="card-content">
            <p className="card-number">7</p>
            <p className="card-description">Applications to review</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
