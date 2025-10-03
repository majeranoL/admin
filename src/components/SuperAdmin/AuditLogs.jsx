import React from 'react'

function AuditLogs() {
  return (
    <div className="content-section">
      <h2>Audit Logs</h2>
      <p>Track system activities, user actions, and security events</p>
      
      <div className="section-content">
        <div className="audit-filters">
          <div className="filter-group">
            <label htmlFor="log-type">Log Type:</label>
            <select id="log-type" className="filter-select">
              <option value="all">All Activities</option>
              <option value="admin">Admin Actions</option>
              <option value="user">User Activities</option>
              <option value="system">System Events</option>
              <option value="security">Security Events</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="date-range">Date Range:</label>
            <select id="date-range" className="filter-select">
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="severity">Severity:</label>
            <select id="severity" className="filter-select">
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <button className="filter-btn">Apply Filters</button>
        </div>

        <div className="audit-stats">
          <div className="audit-stat-card">
            <div className="stat-header">
              <h4>Today's Activities</h4>
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">234</span>
              <span className="stat-description">Total logged events</span>
            </div>
          </div>

          <div className="audit-stat-card warning">
            <div className="stat-header">
              <h4>Security Alerts</h4>
              <span className="stat-icon">⚠️</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">3</span>
              <span className="stat-description">Requiring attention</span>
            </div>
          </div>

          <div className="audit-stat-card success">
            <div className="stat-header">
              <h4>Successful Logins</h4>
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">89</span>
              <span className="stat-description">Since midnight</span>
            </div>
          </div>

          <div className="audit-stat-card error">
            <div className="stat-header">
              <h4>Failed Attempts</h4>
              <span className="stat-icon">❌</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">12</span>
              <span className="stat-description">Login failures</span>
            </div>
          </div>
        </div>

        <div className="audit-log-table">
          <h3>Recent Activity Log</h3>
          <div className="table-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Status</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-10-03 12:45:23</td>
                  <td>admin@animal911.com</td>
                  <td>Login</td>
                  <td>Admin Dashboard</td>
                  <td><span className="status success">Success</span></td>
                  <td>192.168.1.100</td>
                </tr>
                <tr>
                  <td>2025-10-03 12:42:15</td>
                  <td>volunteer@animal911.com</td>
                  <td>Update Report</td>
                  <td>Rescue Report #1234</td>
                  <td><span className="status success">Success</span></td>
                  <td>192.168.1.105</td>
                </tr>
                <tr>
                  <td>2025-10-03 12:40:33</td>
                  <td>unknown</td>
                  <td>Failed Login</td>
                  <td>Admin Portal</td>
                  <td><span className="status error">Failed</span></td>
                  <td>10.0.0.25</td>
                </tr>
                <tr>
                  <td>2025-10-03 12:38:45</td>
                  <td>superadmin@animal911.com</td>
                  <td>Create User</td>
                  <td>User Account</td>
                  <td><span className="status success">Success</span></td>
                  <td>192.168.1.110</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="audit-actions">
          <button className="action-btn primary">
            <span className="btn-icon">📥</span>
            Export Logs
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">🧹</span>
            Archive Old Logs
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">🔍</span>
            Advanced Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditLogs