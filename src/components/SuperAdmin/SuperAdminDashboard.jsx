import React, { useState, useEffect } from 'react'
import { useData } from '../../contexts/DataContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import '../../css/SuperAdmin/SuperAdminDashboard.css'
import '../../css/EnhancedComponents.css'

function SuperAdminDashboard({ onNavigate }) {
  const { adminUsers, shelters } = useData()
  const [totalAdmins, setTotalAdmins] = useState(0)
  const [totalShelters, setTotalShelters] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRescuers, setTotalRescuers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Count admins from 'admins' collection
        const adminsQuery = query(collection(db, 'admins'))
        const adminsSnapshot = await getDocs(adminsQuery)
        setTotalAdmins(adminsSnapshot.size)

        // Count shelters from 'shelters' collection
        const sheltersQuery = query(collection(db, 'shelters'))
        const sheltersSnapshot = await getDocs(sheltersQuery)
        setTotalShelters(sheltersSnapshot.size)

        // Count users from 'users' collection
        const usersQuery = query(collection(db, 'users'))
        const usersSnapshot = await getDocs(usersQuery)
        setTotalUsers(usersSnapshot.size)

        // Count rescuers from 'rescuers' collection
        const rescuersQuery = query(collection(db, 'rescuers'))
        const rescuersSnapshot = await getDocs(rescuersQuery)
        setTotalRescuers(rescuersSnapshot.size)
      } catch (error) {
        console.error('Error fetching counts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className="super-admin-dashboard">
      <h2><i className="bi bi-shield-check me-2"></i>Super Admin Dashboard</h2>
      <p>Super Admin specific features will be implemented here.</p>
      
      <div className="dashboard-cards-grid">
        <div 
          className="dashboard-card clickable" 
          onClick={() => onNavigate && onNavigate('account-management')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Total Admins</h3>
            <span className="card-icon"><i className="bi bi-person-circle"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : totalAdmins}</p>
            <p className="card-description">Active admin accounts</p>
          </div>
        </div>

        <div 
          className="dashboard-card clickable" 
          onClick={() => onNavigate && onNavigate('shelter-management')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Partner Shelters</h3>
            <span className="card-icon"><i className="bi bi-house-heart"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : totalShelters}</p>
            <p className="card-description">Registered shelters</p>
          </div>
        </div>

        <div 
          className="dashboard-card clickable" 
          onClick={() => onNavigate && onNavigate('account-management')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Total Users</h3>
            <span className="card-icon"><i className="bi bi-people"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : totalUsers}</p>
            <p className="card-description">Registered users</p>
          </div>
        </div>

        <div 
          className="dashboard-card clickable" 
          onClick={() => onNavigate && onNavigate('account-management')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-header">
            <h3>Total Rescuers</h3>
            <span className="card-icon"><i className="bi bi-heart-pulse"></i></span>
          </div>
          <div className="card-content">
            <p className="card-number">{loading ? '...' : totalRescuers}</p>
            <p className="card-description">Active rescuers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
