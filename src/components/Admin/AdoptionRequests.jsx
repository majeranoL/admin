import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/Admin/AdoptionRequests.css'

function AdoptionRequests() {
  const {
    adoptionRequests, 
    loading, 
    updateAdoptionStatus, 
    exportToCSV, 
    bulkUpdateStatus,
    showNotification
  } = useData()  // Component state
  const [selectedRequests, setSelectedRequests] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionRequest, setActionRequest] = useState({ id: null, action: null })

  // Filter and search logic
  const filteredRequests = adoptionRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesSearch = request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending' },
      approved: { class: 'status-approved', label: 'Approved' },
      rejected: { class: 'status-rejected', label: 'Rejected' },
      'under-review': { class: 'status-review', label: 'Under Review' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: 'Unknown' }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  // Selection handlers
  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id))
    }
  }

  // Action handlers
  const handleStatusAction = (requestId, action) => {
    setActionRequest({ id: requestId, action })
    setShowConfirm(true)
  }

  const confirmAction = () => {
    const { id, action } = actionRequest
    try {
      updateAdoptionStatus(id, action)
      const actionText = action === 'approved' ? 'approved' : action === 'rejected' ? 'rejected' : 'updated'
      showNotification(`Adoption request ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating adoption status:', error)
      showNotification('Failed to update adoption request. Please try again.', 'error')
    }
    setShowConfirm(false)
    setActionRequest({ id: null, action: null })
  }

  const handleBulkAction = (action) => {
    if (selectedRequests.length === 0) return
    try {
      bulkUpdateStatus(selectedRequests, action)
      const actionText = action === 'approved' ? 'approved' : action === 'rejected' ? 'rejected' : 'updated'
      showNotification(`${selectedRequests.length} adoption requests ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating adoption requests:', error)
      showNotification('Failed to update adoption requests. Please try again.', 'error')
    }
    setSelectedRequests([])
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  return (
    <div className="adoption-requests">
      {/* Header */}
      <div className="requests-header">
        <div className="header-left">
          <h2>Adoption Requests</h2>
          <span className="requests-count">
            {filteredRequests.length} of {adoptionRequests.length} requests
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-export"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="requests-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, animal, or ID..."
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
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedRequests.length} selected</span>
          <div className="bulk-buttons">
            <button 
              className="btn-bulk-approve"
              onClick={() => handleBulkAction('approved')}
              disabled={loading.bulk}
            >
              {loading.bulk ? 'Processing...' : 'Approve Selected'}
            </button>
            <button 
              className="btn-bulk-reject"
              onClick={() => handleBulkAction('rejected')}
              disabled={loading.bulk}
            >
              {loading.bulk ? 'Processing...' : 'Reject Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRequests.length === filteredRequests.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Request ID</th>
              <th>Applicant</th>
              <th>Animal</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id} className="request-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => handleSelectRequest(request.id)}
                  />
                </td>
                <td className="request-id">{request.id}</td>
                <td className="applicant-name">{request.applicantName}</td>
                <td className="animal-info">{request.animal}</td>
                <td>{getStatusBadge(request.status)}</td>
                <td className="submitted-date">{request.submittedDate}</td>
                <td className="contact-info">{request.contactInfo}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(request)}
                    >
                      View
                    </button>
                    
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusAction(request.id, 'approved')}
                          disabled={loading[request.id]}
                        >
                          {loading[request.id] ? '...' : 'Approve'}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusAction(request.id, 'rejected')}
                          disabled={loading[request.id]}
                        >
                          {loading[request.id] ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                    
                    {request.status === 'under-review' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusAction(request.id, 'approved')}
                          disabled={loading[request.id]}
                        >
                          {loading[request.id] ? '...' : 'Approve'}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusAction(request.id, 'rejected')}
                          disabled={loading[request.id]}
                        >
                          {loading[request.id] ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="no-requests">
            <p>No adoption requests found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adoption Request Details - {selectedRequest.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Applicant Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedRequest.applicantName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedRequest.contactInfo}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedRequest.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Animal:</label>
                    <span>{selectedRequest.animal}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="detail-item">
                    <label>Submitted:</label>
                    <span>{selectedRequest.submittedDate}</span>
                  </div>
                </div>
              </div>

              {selectedRequest.applicationDetails && (
                <div className="detail-section">
                  <h4>Application Details</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Experience:</label>
                      <span>{selectedRequest.applicationDetails.experience}</span>
                    </div>
                    <div className="detail-item">
                      <label>Living Space:</label>
                      <span>{selectedRequest.applicationDetails.livingSpace}</span>
                    </div>
                    <div className="detail-item">
                      <label>Other Pets:</label>
                      <span>{selectedRequest.applicationDetails.otherPets}</span>
                    </div>
                    <div className="detail-item">
                      <label>Work Schedule:</label>
                      <span>{selectedRequest.applicationDetails.workSchedule}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Reason for Adoption:</label>
                      <span>{selectedRequest.applicationDetails.reason}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>References:</label>
                      <span>{selectedRequest.applicationDetails.references}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => {
                      handleStatusAction(selectedRequest.id, 'approved')
                      setShowModal(false)
                    }}
                  >
                    Approve Request
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => {
                      handleStatusAction(selectedRequest.id, 'rejected')
                      setShowModal(false)
                    }}
                  >
                    Reject Request
                  </button>
                </>
              )}
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
              Are you sure you want to {actionRequest.action} request {actionRequest.id}?
            </p>
            <div className="confirm-actions">
              <button 
                className="btn-confirm"
                onClick={confirmAction}
              >
                Yes, {actionRequest.action}
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

export default AdoptionRequests
