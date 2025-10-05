import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/SuperAdmin/AuditLogs.css'
import '../../css/EnhancedComponents.css'

function AuditLogs() {
  const { auditLogs, loading, exportAuditLogs, showNotification } = useData()
  
  const [selectedLogs, setSelectedLogs] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const [dateRange, setDateRange] = useState('week')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [customDateStart, setCustomDateStart] = useState('')
  const [customDateEnd, setCustomDateEnd] = useState('')

  // Filter logs based on selected criteria
  const getFilteredLogs = () => {
    let filtered = [...auditLogs]
    
    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type.toLowerCase() === filterType.toLowerCase())
    }
    
    // Severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity.toLowerCase() === filterSeverity.toLowerCase())
    }
    
    // User filter
    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user === filterUser)
    }
    
    // Date range filter
    const now = new Date()
    const filterDate = new Date()
    
    switch (dateRange) {
      case 'today':
        filterDate.setDate(now.getDate())
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setDate(now.getDate() - 30)
        break
      case 'custom':
        if (customDateStart && customDateEnd) {
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp)
            return logDate >= new Date(customDateStart) && logDate <= new Date(customDateEnd)
          })
        }
        break
    }
    
    if (dateRange !== 'custom') {
      filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate)
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const filteredLogs = getFilteredLogs()

  // Get severity badge styling
  const getSeverityBadge = (severity) => {
    const severityConfig = {
      'Info': { class: 'severity-info', label: 'Info', icon: 'bi-info-circle', color: '#0ea5e9' },
      'Warning': { class: 'severity-warning', label: 'Warning', icon: 'bi-exclamation-triangle', color: '#f59e0b' },
      'Error': { class: 'severity-error', label: 'Error', icon: 'bi-x-circle', color: '#ef4444' },
      'Critical': { class: 'severity-critical', label: 'Critical', icon: 'bi-exclamation-triangle-fill', color: '#dc2626' }
    }
    const config = severityConfig[severity] || { class: 'severity-unknown', label: severity, icon: 'bi-question-circle', color: '#6b7280' }
    return <span className={`severity-badge ${config.class}`}><i className={`bi ${config.icon} me-1`}></i>{config.label}</span>
  }

  // Get type icon
  const getTypeIcon = (type) => {
    const typeIcons = {
      'Authentication': 'bi-key',
      'User Management': 'bi-people',
      'Data Access': 'bi-database',
      'System': 'bi-gear',
      'Security': 'bi-shield-check',
      'API': 'bi-plug',
      'File': 'bi-folder'
    }
    return <i className={`bi ${typeIcons[type] || 'bi-file-text'}`}></i>
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleSelectLog = (logId) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id))
    }
  }

  const handleExportLogs = () => {
    try {
      const logsToExport = selectedLogs.length > 0 
        ? filteredLogs.filter(log => selectedLogs.includes(log.id))
        : filteredLogs
      exportAuditLogs(logsToExport)
      showNotification('Audit logs exported successfully!', 'success')
    } catch (error) {
      console.error('Error exporting logs:', error)
      showNotification('Failed to export audit logs. Please try again.', 'error')
    }
  }

  const handleViewDetails = (log) => {
    setSelectedLog(log)
    setShowModal(true)
  }

  const handleExportSingleLog = (log) => {
    try {
      exportAuditLogs([log])
      showNotification('Log exported successfully!', 'success')
    } catch (error) {
      console.error('Error exporting log:', error)
      showNotification('Failed to export log. Please try again.', 'error')
    }
  }

  // Statistics
  const stats = {
    total: filteredLogs.length,
    info: filteredLogs.filter(log => log.severity === 'Info').length,
    warning: filteredLogs.filter(log => log.severity === 'Warning').length,
    error: filteredLogs.filter(log => log.severity === 'Error').length,
    critical: filteredLogs.filter(log => log.severity === 'Critical').length,
    uniqueUsers: [...new Set(filteredLogs.map(log => log.user))].length
  }

  // Unique users and types for filtering
  const uniqueUsers = [...new Set(auditLogs.map(log => log.user))]
  const uniqueTypes = [...new Set(auditLogs.map(log => log.type))]

  return (
    <div className="audit-logs enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-journal-text me-2"></i>Audit Logs</h2>
          <span className="logs-count">
            {filteredLogs.length} of {auditLogs.length} log entries
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-export"
            onClick={handleExportLogs}
            disabled={loading.export}
          >
            <span className="btn-icon"><i className="bi bi-download"></i></span>
            {loading.export ? 'Exporting...' : 'Export Logs'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"><i className="bi bi-journal-text"></i></div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Entries</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon"><i className="bi bi-info-circle"></i></div>
          <div className="stat-content">
            <h3>{stats.info}</h3>
            <p>Info Logs</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon"><i className="bi bi-exclamation-triangle"></i></div>
          <div className="stat-content">
            <h3>{stats.warning}</h3>
            <p>Warnings</p>
          </div>
        </div>
        
        <div className="stat-card error">
          <div className="stat-icon"><i className="bi bi-x-circle"></i></div>
          <div className="stat-content">
            <h3>{stats.error + stats.critical}</h3>
            <p>Errors & Critical</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon"><i className="bi bi-people"></i></div>
          <div className="stat-content">
            <h3>{stats.uniqueUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="component-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon"><i className="bi bi-search"></i></span>
            <input
              type="text"
              placeholder="Search actions, details, or users..."
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
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range */}
      {dateRange === 'custom' && (
        <div className="custom-date-range">
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={customDateStart}
                onChange={(e) => setCustomDateStart(e.target.value)}
              />
            </div>
            <div className="date-input-group">
              <label>End Date:</label>
              <input
                type="date"
                value={customDateEnd}
                onChange={(e) => setCustomDateEnd(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedLogs.length > 0 && (
        <div className="bulk-actions">
          <span className="bulk-count">{selectedLogs.length} selected</span>
          <button 
            className="bulk-btn"
            onClick={handleExportLogs}
            disabled={loading.export}
          >
            <i className="bi bi-download me-2"></i>Export Selected
          </button>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="table-container">
        <table className="enhanced-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Severity</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>IP Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} className={`table-row severity-${log.severity.toLowerCase()}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLogs.includes(log.id)}
                    onChange={() => handleSelectLog(log.id)}
                  />
                </td>
                <td className="timestamp-cell">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="type-cell">
                  <span className="type-icon">{getTypeIcon(log.type)}</span>
                  <span className="type-text">{log.type}</span>
                </td>
                <td>{getSeverityBadge(log.severity)}</td>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-email">{log.userEmail}</div>
                    <div className="user-id">User: {log.user}</div>
                  </div>
                </td>
                <td className="action-cell">
                  <div className="action-text">{log.action}</div>
                </td>
                <td className="details-cell">
                  <div className="details-preview">
                    {log.details.length > 50 ? `${log.details.substring(0, 50)}...` : log.details}
                  </div>
                </td>
                <td className="ip-cell">{log.ipAddress}</td>
                <td className="actions-cell">
                  <button
                    className="btn-view"
                    onClick={() => handleViewDetails(log)}
                    title="View Details"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon"><i className="bi bi-journal-text"></i></div>
            <h3>No audit logs found</h3>
            <p>No logs match your current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {showModal && selectedLog && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Audit Log Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Event Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Log ID:</label>
                    <span>{selectedLog.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Timestamp:</label>
                    <span>{formatTimestamp(selectedLog.timestamp)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span className="type-with-icon">
                      <span className="type-icon">{getTypeIcon(selectedLog.type)}</span>
                      {selectedLog.type}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Severity:</label>
                    {getSeverityBadge(selectedLog.severity)}
                  </div>
                  <div className="detail-item">
                    <label>Action:</label>
                    <span>{selectedLog.action}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>User Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span>{selectedLog.user}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedLog.userEmail}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span>{selectedLog.userRole || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>IP Address:</label>
                    <span>{selectedLog.ipAddress}</span>
                  </div>
                  <div className="detail-item">
                    <label>User Agent:</label>
                    <span>{selectedLog.userAgent || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Session ID:</label>
                    <span>{selectedLog.sessionId || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Event Details</h4>
                <div className="detail-full">
                  <pre className="log-details">{selectedLog.details}</pre>
                </div>
                
                {selectedLog.metadata && (
                  <div className="metadata-section">
                    <h5>Metadata:</h5>
                    <pre className="log-metadata">{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-export"
                onClick={() => handleExportSingleLog(selectedLog)}
              >
                � Export This Log
              </button>
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

export default AuditLogs