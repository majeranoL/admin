import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/SuperAdmin/ShelterManagement.css'
import '../../css/SuperAdmin/CleanTable.css'
import '../../css/EnhancedComponents.css'

function ShelterManagement() {
  const { shelters, loading, updateShelterStatus, showNotification } = useData()
  
  const [selectedShelters, setSelectedShelters] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShelter, setSelectedShelter] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionShelter, setActionShelter] = useState({ id: null, action: null })
  const [showAddModal, setShowAddModal] = useState(false)
  const [newShelterData, setNewShelterData] = useState({
    name: '',
    type: 'Animal Shelter',
    email: '',
    phone: '',
    address: '',
    capacity: '',
    licenseNumber: '',
    website: ''
  })

  // Filter and search logic
  const filteredShelters = shelters.filter(shelter => {
    const matchesStatus = filterStatus === 'all' || shelter.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesType = filterType === 'all' || (shelter.type && shelter.type.toLowerCase() === filterType.toLowerCase())
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shelter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shelter.manager.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Operational': { class: 'status-active', label: 'Operational' },
      'Pending': { class: 'status-pending', label: 'Pending' },
      'Maintenance': { class: 'status-warning', label: 'Maintenance' },
      'Closed': { class: 'status-inactive', label: 'Closed' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Animal Shelter': { icon: 'bi-house', class: 'type-shelter' },
      'Rescue Organization': { icon: 'bi-truck', class: 'type-rescue' },
      'Veterinary Clinic': { icon: 'bi-hospital', class: 'type-vet' },
      'Foster Network': { icon: 'bi-people', class: 'type-foster' }
    }
    const config = typeConfig[type] || { icon: 'bi-building', class: 'type-other' }
    return (
      <span className={`type-badge ${config.class}`}>
        <span className="type-icon"><i className={`bi ${config.icon}`}></i></span>
        {type}
      </span>
    )
  }

  const handleSelectShelter = (shelterId) => {
    setSelectedShelters(prev => 
      prev.includes(shelterId) 
        ? prev.filter(id => id !== shelterId)
        : [...prev, shelterId]
    )
  }

  const handleSelectAll = () => {
    if (selectedShelters.length === filteredShelters.length) {
      setSelectedShelters([])
    } else {
      setSelectedShelters(filteredShelters.map(shelter => shelter.id))
    }
  }

  const handleStatusAction = (shelterId, action) => {
    setActionShelter({ id: shelterId, action })
    setShowConfirm(true)
  }

  const confirmAction = () => {
    const { id, action } = actionShelter
    updateShelterStatus(id, action)
    
    // Show notification based on action
    const shelter = shelters.find(shelter => shelter.id === id)
    const shelterName = shelter ? shelter.name : 'Shelter'
    const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'suspended'
    showNotification(`${shelterName} has been ${actionText} successfully!`, 'success')
    
    setShowConfirm(false)
    setActionShelter({ id: null, action: null })
  }

  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter)
    setShowModal(true)
  }

  const handleAddShelter = () => {
    // In a real app, this would make an API call
    console.log('Adding new shelter:', newShelterData)
    setNewShelterData({
      name: '',
      type: 'Animal Shelter',
      email: '',
      phone: '',
      address: '',
      capacity: '',
      licenseNumber: '',
      website: ''
    })
    setShowAddModal(false)
  }

  // Statistics
  const stats = {
    active: shelters.filter(s => s.status === 'Operational').length,
    pending: shelters.filter(s => s.status === 'Pending').length,
    shelterType: shelters.filter(s => s.type === 'Animal Shelter').length,
    rescueType: shelters.filter(s => s.type === 'Rescue Organization').length,
    vetType: shelters.filter(s => s.type === 'Veterinary Clinic').length,
    totalAnimals: shelters.reduce((sum, s) => sum + (s.currentOccupancy || 0), 0)
  }

  // Unique types for filtering
  const uniqueTypes = [...new Set(shelters.map(s => s.type))]

  return (
    <div className="shelter-management enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-house me-2"></i>Shelter Management</h2>
          <span className="shelters-count">
            {filteredShelters.length} of {shelters.length} partners
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <span className="btn-icon"><i className="bi bi-plus"></i></span>
            Add New Partner
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"><i className="bi bi-house"></i></div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active Partners</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon"><i className="bi bi-clipboard-data"></i></div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon"><i className="bi bi-heart"></i></div>
          <div className="stat-content">
            <h3>{stats.totalAnimals}</h3>
            <p>Animals Hosted</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon"><i className="bi bi-hospital"></i></div>
          <div className="stat-content">
            <h3>{stats.vetType}</h3>
            <p>Veterinary Partners</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="component-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon"><i className="bi bi-search"></i></span>
            <input
              type="text"
              placeholder="Search by shelter name, location, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="pending">Pending</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shelters Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedShelters.length === filteredShelters.length && filteredShelters.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-partner">Partner Information</th>
              <th className="col-type-status">Type & Status</th>
              <th className="col-capacity">Capacity Usage</th>
              <th className="col-contact">Contact & License</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShelters.map(shelter => (
              <tr key={shelter.id}>
                <td className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedShelters.includes(shelter.id)}
                    onChange={() => handleSelectShelter(shelter.id)}
                  />
                </td>
                <td className="col-partner">
                  <div className="partner-name">{shelter.name}</div>
                  <div className="partner-location">{shelter.address}</div>
                  <div className="partner-manager">Manager: {shelter.manager}</div>
                </td>
                <td className="col-type-status">
                  <div className="badge-container">
                    {getTypeBadge(shelter.type)}
                    {getStatusBadge(shelter.status)}
                  </div>
                </td>
                <td className="col-capacity">
                  <div className="capacity-display">
                    <div className="capacity-numbers">
                      <span className="current">{shelter.currentOccupancy || 0}</span>
                      <span className="divider">/</span>
                      <span className="total">{shelter.capacity}</span>
                    </div>
                    <div className="capacity-percent">
                      {(((shelter.currentOccupancy || 0) / shelter.capacity) * 100).toFixed(0)}% occupied
                    </div>
                  </div>
                </td>
                <td className="col-contact">
                  <div className="contact-details">
                    <div className="email-info">{shelter.email}</div>
                    <div className="phone-info">{shelter.phone}</div>
                    <div className="license-info">License: {shelter.licenseNumber || 'N/A'}</div>
                  </div>
                </td>
                <td className="col-actions">
                  <div className="actions-wrapper">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleViewDetails(shelter)}
                      title="View Details"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    
                    {shelter.status === 'Pending' && (
                      <>
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleStatusAction(shelter.id, 'Operational')}
                          disabled={loading[shelter.id]}
                          title="Approve"
                        >
                          {loading[shelter.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-check-circle"></i>}
                        </button>
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleStatusAction(shelter.id, 'Closed')}
                          disabled={loading[shelter.id]}
                          title="Reject"
                        >
                          {loading[shelter.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-x-circle"></i>}
                        </button>
                      </>
                    )}
                    
                    {shelter.status === 'Operational' && (
                      <button
                        className="action-btn suspend-btn"
                        onClick={() => handleStatusAction(shelter.id, 'Maintenance')}
                        disabled={loading[shelter.id]}
                        title="Set to Maintenance"
                      >
                        {loading[shelter.id] ? '⏳' : '�'}
                      </button>
                    )}

                    {shelter.status === 'Maintenance' && (
                      <button
                        className="action-btn activate-btn"
                        onClick={() => handleStatusAction(shelter.id, 'Operational')}
                        disabled={loading[shelter.id]}
                        title="Reactivate"
                      >
                        {loading[shelter.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-check-circle"></i>}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredShelters.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon"><i className="bi bi-house"></i></div>
            <h3>No partners found</h3>
            <p>No shelters or organizations match your current filters.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedShelter && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Partner Details - {selectedShelter.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Organization Name:</label>
                    <span>{selectedShelter.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    {getTypeBadge(selectedShelter.type)}
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedShelter.status)}
                  </div>
                  <div className="detail-item">
                    <label>License Number:</label>
                    <span>{selectedShelter.licenseNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>License Expiry:</label>
                    <span>{selectedShelter.licenseExpiry}</span>
                  </div>
                  <div className="detail-item">
                    <label>Registration Date:</label>
                    <span>{selectedShelter.registeredDate}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Contact Person:</label>
                    <span>{selectedShelter.manager}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedShelter.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedShelter.phone}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Address:</label>
                    <span>{selectedShelter.address}</span>
                  </div>
                  <div className="detail-item">
                    <label>Website:</label>
                    <span>{selectedShelter.website || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Capacity & Performance</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Total Capacity:</label>
                    <span>{selectedShelter.capacity} animals</span>
                  </div>
                  <div className="detail-item">
                    <label>Currently Hosted:</label>
                    <span>{selectedShelter.animalsHosted} animals</span>
                  </div>
                  <div className="detail-item">
                    <label>Occupancy Rate:</label>
                    <span>{((selectedShelter.animalsHosted / selectedShelter.capacity) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Animals Rescued:</label>
                    <span>{selectedShelter.totalRescued || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Successful Adoptions:</label>
                    <span>{selectedShelter.successfulAdoptions || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rating:</label>
                    <span>
                      {Array.from({length: 5}).map((_, i) => (
                        <i key={i} className={`bi ${i < (selectedShelter.rating || 5) ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                      ))}
                      ({selectedShelter.rating || 5}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => console.log('Edit shelter:', selectedShelter.id)}
              >
                📝 Edit Details
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

      {/* Add New Shelter Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Partner</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid">
                  <div className="form-item">
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      value={newShelterData.name}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter organization name"
                    />
                  </div>
                  
                  <div className="form-item">
                    <label>Type *</label>
                    <select
                      value={newShelterData.type}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="Animal Shelter">Animal Shelter</option>
                      <option value="Rescue Organization">Rescue Organization</option>
                      <option value="Veterinary Clinic">Veterinary Clinic</option>
                      <option value="Foster Network">Foster Network</option>
                    </select>
                  </div>

                  <div className="form-item">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newShelterData.email}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="form-item">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={newShelterData.phone}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-item full-width">
                    <label>Address *</label>
                    <textarea
                      value={newShelterData.address}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter complete address"
                      rows="3"
                    />
                  </div>

                  <div className="form-item">
                    <label>Capacity</label>
                    <input
                      type="number"
                      value={newShelterData.capacity}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="Animal capacity"
                    />
                  </div>

                  <div className="form-item">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={newShelterData.licenseNumber}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="License/Registration number"
                    />
                  </div>

                  <div className="form-item full-width">
                    <label>Website</label>
                    <input
                      type="url"
                      value={newShelterData.website}
                      onChange={(e) => setNewShelterData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={handleAddShelter}
                disabled={!newShelterData.name || !newShelterData.email || !newShelterData.phone}
              >
                ➕ Add Partner
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
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
            <h3>Confirm Status Change</h3>
            <p>
              Are you sure you want to change the status to {actionShelter.action} for shelter {actionShelter.id}?
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

export default ShelterManagement