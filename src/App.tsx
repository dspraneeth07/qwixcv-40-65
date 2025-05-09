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
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-cert/:certHash" element={<VerifyCertificate />} />
              <Route path="/verify-document/:documentId" element={<VerifyDocument />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

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
                    <Layout>
                      <Dashboard />
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
                    {({ user }) => {
                      if (user?.role === 'organization') {
                        return <OrganizationHome />;
                      } else {
                        return <StudentHome />;
                      }
                    }}
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
