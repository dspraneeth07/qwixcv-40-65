
import { useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileCheck, AlertTriangle, Award, ArrowRight, Download, FileText, Scan } from "lucide-react";
import { motion } from "framer-motion";
import { generateATSScore } from "@/utils/atsScoreApi";
import { generateComparisonReport } from "@/utils/comparisonReportApi";
import { toast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { ResumeComparisonScanner } from "@/components/resume/ResumeComparisonScanner";

const ResumeCompare = () => {
  const [resumeA, setResumeA] = useState<File | null>(null);
  const [resumeB, setResumeB] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleResumeAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeA(e.target.files[0]);
    }
  };

  const handleResumeBUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeB(e.target.files[0]);
    }
  };

  const compareResumes = async () => {
    if (!resumeA || !resumeB) {
      toast({
        title: "Missing files",
        description: "Please upload both resumes to compare",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    
    try {
      // In a real application, this would parse the resume files
      // Here we'll simulate the process with mock data
      setTimeout(async () => {
        // Mock resume data that would normally be extracted from files
        const mockResumeDataA = {
          personalInfo: {
            firstName: "John",
            lastName: "Doe",
            jobTitle: "Software Engineer",
            email: "john.doe@example.com",
            phone: "+1 123-456-7890",
            location: "San Francisco, CA"
          },
          education: [{
            id: "1",
            school: "University of Technology",
            degree: "Bachelor of Science in Computer Science",
            graduationDate: "2019"
          }],
          experience: [{
            id: "1",
            jobTitle: "Software Engineer",
            companyName: "Tech Corp",
            startDate: "Jan 2020",
            description: "Developed and maintained web applications using React and Node.js."
          }],
          skills: {
            professional: "Project Management, Business Analysis",
            technical: "JavaScript, React, Node.js, TypeScript",
            soft: "Communication, Teamwork, Problem Solving"
          },
          objective: "Experienced software engineer seeking a challenging role in a dynamic organization."
        };

        const mockResumeDataB = {
          personalInfo: {
            firstName: "Jane",
            lastName: "Smith",
            jobTitle: "Frontend Developer",
            email: "jane.smith@example.com",
            phone: "+1 987-654-3210",
            location: "New York, NY"
          },
          education: [{
            id: "1",
            school: "State University",
            degree: "Master of Computer Science",
            graduationDate: "2020"
          }],
          experience: [{
            id: "1",
            jobTitle: "Frontend Developer",
            companyName: "Web Solutions Inc",
            startDate: "Mar 2021",
            description: "Built responsive web interfaces using React, improved site performance by 40%."
          }],
          skills: {
            professional: "UI/UX Design, Project Planning",
            technical: "React, TypeScript, CSS, HTML5, Redux",
            soft: "Leadership, Communication, Time Management"
          },
          objective: "Frontend Developer with expertise in React seeking opportunities to build intuitive user experiences."
        };

        // Generate ATS scores for both resumes
        const scoreDataA = await generateATSScore(mockResumeDataA);
        const scoreDataB = await generateATSScore(mockResumeDataB);

        // Use Gemini AI to generate comparison insights
        const comparisonData = await generateComparisonReport(
          mockResumeDataA, 
          mockResumeDataB, 
          scoreDataA, 
          scoreDataB
        );

        setComparisonResults(comparisonData);
        setIsComparing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Both resumes have been analyzed and compared successfully."
        });
      }, 3000);
    } catch (error) {
      console.error("Error comparing resumes:", error);
      setIsComparing(false);
      
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your resumes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadComparisonReport = () => {
    if (!reportRef.current || !comparisonResults) return;
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'resume-comparison-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
    };
    
    toast({
      title: "Generating PDF",
      description: "Your comparison report is being prepared for download..."
    });
    
    // Clone the report div to modify it for PDF
    const reportElement = reportRef.current.cloneNode(true) as HTMLElement;
    
    // Adjust styles for better PDF rendering
    const styles = document.createElement('style');
    styles.innerHTML = `
      body { font-family: 'SF Pro Display', 'Poppins', sans-serif; color: #333; }
      .pdf-header { text-align: center; margin-bottom: 20px; }
      .pdf-header h1 { font-size: 24px; color: #4338ca; margin-bottom: 10px; }
      .resume-card { margin-bottom: 20px; page-break-inside: avoid; }
      .resume-title { font-size: 18px; font-weight: bold; color: #4338ca; margin-bottom: 10px; }
      .score-item { margin-bottom: 8px; }
      .score-label { font-weight: bold; }
      .winner-badge { color: #10b981; font-weight: bold; }
      .section-title { font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; }
      .suggestion-item { margin-bottom: 5px; }
      .footer { text-align: center; font-size: 12px; margin-top: 20px; color: #6b7280; }
    `;
    reportElement.appendChild(styles);
    
    html2pdf().from(reportElement).set(opt).save().then(() => {
      toast({
        title: "PDF Downloaded",
        description: "Your comparison report has been successfully downloaded."
      });
    }).catch(error => {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    });
  };

  const handleShareToMedia = async () => {
    try {
      if (!comparisonResults) {
        toast({
          title: "No Results",
          description: "Please compare resumes first before sharing",
          variant: "destructive"
        });
        return;
      }

      const reportElement = reportRef.current;
      if (!reportElement) {
        toast({
          title: "Error",
          description: "Could not generate report for sharing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Preparing Report",
        description: "Getting your comparison ready for sharing..."
      });

      const opt = {
        margin: 1,
        filename: 'resume-comparison-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().from(reportElement).set(opt).outputPdf('blob');
      
      if (navigator.share && navigator.canShare({ files: [new File([pdfBlob], 'resume-comparison.pdf', { type: 'application/pdf' })] })) {
        await navigator.share({
          files: [new File([pdfBlob], 'resume-comparison.pdf', { type: 'application/pdf' })],
          title: 'Resume Comparison Report',
          text: 'Check out this resume comparison report from QwiX CV!'
        });
        
        toast({
          title: "Success",
          description: "Your comparison report has been shared"
        });
      } else {
        // Fallback for browsers that don't support sharing files
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'resume-comparison.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pdfUrl);
        
        toast({
          title: "Downloaded",
          description: "Your comparison report has been downloaded (sharing not supported in this browser)"
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not share your report. Please try downloading it instead.",
        variant: "destructive"
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-sf-pro font-bold mb-4 gradient-text">📊 Compare Your Resumes & Find the Best!</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload two different versions of your resume to see which one performs better with ATS systems.
            Our AI will analyze both and provide detailed feedback on which one is more likely to land you the job.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Resume A Upload */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-sf-pro font-semibold text-modern-blue-600">Resume A</h2>
              <p className="text-gray-500">Upload your first resume</p>
            </div>
            
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${resumeA ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-modern-blue-400'} transition-all duration-300`}>
              {resumeA ? (
                <div className="flex flex-col items-center">
                  <FileCheck className="h-16 w-16 text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">{resumeA.name}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setResumeA(null)}
                  >
                    Replace File
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-16 w-16 text-modern-blue-500 mb-2" />
                  <p className="text-modern-blue-600 font-medium mb-2">Drag & drop your resume or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="hidden" 
                    onChange={handleResumeAUpload}
                  />
                </label>
              )}
            </div>
          </motion.div>

          {/* Resume B Upload */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-sf-pro font-semibold text-modern-blue-600">Resume B</h2>
              <p className="text-gray-500">Upload your second resume</p>
            </div>
            
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${resumeB ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-modern-blue-400'} transition-all duration-300`}>
              {resumeB ? (
                <div className="flex flex-col items-center">
                  <FileCheck className="h-16 w-16 text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">{resumeB.name}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setResumeB(null)}
                  >
                    Replace File
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-16 w-16 text-modern-blue-500 mb-2" />
                  <p className="text-modern-blue-600 font-medium mb-2">Drag & drop your resume or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="hidden" 
                    onChange={handleResumeBUpload}
                  />
                </label>
              )}
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <Button
            variant="gradient"
            size="xl"
            className="px-10"
            disabled={!resumeA || !resumeB || isComparing}
            onClick={compareResumes}
          >
            {isComparing ? "Analyzing..." : "Compare Resumes"}
            {!isComparing && <ArrowRight className="ml-2" />}
          </Button>
        </div>

        {isComparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-12"
          >
            <Card className="border shadow-sm overflow-hidden glassmorphism">
              <CardHeader className="bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
                <CardTitle className="text-center flex items-center justify-center">
                  <Scan className="mr-2 h-5 w-5 animate-pulse" />
                  Scanning & Comparing Resumes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center py-8">
                  <ResumeComparisonScanner />
                </div>
                <p className="text-center text-gray-600 animate-pulse mt-4">
                  Our AI is analyzing both resumes for ATS compatibility, keywords, formatting, and content quality...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {comparisonResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-sf-pro font-bold text-center mb-8 gradient-text">Comparison Results</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Resume A Results */}
              <Card className={`overflow-hidden ${comparisonResults.winner === 'resumeA' ? 'border-2 border-green-500' : ''}`}>
                {comparisonResults.winner === 'resumeA' && (
                  <div className="absolute -right-12 top-10 bg-green-500 text-white py-2 px-12 transform rotate-45 flex items-center justify-center z-10">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">WINNER</span>
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-modern-blue-600 to-modern-blue-500 text-white">
                  <CardTitle className="text-center">Resume A Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-sf-pro font-semibold mb-4">ATS Score Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall ATS Score</span>
                          <span className="text-sm font-medium">
                            {comparisonResults?.resumeA?.atsScore || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-modern-blue-500 to-soft-purple" 
                            style={{ width: `${comparisonResults.resumeA.atsScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Keyword Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.keywordScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-modern-blue-500 to-soft-purple" 
                            style={{ width: `${comparisonResults.resumeA.keywordScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Format Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.formatScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-modern-blue-500 to-soft-purple" 
                            style={{ width: `${comparisonResults.resumeA.formatScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Content Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.contentScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-modern-blue-500 to-soft-purple" 
                            style={{ width: `${comparisonResults.resumeA.contentScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-sf-pro font-semibold mb-3 text-green-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                      </div>
                      Strengths
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeA.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-sf-pro font-semibold mb-3 text-amber-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      Areas to Improve
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeA.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-gray-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Resume B Results */}
              <Card className={`overflow-hidden ${comparisonResults.winner === 'resumeB' ? 'border-2 border-green-500' : ''}`}>
                {comparisonResults.winner === 'resumeB' && (
                  <div className="absolute -right-12 top-10 bg-green-500 text-white py-2 px-12 transform rotate-45 flex items-center justify-center z-10">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">WINNER</span>
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-soft-purple to-modern-blue-500 text-white">
                  <CardTitle className="text-center">Resume B Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-sf-pro font-semibold mb-4">ATS Score Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall ATS Score</span>
                          <span className="text-sm font-medium">
                            {comparisonResults?.resumeB?.atsScore || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-soft-purple to-modern-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.atsScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Keyword Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.keywordScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-soft-purple to-modern-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.keywordScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Format Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.formatScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-soft-purple to-modern-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.formatScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Content Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.contentScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-soft-purple to-modern-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.contentScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-sf-pro font-semibold mb-3 text-green-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                      </div>
                      Strengths
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeB.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-sf-pro font-semibold mb-3 text-amber-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      Areas to Improve
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeB.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-gray-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Expert Recommendation */}
            <Card className="glassmorphism my-8">
              <CardHeader>
                <CardTitle className="flex items-center text-modern-blue-600">
                  <Award className="mr-2 h-6 w-6 text-modern-blue-600" />
                  Expert Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{comparisonResults.reason}</p>
              </CardContent>
            </Card>
            
            {/* Improvement Suggestions */}
            <Card className="mb-10">
              <CardHeader className="bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
                <CardTitle>Improvement Suggestions for Both Resumes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {comparisonResults.improvementSuggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-modern-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-modern-blue-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Hidden div for PDF generation */}
            <div className="hidden">
              <div ref={reportRef} className="p-8 bg-white">
                <div className="pdf-header">
                  <h1>Resume Comparison Report</h1>
                  <p>Detailed analysis and recommendations powered by AI</p>
                </div>
                
                <div className="resume-card">
                  <div className="resume-title">Resume A Analysis</div>
                  <div className="score-item">
                    <span className="score-label">Overall ATS Score:</span> {comparisonResults.resumeA.atsScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Keyword Score:</span> {comparisonResults.resumeA.keywordScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Format Score:</span> {comparisonResults.resumeA.formatScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Content Score:</span> {comparisonResults.resumeA.contentScore}%
                  </div>
                  
                  <div className="section-title">Strengths:</div>
                  <ul>
                    {comparisonResults.resumeA.strengths.map((strength: string, index: number) => (
                      <li key={index} className="suggestion-item">{strength}</li>
                    ))}
                  </ul>
                  
                  <div className="section-title">Areas to Improve:</div>
                  <ul>
                    {comparisonResults.resumeA.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="suggestion-item">{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="resume-card">
                  <div className="resume-title">Resume B Analysis</div>
                  <div className="score-item">
                    <span className="score-label">Overall ATS Score:</span> {comparisonResults.resumeB.atsScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Keyword Score:</span> {comparisonResults.resumeB.keywordScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Format Score:</span> {comparisonResults.resumeB.formatScore}%
                  </div>
                  <div className="score-item">
                    <span className="score-label">Content Score:</span> {comparisonResults.resumeB.contentScore}%
                  </div>
                  
                  <div className="section-title">Strengths:</div>
                  <ul>
                    {comparisonResults.resumeB.strengths.map((strength: string, index: number) => (
                      <li key={index} className="suggestion-item">{strength}</li>
                    ))}
                  </ul>
                  
                  <div className="section-title">Areas to Improve:</div>
                  <ul>
                    {comparisonResults.resumeB.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="suggestion-item">{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="resume-card">
                  <div className="section-title">Expert Recommendation:</div>
                  <p>
                    {comparisonResults.winner === 'resumeA' ? 
                      <span className="winner-badge">Resume A is the winner. </span> : 
                      <span className="winner-badge">Resume B is the winner. </span>
                    }
                    {comparisonResults.reason}
                  </p>
                </div>
                
                <div className="resume-card">
                  <div className="section-title">Improvement Suggestions for Both Resumes:</div>
                  <ol>
                    {comparisonResults.improvementSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="suggestion-item">{suggestion}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="footer">
                  <p>Generated by QwiX CV | ATS Resume Scanner and Optimizer</p>
                  <p>https://qwixcv.com | © {new Date().getFullYear()} QwikZen</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                variant="gradient"
                className="mr-3"
                onClick={downloadComparisonReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button
                variant="outline"
                onClick={handleShareToMedia}
              >
                <FileText className="mr-2 h-4 w-4" />
                Share Report
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResumeCompare;
