// src/views/records/RecordForm.js
import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const RecordForm = ({ record, onSave, onCancel }) => {
  // Format timestamp for datetime-local input
  const formatDateTimeForInput = (timestamp) => {
    if (!timestamp) return '';
    
    // The datetime-local input requires format: YYYY-MM-DDThh:mm
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16);
  };
  
  // Handle type change
  const handleTypeChange = (e) => {
    record.type = e.target.value;
  };
  
  // Handle timestamp change
  const handleTimestampChange = (e) => {
    const localDateTime = e.target.value;
    if (localDateTime) {
      record.timestamp = new Date(localDateTime).toISOString();
    }
  };

  return (
    <Form className="p-3 border rounded">
      <Row className="align-items-end">
        <Col xs={12} md={5} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Label>Timestamp</Form.Label>
            <Form.Control
              type="datetime-local"
              defaultValue={formatDateTimeForInput(record.timestamp)}
              onChange={handleTimestampChange}
              required
            />
          </Form.Group>
        </Col>
        
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Select
              defaultValue={record.type}
              onChange={handleTypeChange}
              required
            >
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col xs={12} md={3} className="d-flex justify-content-end">
          <Button variant="success" className="me-2" onClick={onSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default RecordForm;