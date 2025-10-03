import React, { useState, useEffect } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/Admin/Settings.css'

function Settings() {
  const { showNotification } = useData()
  
  // Account Settings
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem('adminUsername') || 'admin',
    email: localStorage.getItem('adminEmail') || 'admin@animal911.com',
    fullName: localStorage.getItem('adminFullName') || 'Admin User',
    phone: localStorage.getItem('adminPhone') || '+63912345678',
    role: localStorage.getItem('userRole') || 'Admin'
  })

  // System Preferences
  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: JSON.parse(localStorage.getItem('emailNotifications') || 'true'),
    pushNotifications: JSON.parse(localStorage.getItem('pushNotifications') || 'true'),
    autoAssignVolunteers: JSON.parse(localStorage.getItem('autoAssignVolunteers') || 'false'),
    dailySummaryReports: JSON.parse(localStorage.getItem('dailySummaryReports') || 'true'),
    emergencyAlerts: JSON.parse(localStorage.getItem('emergencyAlerts') || 'true'),
    systemMaintenance: JSON.parse(localStorage.getItem('systemMaintenance') || 'false')
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: JSON.parse(localStorage.getItem('twoFactorAuth') || 'false'),
    sessionTimeout: localStorage.getItem('sessionTimeout') || '30',
    passwordExpiry: localStorage.getItem('passwordExpiry') || '90',
    loginAttempts: localStorage.getItem('loginAttempts') || '5'
  })

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en',
    timezone: localStorage.getItem('timezone') || 'Asia/Manila',
    dateFormat: localStorage.getItem('dateFormat') || 'MM/DD/YYYY',
    itemsPerPage: localStorage.getItem('itemsPerPage') || '20'
  })

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSystemSettingChange = (setting) => {
    setSystemSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] }
      localStorage.setItem(setting, JSON.stringify(newSettings[setting]))
      return newSettings
    })
  }

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => {
      const newSettings = { ...prev, [field]: value }
      localStorage.setItem(field, value)
      return newSettings
    })
  }

  const handleDisplayChange = (field, value) => {
    setDisplaySettings(prev => {
      const newSettings = { ...prev, [field]: value }
      localStorage.setItem(field, value)
      return newSettings
    })
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Save to localStorage (in real app, this would be an API call)
      Object.entries(profileData).forEach(([key, value]) => {
        localStorage.setItem(`admin${key.charAt(0).toUpperCase() + key.slice(1)}`, value)
      })
      
      showNotification('Profile updated successfully!', 'success')
    } catch (error) {
      showNotification('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match', 'error')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      showNotification('Password must be at least 8 characters', 'error')
      return
    }

    setLoading(true)
    try {
      // Simulate password change (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
      showNotification('Password changed successfully!', 'success')
    } catch (error) {
      showNotification('Failed to change password', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset system settings
      const defaultSystemSettings = {
        emailNotifications: true,
        pushNotifications: true,
        autoAssignVolunteers: false,
        dailySummaryReports: true,
        emergencyAlerts: true,
        systemMaintenance: false
      }
      
      setSystemSettings(defaultSystemSettings)
      Object.entries(defaultSystemSettings).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })

      // Reset display settings
      const defaultDisplaySettings = {
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Manila',
        dateFormat: 'MM/DD/YYYY',
        itemsPerPage: '20'
      }
      
      setDisplaySettings(defaultDisplaySettings)
      Object.entries(defaultDisplaySettings).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      showNotification('Settings reset to defaults', 'success')
    }
  }

  const tabNavigation = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'system', label: '⚙️ System', icon: '⚙️' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'display', label: '🎨 Display', icon: '🎨' }
  ]

  return (
    <div className="settings enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2>⚙️ Settings</h2>
          <span className="settings-subtitle">Manage your account and system preferences</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={handleResetToDefaults}
          >
            <span className="btn-icon">🔄</span>
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabNavigation.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>👤 Profile Information</h3>
              <p>Manage your personal information and account details</p>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="setting-item">
                <label>Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="setting-item">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="setting-item">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="setting-item">
                <label>Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? '⏳ Saving...' : '💾 Save Profile'}
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => setShowChangePassword(true)}
              >
                🔑 Change Password
              </button>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>⚙️ System Preferences</h3>
              <p>Configure system behavior and notifications</p>
            </div>

            <div className="settings-list">
              <div className="setting-group">
                <h4>📧 Notification Settings</h4>
                
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Email Notifications</label>
                    <span>Receive notifications via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.emailNotifications}
                      onChange={() => handleSystemSettingChange('emailNotifications')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Push Notifications</label>
                    <span>Receive browser push notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.pushNotifications}
                      onChange={() => handleSystemSettingChange('pushNotifications')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Emergency Alerts</label>
                    <span>High priority emergency notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.emergencyAlerts}
                      onChange={() => handleSystemSettingChange('emergencyAlerts')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>🔄 Automation Settings</h4>
                
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Auto-assign Volunteers</label>
                    <span>Automatically assign available volunteers to rescue reports</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoAssignVolunteers}
                      onChange={() => handleSystemSettingChange('autoAssignVolunteers')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Daily Summary Reports</label>
                    <span>Generate and send daily activity summaries</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.dailySummaryReports}
                      onChange={() => handleSystemSettingChange('dailySummaryReports')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>System Maintenance Mode</label>
                    <span>Enable maintenance mode for system updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.systemMaintenance}
                      onChange={() => handleSystemSettingChange('systemMaintenance')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>🔒 Security Settings</h3>
              <p>Manage security preferences and access controls</p>
            </div>

            <div className="settings-grid">
              <div className="setting-toggle">
                <div className="toggle-info">
                  <label>Two-Factor Authentication</label>
                  <span>Add extra security to your account</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Password Expiry (days)</label>
                <select
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Max Login Attempts</label>
                <select
                  value={securitySettings.loginAttempts}
                  onChange={(e) => handleSecurityChange('loginAttempts', e.target.value)}
                >
                  <option value="3">3 attempts</option>
                  <option value="5">5 attempts</option>
                  <option value="10">10 attempts</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>🎨 Display Preferences</h3>
              <p>Customize the appearance and behavior of the interface</p>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Theme</label>
                <select
                  value={displaySettings.theme}
                  onChange={(e) => handleDisplayChange('theme', e.target.value)}
                >
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="auto">🔄 Auto (System)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Language</label>
                <select
                  value={displaySettings.language}
                  onChange={(e) => handleDisplayChange('language', e.target.value)}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="fil">🇵🇭 Filipino</option>
                  <option value="es">🇪🇸 Spanish</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Timezone</label>
                <select
                  value={displaySettings.timezone}
                  onChange={(e) => handleDisplayChange('timezone', e.target.value)}
                >
                  <option value="Asia/Manila">Philippines (GMT+8)</option>
                  <option value="Asia/Tokyo">Japan (GMT+9)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Date Format</label>
                <select
                  value={displaySettings.dateFormat}
                  onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Items Per Page</label>
                <select
                  value={displaySettings.itemsPerPage}
                  onChange={(e) => handleDisplayChange('itemsPerPage', e.target.value)}
                >
                  <option value="10">10 items</option>
                  <option value="20">20 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Change Password</h3>
              <button 
                className="modal-close"
                onClick={() => setShowChangePassword(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="password-form">
                <div className="setting-item">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="setting-item">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="setting-item">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="password-requirements">
                  <h5>Password Requirements:</h5>
                  <ul>
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={handleChangePassword}
                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {loading ? '⏳ Changing...' : '🔑 Change Password'}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowChangePassword(false)}
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

export default Settings
