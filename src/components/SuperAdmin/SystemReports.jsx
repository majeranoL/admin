import React from 'react'

function SystemReports() {
  return (
    <div className="content-section">
      <h2>System Reports</h2>
      <p>Comprehensive system analytics, performance metrics, and operational reports</p>
      
      <div className="section-content">
        <div className="report-categories">
          <div className="category-card">
            <div className="category-header">
              <h3>Performance Reports</h3>
              <span className="category-icon">📈</span>
            </div>
            <div className="category-content">
              <ul className="report-list">
                <li>System Response Times</li>
                <li>Database Performance</li>
                <li>API Usage Statistics</li>
                <li>Error Rate Analysis</li>
              </ul>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-header">
              <h3>User Activity Reports</h3>
              <span className="category-icon">👥</span>
            </div>
            <div className="category-content">
              <ul className="report-list">
                <li>Daily Active Users</li>
                <li>Registration Statistics</li>
                <li>Feature Usage Analytics</li>
                <li>User Retention Metrics</li>
              </ul>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-header">
              <h3>Rescue Operations</h3>
              <span className="category-icon">🚑</span>
            </div>
            <div className="category-content">
              <ul className="report-list">
                <li>Rescue Success Rate</li>
                <li>Response Time Analysis</li>
                <li>Geographic Distribution</li>
                <li>Volunteer Efficiency</li>
              </ul>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-header">
              <h3>Financial Reports</h3>
              <span className="category-icon">💰</span>
            </div>
            <div className="category-content">
              <ul className="report-list">
                <li>Donation Tracking</li>
                <li>Operational Costs</li>
                <li>Partner Contributions</li>
                <li>Budget Allocation</li>
              </ul>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          <h3>Quick Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">2,341</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">847</span>
              <span className="stat-label">Rescues This Month</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">99.2%</span>
              <span className="stat-label">System Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">156</span>
              <span className="stat-label">Active Volunteers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemReports