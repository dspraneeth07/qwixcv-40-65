
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, FileText, CheckCircle, AlertCircle, Zap, Download, Target, Info, Briefcase } from "lucide-react";
import { ATSScoreDisplay } from "@/components/resume/ATSScoreDisplay";
import { generateATSScore, ATSScoreData } from "@/utils/atsScoreApi";
import { toast } from "@/components/ui/use-toast";
import * as THREE from "three";
import { getJobRecommendations } from "@/utils/jobBoardApi";
import { JobListing } from "@/types/job";

const ATSScanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScoreData | null>(null);
  const [jobRecommendations, setJobRecommendations] = useState<JobListing[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scannerRef.current) return;
    
    const container = scannerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    const documentGeometry = new THREE.BoxGeometry(3, 4, 0.1);
    const documentMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.5
    });
    const document = new THREE.Mesh(documentGeometry, documentMaterial);
    scene.add(document);
    
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const lineGeometry = new THREE.BoxGeometry(2, 0.08, 0.02);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = 1.5 - (i * 0.2);
      line.position.z = 0.06;
      line.scale.x = 0.5 + Math.random() * 0.5;
      linesGroup.add(line);
    }
    document.add(linesGroup);
    
    const scannerGeometry = new THREE.PlaneGeometry(3.2, 0.1);
    const scannerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
    scanner.position.z = 0.2;
    scanner.visible = false;
    scene.add(scanner);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);
    
    camera.position.z = 5;
    
    let scannerPosition = -2;
    let scannerDirection = 0.05;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      document.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      document.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      if (isAnalyzing) {
        scanner.visible = true;
        scanner.position.y = scannerPosition;
        scannerPosition += scannerDirection;
        
        if (scannerPosition > 2 || scannerPosition < -2) {
          scannerDirection *= -1;
        }
      } else {
        scanner.visible = false;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAnalyzing]);
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (validTypes.includes(file.type)) {
      setFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setAtsScore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const analyzeResume = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume file to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setJobRecommendations([]);
    
    try {
      setTimeout(async () => {
        const mockResumeData = {
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
        
        const scoreData = await generateATSScore(mockResumeData);
        setAtsScore(scoreData);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Your resume has been analyzed successfully."
        });
        
        // Fetch job recommendations based on skills and job title
        setIsLoadingJobs(true);
        
        try {
          // Extract skills from the resume
          const skills = Object.values(mockResumeData.skills)
            .filter(Boolean)
            .join(", ")
            .split(/[,;]\s*/)
            .filter(Boolean);
          
          const jobTitle = mockResumeData.personalInfo.jobTitle;
          const location = mockResumeData.personalInfo.location;
          
          const jobs = await getJobRecommendations(skills, jobTitle, location);
          setJobRecommendations(jobs.slice(0, 6)); // Display top 6 recommendations
        } catch (jobError) {
          console.error("Error fetching job recommendations:", jobError);
        } finally {
          setIsLoadingJobs(false);
        }
      }, 3000);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your resume. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="min-h-screen py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 z-0"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-4">
              Scan Your Resume & Optimize for Success
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-indigo-200">
              Upload your resume and our AI will analyze it for ATS compatibility, giving you actionable insights to improve your chances of getting hired.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="order-2 lg:order-1">
              <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-white">
                    <Upload className="mr-2 h-5 w-5 text-blue-500" />
                    Resume Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragging ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary/70'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-indigo-400 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">
                        Drag & Drop Your Resume
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Upload your PDF or Word resume for ATS analysis
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select File
                      </Button>
                    </div>
                  </div>
                  
                  {file && (
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-indigo-400 mr-3" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={removeFile}
                        className="hover:bg-red-500/20 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    onClick={analyzeResume} 
                    disabled={!file || isAnalyzing} 
                    className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 rounded-lg py-6 text-lg transition-all duration-300 ${
                      isAnalyzing ? 'animate-pulse' : ''
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                  
                  <div className="bg-blue-600/10 backdrop-blur-sm border border-blue-600/20 rounded-lg p-4 text-sm text-gray-300">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white mb-1">How it works:</p>
                        <p>Our AI scans your resume to identify keywords, formatting issues, and content gaps. It then provides a comprehensive ATS score analysis with targeted recommendations to improve your resume's performance.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2">
              {isAnalyzing ? (
                <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-white">
                      <Target className="mr-2 h-5 w-5 text-blue-500" />
                      Scanning Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      ref={scannerRef}
                      className="flex flex-col items-center justify-center h-[400px] w-full"
                    >
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-indigo-300 animate-pulse">Scanning and analyzing your resume...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : atsScore ? (
                <ATSScoreDisplay scoreData={atsScore} isLoading={false} />
              ) : (
                <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-white">
                      <Target className="mr-2 h-5 w-5 text-blue-500" />
                      Resume Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-24 h-24 rounded-full bg-indigo-900/50 flex items-center justify-center mb-6">
                        <FileText className="h-12 w-12 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        Upload Your Resume to Begin
                      </h3>
                      <p className="text-gray-400 max-w-md">
                        Our AI will analyze your resume for ATS compatibility and provide detailed suggestions to improve your chances of getting hired.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mb-3">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>
                        <h4 className="text-white font-medium mb-1">ATS Score</h4>
                        <p className="text-gray-400 text-sm">Get a detailed breakdown of your resume's performance</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mb-3">
                          <AlertCircle className="h-5 w-5 text-purple-400" />
                        </div>
                        <h4 className="text-white font-medium mb-1">Suggestions</h4>
                        <p className="text-gray-400 text-sm">Receive actionable recommendations to improve your resume</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center mb-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <h4 className="text-white font-medium mb-1">Job Match</h4>
                        <p className="text-gray-400 text-sm">See which jobs your resume is best suited for</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Job Recommendations Section */}
          {(atsScore && jobRecommendations.length > 0) && (
            <div className="mt-10">
              <Card className="border shadow-sm bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-white">
                    <Briefcase className="mr-2 h-5 w-5 text-green-400" />
                    Recommended Jobs Based on Your Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingJobs ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {jobRecommendations.map(job => (
                        <div 
                          key={job.id} 
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <h3 className="font-semibold text-white mb-1 line-clamp-1">{job.title}</h3>
                          <p className="text-sm text-blue-300 mb-2">{job.company}</p>
                          <p className="text-xs text-gray-300 mb-3">{job.location}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{job.description}</p>
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded px-3 py-1.5 inline-block"
                          >
                            View Job
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
              Ready to build a professional resume from scratch?
            </h2>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-lg px-8 py-6 hover:scale-105 transform rounded-xl"
            >
              <Link to="/builder">
                <Zap className="mr-2 h-5 w-5" />
                Build Your Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ATSScanner;
