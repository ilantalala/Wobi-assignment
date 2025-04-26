// src/views/common/ErrorMessage.js
import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, onDismiss, variant = 'danger', dismissible = true, timeout = 5000 }) => {
  // Auto-dismiss after timeout if dismissible and timeout > 0
  React.useEffect(() => {
    if (dismissible && timeout > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [dismissible, timeout, onDismiss]);
  
  if (!message) {
    return null;
  }
  
  return (
    <Alert 
      variant={variant} 
      onClose={dismissible && onDismiss ? onDismiss : undefined}
      dismissible={dismissible}
      className="d-flex align-items-center"
    >
      <FaExclamationTriangle className="me-2" />
      <div>{message}</div>
    </Alert>
  );
};

export default ErrorMessage;