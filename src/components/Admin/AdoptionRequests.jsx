import React from 'react'

function AdoptionRequests() {
  return (
    <div className="content-section">
      <h2>Adoption Requests</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Applicant Name</th>
              <th>Animal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#A001</td>
              <td>Sarah Johnson</td>
              <td>Buddy (Dog)</td>
              <td><span className="status-badge pending">Pending</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Details</button>
                  <button className="btn-approve">Approve</button>
                  <button className="btn-reject">Reject</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>#A002</td>
              <td>Mike Wilson</td>
              <td>Whiskers (Cat)</td>
              <td><span className="status-badge approved">Approved</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Details</button>
                  <button className="btn-approve">Approve</button>
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

export default AdoptionRequests
