import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile'; // Import the Profile component
import Alert from './components/Settings'
function App() {
  return (
    <Router>
      <Routes>
        {/* Protecting the Dashboard route with PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Protecting the Profile route with PrivateRoute */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Alert />
            </PrivateRoute>
          }
        />
        
        {/* Login and Signup routes (no protection required here) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
