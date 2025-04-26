# Time Attendance Tracking System

A simple time tracking application built with React frontend and Node.js/Express backend. This project follows the MVC (Model-View-Controller) architecture pattern and includes JWT authentication for security.

## Features

- Secure user authentication with JWT and password hashing
- Time tracking with entry and exit records
- Real-time Germany time display
- Admin dashboard to manage records
- Statistics calculation for attendance
- Role-based access control (admin/user)

## Project Structure

The project is organized into a clear MVC structure:

```
attendance-tracker/
│
├── backend/                      # Backend Node.js/Express application
│   ├── config/                   # Configuration settings
│   ├── controllers/              # Request handlers
│   ├── models/                   # Data operations 
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Utility functions
│   ├── data/                     # JSON data storage
│   └── server.js                 # Main application file
│
└── frontend/                     # React frontend application
    ├── public/
    └── src/
        ├── components/           # React components
        │   ├── auth/             # Authentication components
        │   ├── dashboard/        # Dashboard components
        │   ├── records/          # Record-related components
        │   └── common/           # Shared components
        ├── services/             # API service modules
        ├── utils/                # Utility functions
        └── App.jsx               # Main React component
```

## Technologies Used

### Backend
- Node.js
- Express
- JWT (JSON Web Token)
- Bcrypt for password hashing
- File-based storage using JSON

### Frontend
- React
- React Router
- Custom CSS (no Bootstrap)
- JWT for authentication

## Setup and Installation

1. Clone the repository
   ```
   git clone https://github.com/ilantalala/Wobi-assignment.git
   cd attendance-tracker
   ```

2. Install backend dependencies
   ```
   npm install
   ```

3. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with:
   ```
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1d
   ```

5. Start the development servers
   ```
   # In the root directory
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate user and receive JWT token

### Time Management
- `GET /api/current-time` - Get current time in Germany (protected)

### Attendance
- `GET /api/time-records` - Get all attendance records (protected)
- `POST /api/time-record` - Create a new attendance record (protected)
- `PUT /api/time-records/:username/:index` - Update an attendance record (protected)
- `DELETE /api/time-records/:username/:index` - Delete an attendance record (protected)
- `GET /api/statistics` - Get attendance statistics (admin only)

## User Roles

- **User**: Can view their own attendance records and clock in/out
- **Admin**: Can manage all attendance records and view statistics

## Security Features

- JWT authentication for secure API access
- Password hashing with bcrypt
- Protected routes based on user roles
- Token expiration