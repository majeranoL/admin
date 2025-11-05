import React from 'react'
import { useData } from '../../contexts/DataContext'

function AdminDashboard({ userRole }) {
  const { 
    showNotification,
    rescueReports,
    volunteers,
    adoptionRequests
  } = useData()

  // Calculate real statistics
  const pendingReports = rescueReports.filter(report => 
    report.status === 'Pending' || report.status === 'pending'
  ).length

  const ongoingRescues = rescueReports.filter(report => 
    report.status === 'In Progress' || report.status === 'in-progress'
  ).length

  const availableVolunteers = volunteers.filter(volunteer => 
    volunteer.status === 'Active' || volunteer.status === 'active'
  ).length

  const pendingAdoptions = adoptionRequests.filter(request => 
    request.status === 'pending' || request.status === 'Pending'
  ).length
  
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
            <i className="card-icon bi bi-clipboard-check"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{pendingReports}</p>
            <p className="card-description">Reports awaiting review</p>
          </div>
        </div>

        <div className="dashboard-card ongoing">
          <div className="card-header">
            <h3>Ongoing Rescues</h3>
            <i className="card-icon bi bi-truck"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{ongoingRescues}</p>
            <p className="card-description">Active rescue operations</p>
          </div>
        </div>

        <div className="dashboard-card volunteers">
          <div className="card-header">
            <h3>Available Volunteers</h3>
            <i className="card-icon bi bi-people-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{availableVolunteers}</p>
            <p className="card-description">Ready for assignments</p>
          </div>
        </div>

        <div className="dashboard-card adoption">
          <div className="card-header">
            <h3>Pending Adoption Requests</h3>
            <i className="card-icon bi bi-heart-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{pendingAdoptions}</p>
            <p className="card-description">Applications to review</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
