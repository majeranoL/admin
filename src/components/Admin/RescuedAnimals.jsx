import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useRole } from '../../hooks/useRole'
import AuditLogService from '../../services/auditLogService'
import '../../css/Admin/RescuedAnimals.css'

function RescuedAnimals() {
  const { rescuedAnimals, loading, updateAnimalStatus, showNotification } = useData()
  const { userId, username } = useRole()
  
  const [selectedAnimals, setSelectedAnimals] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionAnimal, setActionAnimal] = useState({ id: null, action: null })

  // Filter and search logic
  const filteredAnimals = rescuedAnimals.filter(animal => {
    const matchesStatus = filterStatus === 'all' || animal.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Available': { class: 'status-available', label: 'Available' },
      'Adopted': { class: 'status-adopted', label: 'Adopted' },
      'Medical Care': { class: 'status-medical', label: 'Medical Care' },
      'Quarantine': { class: 'status-quarantine', label: 'Quarantine' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const handleSelectAnimal = (animalId) => {
    setSelectedAnimals(prev => 
      prev.includes(animalId) 
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAnimals.length === filteredAnimals.length) {
      setSelectedAnimals([])
    } else {
      setSelectedAnimals(filteredAnimals.map(animal => animal.id))
    }
  }

  const handleStatusAction = (animalId, action) => {
    setActionAnimal({ id: animalId, action })
    setShowConfirm(true)
  }

  const confirmAction = async () => {
    const { id, action } = actionAnimal
    try {
      // Get animal details before update for logging
      const animal = rescuedAnimals.find(a => a.id === id)
      
      updateAnimalStatus(id, action)
      const actionText = action === 'adopted' ? 'marked as adopted' : 
                        action === 'available' ? 'marked as available' :
                        action === 'medical_care' ? 'moved to medical care' : 'updated'
      
      // Log the animal status change as data access
      await AuditLogService.logDataAccess(
        `Animal ${actionText}`,
        userId,
        username || 'admin@animal911.com',
        'admin',
        `Animal: ${animal?.name || 'Unknown'}`,
        {
          animalId: id,
          animalName: animal?.name,
          species: animal?.species,
          breed: animal?.breed,
          oldStatus: animal?.status,
          newStatus: action,
          rescueDate: animal?.rescueDate
        }
      )
      
      showNotification(`Animal ${actionText} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating animal status:', error)
      showNotification('Failed to update animal status. Please try again.', 'error')
    }
    setShowConfirm(false)
    setActionAnimal({ id: null, action: null })
  }

  const handleViewDetails = (animal) => {
    setSelectedAnimal(animal)
    setShowModal(true)
  }

  return (
    <div className="rescued-animals">
      {/* Header */}
      <div className="animals-header">
        <div className="header-left">
          <h2>Rescued Animals</h2>
          <span className="animals-count">
            {filteredAnimals.length} of {rescuedAnimals.length} animals
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-add">Add New Animal</button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="animals-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, species, or breed..."
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
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="medical care">Medical Care</option>
            <option value="quarantine">Quarantine</option>
          </select>
        </div>
      </div>

      {/* Animals Table */}
      <div className="animals-table-container">
        <table className="animals-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedAnimals.length === filteredAnimals.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Species/Breed</th>
              <th>Age</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className="animal-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAnimals.includes(animal.id)}
                    onChange={() => handleSelectAnimal(animal.id)}
                  />
                </td>
                <td className="animal-id">{animal.id}</td>
                <td className="animal-name">{animal.name}</td>
                <td className="animal-species">{animal.species} - {animal.breed}</td>
                <td className="animal-age">{animal.age}</td>
                <td>{getStatusBadge(animal.status)}</td>
                <td className="animal-location">{animal.location}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(animal)}
                    >
                      View
                    </button>
                    
                    {animal.status === 'Available' && (
                      <button
                        className="btn-adopt"
                        onClick={() => handleStatusAction(animal.id, 'Adopted')}
                        disabled={loading[animal.id]}
                      >
                        {loading[animal.id] ? '...' : 'Mark Adopted'}
                      </button>
                    )}
                    
                    {animal.status === 'Medical Care' && (
                      <button
                        className="btn-available"
                        onClick={() => handleStatusAction(animal.id, 'Available')}
                        disabled={loading[animal.id]}
                      >
                        {loading[animal.id] ? '...' : 'Mark Available'}
                      </button>
                    )}

                    <button
                      className="btn-medical"
                      onClick={() => handleStatusAction(animal.id, 'Medical Care')}
                      disabled={loading[animal.id]}
                    >
                      {loading[animal.id] ? '...' : 'Medical Care'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAnimals.length === 0 && (
          <div className="no-animals">
            <p>No animals found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedAnimal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Animal Details - {selectedAnimal.name}</h3>
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
                    <label>Name:</label>
                    <span>{selectedAnimal.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Species:</label>
                    <span>{selectedAnimal.species}</span>
                  </div>
                  <div className="detail-item">
                    <label>Breed:</label>
                    <span>{selectedAnimal.breed}</span>
                  </div>
                  <div className="detail-item">
                    <label>Age:</label>
                    <span>{selectedAnimal.age}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender:</label>
                    <span>{selectedAnimal.gender}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedAnimal.status)}
                  </div>
                  <div className="detail-item">
                    <label>Rescue Date:</label>
                    <span>{selectedAnimal.rescueDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedAnimal.location}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Health Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Condition:</label>
                    <span>{selectedAnimal.condition}</span>
                  </div>
                  <div className="detail-item">
                    <label>Vaccinated:</label>
                    <span>{selectedAnimal.vaccinated ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Spayed/Neutered:</label>
                    <span>{selectedAnimal.spayed ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Medical History:</label>
                    <span>{selectedAnimal.medicalHistory}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Description:</label>
                    <span>{selectedAnimal.description}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => console.log('Edit animal:', selectedAnimal.id)}
              >
                Edit Information
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
              Are you sure you want to change the status to {actionAnimal.action} for animal {actionAnimal.id}?
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

export default RescuedAnimals
