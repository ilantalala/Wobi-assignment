import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <Routes>
        <Route 
        path='/'
        element={<Navigate to="/login" />}></Route>
        <Route
          path='/login'
          element={!user ? <Login setUser={setUser}/> : <Navigate to="/dashboard"/>}
        />
        <Route
          path='/dashboard'
          element={user ?
            (user.role!=='admin'?<Dashboard user={user} setUser={setUser}/> : <AdminDashboard setUser={setUser}/>):
          (<Navigate to='/login'></Navigate>) }
        />
      </Routes>
    </div>
  );
}

export default App;