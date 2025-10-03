import React from 'react'

function Notifications() {
  return (
    <div className="content-section">
      <h2>Notifications</h2>
      <div className="notifications-container">
        <div className="notification-item urgent">
          <div className="notification-icon">🚨</div>
          <div className="notification-content">
            <h4>Emergency Rescue Request</h4>
            <p>New emergency report from Manila area requires immediate attention</p>
            <span className="notification-time">5 minutes ago</span>
          </div>
        </div>

        <div className="notification-item info">
          <div className="notification-icon">📋</div>
          <div className="notification-content">
            <h4>New Adoption Request</h4>
            <p>Sarah Johnson submitted an adoption request for Buddy</p>
            <span className="notification-time">1 hour ago</span>
          </div>
        </div>

        <div className="notification-item success">
          <div className="notification-icon">✅</div>
          <div className="notification-content">
            <h4>Rescue Completed</h4>
            <p>Volunteer Alice successfully rescued an injured cat from Quezon City</p>
            <span className="notification-time">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
