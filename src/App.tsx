
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
              <Route path="/verify-cert/:certHash" element={<Layout><VerifyCertificate /></Layout>} />
              <Route path="/verify-document/:documentId" element={<Layout><VerifyDocument /></Layout>} />
              <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />

              {/* Student landing page */}
              <Route 
                path="/student-home" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Layout>
                      <StudentHome />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Organization landing page */}
              <Route 
                path="/organization-home" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <OrganizationHome />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Protected user/student routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* CV Tools Routes */}
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ResumeBuilder />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/linkedin-optimizer" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <LinkedInOptimizer />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ats-scanner" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ATSScanner />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/resume-compare" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ResumeCompare />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Career Guide Routes */}
              <Route 
                path="/career-path-simulator" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CareerPathSimulator />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/interview-coach" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <InterviewCoach />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-job-switch-planner" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AIJobSwitchPlanner />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-shadow-career-simulator" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AIShadowCareerSimulator />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/skill-gap-analysis" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SkillGapAnalysis />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-layoff-readiness-toolkit" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AILayoffReadinessToolkit />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* QwiX Learn Routes */}
              <Route 
                path="/mindprint-assessment" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MindprintAssessment />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-coding-coach" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AICodingCoach />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/qwixpro-builder" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QwiXProBuilder />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/job-board" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <JobBoard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Other protected routes that should only be accessible for students/freelancers */}
              <Route 
                path="/certification-center" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Layout>
                      <CertificationCenter />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/certificate/:id" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Layout>
                      <CertificateDetails />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Organization routes */}
              <Route 
                path="/organization/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <OrganizationDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/resume-parser" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <ResumeParser />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/document-generator" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <DocumentGenerator />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/blockchain-verification" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <BlockchainVerification />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/ai-interviewer" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <AIInterviewer />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/organization/aptitude-exams" 
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <Layout>
                      <AptitudeExams />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Default route - redirect to appropriate landing page based on role */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    {({ user }) => (
                      <Layout>
                        {user?.role === 'organization' ? <OrganizationHome /> : <StudentHome />}
                      </Layout>
                    )}
                  </ProtectedRoute>
                } 
              />
              
              {/* Public information pages */}
              <Route path="/about" element={<Layout><div className="container mx-auto px-4 py-8">About Page</div></Layout>} />
              <Route path="/contact" element={<Layout><div className="container mx-auto px-4 py-8">Contact Page</div></Layout>} />
              
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
