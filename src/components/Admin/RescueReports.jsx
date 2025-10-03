import React from 'react'

function RescueReports() {
  return (
    <div className="content-section">
      <h2>Rescue Reports</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reporter</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#001</td>
              <td>John Smith</td>
              <td>123 Main St, Manila</td>
              <td><span className="status-badge pending">Pending</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Details</button>
                  <button className="btn-assign">Assign Volunteer</button>
                  <button className="btn-reject">Reject</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>#002</td>
              <td>Maria Garcia</td>
              <td>456 Oak Ave, Quezon City</td>
              <td><span className="status-badge ongoing">Ongoing</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Details</button>
                  <button className="btn-assign">Assign Volunteer</button>
                  <button className="btn-reject">Reject</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RescueReports
