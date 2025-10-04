import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/SuperAdmin/AdminManagement.css'
import '../../css/EnhancedComponents.css'

function AdminManagement() {
  const { adminUsers, loading, updateAdminStatus } = useData()
  
  const [selectedAdmins, setSelectedAdmins] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionAdmin, setActionAdmin] = useState({ id: null, action: null })

  // Filter and search logic
  const filteredAdmins = adminUsers.filter(admin => {
    const matchesStatus = filterStatus === 'all' || admin.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.shelterLocation.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { class: 'status-active', label: 'Active' },
      'Inactive': { class: 'status-inactive', label: 'Inactive' },
      'Suspended': { class: 'status-suspended', label: 'Suspended' },
      'Pending': { class: 'status-pending', label: 'Pending' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAdmins.length === filteredAdmins.length) {
      setSelectedAdmins([])
    } else {
      setSelectedAdmins(filteredAdmins.map(admin => admin.id))
    }
  }

  const handleStatusAction = (adminId, action) => {
    setActionAdmin({ id: adminId, action })
    setShowConfirm(true)
  }

  const confirmAction = () => {
    const { id, action } = actionAdmin
    updateAdminStatus(id, action)
    setShowConfirm(false)
    setActionAdmin({ id: null, action: null })
  }

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin)
    setShowModal(true)
  }

  return (
    <div className="admin-management">
      {/* Header */}
      <div className="admins-header">
        <div className="header-left">
          <h2>Admin Management</h2>
          <span className="admins-count">
            {filteredAdmins.length} of {adminUsers.length} admin accounts
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-add">Create Admin Account</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-person-circle"></i></div>
          <div className="stat-info">
            <h3>{adminUsers.filter(a => a.status === 'Active').length}</h3>
            <p>Active Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-pause-circle"></i></div>
          <div className="stat-info">
            <h3>{adminUsers.filter(a => a.status === 'Suspended').length}</h3>
            <p>Suspended</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-clock"></i></div>
          <div className="stat-info">
            <h3>{adminUsers.filter(a => a.status === 'Pending').length}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="admins-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or shelter location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="admins-table-container">
        <table className="admins-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedAdmins.length === filteredAdmins.length && filteredAdmins.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Admin ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Shelter Location</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(admin => (
              <tr key={admin.id} className="admin-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAdmins.includes(admin.id)}
                    onChange={() => handleSelectAdmin(admin.id)}
                  />
                </td>
                <td className="admin-id">{admin.id}</td>
                <td className="admin-name">{admin.name}</td>
                <td className="admin-email">{admin.email}</td>
                <td className="admin-role">{admin.role}</td>
                <td className="shelter-location">{admin.shelterLocation}</td>
                <td>{getStatusBadge(admin.status)}</td>
                <td className="last-login">{admin.lastLogin}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(admin)}
                    >
                      View
                    </button>
                    
                    {admin.status === 'Active' && (
                      <>
                        <button
                          className="btn-suspend"
                          onClick={() => handleStatusAction(admin.id, 'Suspended')}
                          disabled={loading[admin.id]}
                        >
                          {loading[admin.id] ? '...' : 'Suspend'}
                        </button>
                        <button
                          className="btn-deactivate"
                          onClick={() => handleStatusAction(admin.id, 'Inactive')}
                          disabled={loading[admin.id]}
                        >
                          {loading[admin.id] ? '...' : 'Deactivate'}
                        </button>
                      </>
                    )}
                    
                    {(admin.status === 'Suspended' || admin.status === 'Inactive' || admin.status === 'Pending') && (
                      <button
                        className="btn-activate"
                        onClick={() => handleStatusAction(admin.id, 'Active')}
                        disabled={loading[admin.id]}
                      >
                        {loading[admin.id] ? '...' : 'Activate'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="no-admins">
            <p>No admin accounts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Admin Account Details - {selectedAdmin.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Account Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Admin ID:</label>
                    <span>{selectedAdmin.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedAdmin.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedAdmin.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span>{selectedAdmin.role}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedAdmin.status)}
                  </div>
                  <div className="detail-item">
                    <label>Shelter Location:</label>
                    <span>{selectedAdmin.shelterLocation}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created Date:</label>
                    <span>{selectedAdmin.createdDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{selectedAdmin.lastLogin}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Permissions</h4>
                <div className="permissions-list">
                  {selectedAdmin.permissions.map(permission => (
                    <span key={permission} className="permission-badge">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => console.log('Edit admin:', selectedAdmin.id)}
              >
                Edit Permissions
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to change the status to {actionAdmin.action} for admin {actionAdmin.id}?
            </p>
            <div className="confirm-actions">
              <button 
                className="btn-confirm"
                onClick={confirmAction}
              >
                Yes, Update Status
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManagement