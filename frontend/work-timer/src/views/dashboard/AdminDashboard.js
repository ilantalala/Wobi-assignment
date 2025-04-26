// src/views/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Container, Tabs, Tab } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCalendarAlt, FaChartBar, FaList, FaUser, FaUsers } from 'react-icons/fa';
import RecordsController from '../../controllers/RecordsController';
import StatsController from '../../controllers/StatsController';
import LoadingSpinner from '../common/LoadingSpinner';
import RecordForm from '../records/RecordForm';
import StatsBox from '../stats/StatsBox';
import { formatDateTime } from '../../utils/formatTime';

const AdminDashboard = () => {
  const [records, setRecords] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Fetch records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await RecordsController.getRecords();
      setRecords(data);
      
      // Select first user if none selected
      if (!selectedUser && Object.keys(data).length > 0) {
        setSelectedUser(Object.keys(data)[0]);
      }
    } catch (error) {
      setError(error.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const stats = await StatsController.getStatistics();
      setStatistics(stats);
    } catch (error) {
      setError(error.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchRecords();
    
    if (activeTab === 'statistics') {
      fetchStatistics();
    }
  }, [activeTab]);

  // Update record
  const handleUpdate = async (username, recordIndex, record) => {
    try {
      setLoading(true);
      const result = await RecordsController.updateRecord(username, recordIndex, record);
      
      if (result.success) {
        setMessage('Record updated successfully');
        setMessageType('success');
        
        await fetchRecords();
        
        if (activeTab === 'statistics') {
          await fetchStatistics();
        }
        
        setEditingRecord(null);
      }
    } catch (error) {
      setError(error.message || 'Failed to update record');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Delete record
  const handleDelete = async (username, recordIndex) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setLoading(true);
      const result = await RecordsController.deleteRecord(username, recordIndex);
      
      if (result.success) {
        setMessage('Record deleted successfully');
        setMessageType('success');
        
        await fetchRecords();
        
        if (activeTab === 'statistics') {
          await fetchStatistics();
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to delete record');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'statistics') {
      fetchStatistics();
    }
  };

  if (loading && !records) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <h1 className="text-center mb-4">
        <FaChartBar className="me-2" />
        Admin Dashboard
      </h1>
      
      {(error || message) && (
        <Alert variant={messageType} className="mb-4" onClose={() => setMessage('')} dismissible={!!message}>
          {error || message}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <FaUsers className="me-2" />
            Employee Records Management
          </h5>
        </Card.Header>
        
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="mb-4"
          >
            <Tab eventKey="records" title={<><FaList className="me-1" /> Records</>}>
              {/* User selection */}
              {Object.keys(records).length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Select Employee:</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.keys(records).map((username) => (
                      <Button
                        key={username}
                        variant={selectedUser === username ? "primary" : "outline-primary"}
                        onClick={() => setSelectedUser(username)}
                      >
                        <FaUser className="me-1" /> {username}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected user's records */}
              {selectedUser && records[selectedUser] && (
                <div className="records-list">
                  <h3 className="mb-3 border-bottom pb-2">
                    <FaUser className="me-2" />
                    {selectedUser}'s Records
                  </h3>
                  
                  {records[selectedUser].length === 0 ? (
                    <p className="text-muted">No records found for this user.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Timestamp</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records[selectedUser].map((record, index) => (
                            <tr key={index}>
                              {editingRecord === `${selectedUser}-${index}` ? (
                                <td colSpan="3">
                                  <RecordForm
                                    record={record}
                                    onSave={() => handleUpdate(selectedUser, index, record)}
                                    onCancel={() => setEditingRecord(null)}
                                  />
                                </td>
                              ) : (
                                <>
                                  <td className={record.type === 'entry' ? 'text-success' : 'text-danger'}>
                                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                                  </td>
                                  <td>
                                    <FaCalendarAlt className="me-2" />
                                    {formatDateTime(record.timestamp)}
                                  </td>
                                  <td>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => setEditingRecord(`${selectedUser}-${index}`)}
                                    >
                                      <FaEdit /> Edit
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDelete(selectedUser, index)}
                                    >
                                      <FaTrash /> Delete
                                    </Button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="statistics" title={<><FaChartBar className="me-1" /> Statistics</>}>
              {statistics ? (
                <StatsBox statistics={statistics} formatDisplayDate={formatDateTime} />
              ) : (
                <p className="text-center text-muted">Loading statistics...</p>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;