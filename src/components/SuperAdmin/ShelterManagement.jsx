import React from 'react'

function ShelterManagement() {
  return (
    <div className="content-section">
      <h2>Shelter/Partner Management</h2>
      <p>Manage animal shelters, rescue organizations, and partner networks</p>
      
      <div className="section-content">
        <div className="action-cards">
          <div className="action-card">
            <div className="card-header">
              <h3>Active Shelters</h3>
              <span className="card-icon">🏠</span>
            </div>
            <div className="card-content">
              <p className="card-number">23</p>
              <p className="card-description">Registered shelter partners</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Rescue Organizations</h3>
              <span className="card-icon">🚑</span>
            </div>
            <div className="card-content">
              <p className="card-number">8</p>
              <p className="card-description">Partner rescue organizations</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Veterinary Partners</h3>
              <span className="card-icon">🏥</span>
            </div>
            <div className="card-content">
              <p className="card-number">15</p>
              <p className="card-description">Veterinary clinic partners</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Pending Applications</h3>
              <span className="card-icon">📋</span>
            </div>
            <div className="card-content">
              <p className="card-number">4</p>
              <p className="card-description">New partner applications</p>
            </div>
          </div>
        </div>

        <div className="management-actions">
          <button className="action-btn primary">
            <span className="btn-icon">➕</span>
            Add New Partner
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">📊</span>
            Partner Performance
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">🗺️</span>
            Partner Map
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">📄</span>
            Partnership Agreements
          </button>
        </div>

        <div className="partner-status-grid">
          <div className="status-card active">
            <h4>Active Partners</h4>
            <div className="status-info">
              <span className="status-count">46</span>
              <span className="status-label">Currently operational</span>
            </div>
          </div>
          <div className="status-card inactive">
            <h4>Inactive Partners</h4>
            <div className="status-info">
              <span className="status-count">3</span>
              <span className="status-label">Temporarily inactive</span>
            </div>
          </div>
          <div className="status-card verification">
            <h4>Under Review</h4>
            <div className="status-info">
              <span className="status-count">2</span>
              <span className="status-label">Verification pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShelterManagement