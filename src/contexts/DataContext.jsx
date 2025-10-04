import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // Adoption Requests Data
  const [adoptionRequests, setAdoptionRequests] = useState([
    {
      id: '#A001',
      applicantName: 'Sarah Johnson',
      animal: 'Buddy (Dog)',
      status: 'pending',
      submittedDate: '2024-10-01',
      contactInfo: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      applicationDetails: {
        experience: 'First-time pet owner',
        livingSpace: 'House with yard',
        otherPets: 'None',
        reason: 'Looking for a loyal companion for my family',
        workSchedule: 'Work from home',
        references: 'Dr. Smith (Veterinarian)'
      }
    },
    {
      id: '#A002',
      applicantName: 'Mike Wilson',
      animal: 'Whiskers (Cat)',
      status: 'approved',
      submittedDate: '2024-09-28',
      contactInfo: 'mike.wilson@email.com',
      phone: '+1 (555) 987-6543',
      applicationDetails: {
        experience: '5+ years with cats',
        livingSpace: 'Apartment',
        otherPets: '1 cat',
        reason: 'Want to give Whiskers a loving home',
        workSchedule: 'Standard 9-5',
        references: 'Previous vet records available'
      }
    },
    {
      id: '#A003',
      applicantName: 'Emma Davis',
      animal: 'Luna (Dog)',
      status: 'pending',
      submittedDate: '2024-10-02',
      contactInfo: 'emma.davis@email.com',
      phone: '+1 (555) 456-7890',
      applicationDetails: {
        experience: '10+ years with dogs',
        livingSpace: 'House with large yard',
        otherPets: 'None currently',
        reason: 'Recently lost my previous dog, ready for a new companion',
        workSchedule: 'Retired',
        references: 'Local animal shelter volunteer'
      }
    },
    {
      id: '#A004',
      applicantName: 'James Rodriguez',
      animal: 'Max (Dog)',
      status: 'rejected',
      submittedDate: '2024-09-25',
      contactInfo: 'james.rodriguez@email.com',
      phone: '+1 (555) 321-0987',
      applicationDetails: {
        experience: 'Limited',
        livingSpace: 'Small apartment',
        otherPets: 'None',
        reason: 'Want a guard dog',
        workSchedule: 'Travel frequently',
        references: 'None provided'
      }
    },
    {
      id: '#A005',
      applicantName: 'Lisa Chen',
      animal: 'Bella (Cat)',
      status: 'pending',
      submittedDate: '2024-10-03',
      contactInfo: 'lisa.chen@email.com',
      phone: '+1 (555) 654-3210',
      applicationDetails: {
        experience: 'Moderate experience with cats',
        livingSpace: 'Condo with balcony',
        otherPets: 'None',
        reason: 'Looking for a calm, indoor companion',
        workSchedule: 'Hybrid work',
        references: 'Neighbor who is a vet tech'
      }
    }
  ])

  // Rescued Animals Data
  const [rescuedAnimals, setRescuedAnimals] = useState([
    {
      id: '#R001',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      gender: 'Male',
      status: 'Available',
      rescueDate: '2024-09-15',
      condition: 'Good',
      location: 'Main Shelter',
      vaccinated: true,
      spayed: true,
      description: 'Friendly and energetic dog, great with kids',
      photos: ['buddy1.jpg', 'buddy2.jpg'],
      medicalHistory: 'Routine checkup completed, all vaccinations up to date'
    },
    {
      id: '#R002',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Siamese',
      age: '2 years',
      gender: 'Female',
      status: 'Adopted',
      rescueDate: '2024-08-20',
      condition: 'Excellent',
      location: 'Foster Home',
      vaccinated: true,
      spayed: true,
      description: 'Calm and affectionate cat, loves to cuddle',
      photos: ['whiskers1.jpg'],
      medicalHistory: 'Minor injury on rescue, fully healed'
    },
    {
      id: '#R003',
      name: 'Luna',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: '1 year',
      gender: 'Female',
      status: 'Medical Care',
      rescueDate: '2024-09-30',
      condition: 'Recovering',
      location: 'Veterinary Clinic',
      vaccinated: true,
      spayed: false,
      description: 'Sweet rabbit, needs special diet',
      photos: ['luna1.jpg'],
      medicalHistory: 'Treated for digestive issues, improving well'
    }
  ])

  // Rescue Reports Data
  const [rescueReports, setRescueReports] = useState([
    {
      id: '#RR001',
      reporterName: 'Jennifer Smith',
      reporterPhone: '+1 (555) 234-5678',
      reporterEmail: 'jennifer.smith@email.com',
      animalType: 'Dog',
      location: '123 Oak Street, Downtown',
      urgency: 'High',
      status: 'Completed',
      reportDate: '2024-09-28',
      description: 'Injured dog found on the roadside, appears to have been hit by a car',
      rescueTeam: 'Team Alpha',
      outcome: 'Animal rescued successfully, treated at clinic'
    },
    {
      id: '#RR002',
      reporterName: 'Mike Johnson',
      reporterPhone: '+1 (555) 345-6789',
      reporterEmail: 'mike.johnson@email.com',
      animalType: 'Cat',
      location: '456 Pine Avenue, Suburbs',
      urgency: 'Medium',
      status: 'In Progress',
      reportDate: '2024-10-01',
      description: 'Stray cat family with kittens, need safe shelter',
      rescueTeam: 'Team Beta',
      outcome: 'Investigation ongoing'
    },
    {
      id: '#RR003',
      reporterName: 'Sarah Davis',
      reporterPhone: '+1 (555) 456-7890',
      reporterEmail: 'sarah.davis@email.com',
      animalType: 'Bird',
      location: '789 Elm Street, Park Area',
      urgency: 'Low',
      status: 'Pending',
      reportDate: '2024-10-02',
      description: 'Injured bird in local park, wing appears damaged',
      rescueTeam: 'Unassigned',
      outcome: 'Awaiting team assignment'
    }
  ])

  // Volunteers Data
  const [volunteers, setVolunteers] = useState([
    {
      id: '#V001',
      name: 'Emily Brown',
      email: 'emily.brown@email.com',
      phone: '+1 (555) 567-8901',
      role: 'Animal Care Volunteer',
      status: 'Active',
      joinDate: '2024-07-15',
      hoursCompleted: 120,
      availability: 'Weekends',
      skills: ['Animal Handling', 'First Aid', 'Cleaning'],
      emergencyContact: 'John Brown - +1 (555) 567-8902'
    },
    {
      id: '#V002',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 678-9012',
      role: 'Transport Volunteer',
      status: 'Active',
      joinDate: '2024-06-20',
      hoursCompleted: 85,
      availability: 'Flexible',
      skills: ['Driving', 'Animal Transport', 'Emergency Response'],
      emergencyContact: 'Lisa Wilson - +1 (555) 678-9013'
    },
    {
      id: '#V003',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 789-0123',
      role: 'Administrative Volunteer',
      status: 'Inactive',
      joinDate: '2024-05-10',
      hoursCompleted: 45,
      availability: 'Weekdays',
      skills: ['Data Entry', 'Phone Support', 'Filing'],
      emergencyContact: 'Carlos Garcia - +1 (555) 789-0124'
    }
  ])

  // SuperAdmin Data - Admin Management
  const [adminUsers, setAdminUsers] = useState([
    {
      id: '#A001',
      name: 'John Administrator',
      email: 'john.admin@animal911.org',
      role: 'Admin',
      status: 'Active',
      createdDate: '2024-01-15',
      lastLogin: '2024-10-03',
      permissions: ['manage_adoptions', 'manage_rescues', 'view_reports'],
      shelterLocation: 'Main Shelter'
    },
    {
      id: '#A002',
      name: 'Lisa Manager',
      email: 'lisa.manager@animal911.org',
      role: 'Admin',
      status: 'Active',
      createdDate: '2024-02-20',
      lastLogin: '2024-10-02',
      permissions: ['manage_adoptions', 'manage_volunteers'],
      shelterLocation: 'North Branch'
    },
    {
      id: '#A003',
      name: 'Tom Supervisor',
      email: 'tom.supervisor@animal911.org',
      role: 'Admin',
      status: 'Suspended',
      createdDate: '2024-03-10',
      lastLogin: '2024-09-25',
      permissions: ['view_reports'],
      shelterLocation: 'South Branch'
    }
  ])

  // Shelter Management Data
  const [shelters, setShelters] = useState([
    {
      id: '#S001',
      name: 'Animal911 Main Shelter',
      type: 'Animal Shelter',
      address: '123 Animal Way, City Center',
      capacity: 150,
      currentOccupancy: 87,
      status: 'Operational',
      manager: 'Dr. Sarah Johnson',
      phone: '+1 (555) 911-0001',
      email: 'main@animal911.org',
      facilities: ['Veterinary Clinic', 'Adoption Center', 'Training Area'],
      operatingHours: '8:00 AM - 6:00 PM'
    },
    {
      id: '#S002',
      name: 'Animal911 North Branch',
      type: 'Animal Shelter',
      address: '456 North Street, Uptown',
      capacity: 75,
      currentOccupancy: 42,
      status: 'Operational',
      manager: 'Mark Wilson',
      phone: '+1 (555) 911-0002',
      email: 'north@animal911.org',
      facilities: ['Basic Care', 'Adoption Center'],
      operatingHours: '9:00 AM - 5:00 PM'
    },
    {
      id: '#S003',
      name: 'Animal911 South Branch',
      type: 'Rescue Organization',
      address: '789 South Avenue, Downtown',
      capacity: 100,
      currentOccupancy: 68,
      status: 'Under Renovation',
      manager: 'Jennifer Davis',
      phone: '+1 (555) 911-0003',
      email: 'south@animal911.org',
      facilities: ['Emergency Care', 'Quarantine Area'],
      operatingHours: 'Limited - Emergency Only'
    }
  ])

  // Audit Logs Data
  const [auditLogs, setAuditLogs] = useState([
    {
      id: '#AL001',
      timestamp: '2024-10-03 14:30:25',
      type: 'User Management',
      user: 'john.admin@animal911.org',
      action: 'Updated Adoption Request',
      details: 'Changed status from pending to approved for request #A001',
      ipAddress: '192.168.1.100',
      severity: 'Info'
    },
    {
      id: '#AL002',
      timestamp: '2024-10-03 12:15:10',
      type: 'Data Access',
      user: 'lisa.manager@animal911.org',
      action: 'Created New Volunteer',
      details: 'Added new volunteer: Emily Brown',
      ipAddress: '192.168.1.101',
      severity: 'Info'
    },
    {
      id: '#AL003',
      timestamp: '2024-10-03 09:45:33',
      type: 'Authentication',
      user: 'system@animal911.org',
      action: 'Failed Login Attempt',
      details: 'Multiple failed login attempts for tom.supervisor@animal911.org',
      ipAddress: '192.168.1.102',
      severity: 'Warning'
    },
    {
      id: '#AL004',
      timestamp: '2024-10-02 16:20:18',
      type: 'System',
      user: 'superadmin@animal911.org',
      action: 'System Settings Modified',
      details: 'Updated security policy settings',
      ipAddress: '192.168.1.99',
      severity: 'Critical'
    }
  ])

  // System Reports Data
  const [systemReports, setSystemReports] = useState([
    {
      id: '#SR001',
      title: 'Monthly Adoption Statistics',
      type: 'Adoption Report',
      generatedDate: '2024-10-01',
      period: 'September 2024',
      status: 'Completed',
      data: {
        totalAdoptions: 45,
        pendingRequests: 12,
        avgProcessingTime: '3.2 days',
        successRate: '89%'
      }
    },
    {
      id: '#SR002',
      title: 'Rescue Operations Summary',
      type: 'Rescue Report',
      generatedDate: '2024-10-01',
      period: 'September 2024',
      status: 'Completed',
      data: {
        totalRescues: 23,
        successfulRescues: 21,
        avgResponseTime: '45 minutes',
        teamEfficiency: '91%'
      }
    },
    {
      id: '#SR003',
      title: 'Volunteer Activity Report',
      type: 'Volunteer Report',
      generatedDate: '2024-10-02',
      period: 'September 2024',
      status: 'In Progress',
      data: {
        activeVolunteers: 28,
        totalHours: 892,
        avgHoursPerVolunteer: '31.9',
        retentionRate: '84%'
      }
    }
  ])

  // Loading states
  const [loading, setLoading] = useState({})
  
  // Popup notifications (temporary notifications)
  const [popupNotifications, setPopupNotifications] = useState([])
  
  // Table notifications (persistent notifications for the Notifications component)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Emergency',
      priority: 'High',
      title: 'Urgent: Injured Dog Found on Highway',
      message: 'A severely injured German Shepherd has been found on Highway 101. Immediate rescue required.',
      status: 'Unread',
      timestamp: '2024-10-04T10:30:00Z',
      details: 'Dog appears to have been hit by a vehicle. Multiple injuries visible. Location: Mile marker 45 on Highway 101 northbound.',
      actionRequired: 'Dispatch rescue team immediately and contact nearest veterinary emergency clinic.'
    },
    {
      id: 2,
      type: 'Adoption',
      priority: 'Medium',
      title: 'New Adoption Application Submitted',
      message: 'Sarah Johnson has submitted an adoption application for Buddy (Golden Retriever).',
      status: 'Unread',
      timestamp: '2024-10-04T09:15:00Z',
      details: 'Application includes references, veterinary history, and home inspection consent.',
      actionRequired: 'Review application and schedule home inspection within 3 business days.'
    },
    {
      id: 3,
      type: 'System',
      priority: 'Low',
      title: 'Weekly Database Backup Completed',
      message: 'Automated weekly database backup has been successfully completed.',
      status: 'Read',
      timestamp: '2024-10-04T02:00:00Z',
      details: 'Backup size: 2.4GB. All data tables verified. Backup stored in secure cloud storage.',
      actionRequired: null
    },
    {
      id: 4,
      type: 'Rescue',
      priority: 'High',
      title: 'Multiple Cats Found in Abandoned Building',
      message: 'Report of 8-12 cats found in an abandoned warehouse. Rescue operation needed.',
      status: 'Unread',
      timestamp: '2024-10-04T08:45:00Z',
      details: 'Anonymous tip received about cats trapped in warehouse at 123 Industrial Blvd. Building appears unsafe.',
      actionRequired: 'Coordinate with building safety inspector and animal rescue team.'
    },
    {
      id: 5,
      type: 'Alert',
      priority: 'Medium',
      title: 'Volunteer Training Session Tomorrow',
      message: 'Reminder: New volunteer orientation scheduled for tomorrow at 2:00 PM.',
      status: 'Read',
      timestamp: '2024-10-03T16:30:00Z',
      details: '15 new volunteers registered. Training covers animal handling, safety protocols, and emergency procedures.',
      actionRequired: 'Ensure training materials are prepared and meeting room is available.'
    },
    {
      id: 6,
      type: 'Update',
      priority: 'Low',
      title: 'Max (German Shepherd) Successfully Adopted',
      message: 'Great news! Max has found his forever home with the Rodriguez family.',
      status: 'Read',
      timestamp: '2024-10-03T14:20:00Z',
      details: 'Adoption process completed successfully. Follow-up check scheduled for next month.',
      actionRequired: null
    },
    {
      id: 7,
      type: 'Emergency',
      priority: 'High',
      title: 'Shelter at Near Capacity',
      message: 'Current shelter occupancy at 95%. Consider temporary foster arrangements.',
      status: 'Unread',
      timestamp: '2024-10-03T11:15:00Z',
      details: 'Dog kennels: 38/40 occupied. Cat areas: 22/25 occupied. Isolation units: 3/5 occupied.',
      actionRequired: 'Contact foster network and consider temporary placement solutions.'
    },
    {
      id: 8,
      type: 'System',
      priority: 'Medium',
      title: 'Software Update Available',
      message: 'New version of the Animal Management System is available for installation.',
      status: 'Unread',
      timestamp: '2024-10-02T20:00:00Z',
      details: 'Version 2.3.1 includes bug fixes, security improvements, and new reporting features.',
      actionRequired: 'Schedule maintenance window for system update installation.'
    },
    {
      id: 9,
      type: 'Adoption',
      priority: 'Low',
      title: 'Adoption Event This Weekend',
      message: 'Reminder: Community adoption event scheduled for Saturday at Central Park.',
      status: 'Read',
      timestamp: '2024-10-02T10:30:00Z',
      details: 'Expected 500+ visitors. 15 animals pre-selected for adoption showcase.',
      actionRequired: null
    },
    {
      id: 10,
      type: 'Alert',
      priority: 'Medium',
      title: 'Medical Supplies Running Low',
      message: 'Several critical medical supplies are below minimum threshold.',
      status: 'Read',
      timestamp: '2024-10-01T15:45:00Z',
      details: 'Low stock: Antibiotics (3 days), Pain medication (5 days), Surgical gloves (2 days).',
      actionRequired: 'Place urgent order with primary veterinary supplier.'
    }
  ])

  // Statistics
  const getStats = () => {
    const total = adoptionRequests.length
    const pending = adoptionRequests.filter(req => req.status === 'pending').length
    const approved = adoptionRequests.filter(req => req.status === 'approved').length
    const rejected = adoptionRequests.filter(req => req.status === 'rejected').length
    
    return { total, pending, approved, rejected }
  }

  // Actions
  const updateAdoptionStatus = async (requestId, newStatus, reason = '') => {
    setLoading(prev => ({ ...prev, [requestId]: true }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAdoptionRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: newStatus,
                statusReason: reason,
                updatedDate: new Date().toISOString().split('T')[0]
              } 
            : req
        )
      )
      
      // Add notification
      const request = adoptionRequests.find(req => req.id === requestId)
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Request ${requestId} has been ${newStatus}`,
        details: `${request?.applicantName}'s application for ${request?.animal}`
      })
      
    } catch (error) {
      addNotification({
        id: Date.now(),
        type: 'error',
        message: `Failed to update request ${requestId}`,
        details: error.message
      })
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: false }))
    }
  }

  // Popup notification functions (for temporary alerts)
  const addPopupNotification = (notification) => {
    setPopupNotifications(prev => [...prev, notification])
    // Auto-removal is handled by NotificationSystem component
  }

  const removePopupNotification = (id) => {
    setPopupNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // Add notification to the table (separate from popup notifications)
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id) => {
    removePopupNotification(id)
  }

  const markNotificationAsRead = (id) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'Read' }
            : notification
        )
      )
      setLoading(prev => ({ ...prev, [id]: false }))
    }, 500)
  }

  const deleteNotification = (id) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      setLoading(prev => ({ ...prev, [id]: false }))
    }, 500)
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

  const bulkUpdateStatus = async (requestIds, newStatus) => {
    setLoading(prev => ({ ...prev, bulk: true }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAdoptionRequests(prev => 
        prev.map(req => 
          requestIds.includes(req.id)
            ? { 
                ...req, 
                status: newStatus,
                updatedDate: new Date().toISOString().split('T')[0]
              }
            : req
        )
      )
      
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `${requestIds.length} requests have been ${newStatus}`,
        details: 'Bulk action completed successfully'
      })
      
    } catch (error) {
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Bulk action failed',
        details: error.message
      })
    } finally {
      setLoading(prev => ({ ...prev, bulk: false }))
    }
  }

  // CRUD Operations for all data types
  
  // Rescued Animals Operations
  const updateAnimalStatus = async (animalId, newStatus) => {
    setLoading(prev => ({ ...prev, [animalId]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRescuedAnimals(prev => 
        prev.map(animal => 
          animal.id === animalId 
            ? { ...animal, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : animal
        )
      )
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Animal ${animalId} status updated to ${newStatus}`,
        details: `Status change completed successfully`
      })
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to update animal status', details: error.message })
    } finally {
      setLoading(prev => ({ ...prev, [animalId]: false }))
    }
  }

  // Rescue Reports Operations
  const updateRescueReportStatus = async (reportId, newStatus, rescueTeam = null) => {
    setLoading(prev => ({ ...prev, [reportId]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRescueReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status: newStatus, 
                rescueTeam: rescueTeam || report.rescueTeam,
                updatedDate: new Date().toISOString().split('T')[0] 
              }
            : report
        )
      )
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Rescue report ${reportId} updated`,
        details: `Status changed to ${newStatus}`
      })
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to update rescue report', details: error.message })
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }))
    }
  }

  // Volunteer Operations
  const updateVolunteerStatus = async (volunteerId, newStatus) => {
    setLoading(prev => ({ ...prev, [volunteerId]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setVolunteers(prev => 
        prev.map(volunteer => 
          volunteer.id === volunteerId 
            ? { ...volunteer, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : volunteer
        )
      )
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Volunteer ${volunteerId} status updated`,
        details: `Status changed to ${newStatus}`
      })
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to update volunteer status', details: error.message })
    } finally {
      setLoading(prev => ({ ...prev, [volunteerId]: false }))
    }
  }

  // Admin Management Operations
  const updateAdminStatus = async (adminId, newStatus) => {
    setLoading(prev => ({ ...prev, [adminId]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAdminUsers(prev => 
        prev.map(admin => 
          admin.id === adminId 
            ? { ...admin, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : admin
        )
      )
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Admin ${adminId} status updated`,
        details: `Status changed to ${newStatus}`
      })
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to update admin status', details: error.message })
    } finally {
      setLoading(prev => ({ ...prev, [adminId]: false }))
    }
  }

  // Shelter Management Operations
  const updateShelterStatus = async (shelterId, newStatus) => {
    setLoading(prev => ({ ...prev, [shelterId]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShelters(prev => 
        prev.map(shelter => 
          shelter.id === shelterId 
            ? { ...shelter, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : shelter
        )
      )
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Shelter ${shelterId} status updated`,
        details: `Status changed to ${newStatus}`
      })
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to update shelter status', details: error.message })
    } finally {
      setLoading(prev => ({ ...prev, [shelterId]: false }))
    }
  }

  // Generate System Report
  const generateSystemReport = async (reportType, period) => {
    const reportId = `#SR${Date.now().toString().slice(-3)}`
    setLoading(prev => ({ ...prev, [reportType]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newReport = {
        id: reportId,
        name: `${reportType} Report`,
        title: `${reportType} Report`,
        type: reportType,
        generatedDate: new Date().toISOString(),
        period: period,
        status: 'Completed',
        summary: `Comprehensive ${reportType} analysis covering ${period}. This report provides detailed insights into system performance and operational metrics.`,
        data: {
          // Mock data based on current state
          totalRecords: Math.floor(Math.random() * 100) + 50,
          processedItems: Math.floor(Math.random() * 50) + 25,
          successRate: `${Math.floor(Math.random() * 20) + 80}%`,
          avgTime: `${Math.floor(Math.random() * 5) + 2}.${Math.floor(Math.random() * 9)} hours`
        },
        metrics: [
          { label: 'Total Records', value: Math.floor(Math.random() * 1000) + 500, change: Math.floor(Math.random() * 20) - 10 },
          { label: 'Success Rate', value: `${Math.floor(Math.random() * 20) + 80}%`, change: Math.floor(Math.random() * 10) - 5 },
          { label: 'Avg Response Time', value: `${Math.floor(Math.random() * 5) + 2}s`, change: Math.floor(Math.random() * 20) - 10 },
          { label: 'Active Users', value: Math.floor(Math.random() * 100) + 50, change: Math.floor(Math.random() * 15) + 5 }
        ],
        analysis: [
          {
            title: 'Performance Overview',
            content: 'System performance has shown steady improvement over the selected period. Key metrics indicate optimal resource utilization and user satisfaction.'
          },
          {
            title: 'Key Findings',
            content: 'Analysis reveals consistent uptime, efficient processing times, and positive user engagement trends across all monitored parameters.'
          }
        ],
        recommendations: [
          {
            title: 'Optimize Database Queries',
            description: 'Consider indexing frequently accessed tables to improve response times.',
            priority: 'medium'
          },
          {
            title: 'Scale Resources',
            description: 'Monitor resource usage and scale accordingly during peak periods.',
            priority: 'high'
          }
        ]
      }
      setSystemReports(prev => [newReport, ...prev])
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Report ${reportId} generated successfully`,
        details: `${reportType} report for ${period} is ready`
      })
      return newReport
    } catch (error) {
      addNotification({ id: Date.now(), type: 'error', message: 'Failed to generate report', details: error.message })
      throw error
    } finally {
      setLoading(prev => ({ ...prev, [reportType]: false }))
    }
  }

  // Enhanced Statistics
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
        totalHours: volunteers.reduce((sum, volunteer) => sum + volunteer.hoursCompleted, 0)
      },
      shelters: {
        total: shelters.length,
        operational: shelters.filter(shelter => shelter.status === 'Operational').length,
        totalCapacity: shelters.reduce((sum, shelter) => sum + shelter.capacity, 0),
        totalOccupancy: shelters.reduce((sum, shelter) => sum + shelter.currentOccupancy, 0)
      }
    }
  }

  // Export Audit Logs Function
  const exportAuditLogs = async (filters = {}) => {
    try {
      setLoading(prev => ({ ...prev, export: true }))
      
      let logsToExport = [...auditLogs]
      
      // Apply filters if provided
      if (filters.type && filters.type !== 'all') {
        logsToExport = logsToExport.filter(log => log.type.toLowerCase() === filters.type.toLowerCase())
      }
      if (filters.severity && filters.severity !== 'all') {
        logsToExport = logsToExport.filter(log => log.severity.toLowerCase() === filters.severity.toLowerCase())
      }
      if (filters.dateRange) {
        const now = new Date()
        const filterDate = new Date()
        
        switch (filters.dateRange) {
          case 'today':
            filterDate.setDate(now.getDate())
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setDate(now.getDate() - 30)
            break
          default:
            break
        }
        
        if (filters.dateRange !== 'all') {
          logsToExport = logsToExport.filter(log => new Date(log.timestamp) >= filterDate)
        }
      }
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create CSV content
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
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      addNotification({
        id: Date.now(),
        type: 'success',
        message: 'Audit logs exported successfully',
        details: `${logsToExport.length} records exported`
      })
      
      return true
    } catch (error) {
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Failed to export audit logs',
        details: error.message
      })
      return false
    } finally {
      setLoading(prev => ({ ...prev, export: false }))
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
    
    // Statistics
    stats: getStats(),
    dashboardStats: getDashboardStats(),
    
    // State
    loading,
    notifications, // Table notifications for Notifications component
    popupNotifications, // Popup notifications for NotificationSystem component
    
    // Adoption Operations
    updateAdoptionStatus,
    bulkUpdateStatus,
    
    // Animal Operations
    updateAnimalStatus,
    
    // Rescue Operations
    updateRescueReportStatus,
    
    // Volunteer Operations
    updateVolunteerStatus,
    
    // Admin Management Operations
    updateAdminStatus,
    
    // Shelter Operations
    updateShelterStatus,
    
    // System Operations
    generateSystemReport,
    
    // Utility Operations
    exportToCSV,
    exportAuditLogs,
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