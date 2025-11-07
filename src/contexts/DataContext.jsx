import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // All data will be populated from Firestore
  const [adoptionRequests, setAdoptionRequests] = useState([])
  const [rescuedAnimals, setRescuedAnimals] = useState([])
  const [rescueReports, setRescueReports] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [shelters, setShelters] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [systemReports, setSystemReports] = useState([])
  
  // Loading states
  const [loading, setLoading] = useState({})
  
  // Notifications
  const [popupNotifications, setPopupNotifications] = useState([])
  const [notifications, setNotifications] = useState([])

  // Fetch notifications from Firestore
  useEffect(() => {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc')
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNotifications(notificationsData)
    }, (error) => {
      console.error('Error fetching notifications:', error)
    })

    return () => unsubscribe()
  }, [])

  // Statistics
  const getStats = () => {
    const total = adoptionRequests.length
    const pending = adoptionRequests.filter(req => req.status === 'pending').length
    const approved = adoptionRequests.filter(req => req.status === 'approved').length
    const rejected = adoptionRequests.filter(req => req.status === 'rejected').length
    
    return { total, pending, approved, rejected }
  }

  const getDashboardStats = () => {
    const adoptionStats = getStats()
    return {
      adoptions: adoptionStats,
      rescuedAnimals: {
        total: rescuedAnimals.length,
        available: rescuedAnimals.filter(animal => animal.status === 'Available').length,
        adopted: rescuedAnimals.filter(animal => animal.status === 'Adopted').length,
        medicalCare: rescuedAnimals.filter(animal => animal.status === 'Medical Care').length
      },
      rescueReports: {
        total: rescueReports.length,
        pending: rescueReports.filter(report => report.status === 'Pending').length,
        inProgress: rescueReports.filter(report => report.status === 'In Progress').length,
        completed: rescueReports.filter(report => report.status === 'Completed').length
      },
      volunteers: {
        total: volunteers.length,
        active: volunteers.filter(volunteer => volunteer.status === 'Active').length,
        inactive: volunteers.filter(volunteer => volunteer.status === 'Inactive').length,
        totalHours: volunteers.reduce((sum, volunteer) => sum + (volunteer.hoursCompleted || 0), 0)
      },
      shelters: {
        total: shelters.length,
        operational: shelters.filter(shelter => shelter.status === 'Operational').length,
        totalCapacity: shelters.reduce((sum, shelter) => sum + (shelter.capacity || 0), 0),
        totalOccupancy: shelters.reduce((sum, shelter) => sum + (shelter.currentOccupancy || 0), 0)
      }
    }
  }

  // Notification functions
  const addPopupNotification = (notification) => {
    setPopupNotifications(prev => [...prev, notification])
  }

  const removePopupNotification = (id) => {
    setPopupNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id) => {
    removePopupNotification(id)
  }

  const markNotificationAsRead = async (id) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      const notificationRef = doc(db, 'notifications', id)
      await updateDoc(notificationRef, {
        isRead: true
      })
      // The onSnapshot listener will automatically update the state
    } catch (error) {
      console.error('Error marking notification as read:', error)
      showNotification('Failed to mark notification as read', 'error')
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const deleteNotification = async (id) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      // For now, we'll just mark it as deleted in Firestore
      // You can implement actual deletion if needed
      const notificationRef = doc(db, 'notifications', id)
      await updateDoc(notificationRef, {
        deleted: true
      })
      // Remove from local state immediately for better UX
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
      showNotification('Failed to delete notification', 'error')
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      type: type,
      title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Information',
      message: message,
      timestamp: new Date().toISOString(),
      details: null
    }
    addPopupNotification(notification)
  }

  // CRUD Operations - To be implemented with Firestore

  // Adoption Operations
  const updateAdoptionStatus = async (requestId, newStatus, reason = '') => {
    setLoading(prev => ({ ...prev, [requestId]: true }))
    try {
      // TODO: Update in Firestore
      setAdoptionRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus, statusReason: reason, updatedDate: new Date().toISOString() }
            : req
        )
      )
      showNotification(`Request ${requestId} has been ${newStatus}`, 'success')
    } catch (error) {
      showNotification(`Failed to update request: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const bulkUpdateStatus = async (requestIds, newStatus) => {
    setLoading(prev => ({ ...prev, bulk: true }))
    try {
      // TODO: Bulk update in Firestore
      setAdoptionRequests(prev => 
        prev.map(req => 
          requestIds.includes(req.id)
            ? { ...req, status: newStatus, updatedDate: new Date().toISOString() }
            : req
        )
      )
      showNotification(`${requestIds.length} requests updated`, 'success')
    } catch (error) {
      showNotification(`Bulk update failed: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, bulk: false }))
    }
  }

  // Animal Operations
  const updateAnimalStatus = async (animalId, newStatus) => {
    setLoading(prev => ({ ...prev, [animalId]: true }))
    try {
      // TODO: Update in Firestore
      setRescuedAnimals(prev => 
        prev.map(animal => 
          animal.id === animalId 
            ? { ...animal, status: newStatus, updatedDate: new Date().toISOString() }
            : animal
        )
      )
      showNotification(`Animal status updated`, 'success')
    } catch (error) {
      showNotification(`Failed to update animal: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [animalId]: false }))
    }
  }

  // Rescue Report Operations
  const updateRescueReportStatus = async (reportId, newStatus, rescueTeam = null) => {
    setLoading(prev => ({ ...prev, [reportId]: true }))
    try {
      // TODO: Update in Firestore
      setRescueReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: newStatus, rescueTeam: rescueTeam || report.rescueTeam, updatedDate: new Date().toISOString() }
            : report
        )
      )
      showNotification(`Rescue report updated`, 'success')
    } catch (error) {
      showNotification(`Failed to update report: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }))
    }
  }

  // Volunteer Operations
  const updateVolunteerStatus = async (volunteerId, newStatus) => {
    setLoading(prev => ({ ...prev, [volunteerId]: true }))
    try {
      // TODO: Update in Firestore
      setVolunteers(prev => 
        prev.map(volunteer => 
          volunteer.id === volunteerId 
            ? { ...volunteer, status: newStatus, updatedDate: new Date().toISOString() }
            : volunteer
        )
      )
      showNotification(`Volunteer status updated`, 'success')
    } catch (error) {
      showNotification(`Failed to update volunteer: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [volunteerId]: false }))
    }
  }

  // Admin Management Operations
  const updateAdminStatus = async (adminId, newStatus) => {
    setLoading(prev => ({ ...prev, [adminId]: true }))
    try {
      // TODO: Update in Firestore
      setAdminUsers(prev => 
        prev.map(admin => 
          admin.id === adminId 
            ? { ...admin, status: newStatus, updatedDate: new Date().toISOString() }
            : admin
        )
      )
      showNotification(`Admin status updated`, 'success')
    } catch (error) {
      showNotification(`Failed to update admin: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [adminId]: false }))
    }
  }

  // Shelter Operations
  const updateShelterStatus = async (shelterId, newStatus) => {
    setLoading(prev => ({ ...prev, [shelterId]: true }))
    try {
      // TODO: Update in Firestore
      setShelters(prev => 
        prev.map(shelter => 
          shelter.id === shelterId 
            ? { ...shelter, status: newStatus, updatedDate: new Date().toISOString() }
            : shelter
        )
      )
      showNotification(`Shelter status updated`, 'success')
    } catch (error) {
      showNotification(`Failed to update shelter: ${error.message}`, 'error')
    } finally {
      setLoading(prev => ({ ...prev, [shelterId]: false }))
    }
  }

  // Export Functions
  const exportToCSV = () => {
    const headers = ['Request ID', 'Applicant Name', 'Animal', 'Status', 'Submitted Date', 'Contact Info']
    const csvData = adoptionRequests.map(req => [
      req.id,
      req.applicantName,
      req.animal,
      req.status,
      req.submittedDate,
      req.contactInfo
    ])
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `adoption_requests_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportAuditLogs = async (filters = {}) => {
    try {
      setLoading(prev => ({ ...prev, export: true }))
      let logsToExport = [...auditLogs]
      
      // Apply filters
      if (filters.type && filters.type !== 'all') {
        logsToExport = logsToExport.filter(log => log.type.toLowerCase() === filters.type.toLowerCase())
      }
      if (filters.severity && filters.severity !== 'all') {
        logsToExport = logsToExport.filter(log => log.severity.toLowerCase() === filters.severity.toLowerCase())
      }
      
      const headers = ['ID', 'Type', 'User', 'Action', 'Severity', 'Timestamp', 'Details']
      const csvContent = [
        headers.join(','),
        ...logsToExport.map(log => [
          log.id,
          log.type,
          log.user,
          log.action,
          log.severity,
          log.timestamp,
          `"${log.details.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      showNotification('Audit logs exported successfully', 'success')
      return true
    } catch (error) {
      showNotification(`Export failed: ${error.message}`, 'error')
      return false
    } finally {
      setLoading(prev => ({ ...prev, export: false }))
    }
  }

  // System Report Generation
  const generateSystemReport = async (reportType, period) => {
    const reportId = `#SR${Date.now().toString().slice(-3)}`
    setLoading(prev => ({ ...prev, [reportType]: true }))
    try {
      // TODO: Generate report from Firestore data
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newReport = {
        id: reportId,
        title: `${reportType} Report`,
        type: reportType,
        generatedDate: new Date().toISOString(),
        period: period,
        status: 'Completed'
      }
      setSystemReports(prev => [newReport, ...prev])
      showNotification(`Report ${reportId} generated successfully`, 'success')
      return newReport
    } catch (error) {
      showNotification(`Failed to generate report: ${error.message}`, 'error')
      throw error
    } finally {
      setLoading(prev => ({ ...prev, [reportType]: false }))
    }
  }

  const value = {
    // Data
    adoptionRequests,
    rescuedAnimals,
    rescueReports,
    volunteers,
    adminUsers,
    shelters,
    auditLogs,
    systemReports,
    
    // Setters (for Firestore integration)
    setAdoptionRequests,
    setRescuedAnimals,
    setRescueReports,
    setVolunteers,
    setAdminUsers,
    setShelters,
    setAuditLogs,
    setSystemReports,
    
    // Statistics
    stats: getStats(),
    dashboardStats: getDashboardStats(),
    
    // State
    loading,
    notifications,
    popupNotifications,
    
    // Operations
    updateAdoptionStatus,
    bulkUpdateStatus,
    updateAnimalStatus,
    updateRescueReportStatus,
    updateVolunteerStatus,
    updateAdminStatus,
    updateShelterStatus,
    generateSystemReport,
    exportToCSV,
    exportAuditLogs,
    
    // Notifications
    removeNotification,
    addNotification,
    addPopupNotification,
    removePopupNotification,
    markNotificationAsRead,
    deleteNotification,
    showNotification
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
