import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useData } from '../../contexts/DataContext'
import { useRole } from '../../hooks/useRole'
import AuditLogService from '../../services/auditLogService'
import '../../css/SuperAdmin/AdminManagement.css'
import '../../css/EnhancedComponents.css'

function AccountManagement() {
  const { showNotification } = useData()
  const { userId, username } = useRole() // Get current admin info
  
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState({})
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionAccount, setActionAccount] = useState({ id: null, collection: null, action: null })

  // Fetch all accounts from Firestore
  useEffect(() => {
    fetchAllAccounts()
  }, [])

  const fetchAllAccounts = async () => {
    setIsLoadingData(true)
    try {
      const allAccounts = []

      // Fetch Users
      const usersQuery = query(collection(db, 'users'))
      const usersSnapshot = await getDocs(usersQuery)
      usersSnapshot.docs.forEach(doc => {
        allAccounts.push({
          id: doc.id,
          ...doc.data(),
          accountType: 'User',
          collection: 'users',
          name: doc.data().name || doc.data().displayName || 'N/A',
          email: doc.data().email || 'N/A',
          status: doc.data().status || 'Active',
          createdAt: doc.data().createdAt || 'N/A',
          location: doc.data().location || doc.data().address || 'N/A'
        })
      })

      // Fetch Shelters
      const sheltersQuery = query(collection(db, 'shelters'))
      const sheltersSnapshot = await getDocs(sheltersQuery)
      sheltersSnapshot.docs.forEach(doc => {
        allAccounts.push({
          id: doc.id,
          ...doc.data(),
          accountType: 'Shelter',
          collection: 'shelters',
          name: doc.data().shelterName || 'N/A',
          email: doc.data().email || 'N/A',
          status: doc.data().verified ? 'Active' : 'Pending',
          createdAt: doc.data().registeredAt || doc.data().createdAt || 'N/A',
          location: doc.data().address || 'N/A',
          contactPerson: doc.data().contactPerson || 'N/A',
          phone: doc.data().contactNumber || 'N/A'
        })
      })

      // Fetch Rescuers
      const rescuersQuery = query(collection(db, 'rescuers'))
      const rescuersSnapshot = await getDocs(rescuersQuery)
      rescuersSnapshot.docs.forEach(doc => {
        allAccounts.push({
          id: doc.id,
          ...doc.data(),
          accountType: 'Rescuer',
          collection: 'rescuers',
          name: doc.data().name || doc.data().displayName || 'N/A',
          email: doc.data().email || 'N/A',
          status: doc.data().status || 'Active',
          createdAt: doc.data().createdAt || 'N/A',
          location: doc.data().location || doc.data().address || 'N/A',
          phone: doc.data().phone || doc.data().contactNumber || 'N/A'
        })
      })

      setAccounts(allAccounts)
    } catch (error) {
      console.error('Error fetching accounts:', error)
      showNotification('Failed to load accounts', 'error')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const matchesType = filterType === 'all' || account.accountType.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === 'all' || account.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  // Update account status
  const updateAccountStatus = async (accountId, collectionName, newStatus) => {
    setLoading(prev => ({ ...prev, [accountId]: true }))
    try {
      // Get account details before update for logging
      const account = accounts.find(a => a.id === accountId)
      const oldStatus = account?.status || 'Unknown'
      
      // Check if trying to reactivate a deactivated account
      if (newStatus === 'Active' && oldStatus === 'Inactive' && account?.deactivatedAt) {
        const deactivatedDate = new Date(account.deactivatedAt)
        const now = new Date()
        const daysSinceDeactivation = Math.floor((now - deactivatedDate) / (1000 * 60 * 60 * 24))
        const cooldownDays = 30
        
        if (daysSinceDeactivation < cooldownDays) {
          const daysRemaining = cooldownDays - daysSinceDeactivation
          showNotification(
            `Cannot reactivate: Account is in ${cooldownDays}-day deactivation cooldown. ${daysRemaining} days remaining. Use "Force Activate" if necessary.`,
            'error'
          )
          return false
        }
      }
      
      const accountRef = doc(db, collectionName, accountId)
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
      
      // If deactivating, store the deactivation timestamp
      if (newStatus === 'Inactive') {
        updateData.deactivatedAt = new Date().toISOString()
      }
      
      // If reactivating from Inactive, clear the deactivation timestamp
      if (newStatus === 'Active' && oldStatus === 'Inactive') {
        updateData.deactivatedAt = null
      }
      
      // For shelters, also update verified field
      if (collectionName === 'shelters') {
        updateData.verified = newStatus === 'Active'
      }
      
      await updateDoc(accountRef, updateData)
      
      // Log the action
      await AuditLogService.logUserManagement(
        `Changed ${collectionName.slice(0, -1)} status`,
        userId,
        username || 'superadmin@animal911.com',
        'superadmin',
        accountId,
        account?.email || 'Unknown',
        {
          accountType: collectionName,
          oldStatus,
          newStatus,
          accountName: account?.name || account?.shelterName || 'Unknown',
          deactivatedAt: newStatus === 'Inactive' ? updateData.deactivatedAt : null
        }
      )
      
      // Update local state
      setAccounts(prev => 
        prev.map(account => 
          account.id === accountId 
            ? { ...account, status: newStatus, deactivatedAt: updateData.deactivatedAt }
            : account
        )
      )
      
      showNotification('Account status updated successfully', 'success')
      return true
    } catch (error) {
      console.error('Error updating account:', error)
      showNotification(`Failed to update account: ${error.message}`, 'error')
      return false
    } finally {
      setLoading(prev => ({ ...prev, [accountId]: false }))
    }
  }

  // Force activate account (bypasses cooldown)
  const forceActivateAccount = async (accountId, collectionName) => {
    setLoading(prev => ({ ...prev, [accountId]: true }))
    try {
      const account = accounts.find(a => a.id === accountId)
      const accountRef = doc(db, collectionName, accountId)
      
      await updateDoc(accountRef, {
        status: 'Active',
        deactivatedAt: null,
        updatedAt: new Date().toISOString(),
        forceActivatedBy: userId,
        forceActivatedAt: new Date().toISOString()
      })
      
      // Log the force activation
      await AuditLogService.logUserManagement(
        `Force activated ${collectionName.slice(0, -1)} (bypassed cooldown)`,
        userId,
        username || 'superadmin@animal911.com',
        'superadmin',
        accountId,
        account?.email || 'Unknown',
        {
          accountType: collectionName,
          oldStatus: account?.status,
          newStatus: 'Active',
          bypassedCooldown: true,
          severity: 'warning'
        }
      )
      
      setAccounts(prev => 
        prev.map(acc => 
          acc.id === accountId 
            ? { ...acc, status: 'Active', deactivatedAt: null }
            : acc
        )
      )
      
      showNotification('Account force activated successfully', 'success')
      return true
    } catch (error) {
      console.error('Error force activating account:', error)
      showNotification(`Failed to force activate: ${error.message}`, 'error')
      return false
    } finally {
      setLoading(prev => ({ ...prev, [accountId]: false }))
    }
  }

  // Delete account
  const deleteAccount = async (accountId, collectionName) => {
    setLoading(prev => ({ ...prev, [accountId]: true }))
    try {
      // Get account details before deletion for logging
      const account = accounts.find(a => a.id === accountId)
      
      await deleteDoc(doc(db, collectionName, accountId))
      
      // Log the deletion with warning severity
      await AuditLogService.logUserManagement(
        `Deleted ${collectionName.slice(0, -1)}`,
        userId,
        username || 'superadmin@animal911.com',
        'superadmin',
        accountId,
        account?.email || 'Unknown',
        {
          accountType: collectionName,
          accountName: account?.name || account?.shelterName || 'Unknown',
          deletedStatus: account?.status || 'Unknown',
          severity: 'warning'
        }
      )
      
      // Update local state
      setAccounts(prev => prev.filter(account => account.id !== accountId))
      
      showNotification('Account deleted successfully', 'success')
      return true
    } catch (error) {
      console.error('Error deleting account:', error)
      showNotification(`Failed to delete account: ${error.message}`, 'error')
      return false
    } finally {
      setLoading(prev => ({ ...prev, [accountId]: false }))
    }
  }

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { class: 'status-active', label: 'Active' },
      'Inactive': { class: 'status-inactive', label: 'Inactive' },
      'Suspended': { class: 'status-suspended', label: 'Suspended' },
      'Pending': { class: 'status-pending', label: 'Pending' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      'User': { icon: 'bi-person', class: 'type-user', color: '#3b82f6' },
      'Shelter': { icon: 'bi-house-heart', class: 'type-shelter', color: '#22c55e' },
      'Rescuer': { icon: 'bi-heart-pulse', class: 'type-rescuer', color: '#f59e0b' }
    }
    const config = typeConfig[type] || { icon: 'bi-person', class: 'type-other', color: '#6b7280' }
    return (
      <span className={`type-badge ${config.class}`} style={{ borderColor: config.color, color: config.color }}>
        <i className={`bi ${config.icon}`}></i> {type}
      </span>
    )
  }

  const handleSelectAccount = (accountId) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([])
    } else {
      setSelectedAccounts(filteredAccounts.map(account => account.id))
    }
  }

  const handleStatusAction = (accountId, collection, action) => {
    setActionAccount({ id: accountId, collection, action })
    setShowConfirm(true)
  }

  const confirmAction = async () => {
    const { id, collection, action } = actionAccount
    
    if (action === 'Delete') {
      await deleteAccount(id, collection)
    } else {
      await updateAccountStatus(id, collection, action)
    }
    
    setShowConfirm(false)
    setActionAccount({ id: null, collection: null, action: null })
  }

  const handleViewDetails = (account) => {
    setSelectedAccount(account)
    setShowModal(true)
  }

  // Statistics
  const stats = {
    totalAccounts: accounts.length,
    users: accounts.filter(a => a.accountType === 'User').length,
    shelters: accounts.filter(a => a.accountType === 'Shelter').length,
    rescuers: accounts.filter(a => a.accountType === 'Rescuer').length,
    active: accounts.filter(a => a.status === 'Active').length,
    pending: accounts.filter(a => a.status === 'Pending').length
  }

  return (
    <div className="admin-management enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-person-gear me-2"></i>Account Management</h2>
          <span className="admins-count">
            {filteredAccounts.length} of {accounts.length} accounts
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"><i className="bi bi-people"></i></div>
          <div className="stat-content">
            <h3>{stats.totalAccounts}</h3>
            <p>Total Accounts</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon"><i className="bi bi-person"></i></div>
          <div className="stat-content">
            <h3>{stats.users}</h3>
            <p>Users</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon"><i className="bi bi-house-heart"></i></div>
          <div className="stat-content">
            <h3>{stats.shelters}</h3>
            <p>Shelters</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon"><i className="bi bi-heart-pulse"></i></div>
          <div className="stat-content">
            <h3>{stats.rescuers}</h3>
            <p>Rescuers</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="component-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon"><i className="bi bi-search"></i></span>
            <input
              type="text"
              placeholder="Search by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-section">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="user">Users</option>
            <option value="shelter">Shelters</option>
            <option value="rescuer">Rescuers</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="table-wrapper">
        {isLoadingData ? (
          <div className="no-data">
            <div className="no-data-icon"><i className="bi bi-hourglass"></i></div>
            <h3>Loading accounts...</h3>
            <p>Please wait while we fetch the data from the database.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Account Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map(account => (
                <tr key={`${account.collection}-${account.id}`}>
                  <td className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleSelectAccount(account.id)}
                    />
                  </td>
                  <td>{getTypeBadge(account.accountType)}</td>
                  <td className="account-name">{account.name}</td>
                  <td className="account-email">{account.email}</td>
                  <td className="account-location">{account.location}</td>
                  <td>
                    {getStatusBadge(account.status)}
                    {account.status === 'Inactive' && account.deactivatedAt && (
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                        🕐 Deactivated {Math.floor((new Date() - new Date(account.deactivatedAt)) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    )}
                  </td>
                  <td className="created-date">
                    {account.createdAt !== 'N/A' ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="col-actions">
                    <div className="actions-wrapper">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewDetails(account)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      
                      {account.status === 'Active' && (
                        <>
                          <button
                            className="action-btn suspend-btn"
                            onClick={() => handleStatusAction(account.id, account.collection, 'Suspended')}
                            disabled={loading[account.id]}
                            title="Suspend Account (Temporary) - Can be reactivated immediately"
                          >
                            {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-pause-circle"></i>}
                          </button>
                          <button
                            className="action-btn deactivate-btn"
                            onClick={() => handleStatusAction(account.id, account.collection, 'Inactive')}
                            disabled={loading[account.id]}
                            title="Deactivate Account (Permanent) - Requires 30-day cooldown to reactivate"
                          >
                            {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-x-circle"></i>}
                          </button>
                        </>
                      )}
                      
                      {(account.status === 'Suspended' || account.status === 'Pending') && (
                        <button
                          className="action-btn activate-btn"
                          onClick={() => handleStatusAction(account.id, account.collection, 'Active')}
                          disabled={loading[account.id]}
                          title="Activate Account"
                        >
                          {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-check-circle"></i>}
                        </button>
                      )}
                      
                      {account.status === 'Inactive' && (
                        <>
                          <button
                            className="action-btn activate-btn"
                            onClick={() => handleStatusAction(account.id, account.collection, 'Active')}
                            disabled={loading[account.id]}
                            title={
                              account.deactivatedAt 
                                ? `Deactivated ${Math.floor((new Date() - new Date(account.deactivatedAt)) / (1000 * 60 * 60 * 24))} days ago. Requires 30-day cooldown.`
                                : 'Activate Account'
                            }
                          >
                            {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-check-circle"></i>}
                          </button>
                          <button
                            className="action-btn warning-btn"
                            onClick={() => forceActivateAccount(account.id, account.collection)}
                            disabled={loading[account.id]}
                            title="Force Activate (Bypass 30-day cooldown)"
                          >
                            {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-lightning-charge"></i>}
                          </button>
                        </>
                      )}

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleStatusAction(account.id, account.collection, 'Delete')}
                        disabled={loading[account.id]}
                        title="Delete"
                      >
                        {loading[account.id] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-trash"></i>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoadingData && filteredAccounts.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon"><i className="bi bi-person-x"></i></div>
            <h3>No accounts found</h3>
            <p>No accounts match your current filters.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedAccount && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Account Details - {selectedAccount.name}</h3>
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
                    <label>Account Type:</label>
                    {getTypeBadge(selectedAccount.accountType)}
                  </div>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedAccount.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedAccount.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedAccount.status)}
                  </div>
                  {selectedAccount.phone && (
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedAccount.phone}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedAccount.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created At:</label>
                    <span>{selectedAccount.createdAt !== 'N/A' ? new Date(selectedAccount.createdAt).toLocaleString() : 'N/A'}</span>
                  </div>
                  {selectedAccount.contactPerson && (
                    <div className="detail-item">
                      <label>Contact Person:</label>
                      <span>{selectedAccount.contactPerson}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
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
              Are you sure you want to {actionAccount.action.toLowerCase()} this account?
              {actionAccount.action === 'Delete' && <strong> This action cannot be undone.</strong>}
            </p>
            <div className="confirm-actions">
              <button 
                className={`btn-confirm ${actionAccount.action === 'Delete' ? 'btn-danger' : ''}`}
                onClick={confirmAction}
              >
                Yes, {actionAccount.action}
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

export default AccountManagement
