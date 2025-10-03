import React from 'react'
import { useData } from '../contexts/DataContext'

function NotificationSystem() {
  const { notifications, removeNotification } = useData()

  if (notifications.length === 0) return null

  return (
    <div className="notification-system">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <div className="notification-message">{notification.message}</div>
            {notification.details && (
              <div className="notification-details">{notification.details}</div>
            )}
          </div>
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem