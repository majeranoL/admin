import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useRole } from '../../hooks/useRole'
import AuditLogService from '../../services/auditLogService'
import '../../css/Admin/Rescuers.css'

function Rescuers() {
  const { userId, username, userRole } = useRole()
  const [rescuers, setRescuers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  
  const [selectedRescuers, setSelectedRescuers] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRescuer, setSelectedRescuer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionRescuer, setActionRescuer] = useState({ id: null, action: null, name: null })
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  // Fetch rescuers from Firestore
  useEffect(() => {
    fetchRescuers()
  }, [])

  const fetchRescuers = async () => {
    try {
      setLoading(true)
      const rescuersRef = collection(db, 'rescuers')
      const q = query(rescuersRef)
      const querySnapshot = await getDocs(q)
      
      const rescuersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate?.()?.toLocaleDateString() || 'N/A',
        lastActive: doc.data().lastActive?.toDate?.()?.toLocaleDateString() || 'N/A'
      }))
      
      setRescuers(rescuersData)
    } catch (error) {
      console.error('Error fetching rescuers:', error)
      showNotification('Failed to load rescuers', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

  // Filter and search logic
  const filteredRescuers = rescuers.filter(rescuer => {
    const matchesStatus = filterStatus === 'all' || rescuer.status?.toLowerCase() === filterStatus.toLowerCase()
    const matchesType = filterType === 'all' || rescuer.type?.toLowerCase() === filterType.toLowerCase()
    const matchesSearch = 
      rescuer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rescuer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rescuer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rescuer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesType && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'status-pending', label: 'Pending Approval' },
      'Active': { class: 'status-active', label: 'Active' },
      'Inactive': { class: 'status-inactive', label: 'Inactive' },
      'Suspended': { class: 'status-suspended', label: 'Suspended' },
      'Rejected': { class: 'status-rejected', label: 'Rejected' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  // Type badge styling
  const getTypeBadge = (type) => {
    const typeConfig = {
      'Shelter': { class: 'type-shelter', label: 'Shelter Rescuer' },
      'Volunteer': { class: 'type-volunteer', label: 'Volunteer' },
      'Independent': { class: 'type-independent', label: 'Independent' }
    }
    const config = typeConfig[type] || { class: 'type-unknown', label: type }
    return (
      <span className={`type-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const handleSelectRescuer = (rescuerId) => {
    setSelectedRescuers(prev => 
      prev.includes(rescuerId) 
        ? prev.filter(id => id !== rescuerId)
        : [...prev, rescuerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedRescuers.length === filteredRescuers.length) {
      setSelectedRescuers([])
    } else {
      setSelectedRescuers(filteredRescuers.map(rescuer => rescuer.id))
    }
  }

  const handleStatusAction = (rescuerId, action, rescuerName) => {
    setActionRescuer({ id: rescuerId, action, name: rescuerName })
    setShowConfirm(true)
  }

  const confirmAction = async () => {
    const { id, action, name } = actionRescuer
    setActionLoading({ ...actionLoading, [id]: true })
    
    try {
      const rescuerRef = doc(db, 'rescuers', id)
      await updateDoc(rescuerRef, {
        status: action,
        [`${action.toLowerCase()}Date`]: serverTimestamp(),
        [`${action.toLowerCase()}By`]: username || userId,
        lastModified: serverTimestamp()
      })

      // Log the action
      await AuditLogService.logUserManagement(
        `Rescuer ${action}`,
        username || 'Unknown',
        userId || 'Unknown',
        userRole || 'Admin',
        name,
        id,
        { 
          action: action,
          previousStatus: rescuers.find(r => r.id === id)?.status,
          newStatus: action
        }
      )

      // Update local state
      setRescuers(prev => prev.map(r => 
        r.id === id ? { ...r, status: action } : r
      ))

      const actionText = {
        'Active': 'approved and activated',
        'Rejected': 'rejected',
        'Suspended': 'suspended',
        'Inactive': 'deactivated'
      }[action] || 'updated'

      showNotification(`Rescuer ${name} has been ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating rescuer status:', error)
      showNotification('Failed to update rescuer status. Please try again.', 'error')
    } finally {
      setActionLoading({ ...actionLoading, [id]: false })
      setShowConfirm(false)
      setActionRescuer({ id: null, action: null, name: null })
    }
  }

  const handleViewDetails = (rescuer) => {
    setSelectedRescuer(rescuer)
    setShowModal(true)
  }

  // Get statistics
  const stats = {
    total: rescuers.length,
    pending: rescuers.filter(r => r.status === 'Pending').length,
    active: rescuers.filter(r => r.status === 'Active').length,
    shelter: rescuers.filter(r => r.type === 'Shelter').length,
    volunteer: rescuers.filter(r => r.type === 'Volunteer').length
  }

  return (
    <div className="rescuers">
      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="rescuers-header">
        <div className="header-left">
          <h2>Rescuer Management</h2>
          <span className="rescuers-count">
            {filteredRescuers.length} of {rescuers.length} rescuers
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchRescuers} disabled={loading}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-people"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Rescuers</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon"><i className="bi bi-check-circle"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Rescuers</div>
          </div>
        </div>
        <div className="stat-card shelter">
          <div className="stat-icon"><i className="bi bi-building"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.shelter}</div>
            <div className="stat-label">Shelter Rescuers</div>
          </div>
        </div>
        <div className="stat-card volunteer">
          <div className="stat-icon"><i className="bi bi-hand-thumbs-up"></i></div>
          <div className="stat-content">
            <div className="stat-value">{stats.volunteer}</div>
            <div className="stat-label">Volunteers</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rescuers-controls">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, location, or skills..."
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
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="shelter">Shelter Rescuers</option>
            <option value="volunteer">Volunteers</option>
            <option value="independent">Independent</option>
          </select>
        </div>
      </div>

      {/* Rescuers Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading rescuers...</p>
          </div>
        ) : (
          <table className="enhanced-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRescuers.length === filteredRescuers.length && filteredRescuers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRescuers.map(rescuer => (
                <tr key={rescuer.id} className={`table-row status-${rescuer.status?.toLowerCase()}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRescuers.includes(rescuer.id)}
                      onChange={() => handleSelectRescuer(rescuer.id)}
                    />
                  </td>
                  <td className="rescuer-name">
                    <div className="name-cell">
                      <strong>{rescuer.name}</strong>
                      {rescuer.status === 'Pending' && (
                        <span className="new-badge">NEW</span>
                      )}
                    </div>
                  </td>
                  <td>{getTypeBadge(rescuer.type)}</td>
                  <td className="contact-info">
                    <div>{rescuer.email}</div>
                    <div className="phone">{rescuer.phone}</div>
                  </td>
                  <td className="location-cell">{rescuer.location || 'N/A'}</td>
                  <td>{getStatusBadge(rescuer.status)}</td>
                  <td className="date-cell">{rescuer.registrationDate}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewDetails(rescuer)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      
                      {rescuer.status === 'Pending' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleStatusAction(rescuer.id, 'Active', rescuer.name)}
                            disabled={actionLoading[rescuer.id]}
                            title="Approve Rescuer"
                          >
                            {actionLoading[rescuer.id] ? '...' : <i className="bi bi-check-circle"></i>}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleStatusAction(rescuer.id, 'Rejected', rescuer.name)}
                            disabled={actionLoading[rescuer.id]}
                            title="Reject Application"
                          >
                            {actionLoading[rescuer.id] ? '...' : <i className="bi bi-x-circle"></i>}
                          </button>
                        </>
                      )}
                      
                      {rescuer.status === 'Active' && (
                        <>
                          <button
                            className="btn-deactivate"
                            onClick={() => handleStatusAction(rescuer.id, 'Inactive', rescuer.name)}
                            disabled={actionLoading[rescuer.id]}
                            title="Deactivate"
                          >
                            {actionLoading[rescuer.id] ? '...' : <i className="bi bi-pause-circle"></i>}
                          </button>
                          <button
                            className="btn-suspend"
                            onClick={() => handleStatusAction(rescuer.id, 'Suspended', rescuer.name)}
                            disabled={actionLoading[rescuer.id]}
                            title="Suspend"
                          >
                            {actionLoading[rescuer.id] ? '...' : <i className="bi bi-slash-circle"></i>}
                          </button>
                        </>
                      )}
                      
                      {(rescuer.status === 'Inactive' || rescuer.status === 'Suspended') && (
                        <button
                          className="btn-activate"
                          onClick={() => handleStatusAction(rescuer.id, 'Active', rescuer.name)}
                          disabled={actionLoading[rescuer.id]}
                          title="Reactivate"
                        >
                          {actionLoading[rescuer.id] ? '...' : <i className="bi bi-arrow-counterclockwise"></i>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredRescuers.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon"><i className="bi bi-people"></i></div>
            <h3>No rescuers found</h3>
            <p>{rescuers.length === 0 ? 'No rescuers have registered yet.' : 'No rescuers match your current filter criteria.'}</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedRescuer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rescuer Profile - {selectedRescuer.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedRescuer.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    {getTypeBadge(selectedRescuer.type)}
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedRescuer.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedRescuer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedRescuer.location || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedRescuer.status)}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Rescuer Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Registration Date:</label>
                    <span>{selectedRescuer.registrationDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Active:</label>
                    <span>{selectedRescuer.lastActive}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Rescues:</label>
                    <span>{selectedRescuer.totalRescues || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Success Rate:</label>
                    <span>{selectedRescuer.successRate || 'N/A'}</span>
                  </div>
                  {selectedRescuer.skills && selectedRescuer.skills.length > 0 && (
                    <div className="detail-item full-width">
                      <label>Skills:</label>
                      <div className="skills-list">
                        {selectedRescuer.skills.map(skill => (
                          <span key={skill} className="skill-badge">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRescuer.availability && (
                    <div className="detail-item full-width">
                      <label>Availability:</label>
                      <span>{selectedRescuer.availability}</span>
                    </div>
                  )}
                  {selectedRescuer.emergencyContact && (
                    <div className="detail-item full-width">
                      <label>Emergency Contact:</label>
                      <span>{selectedRescuer.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
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
            <div className="confirm-icon">
              <i className={`bi ${
                actionRescuer.action === 'Active' ? 'bi-check-circle' : 
                actionRescuer.action === 'Rejected' ? 'bi-x-circle' : 
                'bi-exclamation-triangle'
              }`}></i>
            </div>
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to <strong>{actionRescuer.action.toLowerCase()}</strong> rescuer <strong>{actionRescuer.name}</strong>?
            </p>
            {actionRescuer.action === 'Rejected' && (
              <p className="warning-text">This action will reject their application.</p>
            )}
            <div className="confirm-actions">
              <button 
                className={`btn-confirm ${actionRescuer.action === 'Rejected' ? 'danger' : ''}`}
                onClick={confirmAction}
              >
                Yes, {actionRescuer.action}
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

export default Rescuers
