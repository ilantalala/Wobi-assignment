// src/views/auth/LoginForm.js
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaUserClock, FaLock, FaUser } from 'react-icons/fa';
import AuthController from '../../controllers/AuthController';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  // Local component state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [validated, setValidated] = useState(false);
  
  // Global auth context
  const { setUser, error, setError } = useAuth();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Call controller to handle login logic
    await AuthController.login(
      credentials.username, 
      credentials.password,
      setUser,
      setError
    );
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-75">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="fw-bold mb-2">
                <FaUserClock className="me-2" />
                Work Clock
              </h2>
              <p className="text-white-50 mb-0">Employee Attendance System</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Username is required
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Password is required
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="text-center py-3 bg-light">
              <small className="text-muted">
                © {new Date().getFullYear()} Work Clock Attendance System
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;