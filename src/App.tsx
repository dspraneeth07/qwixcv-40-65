import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { BlockchainProvider } from "@/context/BlockchainContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import StudentHome from "@/pages/StudentHome";
import OrganizationHome from "@/pages/OrganizationHome";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CertificationCenter from "@/pages/CertificationCenter";
import CertificateDetails from "@/pages/CertificateDetails";
import VerifyCertificate from "@/pages/VerifyCertificate";
import VerifyDocument from "@/pages/VerifyDocument";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import ResumeParser from "./pages/organization/ResumeParser";
import DocumentGenerator from "./pages/organization/DocumentGenerator";
import BlockchainVerification from "./pages/organization/BlockchainVerification";
import AIInterviewer from "./pages/organization/AIInterviewer";
import AptitudeExams from "./pages/organization/AptitudeExams";
import ResumeBuilder from "./pages/ResumeBuilder";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import ATSScanner from "./pages/ATSScanner";
import InterviewCoach from "./pages/InterviewCoach";
import JobBoard from "./pages/JobBoard";
import CareerPathSimulator from "./pages/CareerPathSimulator";
import AIJobSwitchPlanner from "./pages/AIJobSwitchPlanner";
import AIShadowCareerSimulator from "./pages/AIShadowCareerSimulator";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import AILayoffReadinessToolkit from "./pages/AILayoffReadinessToolkit";
import MindprintAssessment from "./pages/MindprintAssessment";
import AICodingCoach from "./pages/AICodingCoach";
import ResumeCompare from "./pages/ResumeCompare";
import QwiXProBuilder from "./pages/QwiXProBuilder";
import AuthLayout from "./pages/Auth/AuthLayout";
import BlockchainVault from "./pages/BlockchainVault";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <BlockchainProvider>
            <Routes>
              {/* Auth routes with special layout */}
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
              
              {/* Public verification routes */}
              <Route path="/verify-cert/:certHash" element={<VerifyCertificate />} />
              <Route path="/verify-document/:documentId" element={<VerifyDocument />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Public information pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Student landing page */}
              <Route 
                path="/student-home" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentHome />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organization landing page */}
              <Route 
                path="/organization-home" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <OrganizationHome />
                  </ProtectedRoute>
                } 
              />

              {/* Protected user/student routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Blockchain Vault route */}
              <Route 
                path="/blockchain-vault" 
                element={
                  <ProtectedRoute>
                    <BlockchainVault />
                  </ProtectedRoute>
                } 
              />
              
              {/* CV Tools Routes */}
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <ResumeBuilder />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/linkedin-optimizer" 
                element={
                  <ProtectedRoute>
                    <LinkedInOptimizer />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ats-scanner" 
                element={
                  <ProtectedRoute>
                    <ATSScanner />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/resume-compare" 
                element={
                  <ProtectedRoute>
                    <ResumeCompare />
                  </ProtectedRoute>
                } 
              />
              
              {/* Career Guide Routes */}
              <Route 
                path="/career-path-simulator" 
                element={
                  <ProtectedRoute>
                    <CareerPathSimulator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/interview-coach" 
                element={
                  <ProtectedRoute>
                    <InterviewCoach />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-job-switch-planner" 
                element={
                  <ProtectedRoute>
                    <AIJobSwitchPlanner />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-shadow-career-simulator" 
                element={
                  <ProtectedRoute>
                    <AIShadowCareerSimulator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/skill-gap-analysis" 
                element={
                  <ProtectedRoute>
                    <SkillGapAnalysis />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-layoff-readiness-toolkit" 
                element={
                  <ProtectedRoute>
                    <AILayoffReadinessToolkit />
                  </ProtectedRoute>
                } 
              />
              
              {/* QwiX Learn Routes */}
              <Route 
                path="/mindprint-assessment" 
                element={
                  <ProtectedRoute>
                    <MindprintAssessment />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-coding-coach" 
                element={
                  <ProtectedRoute>
                    <AICodingCoach />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/qwixpro-builder" 
                element={
                  <ProtectedRoute>
                    <QwiXProBuilder />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/job-board" 
                element={
                  <ProtectedRoute>
                    <JobBoard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Other protected routes that should only be accessible for students/freelancers */}
              <Route 
                path="/certification-center" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <CertificationCenter />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/certificate/:id" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <CertificateDetails />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organization routes */}
              <Route 
                path="/organization/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <OrganizationDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/resume-parser" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <ResumeParser />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/document-generator" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <DocumentGenerator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/blockchain-verification" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <BlockchainVerification />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/ai-interviewer" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <AIInterviewer />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/aptitude-exams" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <AptitudeExams />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default route - redirect to appropriate landing page based on role */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    {({ user }) => (
                      user?.role === 'organization' ? <OrganizationHome /> : <StudentHome />
                    )}
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BlockchainProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
