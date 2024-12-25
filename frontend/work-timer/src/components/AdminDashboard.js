import React, { useState, useEffect } from 'react';
import StatsBox from './StatsBox';
import RecordForm from './RecordForm';
import RecordItem from './RecordItem';

function AdminDashboard({ setUser }) {
  const [records, setRecords] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [statistics, setStatistics] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/time-records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load records');
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/statistics');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDisplayDate = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours());
    
    const year = timestamp.substring(0, 4); 
    const month = timestamp.substring(5, 7); 
    const day = timestamp.substring(8, 10); 
    const hours = timestamp.substring(11, 13); 
    const minutes = timestamp.substring(14, 16); 
    const seconds = timestamp.substring(17, 19); 
    
    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  };

  const handleUpdate = async (username, recordIndex, record) => {
    try {
      const updatedRecord = {
        type: record.type,
        timestamp: record.timestamp
      };

      const response = await fetch(
        `http://localhost:3001/api/time-records/${username}/${recordIndex}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedRecord)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      await fetchRecords();
      if (showStats) {
        await fetchStatistics();
      }
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update record');
    }
  };

  const handleDelete = async (username, recordIndex) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/time-records/${username}/${recordIndex}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      await fetchRecords();
      if (showStats) {
        await fetchStatistics();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record');
    }
  };

  const toggleStats = async () => {
    if (!showStats) {
      await fetchStatistics();
    }
    setShowStats(!showStats);
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <button onClick={toggleStats}>
        {showStats ? 'Hide' : 'Show'} Statistics
      </button>

      {error && <div className="error">{error}</div>}

      {showStats && statistics && (
        <StatsBox 
          statistics={statistics} 
          formatDisplayDate={formatDisplayDate} 
        />
      )}

      <div className="records-list">
        {Object.entries(records).map(([username, userRecords]) => (
          <div key={username} className="user-records">
            <h2>{username}'s Records</h2>
            {userRecords.map((record, index) => (
              <div key={index}>
                {editingRecord === `${username}-${index}` ? (
                  <RecordForm
                    record={record}
                    onSave={() => handleUpdate(username, index, record)}
                    onCancel={() => setEditingRecord(null)}
                  />
                ) : (
                  <RecordItem
                    record={record}
                    onEdit={() => setEditingRecord(`${username}-${index}`)}
                    onDelete={() => handleDelete(username, index)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={() => setUser(null)}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;