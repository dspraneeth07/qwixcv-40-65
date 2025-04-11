
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, RefreshCw, Download, Info, Box, Brain, ArrowRight, FilePlus2 } from "lucide-react";
import { generateCareerPaths } from "@/utils/careerPathGenerator";
import { CareerPathVisualization } from "@/components/career/CareerPathVisualization";
import { resumeParser } from "@/utils/resumeParser";
import { toast } from "@/components/ui/use-toast";
import { CareerNode, CareerPath } from "@/types/career";
import { RoleDetails } from "@/components/career/RoleDetails";
import { HackathonBadge } from "@/components/career/HackathonBadge";

const CareerPathSimulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[] | null>(null);
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<CareerNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Parse the resume with our AI-enhanced parser
      const parsedResume = await resumeParser(file);
      setResumeData(parsedResume);
      
      toast({
        title: "Resume analyzed successfully!",
        description: "Generating your personalized career paths...",
      });
      
      // Generate career paths based on resume data
      generatePaths(parsedResume);
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error processing resume",
        description: "There was an issue analyzing your resume. Please try again with a different PDF.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate career paths
  const generatePaths = async (data: any = null) => {
    setIsLoading(true);
    try {
      const dataToUse = data || resumeData;
      if (!dataToUse) {
        toast({
          title: "No resume data",
          description: "Please upload your resume first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const paths = await generateCareerPaths(dataToUse);
      setCareerPaths(paths);
      setActivePathIndex(0);
      setSelectedRole(null);
      
      toast({
        title: "Career paths generated",
        description: "Your personalized career roadmap is ready to explore.",
      });
    } catch (error) {
      console.error("Error generating career paths:", error);
      toast({
        title: "Error generating career paths",
        description: "There was an issue creating your career paths. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: CareerNode) => {
    setSelectedRole(role);
  };

  // Download career path as PDF
  const downloadCareerPath = () => {
    toast({
      title: "Downloading career path",
      description: "Your career path roadmap is being downloaded as a PDF.",
    });
    // In a real implementation, this would generate and download a PDF
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 md:py-12 relative">
        {/* Header with hackathon badge */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                Career Path Simulator™
                <Sparkles className="ml-2 h-6 w-6 text-modern-blue-500" />
              </h1>
              <HackathonBadge />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Visualize your potential career paths based on your current skills and experience, powered by AI.
            </p>
          </div>
        </div>

        {!resumeData ? (
          <Card className="border shadow-md mb-8">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume to generate personalized career path options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-modern-blue-500 transition-all cursor-pointer bg-gray-50"
                onClick={triggerFileUpload}
              >
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-modern-blue-100 text-modern-blue-500 mb-4">
                  <FilePlus2 className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Resume (PDF)</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Upload your resume to let our AI analyze your experience and skills to generate personalized career path options
                </p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-modern-blue-600 hover:bg-modern-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileUpload();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select PDF File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Resume Summary */}
            <Card className="border shadow-md mb-8">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Resume Analysis</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setResumeData(null)}>
                    Change Resume
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">Current Role</Label>
                    <p className="font-medium">{resumeData.currentRole}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Experience</Label>
                    <p className="font-medium">{resumeData.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Education</Label>
                    <p className="font-medium">{resumeData.education[0]}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {resumeData.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Soft Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {resumeData.softSkills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">{skill}</Badge>
                    ))}
                  </div>
                </div>
                {resumeData.certifications && resumeData.certifications.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {resumeData.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="default" className="bg-modern-blue-100 text-modern-blue-800 hover:bg-modern-blue-200">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Path Visualization */}
            <Card className="border shadow-lg mb-8">
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <CardTitle>Your Career Path Options</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => generatePaths()} disabled={isLoading}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Regenerate Paths
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCareerPath}>
                      <Download className="mr-2 h-4 w-4" />
                      Save Roadmap
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Explore three potential career paths based on your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 border-4 border-t-modern-blue-500 border-modern-blue-200 rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Analyzing your career options...</p>
                  </div>
                ) : careerPaths ? (
                  <>
                    <Tabs defaultValue="ambitious" className="w-full" onValueChange={(value) => {
                      setActivePathIndex(value === "ambitious" ? 0 : value === "skills" ? 1 : 2);
                      setSelectedRole(null);
                    }}>
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="ambitious" className="flex items-center gap-2">
                          <Box className="h-4 w-4" />
                          <span className="hidden sm:inline">Leadership Track</span>
                          <span className="sm:hidden">Leadership</span>
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span className="hidden sm:inline">Technical Path</span>
                          <span className="sm:hidden">Technical</span>
                        </TabsTrigger>
                        <TabsTrigger value="balanced" className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          <span className="hidden sm:inline">Balanced Growth</span>
                          <span className="sm:hidden">Balanced</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="ambitious" className="m-0">
                        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-700">
                            {careerPaths[0].description}
                          </p>
                        </div>
                        <div className="h-[400px] lg:h-[500px] mb-4 border rounded-md overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                          <CareerPathVisualization 
                            path={careerPaths[0]} 
                            onRoleSelect={handleRoleSelect}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="skills" className="m-0">
                        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-700">
                            {careerPaths[1].description}
                          </p>
                        </div>
                        <div className="h-[400px] lg:h-[500px] mb-4 border rounded-md overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                          <CareerPathVisualization 
                            path={careerPaths[1]} 
                            onRoleSelect={handleRoleSelect}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="balanced" className="m-0">
                        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-700">
                            {careerPaths[2].description}
                          </p>
                        </div>
                        <div className="h-[400px] lg:h-[500px] mb-4 border rounded-md overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                          <CareerPathVisualization 
                            path={careerPaths[2]} 
                            onRoleSelect={handleRoleSelect}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No career paths generated yet</p>
                    <Button onClick={() => generatePaths()} className="mt-4 bg-modern-blue-600 hover:bg-modern-blue-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Career Paths
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Details Card - shown when a role is selected */}
            {selectedRole && (
              <RoleDetails role={selectedRole} />
            )}
          </>
        )}

        {/* Feature Information */}
        <Card className="border shadow-md mt-12">
          <CardHeader>
            <CardTitle className="text-lg">About Career Path Simulator™</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This AI-powered feature analyzes your resume to predict potential career trajectories. 
              It generates three different paths: an ambitious leadership route, a skills-focused technical path, 
              and a balanced path that prioritizes steady growth with work-life balance.
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between flex-wrap gap-4">
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              Results are based on current market trends and may vary based on industry changes
            </p>
            <Button variant="link" size="sm" onClick={() => navigate("/builder")} className="p-0">
              Update your resume to refine results
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CareerPathSimulator;
