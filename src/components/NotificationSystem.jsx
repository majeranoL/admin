import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'

function NotificationSystem() {
  const { popupNotifications, removePopupNotification } = useData()
  const [exitingNotifications, setExitingNotifications] = useState(new Set())
  const [notificationTimers, setNotificationTimers] = useState(new Map())

  // Map notification types to CSS classes
  const getNotificationClass = (notification) => {
    const type = notification.type?.toLowerCase() || ''
    if (type === 'success') return 'notification-success'
    if (type === 'error') return 'notification-error'
    if (type === 'warning') return 'notification-warning'
    return 'notification-info'
  }

  // Set up individual timers for each notification
  useEffect(() => {
    popupNotifications.forEach(notification => {
      // Skip if notification already has a timer or is exiting
      if (notificationTimers.has(notification.id) || exitingNotifications.has(notification.id)) {
        return
      }
      
      // Create individual timer for this notification
      const timer = setTimeout(() => {
        handleRemoveNotification(notification.id)
      }, 5000) // 5 seconds for each notification individually
      
      setNotificationTimers(prev => new Map(prev.set(notification.id, timer)))
    })
    
    // Clean up timers for notifications that no longer exist
    const currentIds = new Set(popupNotifications.map(n => n.id))
    setNotificationTimers(prev => {
      const newTimers = new Map()
      prev.forEach((timer, id) => {
        if (currentIds.has(id)) {
          newTimers.set(id, timer)
        } else {
          clearTimeout(timer)
        }
      })
      return newTimers
    })
  }, [popupNotifications, exitingNotifications])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      notificationTimers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  // Handle mouse events to pause/resume auto-dismiss
  const handleMouseEnter = (notificationId) => {
    // You can implement pause logic here if needed
  }

  const handleMouseLeave = (notificationId) => {
    // You can implement resume logic here if needed
  }

  // Handle notification removal with slide-out animation
  const handleRemoveNotification = (notificationId) => {
    // Prevent multiple removal attempts
    if (exitingNotifications.has(notificationId)) return
    
    // Clear the timer for this notification
    const timer = notificationTimers.get(notificationId)
    if (timer) {
      clearTimeout(timer)
      setNotificationTimers(prev => {
        const newTimers = new Map(prev)
        newTimers.delete(notificationId)
        return newTimers
      })
    }
    
    // Start slide-out animation
    setExitingNotifications(prev => new Set([...prev, notificationId]))
    
    // Remove notification after animation completes
    setTimeout(() => {
      removePopupNotification(notificationId)
      setExitingNotifications(prev => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }, 400) // Match CSS animation duration (0.4s)
  }

  if (popupNotifications.length === 0) return null

  return (
    <div className="notification-system">
      {popupNotifications.map(notification => (
        <div 
          key={notification.id}
          className={`notification ${getNotificationClass(notification)} ${
            exitingNotifications.has(notification.id) ? 'notification-exiting' : ''
          }`}
          onMouseEnter={() => handleMouseEnter(notification.id)}
          onMouseLeave={() => handleMouseLeave(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-message">{notification.message}</div>
            {notification.details && (
              <div className="notification-details">{notification.details}</div>
            )}
          </div>
          <button 
            className="notification-close"
            onClick={() => handleRemoveNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem