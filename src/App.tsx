
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { BlockchainProvider } from "./context/BlockchainContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import ShareToCompany from "./pages/ShareToCompany";
import JobBoard from "./pages/JobBoard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ATSScanner from "./pages/ATSScanner";
import ResumeCompare from "./pages/ResumeCompare";
import CareerPathSimulator from "./pages/CareerPathSimulator";
import Dashboard from "./pages/Dashboard";
import CertificationCenter from "./pages/CertificationCenter";
import CertificationTest from "./pages/CertificationTest";
import CertificateVerification from "./pages/CertificateVerification";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Unauthorized from "./pages/Auth/Unauthorized";
import InterviewCoach from "./pages/InterviewCoach";
import BlockchainVault from "./pages/BlockchainVault";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

function App() {
  // Load fonts
  useEffect(() => {
    // Add Google Fonts to the document head
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    // Add SF Pro Display (or a similar font that mimics it)
    const sfProLink = document.createElement('link');
    sfProLink.rel = 'stylesheet';
    sfProLink.href = 'https://fonts.cdnfonts.com/css/sf-pro-display';
    document.head.appendChild(sfProLink);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(sfProLink);
    };
  }, []);

  return (
    <ThemeProvider>
      <BlockchainProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/verify-cert/:certHash?" element={<CertificateVerification />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes - Student/Freelancer/Job Seeker */}
              <Route path="/builder" element={<ProtectedRoute allowedRoles={['student']}><ResumeBuilder /></ProtectedRoute>} />
              <Route path="/resume-preview" element={<ProtectedRoute allowedRoles={['student']}><ResumePreview /></ProtectedRoute>} />
              <Route path="/share-to-company" element={<ProtectedRoute allowedRoles={['student']}><ShareToCompany /></ProtectedRoute>} />
              <Route path="/job-board" element={<ProtectedRoute allowedRoles={['student']}><JobBoard /></ProtectedRoute>} />
              <Route path="/ats-scanner" element={<ProtectedRoute allowedRoles={['student']}><ATSScanner /></ProtectedRoute>} />
              <Route path="/resume-compare" element={<ProtectedRoute allowedRoles={['student']}><ResumeCompare /></ProtectedRoute>} />
              <Route path="/career-path-simulator" element={<ProtectedRoute allowedRoles={['student']}><CareerPathSimulator /></ProtectedRoute>} />
              <Route path="/interview-coach" element={<ProtectedRoute allowedRoles={['student']}><InterviewCoach /></ProtectedRoute>} />
              <Route path="/blockchain-vault" element={<ProtectedRoute allowedRoles={['student']}><BlockchainVault /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/certification-center" element={<ProtectedRoute><CertificationCenter /></ProtectedRoute>} />
              <Route path="/certification/:testId" element={<ProtectedRoute><CertificationTest /></ProtectedRoute>} />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </BlockchainProvider>
    </ThemeProvider>
  );
}

export default App;
