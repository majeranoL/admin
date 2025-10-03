import React from 'react'

function Volunteers() {
  return (
    <div className="content-section">
      <h2>Volunteers</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Volunteer ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#V001</td>
              <td>Alice Johnson</td>
              <td>09123456789</td>
              <td><span className="status-badge available">Available</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Profile</button>
                  <button className="btn-assign">Assign Task</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>#V002</td>
              <td>Bob Wilson</td>
              <td>09987654321</td>
              <td><span className="status-badge busy">Busy</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-view">View Profile</button>
                  <button className="btn-assign">Assign Task</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Volunteers
