import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useData } from '../../contexts/DataContext'
import { useRole } from '../../hooks/useRole'
import AuditLogService from '../../services/auditLogService'
import '../../css/Admin/RescueReports.css'

function RescueReports() {
  const { showNotification } = useData()
  const { userId, username } = useRole()
  
  const [rescueReports, setRescueReports] = useState([])
  const [rescuers, setRescuers] = useState([])
  const [loading, setLoading] = useState({})
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedReports, setSelectedReports] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterUrgency, setFilterUrgency] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionReport, setActionReport] = useState({ id: null, action: null })

  // Fetch reports and rescuers from Firestore
  useEffect(() => {
    fetchReports()
    fetchRescuers()
  }, [])

  const fetchRescuers = async () => {
    try {
      const rescuersQuery = query(
        collection(db, 'rescuers'),
        where('status', '==', 'Active')
      )
      const rescuersSnapshot = await getDocs(rescuersQuery)
      
      const rescuersData = rescuersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setRescuers(rescuersData)
    } catch (error) {
      console.error('Error fetching rescuers:', error)
    }
  }

  const fetchReports = async () => {
    setIsLoadingData(true)
    try {
      const reportsQuery = query(collection(db, 'Reports'))
      const reportsSnapshot = await getDocs(reportsQuery)
      
      const reportsData = await Promise.all(
        reportsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data()
          console.log('Report Document:', docSnapshot.id, data) // Debug log
          
          // Fetch user details if userId exists
          let reporterName = 'Unknown User'
          if (data.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', data.userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                console.log('User Data:', data.userId, userData) // Debug log
                reporterName = userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}`.trim()
                  : userData.name || userData.displayName || 'Unknown User'
              }
            } catch (error) {
              console.error('Error fetching user:', data.userId, error)
            }
          }
          
          return {
            id: docSnapshot.id,
            ...data,
            reporterName: reporterName,
            reporterPhone: data.contactInfo || 'N/A',
            reporterEmail: 'N/A', // Not in report, would need to fetch from users collection
            animalType: data.animalType || 'N/A',
            location: data.locationAddress || 'N/A',
            urgency: data.urgencyLevel || 'Medium',
            status: data.status === 'Submitted' ? 'Pending' : (data.status || 'Pending'),
            originalStatus: data.status, // Keep original for Firestore updates
            assignedRescuer: data.assignedRescuer || data.rescueTeam || data.assignedTeam || null,
            assignedRescuerName: data.assignedRescuerName || data.rescueTeam || data.assignedTeam || 'Unassigned',
            reportDate: data.timestamp || 'N/A',
            description: data.emergencyDetails || 'N/A',
            animalDescription: data.animalDescription || 'N/A',
            outcome: data.outcome || 'Pending',
            imageUrls: data.imageUrls || [],
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            userId: data.userId || null
          }
        })
      )
      
      // Sort by timestamp (newest first)
      reportsData.sort((a, b) => {
        if (a.reportDate && b.reportDate) {
          return new Date(b.reportDate) - new Date(a.reportDate)
        }
        return 0
      })
      
      setRescueReports(reportsData)
    } catch (error) {
      console.error('Error fetching reports:', error)
      showNotification('Failed to load rescue reports', 'error')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Update report status
  const updateRescueReportStatus = async (reportId, newStatus, rescueTeam = null) => {
    setLoading(prev => ({ ...prev, [reportId]: true }))
    try {
      const reportRef = doc(db, 'Reports', reportId)
      const updateData = {
        status: newStatus,
        updatedAt: new Date()
      }
      
      if (rescueTeam) {
        updateData.assignedRescuer = rescueTeam.id || null
        updateData.assignedRescuerName = rescueTeam.name || rescueTeam
        updateData.assignedTeam = rescueTeam.name || rescueTeam
        updateData.rescueTeam = rescueTeam.name || rescueTeam
      }
      
      await updateDoc(reportRef, updateData)
      
      // Update local state
      setRescueReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: newStatus, 
                assignedRescuer: rescueTeam?.id || report.assignedRescuer,
                assignedRescuerName: rescueTeam?.name || rescueTeam || report.assignedRescuerName 
              }
            : report
        )
      )
      
      return true
    } catch (error) {
      console.error('Error updating report:', error)
      throw error
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }))
    }
  }

  // Filter and search logic
  const filteredReports = rescueReports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status.toLowerCase().includes(filterStatus.toLowerCase())
    const matchesUrgency = filterUrgency === 'all' || report.urgency.toLowerCase() === filterUrgency.toLowerCase()
    const matchesSearch = report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.animalType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesUrgency && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'status-pending', label: 'Pending' },
      'In Progress': { class: 'status-progress', label: 'In Progress' },
      'Completed': { class: 'status-completed', label: 'Completed' },
      'Cancelled': { class: 'status-cancelled', label: 'Cancelled' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  // Urgency badge styling
  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      'Critical': { class: 'urgency-critical', label: 'Critical' },
      'High': { class: 'urgency-high', label: 'High' },
      'Medium': { class: 'urgency-medium', label: 'Medium' },
      'Low': { class: 'urgency-low', label: 'Low' }
    }
    const config = urgencyConfig[urgency] || { class: 'urgency-unknown', label: urgency }
    return <span className={`urgency-badge ${config.class}`}>{config.label}</span>
  }

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map(report => report.id))
    }
  }

  const handleStatusAction = (reportId, action, rescueTeam = null) => {
    setActionReport({ id: reportId, action, rescueTeam })
    setShowConfirm(true)
  }

  const confirmAction = async () => {
    const { id, action, rescueTeam } = actionReport
    try {
      // Get report details before update for logging
      const report = rescueReports.find(r => r.id === id)
      
      await updateRescueReportStatus(id, action, rescueTeam)
      const actionText = action === 'assigned' ? 'assigned to rescue team' : 
                        action === 'In Progress' ? 'marked as in progress' :
                        action === 'Completed' ? 'marked as completed' : 
                        action === 'Cancelled' ? 'cancelled' : 'updated'
      
      // Log the rescue operation action
      await AuditLogService.logRescueOperation(
        actionText,
        userId,
        username || 'admin@animal911.com',
        report?.animalType || 'Unknown',
        report?.location || 'Unknown',
        {
          reportId: id,
          reporterName: report?.reporterName,
          urgency: report?.urgency,
          oldStatus: report?.status,
          newStatus: action,
          rescuer: rescueTeam?.name || rescueTeam || 'N/A'
        }
      )
      
      showNotification(`Rescue report ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating rescue report status:', error)
      showNotification('Failed to update rescue report. Please try again.', 'error')
    }
    setShowConfirm(false)
    setActionReport({ id: null, action: null, rescueTeam: null })
  }

  const handleViewDetails = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const handleAssignRescuer = (reportId) => {
    setSelectedReport(rescueReports.find(r => r.id === reportId))
    setShowAssignModal(true)
  }

  const assignRescuer = (rescuer) => {
    handleStatusAction(selectedReport.id, 'In Progress', rescuer)
    setShowAssignModal(false)
  }

  return (
    <div className="rescue-reports">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <h2>Rescue Reports</h2>
          <span className="reports-count">
            {filteredReports.length} of {rescueReports.length} reports
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-add">Create Report</button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="reports-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by reporter, location, or animal type..."
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
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-container">
        {isLoadingData ? (
          <div className="no-reports">
            <p>Loading rescue reports...</p>
          </div>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Report ID</th>
                <th>Reporter</th>
                <th>Animal Type</th>
                <th>Location</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Assigned Rescuer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="report-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                    />
                  </td>
                  <td className="report-id">{report.id}</td>
                  <td className="reporter-name">{report.reporterName}</td>
                  <td className="animal-type">{report.animalType}</td>
                  <td className="location">{report.location}</td>
                  <td>{getUrgencyBadge(report.urgency)}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td className="rescuer-cell">{report.assignedRescuerName || 'Unassigned'}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewDetails(report)}
                      >
                        View
                      </button>
                      
                      {report.status === 'Pending' && (
                        <>
                          <button
                            className="btn-assign"
                            onClick={() => handleAssignRescuer(report.id)}
                            disabled={loading[report.id]}
                          >
                            {loading[report.id] ? '...' : 'Assign Team'}
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => handleStatusAction(report.id, 'Cancelled')}
                            disabled={loading[report.id]}
                          >
                            {loading[report.id] ? '...' : 'Cancel'}
                          </button>
                        </>
                      )}
                      
                      {report.status === 'In Progress' && (
                        <button
                          className="btn-complete"
                          onClick={() => handleStatusAction(report.id, 'Completed')}
                          disabled={loading[report.id]}
                        >
                          {loading[report.id] ? '...' : 'Mark Complete'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoadingData && filteredReports.length === 0 && (
          <div className="no-reports">
            <p>No rescue reports found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rescue Report Details - {selectedReport.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Report Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Report ID:</label>
                    <span>{selectedReport.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Reporter Phone:</label>
                    <span>{selectedReport.reporterPhone}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span>{selectedReport.userId || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Animal Type:</label>
                    <span>{selectedReport.animalType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Urgency:</label>
                    {getUrgencyBadge(selectedReport.urgency)}
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <div className="detail-item">
                    <label>Report Date:</label>
                    <span>{selectedReport.reportDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Coordinates:</label>
                    <span>
                      {selectedReport.latitude && selectedReport.longitude 
                        ? `${selectedReport.latitude}, ${selectedReport.longitude}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Location:</label>
                    <span>{selectedReport.location}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Animal Description:</label>
                    <span>{selectedReport.animalDescription}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Emergency Details:</label>
                    <span>{selectedReport.description}</span>
                  </div>
                </div>
              </div>

              {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 && (
                <div className="detail-section">
                  <h4>Report Images</h4>
                  <div className="image-grid">
                    {selectedReport.imageUrls.map((url, index) => (
                      <div key={index} className="image-item">
                        <img src={url} alt={`Report ${index + 1}`} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Rescue Operation</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Assigned Rescuer:</label>
                    <span>{selectedReport.assignedRescuerName || 'Unassigned'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Outcome:</label>
                    <span>{selectedReport.outcome}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => console.log('Edit report:', selectedReport.id)}
              >
                Edit Report
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

      {/* Rescuer Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="assign-modal">
            <h3>Assign Rescuer</h3>
            <p>Select an available rescuer for report {selectedReport?.id}</p>
            <div className="team-options">
              {rescuers.length === 0 ? (
                <p className="no-rescuers">No active rescuers available</p>
              ) : (
                rescuers.map(rescuer => (
                  <button
                    key={rescuer.id}
                    className="btn-team"
                    onClick={() => assignRescuer(rescuer)}
                  >
                    <div className="rescuer-option">
                      <span className="rescuer-name">{rescuer.name}</span>
                      <span className="rescuer-type">{rescuer.type || 'Rescuer'}</span>
                      {rescuer.location && (
                        <span className="rescuer-location">{rescuer.location}</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="assign-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
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
              Are you sure you want to change the status to {actionReport.action} for report {actionReport.id}?
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

export default RescueReports
