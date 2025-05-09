
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { BlockchainProvider } from "./context/BlockchainContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/toaster";

// Public Pages
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import StudentHome from "./pages/StudentHome";

// Resume & Career Tools
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import ResumeCompare from "./pages/ResumeCompare";
import ATSScanner from "./pages/ATSScanner";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import CareerPathSimulator from "./pages/CareerPathSimulator";

// Interview & Skills
import InterviewCoach from "./pages/InterviewCoach";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import MindprintAssessment from "./pages/MindprintAssessment";
import QwiXProBuilder from "./pages/QwiXProBuilder";
import AICodingCoach from "./pages/AICodingCoach";

// AI Tools
import AIJobSwitchPlanner from "./pages/AIJobSwitchPlanner";
import AIShadowCareerSimulator from "./pages/AIShadowCareerSimulator";
import AILayoffReadinessToolkit from "./pages/AILayoffReadinessToolkit";

// Jobs & Network
import JobBoard from "./pages/JobBoard";

// Blockchain & Certification
import BlockchainVault from "./pages/BlockchainVault";
import QwixVaultProfile from "./pages/QwixVaultProfile";
import VerifyDocument from "./pages/VerifyDocument";
import CertificationCenter from "./pages/CertificationCenter";
import CertificationTest from "./pages/CertificationTest";
import CertificateDetails from "./pages/CertificateDetails";
import CertificateVerification from "./pages/CertificateVerification";
import VerifyCertificate from "./pages/VerifyCertificate";
import ShareToCompany from "./pages/ShareToCompany";

// User & Dashboard
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TaskManagement from "./pages/TaskManagement";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Organization Pages
import OrganizationHome from "./pages/OrganizationHome";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import AIInterviewer from "./pages/organization/AIInterviewer";
import AptitudeExams from "./pages/organization/AptitudeExams";
import ResumeParser from "./pages/organization/ResumeParser";
import DocumentGenerator from "./pages/organization/DocumentGenerator";
import BlockchainVerification from "./pages/organization/BlockchainVerification";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// CSS
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BlockchainProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Resume Routes */}
                  <Route path="/builder" element={<ResumeBuilder />} />
                  <Route path="/resume-preview" element={<ResumePreview />} />
                  <Route path="/resume-compare" element={<ResumeCompare />} />
                  <Route path="/ats-scanner" element={<ATSScanner />} />
                  <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
                  
                  {/* Career Routes */}
                  <Route path="/career-path-simulator" element={<CareerPathSimulator />} />
                  <Route path="/job-switch-planner" element={<AIJobSwitchPlanner />} />
                  <Route path="/shadow-career-simulator" element={<AIShadowCareerSimulator />} />
                  <Route path="/layoff-readiness" element={<AILayoffReadinessToolkit />} />
                  
                  {/* Interview & Skills Routes */}
                  <Route path="/interview-coach" element={<InterviewCoach />} />
                  <Route path="/skill-gap" element={<SkillGapAnalysis />} />
                  <Route path="/mindprint" element={<MindprintAssessment />} />
                  <Route path="/portfolio-builder" element={<QwiXProBuilder />} />
                  <Route path="/coding-coach" element={<AICodingCoach />} />
                  
                  {/* Jobs Routes */}
                  <Route path="/job-board" element={<JobBoard />} />
                  
                  {/* Blockchain Routes */}
                  <Route path="/blockchain-vault" element={<BlockchainVault />} />
                  <Route path="/qwix-vault-profile" element={<QwixVaultProfile />} />
                  <Route path="/verify-document" element={<VerifyDocument />} />
                  <Route path="/share-to-company" element={<ShareToCompany />} />
                  
                  {/* Certification Routes */}
                  <Route path="/certification-center" element={<CertificationCenter />} />
                  <Route path="/certification-test/:id" element={<CertificationTest />} />
                  <Route path="/certificate/:id" element={<CertificateDetails />} />
                  <Route path="/certificate-verification/:id" element={<CertificateVerification />} />
                  <Route path="/verify-certificate" element={<VerifyCertificate />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                  <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                  <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
                  <Route path="/tasks" element={<ProtectedRoute element={<TaskManagement />} />} />
                  <Route path="/student-home" element={<ProtectedRoute element={<StudentHome />} />} />
                  
                  {/* Organization Routes */}
                  <Route path="/organization" element={<OrganizationHome />} />
                  <Route path="/organization/dashboard" element={<ProtectedRoute element={<OrganizationDashboard />} />} />
                  <Route path="/organization/ai-interviewer" element={<ProtectedRoute element={<AIInterviewer />} />} />
                  <Route path="/organization/aptitude-exams" element={<ProtectedRoute element={<AptitudeExams />} />} />
                  <Route path="/organization/resume-parser" element={<ProtectedRoute element={<ResumeParser />} />} />
                  <Route path="/organization/document-generator" element={<ProtectedRoute element={<DocumentGenerator />} />} />
                  <Route path="/organization/blockchain-verification" element={<ProtectedRoute element={<BlockchainVerification />} />} />
                  
                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
            <Toaster />
          </BlockchainProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
