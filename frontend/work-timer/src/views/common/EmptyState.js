// src/views/common/EmptyState.js
import React from 'react';
import { Card } from 'react-bootstrap';

const EmptyState = ({ 
  icon, 
  title = 'No Data Found', 
  message = 'There are no records to display at this time.',
  children
}) => {
  return (
    <Card className="text-center my-4 py-5">
      <Card.Body>
        {icon && <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>{icon}</div>}
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-muted">{message}</Card.Text>
        {children}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;