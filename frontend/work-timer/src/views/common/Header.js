// src/views/common/Header.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserClock, FaSignOutAlt, FaChartBar, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthController from '../../controllers/AuthController';

// Import component-specific styles
import '../../styles/components/Header.css';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    AuthController.logout(setUser);
    navigate('/login');
  };

  // If not logged in, show minimal header
  if (!user) {
    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FaUserClock className="me-2" />
            Work Clock
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'}>
          <FaUserClock className="me-2" />
          Work Clock
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.role === 'admin' ? (
              <Nav.Link as={Link} to="/admin">
                <FaChartBar className="me-1" /> Admin Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/dashboard">
                <FaUser className="me-1" /> My Dashboard
              </Nav.Link>
            )}
            
            <div className="d-flex align-items-center ms-lg-3">
              <span className="user-welcome me-3">
                Hello, {user.username}
              </span>
              <Button 
                variant="outline-light" 
                size="sm"
                className="logout-button"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;