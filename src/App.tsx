
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { BlockchainProvider } from "@/context/BlockchainContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentHome = lazy(() => import("./pages/StudentHome"));
const OrganizationHome = lazy(() => import("./pages/OrganizationHome"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const ATSScanner = lazy(() => import("./pages/ATSScanner"));
const ResumeCompare = lazy(() => import("./pages/ResumeCompare"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const CertificationCenter = lazy(() => import("./pages/CertificationCenter"));
const CertificateDetails = lazy(() => import("./pages/CertificateDetails"));
const CertificationTest = lazy(() => import("./pages/CertificationTest"));
const CareerPathSimulator = lazy(() => import("./pages/CareerPathSimulator"));
const InterviewCoach = lazy(() => import("./pages/InterviewCoach"));
const AIJobSwitchPlanner = lazy(() => import("./pages/AIJobSwitchPlanner"));
const AIShadowCareerSimulator = lazy(() => import("./pages/AIShadowCareerSimulator"));
const AILayoffReadinessToolkit = lazy(() => import("./pages/AILayoffReadinessToolkit"));
const SkillGapAnalysis = lazy(() => import("./pages/SkillGapAnalysis"));
const AICodingCoach = lazy(() => import("./pages/AICodingCoach"));
const QwiXProBuilder = lazy(() => import("./pages/QwiXProBuilder"));
const MindprintAssessment = lazy(() => import("./pages/MindprintAssessment"));
const JobBoard = lazy(() => import("./pages/JobBoard"));
const BlockchainVault = lazy(() => import("./pages/BlockchainVault"));

// Organization Pages
const OrganizationDashboard = lazy(() => import("./pages/organization/OrganizationDashboard"));
const AIInterviewer = lazy(() => import("./pages/organization/AIInterviewer"));
const ResumeParser = lazy(() => import("./pages/organization/ResumeParser"));
const AptitudeExams = lazy(() => import("./pages/organization/AptitudeExams"));
const BlockchainVerification = lazy(() => import("./pages/organization/BlockchainVerification"));
const DocumentGenerator = lazy(() => import("./pages/organization/DocumentGenerator"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <BlockchainProvider>
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes - Shared */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              {/* Student/Freelancer Routes */}
              <Route path="/student-home" element={<ProtectedRoute roles={['student']}><StudentHome /></ProtectedRoute>} />
              <Route path="/builder" element={<ProtectedRoute roles={['student']}><ResumeBuilder /></ProtectedRoute>} />
              <Route path="/ats-scanner" element={<ProtectedRoute roles={['student']}><ATSScanner /></ProtectedRoute>} />
              <Route path="/resume-compare" element={<ProtectedRoute roles={['student']}><ResumeCompare /></ProtectedRoute>} />
              <Route path="/linkedin-optimizer" element={<ProtectedRoute roles={['student']}><LinkedInOptimizer /></ProtectedRoute>} />
              <Route path="/career-path-simulator" element={<ProtectedRoute roles={['student']}><CareerPathSimulator /></ProtectedRoute>} />
              <Route path="/interview-coach" element={<ProtectedRoute roles={['student']}><InterviewCoach /></ProtectedRoute>} />
              <Route path="/ai-job-switch-planner" element={<ProtectedRoute roles={['student']}><AIJobSwitchPlanner /></ProtectedRoute>} />
              <Route path="/ai-shadow-career-simulator" element={<ProtectedRoute roles={['student']}><AIShadowCareerSimulator /></ProtectedRoute>} />
              <Route path="/ai-layoff-readiness-toolkit" element={<ProtectedRoute roles={['student']}><AILayoffReadinessToolkit /></ProtectedRoute>} />
              <Route path="/skill-gap-analysis" element={<ProtectedRoute roles={['student']}><SkillGapAnalysis /></ProtectedRoute>} />
              <Route path="/ai-coding-coach" element={<ProtectedRoute roles={['student']}><AICodingCoach /></ProtectedRoute>} />
              <Route path="/qwixpro-builder" element={<ProtectedRoute roles={['student']}><QwiXProBuilder /></ProtectedRoute>} />
              <Route path="/mindprint-assessment" element={<ProtectedRoute roles={['student']}><MindprintAssessment /></ProtectedRoute>} />
              <Route path="/certification-center" element={<ProtectedRoute roles={['student']}><CertificationCenter /></ProtectedRoute>} />
              <Route path="/certification/:id" element={<ProtectedRoute roles={['student']}><CertificateDetails /></ProtectedRoute>} />
              <Route path="/certification-test/:id" element={<ProtectedRoute roles={['student']}><CertificationTest /></ProtectedRoute>} />
              <Route path="/job-board" element={<ProtectedRoute roles={['student', 'organization']}><JobBoard /></ProtectedRoute>} />
              <Route path="/blockchain-vault" element={<ProtectedRoute roles={['student']}><BlockchainVault /></ProtectedRoute>} />
              
              {/* Organization Routes */}
              <Route path="/organization-home" element={<ProtectedRoute roles={['organization']}><OrganizationHome /></ProtectedRoute>} />
              <Route path="/organization/dashboard" element={<ProtectedRoute roles={['organization']}><OrganizationDashboard /></ProtectedRoute>} />
              <Route path="/organization/ai-interviewer" element={<ProtectedRoute roles={['organization']}><AIInterviewer /></ProtectedRoute>} />
              <Route path="/organization/resume-parser" element={<ProtectedRoute roles={['organization']}><ResumeParser /></ProtectedRoute>} />
              <Route path="/organization/aptitude-exams" element={<ProtectedRoute roles={['organization']}><AptitudeExams /></ProtectedRoute>} />
              <Route path="/organization/blockchain-verification" element={<ProtectedRoute roles={['organization']}><BlockchainVerification /></ProtectedRoute>} />
              <Route path="/organization/document-generator" element={<ProtectedRoute roles={['organization']}><DocumentGenerator /></ProtectedRoute>} />
              
              {/* Catch All - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BlockchainProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
