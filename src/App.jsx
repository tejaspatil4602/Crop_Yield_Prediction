import { useState } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Grid } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Landing from './components/Landing'
import Home from './components/Home'
import Prediction from './components/Prediction'
import Analytics from './components/Analytics'
import Contact from './components/Contact'
import Weather from './components/Weather'
import About from './components/About'
import { AIChat } from './components/AIChat'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import Auth from './components/Auth'
import AdminLogin from './components/AdminLogin'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const path = isAdmin ? '/admin/login' : '/login';
  return isAuthenticated ? children : <Navigate to={path} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<>
          <Navigation />
          <Home />
        </>} />
        <Route path="/contact" element={<>
          <Navigation />
          <Contact />
        </>} />
        <Route path="/weather" element={<>
          <Navigation />
          <Weather />
        </>} />
        <Route path="/about" element={<>
          <Navigation />
          <About />
        </>} />
        <Route path="/login" element={<>
          <Navigation />
          <Auth />
        </>} />
        <Route path="/admin/login" element={<>
          <Navigation />
          <AdminLogin />
        </>} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
              <AIChat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App