import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/SuperAdmin/ShelterManagement.css'

function ShelterManagement() {
  const { shelters, loading, updateShelterStatus } = useData()
  
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
      'Active': { class: 'status-active', label: 'Active' },
      'Pending': { class: 'status-pending', label: 'Pending' },
      'Suspended': { class: 'status-suspended', label: 'Suspended' },
      'Inactive': { class: 'status-inactive', label: 'Inactive' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Animal Shelter': { icon: '🏠', class: 'type-shelter' },
      'Rescue Organization': { icon: '🚑', class: 'type-rescue' },
      'Veterinary Clinic': { icon: '🏥', class: 'type-vet' },
      'Foster Network': { icon: '👨‍👩‍👧‍👦', class: 'type-foster' }
    }
    const config = typeConfig[type] || { icon: '🏢', class: 'type-other' }
    return (
      <span className={`type-badge ${config.class}`}>
        <span className="type-icon">{config.icon}</span>
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
    active: shelters.filter(s => s.status === 'Active').length,
    pending: shelters.filter(s => s.status === 'Pending').length,
    shelterType: shelters.filter(s => s.type === 'Animal Shelter').length,
    rescueType: shelters.filter(s => s.type === 'Rescue Organization').length,
    vetType: shelters.filter(s => s.type === 'Veterinary Clinic').length,
    totalAnimals: shelters.reduce((sum, s) => sum + s.animalsHosted, 0)
  }

  // Unique types for filtering
  const uniqueTypes = [...new Set(shelters.map(s => s.type))]

  return (
    <div className="shelter-management enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2>🏠 Shelter Management</h2>
          <span className="shelters-count">
            {filteredShelters.length} of {shelters.length} partners
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <span className="btn-icon">➕</span>
            Add New Partner
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active Partners</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">🐕</div>
          <div className="stat-content">
            <h3>{stats.totalAnimals}</h3>
            <p>Animals Hosted</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">🏥</div>
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
            <span className="search-icon">🔍</span>
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
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
      <div className="table-container">
        <table className="enhanced-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedShelters.length === filteredShelters.length && filteredShelters.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Partner Details</th>
              <th>Type</th>
              <th>Contact Info</th>
              <th>Capacity</th>
              <th>Animals Hosted</th>
              <th>Status</th>
              <th>License</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShelters.map(shelter => (
              <tr key={shelter.id} className="table-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedShelters.includes(shelter.id)}
                    onChange={() => handleSelectShelter(shelter.id)}
                  />
                </td>
                <td className="shelter-details">
                  <div className="shelter-name">{shelter.name}</div>
                  <div className="shelter-location">{shelter.address}</div>
                  <div className="shelter-contact">Contact: {shelter.manager}</div>
                </td>
                <td>{getTypeBadge(shelter.type)}</td>
                <td className="contact-info">
                  <div>{shelter.email}</div>
                  <div className="phone">{shelter.phone}</div>
                </td>
                <td className="capacity-info">
                  <span className="capacity-number">{shelter.capacity}</span>
                  <span className="capacity-label">animals</span>
                </td>
                <td className="hosted-info">
                  <div className="hosted-number">{shelter.animalsHosted}</div>
                  <div className="hosted-percentage">
                    {((shelter.animalsHosted / shelter.capacity) * 100).toFixed(0)}% full
                  </div>
                </td>
                <td>{getStatusBadge(shelter.status)}</td>
                <td className="license-info">
                  <div className="license-number">{shelter.licenseNumber}</div>
                  <div className="license-expiry">Expires: {shelter.licenseExpiry}</div>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(shelter)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    
                    {shelter.status === 'Pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusAction(shelter.id, 'Active')}
                          disabled={loading[shelter.id]}
                          title="Approve"
                        >
                          {loading[shelter.id] ? '⏳' : '✅'}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusAction(shelter.id, 'Inactive')}
                          disabled={loading[shelter.id]}
                          title="Reject"
                        >
                          {loading[shelter.id] ? '⏳' : '❌'}
                        </button>
                      </>
                    )}
                    
                    {shelter.status === 'Active' && (
                      <button
                        className="btn-suspend"
                        onClick={() => handleStatusAction(shelter.id, 'Suspended')}
                        disabled={loading[shelter.id]}
                        title="Suspend"
                      >
                        {loading[shelter.id] ? '⏳' : '🚫'}
                      </button>
                    )}

                    {shelter.status === 'Suspended' && (
                      <button
                        className="btn-activate"
                        onClick={() => handleStatusAction(shelter.id, 'Active')}
                        disabled={loading[shelter.id]}
                        title="Reactivate"
                      >
                        {loading[shelter.id] ? '⏳' : '✅'}
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
            <div className="no-data-icon">🏠</div>
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
                    <span>{'⭐'.repeat(selectedShelter.rating || 5)} ({selectedShelter.rating || 5}/5)</span>
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