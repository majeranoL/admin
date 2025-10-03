import React from 'react'

function Settings() {
  return (
    <div className="content-section">
      <h2>Settings</h2>
      <div className="settings-container">
        <div className="settings-section">
          <h3>Account Settings</h3>
          <div className="setting-item">
            <label>Username</label>
            <input type="text" value={localStorage.getItem('adminUsername')} readOnly />
          </div>
          <div className="setting-item">
            <label>Role</label>
            <input type="text" value={localStorage.getItem('userRole')} readOnly />
          </div>
        </div>

        <div className="settings-section">
          <h3>System Settings</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Enable email notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Auto-assign volunteers to reports
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Send daily summary reports
            </label>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save">Save Changes</button>
          <button className="btn-reset">Reset to Default</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
