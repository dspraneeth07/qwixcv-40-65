
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import JobBoard from '@/pages/JobBoard';
import Builder from '@/pages/Builder';
import ATSScanner from '@/pages/ATSScanner';
import CareerPathSimulator from '@/pages/CareerPathSimulator';
import InterviewCoach from '@/pages/InterviewCoach';
import SkillGapAnalysis from '@/pages/SkillGapAnalysis';
import AIJobSwitchPlanner from '@/pages/AIJobSwitchPlanner';
import AIShadowCareerSimulator from '@/pages/AIShadowCareerSimulator';
import AILayoffReadinessToolkit from '@/pages/AILayoffReadinessToolkit';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Auth protected route component
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/job-board" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
          <Route path="/ats-scanner" element={<ProtectedRoute><ATSScanner /></ProtectedRoute>} />
          <Route path="/career-path-simulator" element={<ProtectedRoute><CareerPathSimulator /></ProtectedRoute>} />
          <Route path="/interview-coach" element={<ProtectedRoute><InterviewCoach /></ProtectedRoute>} />
          <Route path="/skill-gap-analysis" element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>} />
          <Route path="/ai-job-switch-planner" element={<ProtectedRoute><AIJobSwitchPlanner /></ProtectedRoute>} />
          <Route path="/ai-shadow-career-simulator" element={<ProtectedRoute><AIShadowCareerSimulator /></ProtectedRoute>} />
          <Route path="/ai-layoff-readiness-toolkit" element={<ProtectedRoute><AILayoffReadinessToolkit /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
