import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import TeamTasks from './components/team/TeamTasks';
import MeetingCalendar from './components/meetings/MeetingCalendar';
import TeamRanking from './components/team/TeamRanking';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.get('http://localhost:5000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="team-tasks" element={<TeamTasks />} />
          <Route path="meetings" element={<MeetingCalendar />} />
          <Route path="team-ranking" element={<TeamRanking />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;