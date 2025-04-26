import React from 'react';
import { formatDisplayDate } from '../../utils/timeFormatter';
import './StatsBox.css';

function StatsBox({ statistics }) {
  return (
    <div className="stats-container">
      <h2>Attendance Statistics</h2>
      
      {Object.entries(statistics).map(([username, stats]) => (
        <div key={username} className="user-stats">
          <h3>{username}</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{stats.totalRecords}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Entries</div>
              <div className="stat-value">{stats.entries}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Exits</div>
              <div className="stat-value">{stats.exits}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Avg. Stay Time</div>
              <div className="stat-value">{stats.averageStayTime} min</div>
            </div>
          </div>
          
          {stats.lastRecord && (
            <div className="last-record">
              <h4>Last Record</h4>
              <p>
                <span className="record-type">{stats.lastRecord.type}</span> at {formatDisplayDate(stats.lastRecord.timestamp)}
              </p>
            </div>
          )}
          
          {Object.entries(stats.monthlyStats).length > 0 && (
            <div className="monthly-stats">
              <h4>Monthly Activity</h4>
              <div className="monthly-grid">
                {Object.entries(stats.monthlyStats).map(([month, count]) => (
                  <div key={month} className="month-item">
                    <div className="month-label">{month}</div>
                    <div className="month-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsBox;