import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useTheme } from '../../contexts/ThemeContext'
import '../../css/SuperAdmin/SuperAdminSettings.css'
import '../../css/EnhancedComponents.css'

function SuperAdminSettings() {
  const { showNotification } = useData()
  const { theme, toggleTheme, isDark } = useTheme()
  
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: JSON.parse(localStorage.getItem('maintenanceMode') || 'false'),
    autoBackup: localStorage.getItem('autoBackup') || 'daily',
    sessionTimeout: localStorage.getItem('sessionTimeout') || '60',
    maxLoginAttempts: localStorage.getItem('maxLoginAttempts') || '5',
    passwordPolicy: {
      minLength: parseInt(localStorage.getItem('passwordMinLength') || '8'),
      requireSpecialChar: JSON.parse(localStorage.getItem('passwordRequireSpecial') || 'true'),
      requireNumbers: JSON.parse(localStorage.getItem('passwordRequireNumbers') || 'true'),
      requireUppercase: JSON.parse(localStorage.getItem('passwordRequireUppercase') || 'true')
    }
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: JSON.parse(localStorage.getItem('emailAlerts') || 'true'),
    smsAlerts: JSON.parse(localStorage.getItem('smsAlerts') || 'false'),
    emergencyNotifications: JSON.parse(localStorage.getItem('emergencyNotifications') || 'true'),
    systemAlerts: JSON.parse(localStorage.getItem('systemAlerts') || 'true')
  })

  const [apiSettings, setApiSettings] = useState({
    rateLimit: localStorage.getItem('apiRateLimit') || '1000',
    timeout: localStorage.getItem('apiTimeout') || '30',
    enableCors: JSON.parse(localStorage.getItem('enableCors') || 'true'),
    requireAuth: JSON.parse(localStorage.getItem('apiRequireAuth') || 'true')
  })

  const [backupSettings, setBackupSettings] = useState({
    frequency: localStorage.getItem('backupFrequency') || 'daily',
    retention: localStorage.getItem('backupRetention') || '30',
    includeMedia: JSON.parse(localStorage.getItem('backupIncludeMedia') || 'true'),
    compression: JSON.parse(localStorage.getItem('backupCompression') || 'true')
  })

  const [activeTab, setActiveTab] = useState('system')
  const [loading, setLoading] = useState(false)

  const handleSystemSettingChange = (setting, value) => {
    setSystemSettings(prev => {
      const newSettings = { ...prev, [setting]: value }
      localStorage.setItem(setting, typeof value === 'boolean' ? JSON.stringify(value) : value)
      return newSettings
    })
  }

  const handlePasswordPolicyChange = (setting, value) => {
    setSystemSettings(prev => {
      const newSettings = {
        ...prev,
        passwordPolicy: { ...prev.passwordPolicy, [setting]: value }
      }
      localStorage.setItem(`password${setting.charAt(0).toUpperCase() + setting.slice(1)}`, 
        typeof value === 'boolean' ? JSON.stringify(value) : value.toString())
      return newSettings
    })
  }

  const handleNotificationChange = (setting, value) => {
    setNotifications(prev => {
      const newSettings = { ...prev, [setting]: value }
      localStorage.setItem(setting, JSON.stringify(value))
      return newSettings
    })
  }

  const handleApiSettingChange = (setting, value) => {
    setApiSettings(prev => {
      const newSettings = { ...prev, [setting]: value }
      localStorage.setItem(`api${setting.charAt(0).toUpperCase() + setting.slice(1)}`, 
        typeof value === 'boolean' ? JSON.stringify(value) : value)
      return newSettings
    })
  }

  const handleBackupSettingChange = (setting, value) => {
    setBackupSettings(prev => {
      const newSettings = { ...prev, [setting]: value }
      localStorage.setItem(`backup${setting.charAt(0).toUpperCase() + setting.slice(1)}`, 
        typeof value === 'boolean' ? JSON.stringify(value) : value)
      return newSettings
    })
  }

  const handleSaveAllSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showNotification('System settings saved successfully!', 'success')
    } catch (error) {
      showNotification('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTestBackup = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showNotification('Test backup completed successfully!', 'success')
    } catch (error) {
      showNotification('Backup test failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      // Reset all settings to defaults
      const defaultSystemSettings = {
        maintenanceMode: false,
        autoBackup: 'daily',
        sessionTimeout: '60',
        maxLoginAttempts: '5',
        passwordPolicy: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumbers: true,
          requireUppercase: true
        }
      }

      const defaultNotifications = {
        emailAlerts: true,
        smsAlerts: false,
        emergencyNotifications: true,
        systemAlerts: true
      }

      const defaultApiSettings = {
        rateLimit: '1000',
        timeout: '30',
        enableCors: true,
        requireAuth: true
      }

      const defaultBackupSettings = {
        frequency: 'daily',
        retention: '30',
        includeMedia: true,
        compression: true
      }

      setSystemSettings(defaultSystemSettings)
      setNotifications(defaultNotifications)
      setApiSettings(defaultApiSettings)
      setBackupSettings(defaultBackupSettings)

      // Clear localStorage
      const settingsKeys = [
        'maintenanceMode', 'autoBackup', 'sessionTimeout', 'maxLoginAttempts',
        'passwordMinLength', 'passwordRequireSpecial', 'passwordRequireNumbers', 'passwordRequireUppercase',
        'emailAlerts', 'smsAlerts', 'emergencyNotifications', 'systemAlerts',
        'apiRateLimit', 'apiTimeout', 'enableCors', 'apiRequireAuth',
        'backupFrequency', 'backupRetention', 'backupIncludeMedia', 'backupCompression'
      ]
      
      settingsKeys.forEach(key => localStorage.removeItem(key))

      showNotification('All settings reset to defaults', 'success')
    }
  }

  const tabNavigation = [
    { id: 'system', label: 'System', icon: 'bi-gear' },
    { id: 'security', label: 'Security', icon: 'bi-shield-lock' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'api', label: 'API', icon: 'bi-plug' },
    { id: 'backup', label: 'Backup', icon: 'bi-database' }
  ]

  return (
    <div className="super-admin-settings enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-gear me-2"></i>System Settings</h2>
          <span className="settings-subtitle">Configure system-wide settings and administrative preferences</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={handleResetToDefaults}
          >
            <span className="btn-icon"><i className="bi bi-arrow-counterclockwise"></i></span>
            Reset to Defaults
          </button>
          <button 
            className="btn-primary"
            onClick={handleSaveAllSettings}
            disabled={loading}
          >
            <span className="btn-icon"><i className="bi bi-save"></i></span>
            {loading ? 'Saving...' : 'Save All Settings'}
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
            <span className="tab-icon"><i className={`bi ${tab.icon}`}></i></span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* System Configuration */}
        {activeTab === 'system' && (
          <div className="settings-section">
            <div className="section-header">
              <h3><i className="bi bi-gear me-2"></i>System Configuration</h3>
              <p>Core system settings and operational parameters</p>
            </div>

            <div className="settings-grid">
              <div className="setting-card">
                <div className="setting-header">
                  <h4><i className="bi bi-cone-striped me-2"></i>Maintenance Mode</h4>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <p>Enable maintenance mode to prevent user access during system updates</p>
                {systemSettings.maintenanceMode && (
                  <div className="maintenance-warning">
                    <span className="warning-icon"><i className="bi bi-exclamation-triangle"></i></span>
                    System is currently in maintenance mode
                  </div>
                )}
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h4><i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'} me-2`}></i>Theme Mode</h4>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={isDark}
                      onChange={toggleTheme}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <p>Switch between light and dark theme modes for better visibility and comfort</p>
                <div className="theme-preview">
                  <div className="theme-info">
                    <span className="current-theme">
                      <i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'} me-1`}></i>
                      Current: {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <span className="theme-description">
                      {isDark 
                        ? 'Dark theme reduces eye strain in low-light environments' 
                        : 'Light theme provides better readability in bright environments'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h4><i className="bi bi-database me-2"></i>Auto Backup Frequency</h4>
                </div>
                <p>Automatically backup system data at scheduled intervals</p>
                <select
                  value={systemSettings.autoBackup}
                  onChange={(e) => handleSystemSettingChange('autoBackup', e.target.value)}
                  className="setting-select"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h4><i className="bi bi-clock me-2"></i>Session Timeout</h4>
                </div>
                <p>Set automatic logout time for inactive sessions (minutes)</p>
                <select
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => handleSystemSettingChange('sessionTimeout', e.target.value)}
                  className="setting-select"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h4><i className="bi bi-shield-lock me-2"></i>Max Login Attempts</h4>
                </div>
                <p>Maximum failed login attempts before account lockout</p>
                <select
                  value={systemSettings.maxLoginAttempts}
                  onChange={(e) => handleSystemSettingChange('maxLoginAttempts', e.target.value)}
                  className="setting-select"
                >
                  <option value="3">3 attempts</option>
                  <option value="5">5 attempts</option>
                  <option value="10">10 attempts</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h3><i className="bi bi-shield-lock me-2"></i>Security Settings</h3>
              <p>Configure security policies and access controls</p>
            </div>

            <div className="setting-group">
              <h4><i className="bi bi-key me-2"></i>Password Policy</h4>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Minimum Length:</label>
                  <select
                    value={systemSettings.passwordPolicy.minLength}
                    onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                    className="setting-select"
                  >
                    <option value="6">6 characters</option>
                    <option value="8">8 characters</option>
                    <option value="12">12 characters</option>
                    <option value="16">16 characters</option>
                  </select>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Require Special Characters</label>
                    <span>Passwords must contain special characters (!@#$%^&*)</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.passwordPolicy.requireSpecialChar}
                      onChange={(e) => handlePasswordPolicyChange('requireSpecialChar', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Require Numbers</label>
                    <span>Passwords must contain at least one number</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.passwordPolicy.requireNumbers}
                      onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Require Uppercase Letters</label>
                    <span>Passwords must contain uppercase letters</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.passwordPolicy.requireUppercase}
                      onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-header">
              <h3><i className="bi bi-bell me-2"></i>Notification Settings</h3>
              <p>Configure system-wide notification preferences</p>
            </div>

            <div className="settings-list">
              <div className="setting-toggle">
                <div className="toggle-info">
                  <label><i className="bi bi-envelope me-2"></i>Email Alerts</label>
                  <span>Send email notifications for system events</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label><i className="bi bi-phone me-2"></i>SMS Alerts</label>
                  <span>Send SMS notifications for critical events</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    onChange={(e) => handleNotificationChange('smsAlerts', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label><i className="bi bi-exclamation-triangle me-2"></i>Emergency Notifications</label>
                  <span>High-priority notifications for emergency situations</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.emergencyNotifications}
                    onChange={(e) => handleNotificationChange('emergencyNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label><i className="bi bi-gear me-2"></i>System Alerts</label>
                  <span>Notifications for system performance and maintenance</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.systemAlerts}
                    onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>🔌 API Configuration</h3>
              <p>Configure API access and security settings</p>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Rate Limit (requests per hour):</label>
                <input
                  type="number"
                  value={apiSettings.rateLimit}
                  onChange={(e) => handleApiSettingChange('rateLimit', e.target.value)}
                  className="setting-input"
                />
              </div>

              <div className="setting-item">
                <label>Request Timeout (seconds):</label>
                <input
                  type="number"
                  value={apiSettings.timeout}
                  onChange={(e) => handleApiSettingChange('timeout', e.target.value)}
                  className="setting-input"
                />
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label>Enable CORS</label>
                  <span>Allow cross-origin requests from approved domains</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={apiSettings.enableCors}
                    onChange={(e) => handleApiSettingChange('enableCors', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label>Require Authentication</label>
                  <span>All API requests must include valid authentication</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={apiSettings.requireAuth}
                    onChange={(e) => handleApiSettingChange('requireAuth', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Backup Settings */}
        {activeTab === 'backup' && (
          <div className="settings-section">
            <div className="section-header">
              <h3><i className="bi bi-database me-2"></i>Backup Configuration</h3>
              <p>Configure automated backup settings and data retention</p>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Backup Frequency:</label>
                <select
                  value={backupSettings.frequency}
                  onChange={(e) => handleBackupSettingChange('frequency', e.target.value)}
                  className="setting-select"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Retention Period (days):</label>
                <select
                  value={backupSettings.retention}
                  onChange={(e) => handleBackupSettingChange('retention', e.target.value)}
                  className="setting-select"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label>Include Media Files</label>
                  <span>Include uploaded images and documents in backups</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={backupSettings.includeMedia}
                    onChange={(e) => handleBackupSettingChange('includeMedia', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <label>Enable Compression</label>
                  <span>Compress backup files to save storage space</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={backupSettings.compression}
                    onChange={(e) => handleBackupSettingChange('compression', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="backup-actions">
              <button
                className="btn-test"
                onClick={handleTestBackup}
                disabled={loading}
              >
                {loading ? <><i className="bi bi-hourglass me-2"></i>Testing...</> : <><i className="bi bi-play-circle me-2"></i>Test Backup</>}
              </button>
              
              <div className="backup-status">
                <div className="status-item">
                  <span className="status-label">Last Backup:</span>
                  <span className="status-value">October 3, 2025 - 02:00 AM</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Next Scheduled:</span>
                  <span className="status-value">October 4, 2025 - 02:00 AM</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Backup Size:</span>
                  <span className="status-value">2.4 GB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminSettings