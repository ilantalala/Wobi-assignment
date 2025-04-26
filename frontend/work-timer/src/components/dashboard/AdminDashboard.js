import React, { useState, useEffect } from 'react';
import { getAllRecords, updateRecord, deleteRecord, getStatistics } from '../../services/recordsService';
import { formatDisplayDate } from '../../utils/timeFormatter';
import StatsBox from '../records/StatsBox';
import RecordForm from '../records/RecordForm';
import RecordItem from '../records/RecordItem';
import './AdminDashboard.css';

function AdminDashboard({ setUser }) {
  const [records, setRecords] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [statistics, setStatistics] = useState(null);
  
  const fetchRecords = async () => {
    try {
      const data = await getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load records');
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpdate = async (username, recordIndex, record) => {
    try {
      const updatedRecord = {
        type: record.type,
        timestamp: record.timestamp
      };

      await updateRecord(username, recordIndex, updatedRecord);
      
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
      await deleteRecord(username, recordIndex);
      
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
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        
        <button 
          className="stats-toggle" 
          onClick={toggleStats}
        >
          {showStats ? 'Hide' : 'Show'} Statistics
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showStats && statistics && (
        <StatsBox 
          statistics={statistics}
        />
      )}

      <div className="records-container">
        {Object.entries(records).map(([username, userRecords]) => (
          <div key={username} className="user-records">
            <h2>{username}'s Records</h2>
            {userRecords.map((record, index) => (
              <div key={index} className="record-wrapper">
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