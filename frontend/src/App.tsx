import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import Alert from './components/Settings';

function App() {
  return (
    <Router basename='frontend'>
      <Routes>
        {/* Protecting the Dashboard route with PrivateRoute */}
        <Route
          path="/"
          element={
            
              <Dashboard />
            
          }
        />
        
        {/* Protecting the Profile route with PrivateRoute */}
        <Route
          path="/profile"
          element={
            
              <Profile />
            
          }
        />
        
        <Route
          path="/settings"
          element={
            
              <Alert />
            
          }
        />
        
        {/* Login and Signup routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
