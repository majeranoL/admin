import React from 'react'

function SuperAdminSettings() {
  return (
    <div className="content-section">
      <h2>System Settings</h2>
      <p>Configure system-wide settings and administrative preferences</p>
      
      <div className="section-content">
        <div className="settings-categories">
          
          <div className="settings-category">
            <div className="category-header">
              <h3>System Configuration</h3>
              <span className="category-icon">⚙️</span>
            </div>
            <div className="category-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Maintenance Mode</h4>
                  <p>Enable system maintenance mode to prevent user access during updates</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Auto Backup</h4>
                  <p>Automatically backup system data at scheduled intervals</p>
                </div>
                <div className="setting-control">
                  <select className="setting-select">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Session Timeout</h4>
                  <p>Set automatic logout time for inactive sessions</p>
                </div>
                <div className="setting-control">
                  <select className="setting-select">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <div className="category-header">
              <h3>Security Settings</h3>
              <span className="category-icon">🔒</span>
            </div>
            <div className="category-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Require 2FA for all admin accounts</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Password Complexity</h4>
                  <p>Enforce strong password requirements</p>
                </div>
                <div className="setting-control">
                  <select className="setting-select">
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Login Attempt Limit</h4>
                  <p>Maximum failed login attempts before account lockout</p>
                </div>
                <div className="setting-control">
                  <select className="setting-select">
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <div className="category-header">
              <h3>Notification Settings</h3>
              <span className="category-icon">🔔</span>
            </div>
            <div className="category-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Emergency Alerts</h4>
                  <p>Send immediate notifications for emergency rescues</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Daily Reports</h4>
                  <p>Receive daily activity summary reports</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>System Alerts</h4>
                  <p>Get notified about system issues and maintenance</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <div className="category-header">
              <h3>Data Management</h3>
              <span className="category-icon">💾</span>
            </div>
            <div className="category-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Data Retention Period</h4>
                  <p>How long to keep deleted records before permanent removal</p>
                </div>
                <div className="setting-control">
                  <select className="setting-select">
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Automatic Cleanup</h4>
                  <p>Automatically remove old logs and temporary files</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="action-btn primary">
            <span className="btn-icon">💾</span>
            Save All Settings
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">↶</span>
            Reset to Defaults
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">📥</span>
            Export Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSettings