
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormValidator } from "@/components/ui/form-validator";
import { 
  Download, 
  Plus, 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Trash2,
  Save,
  ListChecks,
  GraduationCap,
  Briefcase,
  User
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

// Interface for education entries
interface Education {
  id: string;
  customName: string;
  school: string;
  degree: string;
  graduationDate: string;
  score: string;
}

// Interface for work experience entries
interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Interface for personal information
interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

// Interface for skills
interface Skills {
  professional: string;
  technical: string;
  soft: string;
}

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template") || "modern1"; // Default template
  const [activeTab, setActiveTab] = useState("personal");
  const [formValid, setFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  
  // Form data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: ""
  });
  
  const [education, setEducation] = useState<Education[]>([
    {
      id: "edu1",
      customName: "Education #1",
      school: "",
      degree: "",
      graduationDate: "",
      score: ""
    }
  ]);
  
  const [experience, setExperience] = useState<Experience[]>([
    {
      id: "exp1",
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  ]);
  
  const [skills, setSkills] = useState<Skills>({
    professional: "",
    technical: "",
    soft: ""
  });
  
  const [objective, setObjective] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  
  // Ref for country code detection
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const countryCodeRef = useRef<string>("+1"); // Default to US country code
  
  useEffect(() => {
    // Detect country code based on user's location (simplified example)
    // In a real app, you would use a geolocation API or service
    const detectCountryCode = async () => {
      try {
        // This is a placeholder - in a real app you'd use a geolocation service
        // For demo purposes, we'll stick with +1 (US)
        countryCodeRef.current = "+1";
      } catch (error) {
        console.error("Error detecting country code:", error);
        // Default to +1 if detection fails
        countryCodeRef.current = "+1";
      }
    };
    
    detectCountryCode();
  }, []);

  // Validate form fields
  useEffect(() => {
    // Check personal info section
    const personalInfoValid = 
      personalInfo.firstName.trim() !== "" && 
      personalInfo.lastName.trim() !== "" && 
      personalInfo.jobTitle.trim() !== "" && 
      personalInfo.email.trim() !== "" && 
      personalInfo.phone.trim() !== "" && 
      personalInfo.location.trim() !== "" && 
      personalInfo.summary.trim() !== "";
    
    // Check education section
    const educationValid = education.every(edu => 
      edu.school.trim() !== "" && 
      edu.degree.trim() !== "" && 
      edu.graduationDate.trim() !== "" && 
      edu.score.trim() !== ""
    );
    
    // Check skills section
    const skillsValid = 
      skills.professional.trim() !== "" && 
      skills.technical.trim() !== "" && 
      skills.soft.trim() !== "";
    
    // Check objective
    const objectiveValid = objective.trim() !== "";
    
    // Work experience is optional
    
    // Collect specific errors
    const errors: Record<string, boolean> = {};
    
    // Personal info fields
    if (personalInfo.firstName.trim() === "") errors.firstName = true;
    if (personalInfo.lastName.trim() === "") errors.lastName = true;
    if (personalInfo.jobTitle.trim() === "") errors.jobTitle = true;
    if (personalInfo.email.trim() === "") errors.email = true;
    if (personalInfo.phone.trim() === "") errors.phone = true;
    if (personalInfo.location.trim() === "") errors.location = true;
    if (personalInfo.summary.trim() === "") errors.summary = true;
    
    // Education fields
    education.forEach((edu, index) => {
      if (edu.school.trim() === "") errors[`edu_${index}_school`] = true;
      if (edu.degree.trim() === "") errors[`edu_${index}_degree`] = true;
      if (edu.graduationDate.trim() === "") errors[`edu_${index}_graduationDate`] = true;
      if (edu.score.trim() === "") errors[`edu_${index}_score`] = true;
    });
    
    // Skills fields
    if (skills.professional.trim() === "") errors.professional = true;
    if (skills.technical.trim() === "") errors.technical = true;
    if (skills.soft.trim() === "") errors.soft = true;
    
    // Objective
    if (objective.trim() === "") errors.objective = true;
    
    setFormErrors(errors);
    setFormValid(personalInfoValid && educationValid && skillsValid && objectiveValid);
  }, [personalInfo, education, skills, objective]);
  
  const handleNext = () => {
    const tabs = ["personal", "education", "experience", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    const tabs = ["personal", "education", "experience", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  const handleGenerate = () => {
    if (!formValid) {
      // Show which tab has errors
      if (formErrors.firstName || formErrors.lastName || formErrors.jobTitle || 
          formErrors.email || formErrors.phone || formErrors.location || formErrors.summary) {
        setActiveTab("personal");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Personal tab.",
          variant: "destructive"
        });
        return;
      }
      
      // Check education errors
      const hasEducationErrors = Object.keys(formErrors).some(key => key.startsWith("edu_"));
      if (hasEducationErrors) {
        setActiveTab("education");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Education tab.",
          variant: "destructive"
        });
        return;
      }
      
      // Check skills errors
      if (formErrors.professional || formErrors.technical || formErrors.soft) {
        setActiveTab("skills");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Skills tab.",
          variant: "destructive"
        });
        return;
      }
      
      // Check objective error
      if (formErrors.objective) {
        setActiveTab("objectives");
        toast({
          title: "Missing Information",
          description: "Please provide a career objective.",
          variant: "destructive"
        });
        return;
      }
      
      return;
    }
    
    // Gather all resume data
    const resumeData = {
      personalInfo,
      education,
      experience,
      skills,
      objective,
      templateId
    };
    
    console.log("Generating resume with data:", resumeData);
    
    // In a real app, this would generate a PDF or redirect to a preview page
    // For this demo, we'll simulate a PDF opening in a new tab
    
    toast({
      title: "Resume Generated!",
      description: "Your professional resume has been created successfully.",
    });
    
    // Simulate opening PDF in new tab
    const resumeUrl = `/resume-preview?data=${encodeURIComponent(JSON.stringify(resumeData))}`;
    
    // Open in new tab
    window.open(resumeUrl, "_blank");
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9+]/g, "");
    
    // Ensure country code is preserved
    let formattedPhone = numericValue;
    if (!numericValue.startsWith("+")) {
      formattedPhone = countryCodeRef.current + numericValue;
    } else {
      // If user is modifying the country code, update the ref
      const parts = numericValue.split(" ");
      if (parts[0]?.startsWith("+")) {
        countryCodeRef.current = parts[0];
      }
    }
    
    setPersonalInfo({
      ...personalInfo,
      phone: formattedPhone
    });
  };
  
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu${education.length + 1}`,
      customName: `Education #${education.length + 1}`,
      school: "",
      degree: "",
      graduationDate: "",
      score: ""
    };
    
    setEducation([...education, newEducation]);
  };
  
  const handleRemoveEducation = (id: string) => {
    if (education.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one education entry.",
        variant: "destructive"
      });
      return;
    }
    
    setEducation(education.filter(edu => edu.id !== id));
  };
  
  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };
  
  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp${experience.length + 1}`,
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    
    setExperience([...experience, newExperience]);
  };
  
  const handleRemoveExperience = (id: string) => {
    if (experience.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one experience entry.",
        variant: "destructive"
      });
      return;
    }
    
    setExperience(experience.filter(exp => exp.id !== id));
  };
  
  const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };
  
  const generateAIContent = (type: string, context: any = {}) => {
    setGeneratingAI(true);
    
    // Simulate AI suggestion generation
    setTimeout(() => {
      let generatedContent = "";
      
      switch (type) {
        case "summary":
          generatedContent = `Experienced ${personalInfo.jobTitle || "professional"} with a strong background in ${skills.professional || "various industries"}. Skilled in ${skills.technical || "relevant technical areas"} with excellent ${skills.soft || "soft skills"}. Seeking to leverage my expertise to drive results and contribute to organizational success.`;
          setPersonalInfo({
            ...personalInfo,
            summary: generatedContent
          });
          break;
          
        case "jobDescription":
          generatedContent = `• Led cross-functional teams to achieve project objectives and business goals\n• Increased efficiency by 20% through implementation of streamlined processes\n• Collaborated with stakeholders to ensure alignment with organizational strategy\n• Managed resources effectively to optimize productivity and performance`;
          
          setExperience(experience.map(exp => 
            exp.id === context.id ? { ...exp, description: generatedContent } : exp
          ));
          break;
          
        case "score":
          generatedContent = "GPA: 3.8/4.0";
          setEducation(education.map(edu => 
            edu.id === context.id ? { ...edu, score: generatedContent } : edu
          ));
          break;
          
        case "objective":
          generatedContent = `Seeking a challenging ${personalInfo.jobTitle || "professional"} position where I can utilize my skills in ${skills.professional || "relevant areas"} to contribute to organizational growth while expanding my expertise in ${skills.technical || "technical skills"}.`;
          setObjective(generatedContent);
          break;
          
        case "skillSuggestions":
          if (personalInfo.jobTitle?.toLowerCase().includes("marketing")) {
            setSkills({
              professional: "Digital Marketing, Content Strategy, Brand Management, Market Research, Campaign Planning",
              technical: "Google Analytics, SEO/SEM, Adobe Creative Suite, Social Media Platforms, Email Marketing Software",
              soft: "Communication, Creativity, Analytical Thinking, Project Management, Collaboration"
            });
          } else if (personalInfo.jobTitle?.toLowerCase().includes("developer") || personalInfo.jobTitle?.toLowerCase().includes("engineer")) {
            setSkills({
              professional: "Software Development, Web Application Architecture, Database Design, API Integration, Testing & Debugging",
              technical: "JavaScript, React, Node.js, Python, SQL, Git, Docker, CI/CD",
              soft: "Problem-solving, Communication, Teamwork, Time Management, Adaptability"
            });
          } else {
            setSkills({
              professional: "Project Management, Strategic Planning, Process Improvement, Team Leadership, Client Relationship Management",
              technical: "Microsoft Office Suite, CRM Systems, Data Analysis, Reporting Tools, Collaboration Software",
              soft: "Communication, Leadership, Problem-solving, Decision Making, Time Management"
            });
          }
          break;
      }
      
      setGeneratingAI(false);
      
      toast({
        title: "AI Suggestion Generated",
        description: "The AI has created content based on your information.",
      });
    }, 1500);
  };

  useEffect(() => {
    if (templateId) {
      toast({
        title: "Template Selected",
        description: `You've selected template ${templateId}. Customize it now!`,
      });
    }
  }, [templateId]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
            Build Your Professional Resume
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and let our AI help you create a standout resume
          </p>
        </div>
        
        <div className="relative">
          {templateId && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Using template: {templateId}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/templates">Change Template</a>
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-8">
            <div>
              <div className="bg-card shadow-sm rounded-lg border mb-6">
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Resume Information</span>
                    <span className={`${formValid ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"} text-xs px-2 py-0.5 rounded`}>
                      {formValid ? "Ready to Generate" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex justify-between px-4 py-2 bg-muted/50">
                    <TabsTrigger value="personal" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      <span className="hidden sm:inline">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="objectives" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Objectives</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Personal Details</CardTitle>
                        <CardDescription>
                          Enter your personal information to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center">
                              First Name <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input 
                              id="firstName"
                              placeholder="John"
                              className="max-w-md"
                              value={personalInfo.firstName}
                              onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                            />
                            <FormValidator value={personalInfo.firstName} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center">
                              Last Name <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input 
                              id="lastName"
                              placeholder="Doe"
                              className="max-w-md"
                              value={personalInfo.lastName}
                              onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                            />
                            <FormValidator value={personalInfo.lastName} required />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="flex items-center">
                            Professional Title <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input 
                            id="jobTitle"
                            placeholder="Marketing Specialist"
                            className="max-w-md"
                            value={personalInfo.jobTitle}
                            onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                          />
                          <FormValidator value={personalInfo.jobTitle} required />
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span>AI suggests titles that match your experience</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center">
                              Email <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input 
                              id="email"
                              type="email"
                              placeholder="john.doe@example.com"
                              className="max-w-md"
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                            />
                            <FormValidator value={personalInfo.email} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center">
                              Phone <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input 
                              id="phone"
                              placeholder="(123) 456-7890"
                              className="max-w-md"
                              value={personalInfo.phone}
                              onChange={handlePhoneChange}
                              ref={phoneInputRef}
                            />
                            <FormValidator value={personalInfo.phone} required />
                            {personalInfo.phone && !/^\+\d+/.test(personalInfo.phone) && (
                              <p className="text-sm text-destructive">Phone number must include country code (e.g., +1)</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center">
                            Location <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input 
                            id="location"
                            placeholder="New York, NY"
                            className="max-w-md"
                            value={personalInfo.location}
                            onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          />
                          <FormValidator value={personalInfo.location} required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="summary" className="flex items-center">
                            Professional Summary <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea 
                            id="summary" 
                            placeholder="Experienced marketing professional with 5+ years in digital strategy..."
                            rows={4}
                            className="w-full"
                            value={personalInfo.summary}
                            onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                          />
                          <FormValidator value={personalInfo.summary} required />
                          <div className="flex items-center gap-2 mt-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 text-sm"
                              onClick={() => generateAIContent("summary")}
                              disabled={generatingAI}
                            >
                              <Lightbulb className="h-3 w-3" />
                              AI Suggestions
                            </Button>
                            <span className="text-sm text-muted-foreground">Let AI write a compelling summary for you</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="education" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Education</CardTitle>
                        <CardDescription>
                          Add your educational background
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-6">
                          {education.map((edu, index) => (
                            <div key={edu.id} className="p-4 border rounded-md">
                              <div className="flex justify-between items-start mb-3">
                                <div className="space-y-2 max-w-xs">
                                  <Label htmlFor={`customName-${edu.id}`} className="flex items-center">
                                    Entry Name <span className="text-destructive ml-1">*</span>
                                  </Label>
                                  <Input 
                                    id={`customName-${edu.id}`}
                                    placeholder="e.g., Graduation, Schooling"
                                    value={edu.customName}
                                    onChange={(e) => handleEducationChange(edu.id, "customName", e.target.value)}
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleRemoveEducation(edu.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`school-${edu.id}`} className="flex items-center">
                                    School/University <span className="text-destructive ml-1">*</span>
                                  </Label>
                                  <Input 
                                    id={`school-${edu.id}`}
                                    placeholder="Harvard University"
                                    className="max-w-md"
                                    value={edu.school}
                                    onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)}
                                  />
                                  <FormValidator 
                                    value={edu.school} 
                                    required 
                                    errorMessage="Institution name is required" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`degree-${edu.id}`} className="flex items-center">
                                    Degree <span className="text-destructive ml-1">*</span>
                                  </Label>
                                  <Input 
                                    id={`degree-${edu.id}`}
                                    placeholder="Bachelor of Science"
                                    className="max-w-md"
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                                  />
                                  <FormValidator 
                                    value={edu.degree} 
                                    required 
                                    errorMessage="Degree is required" 
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`graduationDate-${edu.id}`} className="flex items-center">
                                    Year of Completion <span className="text-destructive ml-1">*</span>
                                  </Label>
                                  <Input 
                                    id={`graduationDate-${edu.id}`}
                                    placeholder="May 2020"
                                    className="max-w-md"
                                    value={edu.graduationDate}
                                    onChange={(e) => handleEducationChange(edu.id, "graduationDate", e.target.value)}
                                  />
                                  <FormValidator 
                                    value={edu.graduationDate} 
                                    required 
                                    errorMessage="Graduation date is required" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`score-${edu.id}`} className="flex items-center">
                                    Score/GPA <span className="text-destructive ml-1">*</span>
                                  </Label>
                                  <Input 
                                    id={`score-${edu.id}`}
                                    placeholder="e.g., GPA 3.8/4.0"
                                    className="max-w-md"
                                    value={edu.score}
                                    onChange={(e) => handleEducationChange(edu.id, "score", e.target.value)}
                                  />
                                  <FormValidator 
                                    value={edu.score} 
                                    required 
                                    errorMessage="Score is required" 
                                  />
                                  <div className="flex items-center gap-2 mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="gap-1 text-sm"
                                      onClick={() => generateAIContent("score", {id: edu.id})}
                                      disabled={generatingAI}
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      AI Format
                                    </Button>
                                    <span className="text-sm text-muted-foreground">Format score professionally</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            variant="outline" 
                            className="gap-2 w-full"
                            onClick={handleAddEducation}
                          >
                            <Plus className="h-4 w-4" />
                            Add Another Education
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Work Experience</CardTitle>
                        <CardDescription>
                          Add your work history, starting with the most recent (optional)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-6">
                          {experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border rounded-md">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium">Experience #{index + 1}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleRemoveExperience(exp.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label>
                                  <Input 
                                    id={`jobTitle-${exp.id}`}
                                    placeholder="Marketing Manager"
                                    className="max-w-md"
                                    value={exp.jobTitle}
                                    onChange={(e) => handleExperienceChange(exp.id, "jobTitle", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`companyName-${exp.id}`}>Company Name</Label>
                                  <Input 
                                    id={`companyName-${exp.id}`}
                                    placeholder="Acme Inc."
                                    className="max-w-md"
                                    value={exp.companyName}
                                    onChange={(e) => handleExperienceChange(exp.id, "companyName", e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                                  <Input 
                                    id={`startDate-${exp.id}`}
                                    placeholder="June 2018"
                                    className="max-w-md"
                                    value={exp.startDate}
                                    onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                                  <Input 
                                    id={`endDate-${exp.id}`}
                                    placeholder="Present"
                                    className="max-w-md"
                                    value={exp.endDate}
                                    onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2 mt-4">
                                <Label htmlFor={`jobDescription-${exp.id}`}>Description</Label>
                                <Textarea 
                                  id={`jobDescription-${exp.id}`}
                                  placeholder="• Increased sales by 20% through strategic digital marketing initiatives..."
                                  rows={4}
                                  className="w-full"
                                  value={exp.description}
                                  onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                                />
                                <div className="flex items-center gap-2 mt-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-1 text-sm"
                                    onClick={() => generateAIContent("jobDescription", {id: exp.id})}
                                    disabled={generatingAI}
                                  >
                                    <Lightbulb className="h-3 w-3" />
                                    AI Enhancement
                                  </Button>
                                  <span className="text-sm text-muted-foreground">Let AI improve your bullet points</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            variant="outline" 
                            className="gap-2 w-full"
                            onClick={handleAddExperience}
                          >
                            <Plus className="h-4 w-4" />
                            Add Another Experience
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Skills</CardTitle>
                        <CardDescription>
                          Add your key skills and competencies
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="professionalSkills" className="flex items-center">
                              Professional Skills <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Textarea 
                              id="professionalSkills" 
                              placeholder="Social Media Marketing, Content Strategy, SEO/SEM, Google Analytics, Adobe Creative Suite..."
                              rows={3}
                              className="w-full"
                              value={skills.professional}
                              onChange={(e) => setSkills({...skills, professional: e.target.value})}
                            />
                            <FormValidator value={skills.professional} required />
                            <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="technicalSkills" className="flex items-center">
                              Technical Skills <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Textarea 
                              id="technicalSkills" 
                              placeholder="JavaScript, React, Python, SQL, HTML/CSS..."
                              rows={2}
                              className="w-full"
                              value={skills.technical}
                              onChange={(e) => setSkills({...skills, technical: e.target.value})}
                            />
                            <FormValidator value={skills.technical} required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="softSkills" className="flex items-center">
                              Soft Skills <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Textarea 
                              id="softSkills" 
                              placeholder="Leadership, Communication, Problem-solving, Teamwork..."
                              rows={2}
                              className="w-full"
                              value={skills.soft}
                              onChange={(e) => setSkills({...skills, soft: e.target.value})}
                            />
                            <FormValidator value={skills.soft} required />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => generateAIContent("skillSuggestions")}
                              disabled={generatingAI}
                            >
                              <Sparkles className="h-4 w-4" />
                              AI Skill Suggestions
                            </Button>
                            <span className="text-sm text-muted-foreground">Get suggestions based on your job title</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="objectives" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Career Objectives</CardTitle>
                        <CardDescription>
                          Define your career goals and objectives
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="objective" className="flex items-center">
                            Career Objective <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea 
                            id="objective" 
                            placeholder="Seeking a challenging position in marketing that allows me to leverage my experience in digital strategies to drive business growth..."
                            rows={4}
                            className="w-full"
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                          />
                          <FormValidator value={objective} required />
                          <div className="flex items-center gap-2 mt-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 text-sm"
                              onClick={() => generateAIContent("objective")}
                              disabled={generatingAI}
                            >
                              <Lightbulb className="h-3 w-3" />
                              AI Writer
                            </Button>
                            <span className="text-sm text-muted-foreground">Get AI to write a powerful objective statement</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between p-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={activeTab === "personal"}
                  >
                    Previous
                  </Button>
                  
                  {activeTab === "objectives" ? (
                    <Button 
                      onClick={handleGenerate} 
                      className="gap-2"
                      disabled={!formValid}
                    >
                      <Download className="h-4 w-4" />
                      Generate Resume
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Next</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
