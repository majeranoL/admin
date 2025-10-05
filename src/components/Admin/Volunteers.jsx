import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/Admin/Volunteers.css'

function Volunteers() {
  const { volunteers, loading, updateVolunteerStatus, showNotification } = useData()
  
  const [selectedVolunteers, setSelectedVolunteers] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionVolunteer, setActionVolunteer] = useState({ id: null, action: null })

  // Filter and search logic
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesStatus = filterStatus === 'all' || volunteer.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesRole = filterRole === 'all' || volunteer.role.toLowerCase().includes(filterRole.toLowerCase())
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesRole && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { class: 'status-active', label: 'Active' },
      'Inactive': { class: 'status-inactive', label: 'Inactive' },
      'On Leave': { class: 'status-leave', label: 'On Leave' },
      'Suspended': { class: 'status-suspended', label: 'Suspended' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const handleSelectVolunteer = (volunteerId) => {
    setSelectedVolunteers(prev => 
      prev.includes(volunteerId) 
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedVolunteers.length === filteredVolunteers.length) {
      setSelectedVolunteers([])
    } else {
      setSelectedVolunteers(filteredVolunteers.map(volunteer => volunteer.id))
    }
  }

  const handleStatusAction = (volunteerId, action) => {
    setActionVolunteer({ id: volunteerId, action })
    setShowConfirm(true)
  }

  const confirmAction = () => {
    const { id, action } = actionVolunteer
    try {
      updateVolunteerStatus(id, action)
      const actionText = action === 'active' ? 'activated' : 
                        action === 'inactive' ? 'deactivated' :
                        action === 'suspended' ? 'suspended' : 'updated'
      showNotification(`Volunteer ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating volunteer status:', error)
      showNotification('Failed to update volunteer status. Please try again.', 'error')
    }
    setShowConfirm(false)
    setActionVolunteer({ id: null, action: null })
  }

  const handleViewDetails = (volunteer) => {
    setSelectedVolunteer(volunteer)
    setShowModal(true)
  }

  // Unique roles for filtering
  const uniqueRoles = [...new Set(volunteers.map(v => v.role.split(' ')[0]))]

  return (
    <div className="volunteers">
      {/* Header */}
      <div className="volunteers-header">
        <div className="header-left">
          <h2>Volunteers</h2>
          <span className="volunteers-count">
            {filteredVolunteers.length} of {volunteers.length} volunteers
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-add">Add New Volunteer</button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="volunteers-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
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
            <option value="on leave">On Leave</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role.toLowerCase()}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="volunteers-table-container">
        <table className="volunteers-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedVolunteers.length === filteredVolunteers.length && filteredVolunteers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map(volunteer => (
              <tr key={volunteer.id} className="volunteer-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedVolunteers.includes(volunteer.id)}
                    onChange={() => handleSelectVolunteer(volunteer.id)}
                  />
                </td>
                <td className="volunteer-id">{volunteer.id}</td>
                <td className="volunteer-name">{volunteer.name}</td>
                <td className="volunteer-role">{volunteer.role}</td>
                <td className="contact-info">
                  <div>{volunteer.email}</div>
                  <div className="phone">{volunteer.phone}</div>
                </td>
                <td className="hours-completed">{volunteer.hoursCompleted}h</td>
                <td>{getStatusBadge(volunteer.status)}</td>
                <td className="availability">{volunteer.availability}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(volunteer)}
                    >
                      View
                    </button>
                    
                    {volunteer.status === 'Active' && (
                      <>
                        <button
                          className="btn-leave"
                          onClick={() => handleStatusAction(volunteer.id, 'On Leave')}
                          disabled={loading[volunteer.id]}
                        >
                          {loading[volunteer.id] ? '...' : 'Leave'}
                        </button>
                        <button
                          className="btn-suspend"
                          onClick={() => handleStatusAction(volunteer.id, 'Suspended')}
                          disabled={loading[volunteer.id]}
                        >
                          {loading[volunteer.id] ? '...' : 'Suspend'}
                        </button>
                      </>
                    )}
                    
                    {(volunteer.status === 'Inactive' || volunteer.status === 'On Leave') && (
                      <button
                        className="btn-activate"
                        onClick={() => handleStatusAction(volunteer.id, 'Active')}
                        disabled={loading[volunteer.id]}
                      >
                        {loading[volunteer.id] ? '...' : 'Activate'}
                      </button>
                    )}

                    {volunteer.status === 'Suspended' && (
                      <button
                        className="btn-activate"
                        onClick={() => handleStatusAction(volunteer.id, 'Active')}
                        disabled={loading[volunteer.id]}
                      >
                        {loading[volunteer.id] ? '...' : 'Reinstate'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVolunteers.length === 0 && (
          <div className="no-volunteers">
            <p>No volunteers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Volunteer Profile - {selectedVolunteer.name}</h3>
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
                    <label>ID:</label>
                    <span>{selectedVolunteer.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedVolunteer.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedVolunteer.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedVolunteer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span>{selectedVolunteer.role}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedVolunteer.status)}
                  </div>
                  <div className="detail-item">
                    <label>Join Date:</label>
                    <span>{selectedVolunteer.joinDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Availability:</label>
                    <span>{selectedVolunteer.availability}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Volunteer Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Hours Completed:</label>
                    <span>{selectedVolunteer.hoursCompleted} hours</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Skills:</label>
                    <div className="skills-list">
                      {selectedVolunteer.skills.map(skill => (
                        <span key={skill} className="skill-badge">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-item full-width">
                    <label>Emergency Contact:</label>
                    <span>{selectedVolunteer.emergencyContact}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => console.log('Edit volunteer:', selectedVolunteer.id)}
              >
                Edit Profile
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
              Are you sure you want to change the status to {actionVolunteer.action} for volunteer {actionVolunteer.id}?
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

export default Volunteers
