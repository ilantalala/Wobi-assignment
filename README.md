# Work Clock - Employee Attendance System

A modern attendance tracking system built with Node.js, Express, React, and JWT authentication. This application allows employees to record their entry and exit times, while administrators can manage records and view statistics.

## Features

- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Different interfaces for regular users and administrators
- **Time Tracking**: Record entry and exit times
- **Germany Time Synchronization**: All timestamps use Germany timezone
- **Administrative Dashboard**: View and manage all employee records
- **Statistics**: View attendance statistics and patterns
- **Responsive Design**: Works on both desktop and mobile devices

## Project Structure

The project is organized into two main parts:

### Backend (Server)

```
server/
├── config/                  # Configuration files
│   ├── app.config.js        # App settings and paths
│   └── jwt.config.js        # JWT secrets and options
│
├── controllers/             # Business logic
│   ├── auth.controller.js   # Authentication logic
│   ├── records.controller.js # Time records handling
│   └── stats.controller.js  # Statistics calculation
│
├── middleware/              # Express middleware
│   ├── auth.middleware.js   # Token verification & role checks
│   └── validation.middleware.js # Input validation
│
├── models/                  # Data access layer
│   ├── user.model.js        # User data operations
│   └── record.model.js      # Time records operations
│
├── routes/                  # API endpoints
│   ├── auth.routes.js       # Authentication routes
│   ├── records.routes.js    # Time records routes
│   └── stats.routes.js      # Statistics routes
│
├── utils/                   # Helper functions
│   ├── timeUtils.js         # Time handling utilities
│   └── statsUtils.js        # Statistics utilities
│
├── data/                    # Data storage
│   ├── users.json           # User accounts
│   └── attendance.json      # Time records
│
├── server.js                # Entry point
└── package.json             # Dependencies
```

### Frontend (Client)

```
client/
├── public/                  # Static files
│
├── src/
│   ├── models/              # API communication
│   │   ├── AuthModel.js     # Authentication API
│   │   ├── RecordModel.js   # Time records API
│   │   └── StatsModel.js    # Statistics API
│   │
│   ├── views/               # UI Components
│   │   ├── auth/            # Authentication views
│   │   ├── dashboard/       # Dashboard views
│   │   ├── records/         # Record management views
│   │   ├── stats/           # Statistics views
│   │   └── common/          # Shared components
│   │
│   ├── controllers/         # Business logic
│   │   ├── AuthController.js
│   │   ├── RecordsController.js
│   │   └── StatsController.js
│   │
│   ├── context/             # State management
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   │
│   ├── utils/               # Helper functions
│   │   ├── formatTime.js
│   │   └── validation.js
│   │
│   ├── styles/              # CSS styles
│   │
│   ├── App.js               # Main component
│   └── index.js             # Entry point
│
└── package.json             # Dependencies
```

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/ilantalala/Wobi-assignment.git
cd work-clock
```

2. **Install root dependencies (optional)**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd server
npm install
```

4. **Install frontend dependencies**

```bash
cd ../client
npm install
```

### Backend Dependencies

```bash
npm install express cors bcrypt jsonwebtoken dotenv helmet morgan express-rate-limit node-fetch
```

Dependencies explanation:
- **express**: Web server framework
- **cors**: Cross-Origin Resource Sharing middleware
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **node-fetch**: HTTP requests (for time API)

### Frontend Dependencies

```bash
npm install react react-dom react-router-dom bootstrap react-bootstrap react-icons axios recharts
```

Dependencies explanation:
- **react & react-dom**: UI library
- **react-router-dom**: Navigation and routing
- **bootstrap & react-bootstrap**: UI components and styling
- **react-icons**: Icon components

## Running the Application

### Development Mode

1. **Start the frontend development server**

```bash
cd client
npm start
```

2. **Start the backend development server**
cd ../server
```bash
nodemon server.js
```

## Default Users

The system comes with pre-configured users:

- **Admin User**:
  - Username: admin
  - Password: admin123
  - Role: admin

  - Username: ilan
  - Password: admin123
  - Role: admin

- **Regular Users**:
  - Username: user1
  - Password: user123
  - Role: user
  
  - Username: user2
  - Password: user123
  - Role: user
  

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/verify`: Verify JWT token

### Time Records
- `GET /api/records`: Get all records (admin) or user records
- `POST /api/records`: Create a new record
- `GET /api/records/time`: Get current time (Germany)
- `PUT /api/records/:username/:index`: Update a record (admin only)
- `DELETE /api/records/:username/:index`: Delete a record (admin only)

### Statistics
- `GET /api/stats`: Get attendance statistics

## Author

Ilan Talala