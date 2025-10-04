import React from 'react'
import { useData } from '../../contexts/DataContext'

function AdminDashboard({ userRole }) {
  const { showNotification } = useData()

  const testPopupNotification = (type) => {
    const messages = {
      success: 'Success! This notification slides out to the right individually.',
      error: 'Error! Each notification has its own 5-second timer.',
      info: 'Info! Click multiple buttons to see individual slide-out timing.'
    }
    showNotification(messages[type], type)
  }
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
            <p className="card-number">12</p>
            <p className="card-description">Reports awaiting review</p>
          </div>
        </div>

        <div className="dashboard-card ongoing">
          <div className="card-header">
            <h3>Ongoing Rescues</h3>
            <i className="card-icon bi bi-truck"></i>
          </div>
          <div className="card-content">
            <p className="card-number">5</p>
            <p className="card-description">Active rescue operations</p>
          </div>
        </div>

        <div className="dashboard-card volunteers">
          <div className="card-header">
            <h3>Available Volunteers</h3>
            <i className="card-icon bi bi-people-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">18</p>
            <p className="card-description">Ready for assignments</p>
          </div>
        </div>

        <div className="dashboard-card adoption">
          <div className="card-header">
            <h3>Pending Adoption Requests</h3>
            <i className="card-icon bi bi-heart-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">7</p>
            <p className="card-description">Applications to review</p>
          </div>
        </div>
      </div>

      {/* Test Notification System */}
      <div className="dashboard-card test-notifications" style={{marginTop: '20px', gridColumn: '1 / -1'}}>
        <div className="card-header">
          <h3>Test Popup Notifications</h3>
          <i className="card-icon bi bi-flask"></i>
        </div>
        <div className="card-content">
          <p className="card-description">Test the popup notification system (separate from the Notifications table)</p>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <button 
              onClick={() => testPopupNotification('success')} 
              style={{padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
            >
              <i className="bi bi-check-circle-fill"></i> Success
            </button>
            <button 
              onClick={() => testPopupNotification('error')} 
              style={{padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
            >
              <i className="bi bi-x-circle-fill"></i> Error
            </button>
            <button 
              onClick={() => testPopupNotification('info')} 
              style={{padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
            >
              <i className="bi bi-info-circle-fill"></i> Info
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
