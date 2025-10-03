import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/Admin/Notifications.css'

function Notifications() {
  const { notifications, loading, markNotificationAsRead, deleteNotification } = useData()
  
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
    const matchesStatus = filterStatus === 'all' || notification.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Priority and type styling
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'High': { class: 'priority-high', label: '🚨 High', icon: '🚨' },
      'Medium': { class: 'priority-medium', label: '⚠️ Medium', icon: '⚠️' },
      'Low': { class: 'priority-low', label: '📋 Low', icon: '📋' }
    }
    const config = priorityConfig[priority] || { class: 'priority-unknown', label: priority, icon: '❓' }
    return <span className={`priority-badge ${config.class}`}>{config.label}</span>
  }

  const getTypeIcon = (type) => {
    const typeIcons = {
      'Emergency': '🚨',
      'Adoption': '🏠',
      'Rescue': '🚑',
      'System': '⚙️',
      'Update': '📢',
      'Alert': '⚠️'
    }
    return typeIcons[type] || '📋'
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Unread': { class: 'status-unread', label: 'Unread' },
      'Read': { class: 'status-read', label: 'Read' },
      'Archived': { class: 'status-archived', label: 'Archived' }
    }
    const config = statusConfig[status] || { class: 'status-unknown', label: status }
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
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
    if (notification.status === 'Unread') {
      markNotificationAsRead(notification.id)
    }
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => {
      const notification = notifications.find(n => n.id === id)
      if (notification && notification.status === 'Unread') {
        markNotificationAsRead(id)
      }
    })
    setSelectedNotifications([])
    setShowBulkActions(false)
  }

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => deleteNotification(id))
    setSelectedNotifications([])
    setShowBulkActions(false)
  }

  // Unique types for filtering
  const uniqueTypes = [...new Set(notifications.map(n => n.type))]

  return (
    <div className="notifications enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2>📢 Notifications</h2>
          <span className="notifications-count">
            {sortedNotifications.length} of {notifications.length} notifications
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <span className="btn-icon">⚙️</span>
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
            📖 Mark as Read
          </button>
          <button 
            className="bulk-btn delete"
            onClick={handleBulkDelete}
            disabled={loading.bulk}
          >
            🗑️ Delete Selected
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="notifications-container">
        <div className="table-header">
          <div className="header-cell">
            <input
              type="checkbox"
              checked={selectedNotifications.length === sortedNotifications.length && sortedNotifications.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <div className="header-cell">Type</div>
          <div className="header-cell">Priority</div>
          <div className="header-cell">Message</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Time</div>
          <div className="header-cell">Actions</div>
        </div>

        {sortedNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-row ${notification.status.toLowerCase()} ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}
          >
            <div className="row-cell">
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
              />
            </div>
            
            <div className="row-cell type-cell">
              <span className="type-icon">{getTypeIcon(notification.type)}</span>
              <span className="type-text">{notification.type}</span>
            </div>
            
            <div className="row-cell">
              {getPriorityBadge(notification.priority)}
            </div>
            
            <div className="row-cell message-cell" onClick={() => handleNotificationClick(notification)}>
              <div className="notification-title">{notification.title}</div>
              <div className="notification-preview">{notification.message}</div>
            </div>
            
            <div className="row-cell">
              {getStatusBadge(notification.status)}
            </div>
            
            <div className="row-cell time-cell">
              {formatTimestamp(notification.timestamp)}
            </div>
            
            <div className="row-cell actions-cell">
              <div className="action-buttons">
                <button
                  className="btn-view"
                  onClick={() => handleNotificationClick(notification)}
                  title="View Details"
                >
                  👁️
                </button>
                
                {notification.status === 'Unread' && (
                  <button
                    className="btn-mark-read"
                    onClick={(e) => {
                      e.stopPropagation()
                      markNotificationAsRead(notification.id)
                    }}
                    disabled={loading[notification.id]}
                    title="Mark as Read"
                  >
                    {loading[notification.id] ? '⏳' : '📖'}
                  </button>
                )}
                
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                  disabled={loading[notification.id]}
                  title="Delete"
                >
                  {loading[notification.id] ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedNotifications.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">📭</div>
            <h3>No notifications found</h3>
            <p>No notifications match your current filters.</p>
          </div>
        )}
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
                      {getPriorityBadge(selectedNotification.priority)}
                    </div>
                  </div>
                  <div className="meta-item">
                    {getStatusBadge(selectedNotification.status)}
                    <span className="timestamp">{formatTimestamp(selectedNotification.timestamp)}</span>
                  </div>
                </div>

                <div className="notification-content">
                  <h4>{selectedNotification.title}</h4>
                  <p>{selectedNotification.message}</p>
                  
                  {selectedNotification.details && (
                    <div className="additional-details">
                      <h5>Additional Information:</h5>
                      <p>{selectedNotification.details}</p>
                    </div>
                  )}
                  
                  {selectedNotification.actionRequired && (
                    <div className="action-required">
                      <h5>⚠️ Action Required:</h5>
                      <p>{selectedNotification.actionRequired}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedNotification.status === 'Unread' && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    markNotificationAsRead(selectedNotification.id)
                    setShowModal(false)
                  }}
                >
                  Mark as Read
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
