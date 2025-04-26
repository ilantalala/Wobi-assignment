// src/views/stats/StatsBox.js
import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaChartBar, FaUserClock, FaCalendarAlt } from 'react-icons/fa';

const StatsBox = ({ statistics, formatDisplayDate }) => {
  if (!statistics) return <div>Loading statistics...</div>;
  
  return (
    <div className="stats-container">
      <h2 className="mb-4">
        <FaChartBar className="me-2" />
        Attendance Statistics
      </h2>
      
      {Object.entries(statistics).map(([username, stats]) => (
        <Card key={username} className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">
              <FaUserClock className="me-2" />
              {username}'s Statistics
            </h4>
          </Card.Header>
          
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5 className="border-bottom pb-2">Summary</h5>
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Total Records
                    <Badge bg="primary" pill>{stats.totalRecords}</Badge>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Entries
                    <Badge bg="success" pill>{stats.entries}</Badge>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Exits
                    <Badge bg="danger" pill>{stats.exits}</Badge>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Average Stay Time
                    <Badge bg="info" pill>{stats.averageStayTime} mins</Badge>
                  </li>
                  {stats.balanceIssue && (
                    <li className="list-group-item d-flex justify-content-between align-items-center text-danger">
                      Balance Issue
                      <Badge bg="warning" text="dark" pill>Yes</Badge>
                    </li>
                  )}
                </ul>
                
                {stats.lastRecord && (
                  <div className="mb-4">
                    <h5 className="border-bottom pb-2">Last Activity</h5>
                    <p>
                      <FaCalendarAlt className="me-2" />
                      <Badge bg={stats.lastRecord.type === 'entry' ? 'success' : 'danger'} className="me-2">
                        {stats.lastRecord.type.charAt(0).toUpperCase() + stats.lastRecord.type.slice(1)}
                      </Badge>
                      at {formatDisplayDate(stats.lastRecord.timestamp)}
                    </p>
                  </div>
                )}
              </Col>
              
              <Col md={6}>
                {stats.monthlyStats && Object.keys(stats.monthlyStats).length > 0 && (
                  <div>
                    <h5 className="border-bottom pb-2">Monthly Activity</h5>
                    <ul className="list-group list-group-flush">
                      {Object.entries(stats.monthlyStats)
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .map(([month, count]) => (
                          <li key={month} className="list-group-item d-flex justify-content-between align-items-center">
                            {month}
                            <Badge bg="primary" pill>{count}</Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                
                {stats.longestStay > 0 && (
                  <div className="mt-4">
                    <h5 className="border-bottom pb-2">Duration Records</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Longest Stay
                        <Badge bg="primary" pill>{stats.longestStay} mins</Badge>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Shortest Stay
                        <Badge bg="primary" pill>{stats.shortestStay} mins</Badge>
                      </li>
                    </ul>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default StatsBox;