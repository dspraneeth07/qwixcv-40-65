
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  User,
  Eye,
  Code,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ResumePreviewContent } from "./ResumePreview";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Education {
  id: string;
  customName: string;
  school: string;
  degree: string;
  graduationYear: string;
  score: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  countryCode: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface Skills {
  professional: string;
  technical: string;
  soft: string;
}

const countryCodes = [
  { value: "+1", label: "United States (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+91", label: "India (+91)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+86", label: "China (+86)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+33", label: "France (+33)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+7", label: "Russia (+7)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+1", label: "Canada (+1)" },
];

const STORAGE_KEY = "resume_builder_data";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const templateId = "modern1"; // Default template, since we're removing template selection
  const [activeTab, setActiveTab] = useState("personal");
  const [formValid, setFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [validationTriggered, setValidationTriggered] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    countryCode: "+1",
    location: "",
    githubUrl: "",
    linkedinUrl: ""
  });
  
  const [education, setEducation] = useState<Education[]>([
    {
      id: "edu1",
      customName: "Education #1",
      school: "",
      degree: "",
      graduationYear: "",
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

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj1",
      title: "",
      description: "",
      technologies: "",
      link: ""
    }
  ]);
  
  const [skills, setSkills] = useState<Skills>({
    professional: "",
    technical: "",
    soft: ""
  });
  
  const [objective, setObjective] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const detectCountryCode = async () => {
      try {
        setPersonalInfo(prev => ({
          ...prev,
          countryCode: "+1"
        }));
      } catch (error) {
        console.error("Error detecting country code:", error);
        setPersonalInfo(prev => ({
          ...prev,
          countryCode: "+1"
        }));
      }
    };
    
    detectCountryCode();
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        if (parsedData.personalInfo) setPersonalInfo(parsedData.personalInfo);
        if (parsedData.education) setEducation(parsedData.education);
        if (parsedData.experience) setExperience(parsedData.experience);
        if (parsedData.projects) setProjects(parsedData.projects);
        if (parsedData.skills) setSkills(parsedData.skills);
        if (parsedData.objective) setObjective(parsedData.objective);
        
        toast({
          title: "Data Loaded",
          description: "Your previously saved resume data has been loaded."
        });
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = () => {
    try {
      const dataToSave = {
        personalInfo,
        education,
        experience,
        projects,
        skills,
        objective,
        templateId
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved to browser storage."
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your resume data.",
        variant: "destructive"
      });
    }
  };

  const getResumeData = () => {
    return {
      personalInfo: {
        ...personalInfo,
        phone: personalInfo.phone ? `${personalInfo.countryCode} ${personalInfo.phone}` : ""
      },
      education,
      experience,
      projects,
      skills,
      objective,
      templateId
    };
  };

  useEffect(() => {
    const personalInfoValid = 
      personalInfo.firstName.trim() !== "" && 
      personalInfo.lastName.trim() !== "" && 
      personalInfo.jobTitle.trim() !== "" && 
      personalInfo.email.trim() !== "" && 
      personalInfo.phone.trim() !== "" && 
      personalInfo.location.trim() !== "";
    
    const educationValid = education.every(edu => 
      edu.school.trim() !== "" && 
      edu.degree.trim() !== "" && 
      edu.graduationYear.trim() !== ""
      // Score is now optional, removed from validation
    );
    
    const experienceValid = experience.every(exp => 
      (!exp.companyName.trim() && !exp.jobTitle.trim()) || 
      (exp.companyName.trim() !== "" && exp.jobTitle.trim() !== "")
    );
    
    const skillsValid = 
      skills.professional.trim() !== "" && 
      skills.technical.trim() !== "" && 
      skills.soft.trim() !== "";
    
    const objectiveValid = objective.trim() !== "";
    
    const errors: Record<string, boolean> = {};
    
    if (personalInfo.firstName.trim() === "") errors.firstName = true;
    if (personalInfo.lastName.trim() === "") errors.lastName = true;
    if (personalInfo.jobTitle.trim() === "") errors.jobTitle = true;
    if (personalInfo.email.trim() === "") errors.email = true;
    if (personalInfo.phone.trim() === "") errors.phone = true;
    if (personalInfo.location.trim() === "") errors.location = true;
    
    education.forEach((edu, index) => {
      if (edu.school.trim() === "") errors[`edu_${index}_school`] = true;
      if (edu.degree.trim() === "") errors[`edu_${index}_degree`] = true;
      if (edu.graduationYear.trim() === "") errors[`edu_${index}_graduationYear`] = true;
      // Score is now optional, removed from validation
    });
    
    experience.forEach((exp, index) => {
      if (exp.companyName.trim() !== "" || exp.jobTitle.trim() !== "") {
        if (exp.companyName.trim() === "") errors[`exp_${index}_companyName`] = true;
        if (exp.jobTitle.trim() === "") errors[`exp_${index}_jobTitle`] = true;
      }
    });
    
    if (skills.professional.trim() === "") errors.professional = true;
    if (skills.technical.trim() === "") errors.technical = true;
    if (skills.soft.trim() === "") errors.soft = true;
    
    if (objective.trim() === "") errors.objective = true;
    
    setFormErrors(errors);
    setFormValid(personalInfoValid && educationValid && experienceValid && skillsValid && objectiveValid);
  }, [personalInfo, education, experience, skills, objective]);
  
  const handleNext = () => {
    const tabs = ["personal", "education", "experience", "projects", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    const tabs = ["personal", "education", "experience", "projects", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  const handleGenerate = () => {
    setValidationTriggered(true);
    
    if (!formValid) {
      if (formErrors.firstName || formErrors.lastName || formErrors.jobTitle || 
          formErrors.email || formErrors.phone || formErrors.location) {
        setActiveTab("personal");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Personal tab.",
          variant: "destructive"
        });
        return;
      }
      
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
      
      const hasExperienceErrors = Object.keys(formErrors).some(key => key.startsWith("exp_"));
      if (hasExperienceErrors) {
        setActiveTab("experience");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Experience tab.",
          variant: "destructive"
        });
        return;
      }
      
      if (formErrors.professional || formErrors.technical || formErrors.soft) {
        setActiveTab("skills");
        toast({
          title: "Missing Information",
          description: "Please fill all required fields in the Skills tab.",
          variant: "destructive"
        });
        return;
      }
      
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
    
    const resumeData = getResumeData();
    
    console.log("Generating resume with data:", resumeData);
    
    saveData();
    
    toast({
      title: "Resume Generated!",
      description: "Your professional resume has been created successfully.",
    });
    
    try {
      const encodedData = encodeURIComponent(JSON.stringify(resumeData));
      const resumeUrl = `/resume-preview?data=${encodedData}`;
      navigate(resumeUrl);
    } catch (error) {
      console.error("Error encoding resume data:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    
    setPersonalInfo({
      ...personalInfo,
      phone: numericValue
    });
  };

  const handleCountryCodeChange = (value: string) => {
    setPersonalInfo({
      ...personalInfo,
      countryCode: value
    });
  };
  
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu${education.length + 1}`,
      customName: `Education #${education.length + 1}`,
      school: "",
      degree: "",
      graduationYear: "",
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
    if (field === "graduationYear") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const yearValue = numericValue.substring(0, 4);
      
      setEducation(education.map(edu => 
        edu.id === id ? { ...edu, [field]: yearValue } : edu
      ));
      return;
    }
    
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };
  
  const handleAddProject = () => {
    const newProject: Project = {
      id: `proj${projects.length + 1}`,
      title: "",
      description: "",
      technologies: "",
      link: ""
    };
    
    setProjects([...projects, newProject]);
  };
  
  const handleRemoveProject = (id: string) => {
    if (projects.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one project entry.",
        variant: "destructive"
      });
      return;
    }
    
    setProjects(projects.filter(proj => proj.id !== id));
  };
  
  const handleProjectChange = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
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
    
    setTimeout(() => {
      let generatedContent = "";
      
      switch (type) {
        case "jobDescription":
          const expJobTitle = experience.find(exp => exp.id === context.id)?.jobTitle || "";
          
          if (expJobTitle.toLowerCase().includes("marketing")) {
            generatedContent = `• Developed and executed comprehensive marketing campaigns across digital and traditional channels\n• Increased brand visibility by 30% through strategic social media management\n• Conducted market research to identify customer needs and competitive positioning\n• Collaborated with creative teams to develop compelling marketing materials\n• Tracked campaign performance using analytics tools and presented results to leadership`;
          } else if (expJobTitle.toLowerCase().includes("developer") || expJobTitle.toLowerCase().includes("engineer")) {
            generatedContent = `• Designed and developed scalable application features using modern frameworks and best practices\n• Collaborated with cross-functional teams to implement new product capabilities\n• Reduced application load time by 40% through performance optimization\n• Implemented automated testing, resulting in a 25% decrease in production bugs\n• Participated in code reviews and mentored junior developers`;
          } else if (expJobTitle.toLowerCase().includes("manager")) {
            generatedContent = `• Led a team of 10+ professionals, providing mentorship and performance evaluations\n• Increased department efficiency by 20% through process improvements and tool adoption\n• Managed project budgets exceeding $500,000 with consistent on-time delivery\n• Developed strategic plans aligned with company objectives and market trends\n• Built strong relationships with key stakeholders and clients`;
          } else if (expJobTitle.toLowerCase().includes("sales")) {
            generatedContent = `• Consistently exceeded quarterly sales targets by 15-20%\n• Built and maintained a portfolio of 50+ enterprise clients\n• Developed and implemented successful sales strategies for new market segments\n• Conducted product demonstrations and negotiations with potential clients\n• Collaborated with marketing team to develop targeted outreach campaigns`;
          } else if (expJobTitle.toLowerCase().includes("design")) {
            generatedContent = `• Created user-centered designs for web and mobile applications\n• Developed brand identity systems including logos, color palettes, and style guides\n• Conducted user research and usability testing to inform design decisions\n• Collaborated with development team to ensure design implementation accuracy\n• Maintained design system documentation and component libraries`;
          } else {
            generatedContent = `• Implemented key initiatives that resulted in significant improvements to company operations\n• Collaborated with cross-functional teams to achieve project objectives and business goals\n• Increased efficiency by 20% through implementation of streamlined processes\n• Developed and maintained positive relationships with key stakeholders\n• Recognized for exceptional performance and problem-solving abilities`;
          }
          
          setExperience(experience.map(exp => 
            exp.id === context.id ? { ...exp, description: generatedContent } : exp
          ));
          break;
          
        case "projectDescription":
          const projectTitle = projects.find(proj => proj.id === context.id)?.title || "";
          
          if (projectTitle.toLowerCase().includes("e-commerce") || projectTitle.toLowerCase().includes("ecommerce")) {
            generatedContent = `• Built a full-featured e-commerce platform with product catalog, cart, and checkout functionality\n• Implemented secure payment processing integration with multiple payment gateways\n• Created admin dashboard for inventory and order management\n• Optimized site performance resulting in 30% faster page load times`;
          } else if (projectTitle.toLowerCase().includes("mobile") || projectTitle.toLowerCase().includes("app")) {
            generatedContent = `• Developed a cross-platform mobile application with React Native for iOS and Android\n• Implemented offline-first architecture with local data persistence\n• Integrated with RESTful APIs for real-time data synchronization\n• Added push notification system with targeted user messaging`;
          } else if (projectTitle.toLowerCase().includes("dashboard") || projectTitle.toLowerCase().includes("analytics")) {
            generatedContent = `• Created an interactive data visualization dashboard with real-time analytics\n• Implemented filterable data views and exportable reports\n• Built user authentication and role-based access control\n• Optimized query performance for handling large datasets`;
          } else if (projectTitle.toLowerCase().includes("game") || projectTitle.toLowerCase().includes("gaming")) {
            generatedContent = `• Developed an interactive browser-based game with modern JavaScript\n• Designed responsive user interface that works across desktop and mobile\n• Implemented game mechanics including scoring, levels, and achievements\n• Created custom animations and sound effects for enhanced user experience`;
          } else {
            generatedContent = `• Designed and implemented key features including user authentication and data management\n• Developed responsive UI that works seamlessly across desktop and mobile devices\n• Created comprehensive documentation for codebase and user guides\n• Implemented automated testing for critical application workflows`;
          }
          
          setProjects(projects.map(proj => 
            proj.id === context.id ? { ...proj, description: generatedContent } : proj
          ));
          break;
          
        case "objective":
          const userJobTitle = personalInfo.jobTitle || "professional";
          const professionalSkills = skills.professional || "relevant areas";
          const technicalSkills = skills.technical || "technical skills";
          
          generatedContent = `Seeking a challenging ${userJobTitle} position where I can utilize my skills in ${professionalSkills} to contribute to organizational growth while expanding my expertise in ${technicalSkills}.`;
          setObjective(generatedContent);
          break;
          
        case "skillSuggestions":
          const title = personalInfo.jobTitle?.toLowerCase() || "";
          
          if (title.includes("marketing") || title === "") {
            setSkills({
              professional: "Digital Marketing, Content Strategy, Brand Management, Market Research, Campaign Planning",
              technical: "Google Analytics, SEO/SEM, Adobe Creative Suite, Social Media Platforms, Email Marketing Software",
              soft: "Communication, Creativity, Analytical Thinking, Project Management, Collaboration"
            });
          } else if (title.includes("developer") || title.includes("engineer")) {
            setSkills({
              professional: "Software Development, Web Application Architecture, Database Design, API Integration, Testing & Debugging",
              technical: "JavaScript, React, Node.js, Python, SQL, Git, Docker, CI/CD",
              soft: "Problem-solving, Communication, Teamwork, Time Management, Adaptability"
            });
          } else if (title.includes("designer")) {
            setSkills({
              professional: "UI/UX Design, Visual Design, User Research, Wireframing, Prototyping",
              technical: "Figma, Adobe Creative Suite, Sketch, HTML/CSS, Design Systems",
              soft: "Creativity, Communication, Teamwork, Attention to Detail, Time Management"
            });
          } else if (title.includes("data")) {
            setSkills({
              professional: "Data Analysis, Statistical Modeling, Data Visualization, Business Intelligence, Predictive Analytics",
              technical: "Python, SQL, R, Tableau, Power BI, Excel, TensorFlow, PyTorch",
              soft: "Analytical Thinking, Problem-solving, Communication, Attention to Detail, Continuous Learning"
            });
          } else if (title.includes("sales")) {
            setSkills({
              professional: "Account Management, Lead Generation, Negotiation, CRM Management, Sales Strategy",
              technical: "Salesforce, HubSpot, Microsoft Office, CRM Software, LinkedIn Sales Navigator",
              soft: "Communication, Persuasion, Relationship Building, Active Listening, Resilience"
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

  const getAISuggestionButton = () => {
    switch(activeTab) {
      case "personal":
        return null; // No AI suggestions for personal tab
      case "experience":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => experience.length > 0 && generateAIContent("jobDescription", { id: experience[0].id })}
            disabled={generatingAI}
          >
            <Lightbulb className="h-4 w-4" />
            AI Generate Job Description
          </Button>
        );
      case "projects":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => projects.length > 0 && generateAIContent("projectDescription", { id: projects[0].id })}
            disabled={generatingAI}
          >
            <Lightbulb className="h-4 w-4" />
            AI Generate Project Description
          </Button>
        );
      case "skills":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => generateAIContent("skillSuggestions")}
            disabled={generatingAI}
          >
            <Lightbulb className="h-4 w-4" />
            AI Suggest Skills
          </Button>
        );
      case "objectives":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => generateAIContent("objective")}
            disabled={generatingAI}
          >
            <Lightbulb className="h-4 w-4" />
            AI Generate Objective
          </Button>
        );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    const tabs = ["personal", "education", "experience", "projects", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabs.length - 1;

    return (
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={isFirstTab}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="flex gap-2">
          {getAISuggestionButton()}
          
          {!isLastTab ? (
            <Button onClick={handleNext} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleGenerate}
              className="gap-1"
            >
              <Download className="h-4 w-4" /> Generate Resume
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Input error styling helper
  const getInputStyle = (fieldName: string) => {
    return validationTriggered && formErrors[fieldName] 
      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500" 
      : "";
  };

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
          <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
            <div className={showLivePreview ? 'lg:col-span-2' : 'lg:col-span-1'}>
              <div className="bg-card shadow-sm rounded-lg border mb-6">
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Resume Information</span>
                    <span className={`${formValid ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"} text-xs px-2 py-0.5 rounded`}>
                      {formValid ? "Ready to Generate" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> 
                      {showLivePreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={saveData}
                    >
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
                    <TabsTrigger value="projects" className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      <span className="hidden sm:inline">Projects</span>
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
                              First Name <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input 
                              id="firstName" 
                              placeholder="John" 
                              value={personalInfo.firstName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                              className={getInputStyle("firstName")}
                            />
                            <FormValidator value={personalInfo.firstName} required highlightOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center">
                              Last Name <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input 
                              id="lastName" 
                              placeholder="Doe" 
                              value={personalInfo.lastName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                              className={getInputStyle("lastName")}
                            />
                            <FormValidator value={personalInfo.lastName} required highlightOnly />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="flex items-center">
                            Job Title <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input 
                            id="jobTitle" 
                            placeholder="Front-end Developer" 
                            value={personalInfo.jobTitle}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                            className={getInputStyle("jobTitle")}
                          />
                          <FormValidator value={personalInfo.jobTitle} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            Email <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john.doe@example.com" 
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            className={getInputStyle("email")}
                          />
                          <FormValidator value={personalInfo.email} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            Phone Number <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <div className="flex">
                            <Select 
                              value={personalInfo.countryCode} 
                              onValueChange={handleCountryCodeChange}
                            >
                              <SelectTrigger className="w-[140px] rounded-r-none">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {countryCodes.map((code) => (
                                  <SelectItem key={code.value} value={code.value}>
                                    {code.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="123-456-7890"
                              value={personalInfo.phone}
                              onChange={handlePhoneChange}
                              className={`flex-1 rounded-l-none ${getInputStyle("phone")}`}
                              ref={phoneInputRef}
                            />
                          </div>
                          <FormValidator value={personalInfo.phone} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center">
                            Location <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input 
                            id="location" 
                            placeholder="San Francisco, CA" 
                            value={personalInfo.location}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                            className={getInputStyle("location")}
                          />
                          <FormValidator value={personalInfo.location} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="githubUrl">GitHub URL</Label>
                          <Input 
                            id="githubUrl" 
                            placeholder="https://github.com/username" 
                            value={personalInfo.githubUrl}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, githubUrl: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                          <Input 
                            id="linkedinUrl" 
                            placeholder="https://linkedin.com/in/username" 
                            value={personalInfo.linkedinUrl}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, linkedinUrl: e.target.value })}
                          />
                        </div>
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="education" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Education</CardTitle>
                          <CardDescription>
                            Add your educational background
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddEducation}
                          className="h-8 px-2 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Education
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {education.map((edu, eduIndex) => (
                          <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
                            <div className="absolute top-2 right-2 flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEducation(edu.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                            
                            <div className="mb-2">
                              <span className="font-medium text-sm text-muted-foreground">
                                {edu.customName}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edu-${edu.id}-school`} className="flex items-center">
                                  School/University <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                  id={`edu-${edu.id}-school`} 
                                  placeholder="Harvard University" 
                                  value={edu.school}
                                  onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)}
                                  className={getInputStyle(`edu_${eduIndex}_school`)}
                                />
                                <FormValidator value={edu.school} required highlightOnly />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`edu-${edu.id}-degree`} className="flex items-center">
                                  Degree <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                  id={`edu-${edu.id}-degree`} 
                                  placeholder="Bachelor of Science in Computer Science" 
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                                  className={getInputStyle(`edu_${eduIndex}_degree`)}
                                />
                                <FormValidator value={edu.degree} required highlightOnly />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edu-${edu.id}-graduation-year`} className="flex items-center">
                                  Graduation Year <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                  id={`edu-${edu.id}-graduation-year`} 
                                  placeholder="2020" 
                                  value={edu.graduationYear}
                                  onChange={(e) => handleEducationChange(edu.id, "graduationYear", e.target.value)}
                                  className={getInputStyle(`edu_${eduIndex}_graduationYear`)}
                                />
                                <FormValidator value={edu.graduationYear} required highlightOnly />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`edu-${edu.id}-score`}>
                                  Score/GPA (Optional)
                                </Label>
                                <Input 
                                  id={`edu-${edu.id}-score`} 
                                  placeholder="3.8/4.0" 
                                  value={edu.score}
                                  onChange={(e) => handleEducationChange(edu.id, "score", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Work Experience</CardTitle>
                          <CardDescription>
                            Add your professional experience
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddExperience}
                          className="h-8 px-2 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Experience
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {experience.map((exp, expIndex) => (
                          <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative">
                            <div className="absolute top-2 right-2 flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExperience(exp.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`exp-${exp.id}-job-title`} className="flex items-center">
                                  Job Title <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                  id={`exp-${exp.id}-job-title`} 
                                  placeholder="Software Engineer" 
                                  value={exp.jobTitle}
                                  onChange={(e) => handleExperienceChange(exp.id, "jobTitle", e.target.value)}
                                  className={getInputStyle(`exp_${expIndex}_jobTitle`)}
                                />
                                <FormValidator value={exp.jobTitle} required highlightOnly />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`exp-${exp.id}-company`} className="flex items-center">
                                  Company <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                  id={`exp-${exp.id}-company`} 
                                  placeholder="Google" 
                                  value={exp.companyName}
                                  onChange={(e) => handleExperienceChange(exp.id, "companyName", e.target.value)}
                                  className={getInputStyle(`exp_${expIndex}_companyName`)}
                                />
                                <FormValidator value={exp.companyName} required highlightOnly />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`exp-${exp.id}-start-date`}>
                                  Start Date
                                </Label>
                                <Input 
                                  id={`exp-${exp.id}-start-date`} 
                                  placeholder="Jun 2020" 
                                  value={exp.startDate}
                                  onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`exp-${exp.id}-end-date`}>
                                  End Date
                                </Label>
                                <Input 
                                  id={`exp-${exp.id}-end-date`} 
                                  placeholder="Present (leave blank for current)" 
                                  value={exp.endDate}
                                  onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`exp-${exp.id}-description`}>
                                  Job Description
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => generateAIContent("jobDescription", { id: exp.id })}
                                  className="h-7 text-xs"
                                  disabled={generatingAI}
                                >
                                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                                  Generate with AI
                                </Button>
                              </div>
                              <Textarea 
                                id={`exp-${exp.id}-description`} 
                                placeholder="Describe your responsibilities and achievements..."
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="projects" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Projects</CardTitle>
                          <CardDescription>
                            Add your notable projects
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddProject}
                          className="h-8 px-2 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Project
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {projects.map((proj) => (
                          <div key={proj.id} className="space-y-4 p-4 border rounded-lg relative">
                            <div className="absolute top-2 right-2 flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProject(proj.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`proj-${proj.id}-title`}>
                                Project Title
                              </Label>
                              <Input 
                                id={`proj-${proj.id}-title`} 
                                placeholder="E-commerce Application" 
                                value={proj.title}
                                onChange={(e) => handleProjectChange(proj.id, "title", e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`proj-${proj.id}-description`}>
                                  Project Description
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => generateAIContent("projectDescription", { id: proj.id })}
                                  className="h-7 text-xs"
                                  disabled={generatingAI}
                                >
                                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                                  Generate with AI
                                </Button>
                              </div>
                              <Textarea 
                                id={`proj-${proj.id}-description`} 
                                placeholder="Describe the project, your role, and the technologies used..."
                                value={proj.description}
                                onChange={(e) => handleProjectChange(proj.id, "description", e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`proj-${proj.id}-technologies`}>
                                Technologies Used
                              </Label>
                              <Input 
                                id={`proj-${proj.id}-technologies`} 
                                placeholder="React, Node.js, MongoDB" 
                                value={proj.technologies}
                                onChange={(e) => handleProjectChange(proj.id, "technologies", e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`proj-${proj.id}-link`}>
                                Project Link
                              </Label>
                              <Input 
                                id={`proj-${proj.id}-link`} 
                                placeholder="https://github.com/username/project" 
                                value={proj.link}
                                onChange={(e) => handleProjectChange(proj.id, "link", e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Skills</CardTitle>
                        <CardDescription>
                          Showcase your professional and technical abilities
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="professional-skills" className="flex items-center">
                            Professional Skills <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Textarea 
                            id="professional-skills" 
                            placeholder="Project Management, Team Leadership, Strategic Planning, etc."
                            value={skills.professional}
                            onChange={(e) => setSkills({ ...skills, professional: e.target.value })}
                            className={getInputStyle("professional")}
                          />
                          <FormValidator value={skills.professional} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="technical-skills" className="flex items-center">
                            Technical Skills <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Textarea 
                            id="technical-skills" 
                            placeholder="JavaScript, React, Node.js, CSS, etc."
                            value={skills.technical}
                            onChange={(e) => setSkills({ ...skills, technical: e.target.value })}
                            className={getInputStyle("technical")}
                          />
                          <FormValidator value={skills.technical} required highlightOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="soft-skills" className="flex items-center">
                            Soft Skills <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Textarea 
                            id="soft-skills" 
                            placeholder="Communication, Teamwork, Problem Solving, etc."
                            value={skills.soft}
                            onChange={(e) => setSkills({ ...skills, soft: e.target.value })}
                            className={getInputStyle("soft")}
                          />
                          <FormValidator value={skills.soft} required highlightOnly />
                        </div>
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="objectives" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Career Objective</CardTitle>
                        <CardDescription>
                          Summarize your career goals and what you bring to the table
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="career-objective" className="flex items-center">
                              Career Objective <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => generateAIContent("objective")}
                              className="h-7 text-xs"
                              disabled={generatingAI}
                            >
                              <Sparkles className="h-3.5 w-3.5 mr-1" />
                              Generate with AI
                            </Button>
                          </div>
                          <Textarea 
                            id="career-objective" 
                            placeholder="A concise statement about your career goals and what you bring to a potential employer..."
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            className={`min-h-[150px] ${getInputStyle("objective")}`}
                          />
                          <FormValidator value={objective} required highlightOnly />
                        </div>
                        
                        {renderNavigationButtons()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {showLivePreview && (
              <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
                <ResumePreviewContent 
                  data={getResumeData()} 
                  templateId={templateId}
                  isPreview={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
