import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useData } from '../../contexts/DataContext'

function AdminDashboard({ userRole, onNavigate }) {
  const { 
    showNotification,
    volunteers,
    adoptionRequests
  } = useData()

  const [pendingReports, setPendingReports] = useState(0)
  const [ongoingRescues, setOngoingRescues] = useState(0)
  const [pendingRescuers, setPendingRescuers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      // Fetch reports stats
      const reportsQuery = query(collection(db, 'Reports'))
      const reportsSnapshot = await getDocs(reportsQuery)
      
      let pending = 0
      let ongoing = 0
      
      reportsSnapshot.docs.forEach(doc => {
        const data = doc.data()
        const status = data.status
        
        // Count "Submitted" as "Pending"
        if (status === 'Submitted' || status === 'Pending') {
          pending++
        } else if (status === 'In Progress') {
          ongoing++
        }
      })
      
      setPendingReports(pending)
      setOngoingRescues(ongoing)

      // Fetch pending rescuers count
      const rescuersQuery = query(
        collection(db, 'rescuers'),
        where('status', '==', 'Pending')
      )
      const rescuersSnapshot = await getDocs(rescuersQuery)
      setPendingRescuers(rescuersSnapshot.size)
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      showNotification('Failed to load dashboard statistics', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Calculate real statistics
  const availableVolunteers = volunteers.filter(volunteer => 
    volunteer.status === 'Active' || volunteer.status === 'active'
  ).length

  const pendingAdoptions = adoptionRequests.filter(request => 
    request.status === 'pending' || request.status === 'Pending'
  ).length
  
  return (
    <div className="content-section">
      <h2>Admin Dashboard</h2>
      <div className="role-indicator">
        <span className={`role-badge ${userRole}`}>
          {userRole === "superadmin" ? "Super Admin" : "Admin"}
        </span>
      </div>
      
      <div className="dashboard-cards-grid">
        <div 
          className="dashboard-card pending clickable" 
          onClick={() => onNavigate && onNavigate('rescue-reports')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Pending Reports</h3>
            <i className="card-icon bi bi-clipboard-check"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : pendingReports}</p>
            <p className="card-description">Reports awaiting review</p>
          </div>
        </div>

        <div 
          className="dashboard-card ongoing clickable" 
          onClick={() => onNavigate && onNavigate('rescue-reports')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Ongoing Rescues</h3>
            <i className="card-icon bi bi-truck"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : ongoingRescues}</p>
            <p className="card-description">Active rescue operations</p>
          </div>
        </div>

        <div 
          className="dashboard-card volunteers clickable" 
          onClick={() => onNavigate && onNavigate('rescuers')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Pending Rescuers</h3>
            <i className="card-icon bi bi-people-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : pendingRescuers}</p>
            <p className="card-description">Awaiting approval</p>
          </div>
        </div>

        <div 
          className="dashboard-card adoption clickable" 
          onClick={() => onNavigate && onNavigate('adoption-requests')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Pending Adoption Requests</h3>
            <i className="card-icon bi bi-heart-fill"></i>
          </div>
          <div className="card-content">
            <p className="card-number">{pendingAdoptions}</p>
            <p className="card-description">Applications to review</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
