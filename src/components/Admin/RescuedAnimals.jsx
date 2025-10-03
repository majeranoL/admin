import React from 'react'

function RescuedAnimals() {
  return (
    <div className="content-section">
      <h2>Rescued Animals</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Health</th>
              <th>Posted for Adoption</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Buddy</td>
              <td>Dog</td>
              <td><span className="health-badge good">Good</span></td>
              <td><span className="adoption-badge yes">Yes</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-health">Update Health</button>
                  <button className="btn-adoption">Post for Adoption</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Whiskers</td>
              <td>Cat</td>
              <td><span className="health-badge recovering">Recovering</span></td>
              <td><span className="adoption-badge no">No</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-health">Update Health</button>
                  <button className="btn-adoption">Post for Adoption</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RescuedAnimals
