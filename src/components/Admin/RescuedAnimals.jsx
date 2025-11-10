import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useRole } from '../../hooks/useRole'
import AuditLogService from '../../services/auditLogService'
import '../../css/Admin/RescuedAnimals.css'

function RescuedAnimals() {
  const { userId, username } = useRole()
  
  const [rescuedAnimals, setRescuedAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [selectedAnimals, setSelectedAnimals] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionAnimal, setActionAnimal] = useState({ id: null, action: null })

  useEffect(() => {
    fetchRescuedAnimals()
  }, [])

  const fetchRescuedAnimals = async () => {
    try {
      setLoading(true)
      const rescuedAnimalsRef = collection(db, 'RescuedAnimals')
      const q = query(rescuedAnimalsRef)
      const querySnapshot = await getDocs(q)
      
      const animals = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.animalType || 'Unknown', // Use animalType as name if no name field
          species: data.animalType || 'Unknown',
          breed: data.breed || 'Unknown',
          age: data.age || 'Unknown',
          gender: data.gender || 'Unknown',
          status: data.status || 'Medical Care',
          medicalStatus: data.medicalStatus || 'Under Evaluation',
          readyForAdoption: data.readyForAdoption || false,
          rescueDate: data.rescueDate?.toDate?.()?.toLocaleDateString() || 'N/A',
          rescueLocation: data.rescueLocation || 'N/A',
          rescuedBy: data.rescuedBy || 'Unknown',
          reporterName: data.reporterName || 'Anonymous',
          reporterPhone: data.reporterPhone || 'N/A',
          emergencyDetails: data.emergencyDetails || 'N/A',
          animalDescription: data.animalDescription || 'N/A',
          imageUrls: data.imageUrls || [],
          rescueReportId: data.rescueReportId || null,
          urgencyLevel: data.urgencyLevel || 'Medium',
          createdAt: data.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
          updatedAt: data.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'
        }
      })
      
      setRescuedAnimals(animals)
    } catch (error) {
      console.error('Error fetching rescued animals:', error)
      showNotificationMessage('Failed to load rescued animals', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotificationMessage = (message, type = 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

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

  // Medical Status badge styling
  const getMedicalStatusBadge = (medicalStatus) => {
    const statusConfig = {
      'Healthy': { class: 'medical-healthy', label: 'Healthy' },
      'Under Treatment': { class: 'medical-treatment', label: 'Under Treatment' },
      'Under Evaluation': { class: 'medical-evaluation', label: 'Under Evaluation' },
      'Critical': { class: 'medical-critical', label: 'Critical' },
      'Recovering': { class: 'medical-recovering', label: 'Recovering' }
    }
    const config = statusConfig[medicalStatus] || { class: 'medical-unknown', label: medicalStatus }
    return <span className={`medical-badge ${config.class}`}>{config.label}</span>
  }

  // Ready for Adoption display
  const getAdoptionReadiness = (ready) => {
    return ready ? (
      <span className="adoption-yes"><i className="bi bi-check-circle-fill"></i> Yes</span>
    ) : (
      <span className="adoption-no"><i className="bi bi-x-circle-fill"></i> No</span>
    )
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
      
      const animalRef = doc(db, 'RescuedAnimals', id)
      await updateDoc(animalRef, {
        status: action,
        updatedAt: serverTimestamp()
      })
      
      const actionText = action === 'Adopted' ? 'marked as adopted' : 
                        action === 'Available' ? 'marked as available' :
                        action === 'Medical Care' ? 'moved to medical care' : 
                        action === 'Quarantine' ? 'moved to quarantine' : 'updated'
      
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
      
      showNotificationMessage(`Animal ${actionText} successfully!`, 'success')
      fetchRescuedAnimals() // Refresh the list
    } catch (error) {
      console.error('Error updating animal status:', error)
      showNotificationMessage('Failed to update animal status. Please try again.', 'error')
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
      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="animals-header">
        <div className="header-left">
          <h2>Rescued Animals</h2>
          <span className="animals-count">
            {filteredAnimals.length} of {rescuedAnimals.length} animals
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchRescuedAnimals} disabled={loading}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
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
              <th>Medical Status</th>
              <th>Ready for Adoption</th>
              <th>Rescue Location</th>
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
                <td className="animal-id">{animal.id.substring(0, 8)}...</td>
                <td className="animal-name">{animal.name}</td>
                <td className="animal-species">{animal.species} - {animal.breed}</td>
                <td className="animal-age">{animal.age}</td>
                <td>{getStatusBadge(animal.status)}</td>
                <td>{getMedicalStatusBadge(animal.medicalStatus)}</td>
                <td className="adoption-ready">{getAdoptionReadiness(animal.readyForAdoption)}</td>
                <td className="animal-location">{animal.rescueLocation}</td>
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
                    <label>Animal Type:</label>
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
                    <label>Medical Status:</label>
                    {getMedicalStatusBadge(selectedAnimal.medicalStatus)}
                  </div>
                  <div className="detail-item">
                    <label>Ready for Adoption:</label>
                    {getAdoptionReadiness(selectedAnimal.readyForAdoption)}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Rescue Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Rescue Date:</label>
                    <span>{selectedAnimal.rescueDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rescue Location:</label>
                    <span>{selectedAnimal.rescueLocation}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rescued By:</label>
                    <span>{selectedAnimal.rescuedBy}</span>
                  </div>
                  <div className="detail-item">
                    <label>Urgency Level:</label>
                    <span className={`urgency-${selectedAnimal.urgencyLevel?.toLowerCase()}`}>
                      {selectedAnimal.urgencyLevel}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Reporter Name:</label>
                    <span>{selectedAnimal.reporterName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Reporter Phone:</label>
                    <span>{selectedAnimal.reporterPhone}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Animal Description:</label>
                    <span>{selectedAnimal.animalDescription}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Emergency Details:</label>
                    <span>{selectedAnimal.emergencyDetails}</span>
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
