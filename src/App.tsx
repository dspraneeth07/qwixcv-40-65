
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import ResumeBuilder from "@/pages/ResumeBuilder";
import ResumePreview from "@/pages/ResumePreview";
import ResumeCompare from "@/pages/ResumeCompare";
import ATSScanner from "@/pages/ATSScanner";
import InterviewCoach from "@/pages/InterviewCoach";
import CareerPathSimulator from "@/pages/CareerPathSimulator";
import CertificationCenter from "@/pages/CertificationCenter";
import CertificationTest from "@/pages/CertificationTest";
import CertificateVerification from "@/pages/CertificateVerification";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";
import JobBoard from "@/pages/JobBoard";
import ShareToCompany from "@/pages/ShareToCompany";
import ProtectedRoute from "@/components/ProtectedRoute";
import Unauthorized from "@/pages/Auth/Unauthorized";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { BlockchainProvider } from "@/context/BlockchainContext";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BlockchainVault from "@/pages/BlockchainVault";
import VerifyDocument from "@/pages/VerifyDocument";
import QwixVaultProfilePage from "@/pages/QwixVaultProfilePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="qwix360-theme">
        <AuthProvider>
          <BlockchainProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/verify-certificate/:id" element={<CertificateVerification />} />
                <Route path="/verify-document/:uniqueId" element={<VerifyDocument />} />
                <Route path="/qwixvault-profile/:address" element={<QwixVaultProfilePage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/resume-preview/:id" element={<ResumePreview />} />
                  <Route path="/resume-compare" element={<ResumeCompare />} />
                  <Route path="/ats-scanner" element={<ATSScanner />} />
                  <Route path="/interview-coach" element={<InterviewCoach />} />
                  <Route path="/career-path-simulator" element={<CareerPathSimulator />} />
                  <Route path="/certification-center" element={<CertificationCenter />} />
                  <Route path="/certification-test/:id" element={<CertificationTest />} />
                  <Route path="/job-board" element={<JobBoard />} />
                  <Route path="/share-to-company/:id" element={<ShareToCompany />} />
                  <Route path="/blockchain-vault" element={<BlockchainVault />} />
                  <Route path="/blockchain-vault/documents" element={<BlockchainVault />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </BlockchainProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
