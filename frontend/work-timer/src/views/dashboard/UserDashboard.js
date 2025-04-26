// src/views/dashboard/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaUserCheck, FaUserMinus, FaHistory, FaClock } from 'react-icons/fa';
import RecordsController from '../../controllers/RecordsController';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDateTime } from '../../utils/formatTime';

const UserDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);

  // Handle record creation (entry/exit)
  const handleTimeRecord = async (type) => {
    try {
      setLoading(true);
      const result = await RecordsController.createRecord(type);
      
      if (result.success) {
        setMessage(`Successfully recorded ${type}`);
        setMessageType('success');
        // Refresh records
        fetchData();
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to record time');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch time and records
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get current time and records
      const [time, recordsData] = await Promise.all([
        RecordsController.getCurrentTime(),
        RecordsController.getRecords()
      ]);
      
      setCurrentTime(new Date(time));
      
      // Process records
      if (recordsData[user.username]) {
        const userRecords = recordsData[user.username];
        const sortedRecords = [...userRecords].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setRecords(sortedRecords);
        
        if (sortedRecords.length > 0) {
          setLastRecord(sortedRecords[0]);
        }
      }
    } catch (error) {
      setMessage(error.message || 'Failed to load data');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Initialize and setup timers
  useEffect(() => {
    fetchData();
    
    // Set up time update intervals
    const serverInterval = setInterval(() => {
      RecordsController.getCurrentTime()
        .then(time => setCurrentTime(new Date(time)))
        .catch(err => console.error('Error updating time:', err));
    }, 60000); // Update from server every minute
    
    const localInterval = setInterval(() => {
      setCurrentTime(prevTime => {
        if (prevTime) {
          const newTime = new Date(prevTime);
          newTime.setSeconds(newTime.getSeconds() + 1);
          return newTime;
        }
        return prevTime;
      });
    }, 1000); // Update clock every second
    
    return () => {
      clearInterval(serverInterval);
      clearInterval(localInterval);
    };
  }, [user.username]);

  if (loading && !currentTime) {
    return <LoadingSpinner />;
  }

  // Determine if entry button should be disabled based on last record
  const lastActionWasEntry = lastRecord?.type === 'entry';
  
  return (
    <Container>
      <h1 className="text-center mb-4">Employee Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaClock className="me-2" />
                Current Time in Germany
              </h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              <h2 className="text-center">
                {currentTime ? formatDateTime(currentTime) : 'Loading...'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                Last Activity
              </h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              {lastRecord ? (
                <div className="text-center">
                  <h4>
                    <Badge bg={lastRecord.type === 'entry' ? 'success' : 'danger'}>
                      {lastRecord.type === 'entry' ? 'Entry' : 'Exit'}
                    </Badge>
                  </h4>
                  <p className="mb-0">{formatDateTime(lastRecord.timestamp)}</p>
                </div>
              ) : (
                <p className="text-muted mb-0">No recent activity</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {message && (
        <Alert variant={messageType} className="mb-4">
          {message}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Record Attendance</h5>
        </Card.Header>
        <Card.Body className="text-center">
          <Row>
            <Col xs={6}>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100"
                onClick={() => handleTimeRecord('entry')}
                disabled={lastActionWasEntry}
              >
                <FaUserCheck className="me-2" />
                Entry
              </Button>
            </Col>
            <Col xs={6}>
              <Button 
                variant="danger" 
                size="lg" 
                className="w-100"
                onClick={() => handleTimeRecord('exit')}
                disabled={!lastActionWasEntry}
              >
                <FaUserMinus className="me-2" />
                Exit
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <FaHistory className="me-2" />
            Recent Records
          </h5>
        </Card.Header>
        <Card.Body>
          {records.length === 0 ? (
            <p className="text-center text-muted">No records found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 5).map((record, index) => (
                    <tr key={index}>
                      <td>
                        <Badge bg={record.type === 'entry' ? 'success' : 'danger'}>
                          {record.type === 'entry' ? 'Entry' : 'Exit'}
                        </Badge>
                      </td>
                      <td>{formatDateTime(record.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard;