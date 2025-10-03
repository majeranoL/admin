import React from 'react'
import { RoleBasedRender } from '../RoleAccess'

function AdminManagement() {
  return (
    <div className="content-section">
      <h2>Admin Management</h2>
      <p>Manage admin accounts, permissions, and access levels</p>
      
      <div className="section-content">
        <div className="action-cards">
          <div className="action-card">
            <div className="card-header">
              <h3>Active Admins</h3>
              <span className="card-icon">👤</span>
            </div>
            <div className="card-content">
              <p className="card-number">5</p>
              <p className="card-description">Currently active admin accounts</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Pending Approvals</h3>
              <span className="card-icon">⏳</span>
            </div>
            <div className="card-content">
              <p className="card-number">2</p>
              <p className="card-description">Admin accounts awaiting approval</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Suspended Accounts</h3>
              <span className="card-icon">🚫</span>
            </div>
            <div className="card-content">
              <p className="card-number">0</p>
              <p className="card-description">Temporarily suspended admins</p>
            </div>
          </div>

          <div className="action-card">
            <div className="card-header">
              <h3>Role Permissions</h3>
              <span className="card-icon">🔑</span>
            </div>
            <div className="card-content">
              <p className="card-number">3</p>
              <p className="card-description">Different admin role levels</p>
            </div>
          </div>
        </div>

        <div className="management-actions">
          <RoleBasedRender 
            permissions={['manage_admins']}
            fallback={
              <div className="access-denied">
                <p>🔒 Insufficient permissions to perform admin management actions</p>
              </div>
            }
          >
            <button className="action-btn primary">
              <span className="btn-icon">➕</span>
              Add New Admin
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📊</span>
              View Admin Activity
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">⚙️</span>
              Manage Permissions
            </button>
          </RoleBasedRender>
        </div>
      </div>
    </div>
  )
}

export default AdminManagement