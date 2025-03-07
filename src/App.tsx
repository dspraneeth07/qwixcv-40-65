
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import ShareToCompany from "./pages/ShareToCompany";
import JobBoard from "./pages/JobBoard";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ATSScanner from "./pages/ATSScanner";
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/resume-preview" element={<ResumePreview />} />
          <Route path="/share-to-company" element={<ShareToCompany />} />
          <Route path="/job-board" element={<JobBoard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ats-scanner" element={<ATSScanner />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
