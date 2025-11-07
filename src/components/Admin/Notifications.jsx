import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/Admin/Notifications.css'
import '../../css/EnhancedComponents.css'

function Notifications({ onNavigate }) {
  const { notifications, loading, markNotificationAsRead, deleteNotification, showNotification } = useData()
  
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Filter and search logic
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'unread' && !notification.isRead) ||
      (filterStatus === 'read' && notification.isRead)
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (notification.locationAddress && notification.locationAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (notification.animalType && notification.animalType.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesStatus && matchesSearch
  })

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Priority and type styling - Updated for urgency levels
  const getPriorityBadge = (urgency) => {
    const priorityConfig = {
      'Critical': { class: 'priority-critical', label: 'Critical', icon: 'bi bi-exclamation-triangle-fill' },
      'High': { class: 'priority-high', label: 'High', icon: 'bi bi-exclamation-triangle-fill' },
      'Medium': { class: 'priority-medium', label: 'Medium', icon: 'bi bi-exclamation-circle-fill' },
      'Low': { class: 'priority-low', label: 'Low', icon: 'bi bi-info-circle-fill' }
    }
    const config = priorityConfig[urgency] || { class: 'priority-unknown', label: urgency, icon: 'bi bi-question-circle-fill' }
    return <span className={`priority-badge ${config.class}`}><i className={config.icon}></i> {config.label}</span>
  }

  const getTypeIcon = (type) => {
    const typeIcons = {
      'report': 'bi bi-exclamation-triangle-fill',
      'adoption': 'bi bi-house-heart-fill',
      'rescue': 'bi bi-truck',
      'system': 'bi bi-gear-fill',
      'update': 'bi bi-megaphone-fill',
      'alert': 'bi bi-exclamation-circle-fill'
    }
    return typeIcons[type.toLowerCase()] || 'bi bi-clipboard-check'
  }

  const getStatusBadge = (isRead) => {
    return isRead 
      ? <span className="status-badge status-read">Read</span>
      : <span className="status-badge status-unread">Unread</span>
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
    setShowBulkActions(selectedNotifications.length > 0 || !selectedNotifications.includes(notificationId))
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === sortedNotifications.length) {
      setSelectedNotifications([])
      setShowBulkActions(false)
    } else {
      setSelectedNotifications(sortedNotifications.map(notification => notification.id))
      setShowBulkActions(true)
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      try {
        markNotificationAsRead(notification.id)
        showNotification('Notification marked as read', 'success')
      } catch (error) {
        console.error('Error marking notification as read:', error)
        showNotification('Failed to mark notification as read', 'error')
      }
    }
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleNavigateToSource = (notification) => {
    // Navigate based on notification type
    if (notification.type === 'report' || notification.type === 'rescue') {
      // Navigate to Rescue Reports
      if (onNavigate) {
        onNavigate('rescue-reports')
      }
    } else if (notification.type === 'rescuer' || notification.type === 'account') {
      // Navigate to Rescuer Management
      if (onNavigate) {
        onNavigate('rescuers')
      }
    } else if (notification.type === 'adoption') {
      // Navigate to Adoption Requests
      if (onNavigate) {
        onNavigate('adoption')
      }
    }
    setShowModal(false)
  }

  const handleBulkMarkAsRead = () => {
    try {
      const unreadCount = selectedNotifications.filter(id => {
        const notification = notifications.find(n => n.id === id)
        return notification && !notification.isRead
      }).length

      selectedNotifications.forEach(id => {
        const notification = notifications.find(n => n.id === id)
        if (notification && !notification.isRead) {
          markNotificationAsRead(id)
        }
      })

      if (unreadCount > 0) {
        showNotification(`${unreadCount} notifications marked as read`, 'success')
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
      showNotification('Failed to mark notifications as read', 'error')
    }
    setSelectedNotifications([])
    setShowBulkActions(false)
  }

  const handleBulkDelete = () => {
    try {
      const deleteCount = selectedNotifications.length
      selectedNotifications.forEach(id => deleteNotification(id))
      showNotification(`${deleteCount} notifications deleted successfully`, 'success')
    } catch (error) {
      console.error('Error deleting notifications:', error)
      showNotification('Failed to delete notifications', 'error')
    }
    setSelectedNotifications([])
    setShowBulkActions(false)
  }

  const handleMarkSingleAsRead = (notificationId, event) => {
    if (event) event.stopPropagation()
    try {
      markNotificationAsRead(notificationId)
      showNotification('Notification marked as read', 'success')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      showNotification('Failed to mark notification as read', 'error')
    }
  }

  const handleDeleteSingle = (notificationId, event) => {
    if (event) event.stopPropagation()
    try {
      deleteNotification(notificationId)
      showNotification('Notification deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting notification:', error)
      showNotification('Failed to delete notification', 'error')
    }
  }

  // Unique types for filtering
  const uniqueTypes = [...new Set(notifications.map(n => n.type))]

  return (
    <div className="notifications enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-bell-fill"></i> Notifications</h2>
          <span className="notifications-count">
            {sortedNotifications.length} of {notifications.length} notifications
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <i className="btn-icon bi bi-gear"></i>
            Notification Settings
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="component-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search notifications by title or message..."
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
            {uniqueTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bulk-actions">
          <span className="bulk-count">{selectedNotifications.length} selected</span>
          <button 
            className="bulk-btn"
            onClick={handleBulkMarkAsRead}
            disabled={loading.bulk}
          >
            <i className="bi bi-check-circle"></i> Mark as Read
          </button>
          <button 
            className="bulk-btn delete"
            onClick={handleBulkDelete}
            disabled={loading.bulk}
          >
            <i className="bi bi-trash3"></i> Delete Selected
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="notifications-wrapper">
        {/* Horizontal scroll hint */}
        <div className="scroll-hint">
          <span>← Scroll horizontally to see all columns →</span>
        </div>
        <div className="notifications-container">
          <table className="notifications-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === sortedNotifications.length && sortedNotifications.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{width: '120px'}}>Type</th>
                <th style={{width: '100px'}}>Priority</th>
                <th style={{minWidth: '300px'}}>Message</th>
                <th style={{width: '100px'}}>Status</th>
                <th style={{width: '120px'}}>Time</th>
                <th style={{width: '120px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>

              {sortedNotifications.map(notification => (
                <tr 
                  key={notification.id} 
                  className={`${notification.isRead ? 'read' : 'unread'} ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                    />
                  </td>
                  
                  <td className="type-cell">
                    <i className={`type-icon ${getTypeIcon(notification.type)}`}></i>
                    <span className="type-text">{notification.type}</span>
                  </td>
                  
                  <td>
                    {getPriorityBadge(notification.urgencyLevel)}
                  </td>
                  
                  <td className="message-cell" onClick={() => handleNotificationClick(notification)}>
                    <div className="notification-title">{notification.animalType && `${notification.animalType} Report`}</div>
                    <div className="notification-preview">{notification.message}</div>
                    {notification.locationAddress && (
                      <div className="notification-location">
                        <i className="bi bi-geo-alt-fill"></i> {notification.locationAddress}
                      </div>
                    )}
                  </td>
                  
                  <td>
                    {getStatusBadge(notification.isRead)}
                  </td>
                  
                  <td className="time-cell">
                    {formatTimestamp(notification.timestamp)}
                  </td>
                  
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleNotificationClick(notification)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      
                      {!notification.isRead && (
                        <button
                          className="btn-mark-read"
                          onClick={(e) => handleMarkSingleAsRead(notification.id, e)}
                          disabled={loading[notification.id]}
                          title="Mark as Read"
                        >
                          {loading[notification.id] ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-check-circle"></i>}
                        </button>
                      )}
                      
                      <button
                        className="btn-delete"
                        onClick={(e) => handleDeleteSingle(notification.id, e)}
                        disabled={loading[notification.id]}
                        title="Delete"
                      >
                        {loading[notification.id] ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-trash3"></i>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          
          {sortedNotifications.length === 0 && (
            <div className="no-data">
              <i className="no-data-icon bi bi-inbox"></i>
              <h3>No notifications found</h3>
              <p>No notifications match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedNotification && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notification Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <div className="notification-meta">
                  <div className="meta-item">
                    <span className="type-icon large">{getTypeIcon(selectedNotification.type)}</span>
                    <div className="meta-content">
                      <div className="notification-type">{selectedNotification.type}</div>
                      {getPriorityBadge(selectedNotification.urgencyLevel)}
                    </div>
                  </div>
                  <div className="meta-item">
                    {getStatusBadge(selectedNotification.isRead)}
                    <span className="timestamp">{formatTimestamp(selectedNotification.timestamp)}</span>
                  </div>
                </div>

                <div className="notification-content">
                  <h4>{selectedNotification.animalType && `${selectedNotification.animalType} Report`}</h4>
                  <p>{selectedNotification.message}</p>
                  
                  {selectedNotification.locationAddress && (
                    <div className="additional-details">
                      <h5><i className="bi bi-geo-alt-fill"></i> Location:</h5>
                      <p>{selectedNotification.locationAddress}</p>
                    </div>
                  )}
                  
                  {selectedNotification.reportId && (
                    <div className="additional-details">
                      <h5><i className="bi bi-file-text-fill"></i> Report ID:</h5>
                      <p>{selectedNotification.reportId}</p>
                    </div>
                  )}

                  {selectedNotification.status && (
                    <div className="additional-details">
                      <h5><i className="bi bi-clipboard-check-fill"></i> Report Status:</h5>
                      <p>{selectedNotification.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {!selectedNotification.isRead && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    handleMarkSingleAsRead(selectedNotification.id)
                    setShowModal(false)
                  }}
                >
                  <i className="bi bi-check-circle"></i> Mark as Read
                </button>
              )}
              
              {/* Show different navigation buttons based on notification type */}
              {(selectedNotification.type === 'report' || selectedNotification.type === 'rescue') && (
                <button
                  className="btn-primary"
                  onClick={() => handleNavigateToSource(selectedNotification)}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i> Go to Rescue Reports
                </button>
              )}
              
              {(selectedNotification.type === 'rescuer' || selectedNotification.type === 'account') && (
                <button
                  className="btn-primary"
                  onClick={() => handleNavigateToSource(selectedNotification)}
                >
                  <i className="bi bi-person-fill-check"></i> Go to Rescuer Management
                </button>
              )}
              
              {selectedNotification.type === 'adoption' && (
                <button
                  className="btn-primary"
                  onClick={() => handleNavigateToSource(selectedNotification)}
                >
                  <i className="bi bi-house-heart-fill"></i> Go to Adoption Requests
                </button>
              )}
              
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
    </div>
  )
}

export default Notifications
