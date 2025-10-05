import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import '../../css/SuperAdmin/SystemReports.css'
import '../../css/EnhancedComponents.css'

function SystemReports() {
  const { systemReports, loading, generateSystemReport, exportToCSV, showNotification } = useData()
  
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [reportType, setReportType] = useState('performance')
  const [dateRange, setDateRange] = useState('week')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [reportFilters, setReportFilters] = useState({
    includeCharts: true,
    includeDetails: true,
    format: 'pdf'
  })

  const reportCategories = [
    {
      id: 'performance',
      title: 'Performance Reports',
      icon: 'bi-graph-up',
      description: 'System performance and technical metrics',
      reports: [
        'System Response Times',
        'Database Performance',
        'API Usage Statistics',
        'Error Rate Analysis',
        'Server Resource Usage',
        'Load Balancing Metrics'
      ]
    },
    {
      id: 'user_activity',
      title: 'User Activity Reports',
      icon: 'bi-people',
      description: 'User engagement and behavior analytics',
      reports: [
        'Daily Active Users',
        'Registration Statistics',
        'Feature Usage Analytics',
        'User Retention Metrics',
        'Session Duration Analysis',
        'Geographic Distribution'
      ]
    },
    {
      id: 'rescue_operations',
      title: 'Rescue Operations',
      icon: 'bi-truck',
      description: 'Animal rescue and emergency response data',
      reports: [
        'Rescue Success Rate',
        'Response Time Analysis',
        'Volunteer Performance',
        'Geographic Coverage',
        'Animal Type Distribution',
        'Seasonal Trends'
      ]
    },
    {
      id: 'adoption_analytics',
      title: 'Adoption Analytics',
      icon: 'bi-house-heart',
      description: 'Adoption process and success metrics',
      reports: [
        'Adoption Success Rate',
        'Processing Time Analysis',
        'Adopter Demographics',
        'Animal Characteristics Impact',
        'Shelter Performance',
        'Follow-up Success Rate'
      ]
    },
    {
      id: 'financial',
      title: 'Financial Reports',
      icon: 'bi-cash-coin',
      description: 'Financial tracking and budget analysis',
      reports: [
        'Donation Analytics',
        'Operating Expenses',
        'Funding Sources',
        'Cost per Rescue',
        'Budget vs Actual',
        'ROI Analysis'
      ]
    },
    {
      id: 'security',
      title: 'Security Reports',
      icon: 'bi-shield-check',
      description: 'Security incidents and compliance metrics',
      reports: [
        'Security Incidents',
        'Login Attempts Analysis',
        'Data Access Audit',
        'Compliance Status',
        'Vulnerability Assessment',
        'Backup Success Rate'
      ]
    }
  ]

  const handleGenerateReport = async (categoryId) => {
    const reportConfig = {
      type: categoryId,
      dateRange: dateRange,
      startDate: dateRange === 'custom' ? customStartDate : null,
      endDate: dateRange === 'custom' ? customEndDate : null,
      filters: reportFilters
    }

    try {
      // Call generateSystemReport with the correct parameters
      const report = await generateSystemReport(categoryId, getDateRangeLabel())
      setSelectedReport(report)
      setShowModal(true)
      showNotification('Report generated successfully!', 'success')
    } catch (error) {
      console.error('Error generating report:', error)
      showNotification('Failed to generate report. Please try again.', 'error')
    }
  }

  const handleExportReport = (report) => {
    try {
      // Create export data from the report
      const exportData = [
        ['Report Name', 'Type', 'Generated Date', 'Status'],
        [report.title || report.name, report.type, report.generatedDate, report.status]
      ]
      
      // Use the available exportToCSV function
      exportToCSV(exportData, `${report.name}_export.csv`)
      showNotification('Report exported successfully!', 'success')
    } catch (error) {
      console.error('Error exporting report:', error)
      showNotification('Failed to export report. Please try again.', 'error')
    }
  }

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today'
      case 'week': return 'Last 7 Days'
      case 'month': return 'Last 30 Days'
      case 'quarter': return 'Last Quarter'
      case 'year': return 'Last Year'
      case 'custom': return `${customStartDate} to ${customEndDate}`
      default: return 'Last 7 Days'
    }
  }

  // Get existing reports summary
  const recentReports = systemReports.slice(0, 5)
  const reportStats = {
    total: systemReports.length,
    thisWeek: systemReports.filter(r => {
      const reportDate = new Date(r.generatedDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return reportDate >= weekAgo
    }).length,
    pending: systemReports.filter(r => r.status === 'Generating').length,
    performance: systemReports.filter(r => r.type === 'performance').length
  }

  return (
    <div className="system-reports enhanced-component">
      {/* Header */}
      <div className="component-header">
        <div className="header-left">
          <h2><i className="bi bi-bar-chart me-2"></i>System Reports</h2>
          <span className="reports-subtitle">
            Comprehensive analytics and operational insights
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            <span className="btn-icon"><i className="bi bi-arrow-clockwise"></i></span>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"><i className="bi bi-bar-chart"></i></div>
          <div className="stat-content">
            <h3>{reportStats.total}</h3>
            <p>Total Reports</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon"><i className="bi bi-graph-up-arrow"></i></div>
          <div className="stat-content">
            <h3>{reportStats.thisWeek}</h3>
            <p>Generated This Week</p>
          </div>
        </div>
        
                <div className="stat-card warning">
          <div className="stat-icon"><i className="bi bi-hourglass-split"></i></div>
          <div className="stat-content">
            <h3>{reportStats.pending}</h3>
            <p>In Progress</p>
          </div>
        </div>        <div className="stat-card info">
          <div className="stat-icon"><i className="bi bi-lightning"></i></div>
          <div className="stat-content">
            <h3>{reportStats.performance}</h3>
            <p>Performance Reports</p>
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="report-config">
        <div className="config-section">
          <h3>Report Configuration</h3>
          
          <div className="config-grid">
            <div className="config-item">
              <label>Date Range:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="config-select"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div className="config-item">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                
                <div className="config-item">
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="config-item">
              <label>Export Format:</label>
              <select
                value={reportFilters.format}
                onChange={(e) => setReportFilters(prev => ({ ...prev, format: e.target.value }))}
                className="config-select"
              >
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
                <option value="json">JSON Data</option>
              </select>
            </div>
          </div>

          <div className="config-options">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={reportFilters.includeCharts}
                onChange={(e) => setReportFilters(prev => ({ ...prev, includeCharts: e.target.checked }))}
              />
              <span>Include Charts and Graphs</span>
            </label>
            
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={reportFilters.includeDetails}
                onChange={(e) => setReportFilters(prev => ({ ...prev, includeDetails: e.target.checked }))}
              />
              <span>Include Detailed Data</span>
            </label>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="report-categories">
        <h3>Available Report Types</h3>
        <div className="categories-grid">
          {reportCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-title">
                  <span className="category-icon"><i className={`bi ${category.icon}`}></i></span>
                  <h4>{category.title}</h4>
                </div>
                <button
                  className="btn-generate"
                  onClick={() => handleGenerateReport(category.id)}
                  disabled={loading[category.id]}
                >
                  {loading[category.id] ? (
                    <>
                      <i className="bi bi-hourglass-split me-1"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bar-chart me-1"></i>
                      Generate
                    </>
                  )}
                </button>
              </div>
              
              <div className="category-content">
                <p className="category-description">{category.description}</p>
                <ul className="report-list">
                  {category.reports.map((report, index) => (
                    <li key={index}>
                      <span className="report-bullet">•</span>
                      {report}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="category-footer">
                <div className="date-info">
                  <span className="date-label">Range:</span>
                  <span className="date-range">{getDateRangeLabel()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="recent-reports">
        <div className="section-header">
          <h3>Recent Reports</h3>
          <span className="report-count">{systemReports.length} total reports</span>
        </div>
        
        <div className="reports-table">
          <table className="enhanced-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Date Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map(report => (
                <tr key={report.id}>
                  <td className="report-name">
                    <div className="name-with-icon">
                      <span className="report-icon"><i className="bi bi-file-text"></i></span>
                      {report.title}
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge type-${report.type.toLowerCase().replace(' ', '-')}`}>
                      {report.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(report.generatedDate).toLocaleString()}
                  </td>
                  <td>{report.period}</td>
                  <td>
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedReport(report)
                          setShowModal(true)
                        }}
                        title="View Report"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      
                      <button
                        className="btn-download"
                        onClick={() => handleExportReport(report)}
                        disabled={loading[`export-${report.id}`]}
                        title="Download Report"
                      >
                        {loading[`export-${report.id}`] ? <i className="bi bi-hourglass"></i> : <i className="bi bi-download"></i>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {systemReports.length === 0 && (
            <div className="no-data">
              <div className="no-data-icon"><i className="bi bi-bar-chart"></i></div>
              <h4>No Reports Generated Yet</h4>
              <p>Generate your first system report using the categories above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {showModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content extra-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="bi bi-bar-chart me-2"></i>{selectedReport.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="report-meta">
                <div className="meta-item">
                  <label>Report Type:</label>
                  <span className={`type-badge type-${selectedReport.type.toLowerCase().replace(' ', '-')}`}>
                    {selectedReport.type.toUpperCase()}
                  </span>
                </div>
                <div className="meta-item">
                  <label>Generated:</label>
                  <span>{new Date(selectedReport.generatedDate).toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <label>Date Range:</label>
                  <span>{selectedReport.period}</span>
                </div>
                <div className="meta-item">
                  <label>Status:</label>
                  <span className={`status-badge status-${selectedReport.status.toLowerCase()}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div className="report-content">
                <div className="report-section">
                  <h4>Executive Summary</h4>
                  <p>{selectedReport.summary}</p>
                </div>

                <div className="report-section">
                  <h4>Key Metrics</h4>
                  <div className="metrics-grid">
                    {selectedReport.metrics?.map((metric, index) => (
                      <div key={index} className="metric-card">
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-label">{metric.label}</div>
                        {metric.change && (
                          <div className={`metric-change ${metric.change > 0 ? 'positive' : 'negative'}`}>
                            <i className={`bi ${metric.change > 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'} me-1`}></i>{Math.abs(metric.change)}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-section">
                  <h4>Detailed Analysis</h4>
                  <div className="analysis-content">
                    {selectedReport.analysis?.map((section, index) => (
                      <div key={index} className="analysis-section">
                        <h5>{section.title}</h5>
                        <p>{section.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReport.recommendations && (
                  <div className="report-section">
                    <h4>Recommendations</h4>
                    <ul className="recommendations-list">
                      {selectedReport.recommendations.map((rec, index) => (
                        <li key={index} className={`recommendation priority-${rec.priority}`}>
                          <span className="priority-indicator"></span>
                          <div className="rec-content">
                            <strong>{rec.title}</strong>
                            <p>{rec.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-export"
                onClick={() => handleExportReport(selectedReport)}
                disabled={loading[`export-${selectedReport.id}`]}
              >
                <i className={`bi ${loading[`export-${selectedReport.id}`] ? 'bi-hourglass' : 'bi-download'} me-2`}></i>
                {loading[`export-${selectedReport.id}`] ? 'Exporting...' : 'Export Report'}
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

export default SystemReports