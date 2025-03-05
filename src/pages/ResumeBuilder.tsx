import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { FormValidator } from "@/components/ui/form-validator";
import { Plus, Trash } from "lucide-react";
import { ResumePreviewContent } from "./ResumePreview";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  graduationDate: string;
  score?: string;
}

interface ExperienceItem {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface ProjectItem {
  id: string;
  title: string;
  link?: string;
  description: string;
  technologies?: string;
}

interface Skills {
  professional: string;
  technical: string;
  soft: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const countryCodes = [
  { label: "United States (+1)", value: "+1" },
  { label: "United Kingdom (+44)", value: "+44" },
  { label: "Germany (+49)", value: "+49" },
  { label: "India (+91)", value: "+91" },
  { label: "China (+86)", value: "+86" },
  { label: "Brazil (+55)", value: "+55" },
  { label: "Japan (+81)", value: "+81" },
  { label: "Australia (+61)", value: "+61" },
  { label: "Canada (+1)", value: "+1" },
  { label: "France (+33)", value: "+33" },
];

const STORAGE_KEY = "resumeData";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<Skills>({
    professional: "",
    technical: "",
    soft: "",
  });
  const [objective, setObjective] = useState("");
	const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedTemplate, setSelectedTemplate] = useState("default");

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPersonalInfo(parsedData.personalInfo || personalInfo);
      setEducation(parsedData.education || education);
      setExperience(parsedData.experience || experience);
      setSkills(parsedData.skills || skills);
      setObjective(parsedData.objective || objective);
      setProjects(parsedData.projects || projects);
    }
  }, []);

  const saveData = () => {
    const data = {
      personalInfo,
      education,
      experience,
      skills,
      objective,
      projects
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const getResumeData = () => ({
    personalInfo,
    education,
    experience,
    skills,
    objective,
    projects
  });

  const validateField = useCallback((fieldName: string, value: string) => {
    if (!value && (fieldName === 'firstName' || fieldName === 'lastName' || fieldName === 'jobTitle' || fieldName === 'email' || fieldName === 'phone' || fieldName === 'location')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return undefined;
  }, []);

  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    // Validate Personal Info
    for (const key of Object.keys(personalInfo)) {
      const error = validateField(key, personalInfo[key as keyof PersonalInfo]);
      if (error) {
        errors[key] = error;
      }
    }

    // Validate Education
    education.forEach((edu, index) => {
      if (!edu.school) errors[`edu_${index}_school`] = 'School is required';
      if (!edu.degree) errors[`edu_${index}_degree`] = 'Degree is required';
      if (!edu.graduationDate) errors[`edu_${index}_graduationDate`] = 'Graduation Date is required';
    });

    // Validate Experience
    experience.forEach((exp, index) => {
      if (!exp.jobTitle) errors[`exp_${index}_jobTitle`] = 'Job Title is required';
      if (!exp.companyName) errors[`exp_${index}_companyName`] = 'Company Name is required';
      if (!exp.startDate) errors[`exp_${index}_startDate`] = 'Start Date is required';
    });

    // Validate Skills
    if (!skills.professional) errors['professional'] = 'Professional skills are required';
    if (!skills.technical) errors['technical'] = 'Technical skills are required';
    if (!skills.soft) errors['soft'] = 'Soft skills are required';

    // Validate Objective
    if (!objective) errors['objective'] = 'Career Objective is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [personalInfo, education, experience, skills, objective, validateField]);

  const formValid = validateForm();

  const handleGenerate = () => {
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
      // Navigate with state for more reliable data transfer
      navigate('/resume-preview', { state: { resumeData } });
    } catch (error) {
      console.error("Error navigating to resume preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addEducation = () => {
    setEducation([...education, { id: String(Date.now()), school: "", degree: "", graduationDate: "" }]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const deleteEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addExperience = () => {
    setExperience([...experience, { id: String(Date.now()), jobTitle: "", companyName: "", startDate: "", description: "" }]);
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperience(experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const deleteExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const addProject = () => {
    setProjects([...projects, { id: String(Date.now()), title: "", description: "" }]);
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
            <p className="text-muted-foreground">Create your professional resume with ease</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowLivePreview(!showLivePreview)}>
              {showLivePreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button onClick={handleGenerate}>Generate Resume</Button>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="template">Template</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {/* Add more templates here */}
            </SelectContent>
          </Select>
        </div>
        
        <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
          <div className={showLivePreview ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Resume Information</h2>
              <p className="text-muted-foreground">Fill in the following information to build your resume</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="objectives">Objectives</TabsTrigger>
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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={personalInfo.firstName}
                          onChange={e => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                          className={formErrors.firstName ? "border-destructive" : ""}
                        />
                        <FormValidator 
                          value={personalInfo.firstName} 
                          required={true}
                          errorMessage="First Name is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={personalInfo.lastName}
                          onChange={e => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                          className={formErrors.lastName ? "border-destructive" : ""}
                        />
                        <FormValidator 
                          value={personalInfo.lastName} 
                          required={true}
                          errorMessage="Last Name is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Professional Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g. Software Engineer, Marketing Specialist"
                        value={personalInfo.jobTitle}
                        onChange={e => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                        className={formErrors.jobTitle ? "border-destructive" : ""}
                      />
                      <FormValidator 
                        value={personalInfo.jobTitle} 
                        required={true}
                        errorMessage="Professional Title is required"
                        showMessage={false}
                        highlightOnly={true}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. you@example.com"
                          value={personalInfo.email}
                          onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className={formErrors.email ? "border-destructive" : ""}
                        />
                         <FormValidator 
                          value={personalInfo.email} 
                          required={true}
                          errorMessage="Email is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex">
                          <Select>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="+1" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map(code => (
                                <SelectItem key={code.value} value={code.value}>
                                  {code.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 123-456-7890"
                            value={personalInfo.phone}
                            onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})}
                            className="flex-1"
                          />
                        </div>
                        <FormValidator 
                          value={personalInfo.phone} 
                          required={true}
                          errorMessage="Phone Number is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g. New York, NY"
                        value={personalInfo.location}
                        onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})}
                        className={formErrors.location ? "border-destructive" : ""}
                      />
                      <FormValidator 
                          value={personalInfo.location} 
                          required={true}
                          errorMessage="Location is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          type="url"
                          placeholder="e.g. linkedin.com/in/johndoe"
                          value={personalInfo.linkedinUrl}
                          onChange={e => setPersonalInfo({...personalInfo, linkedinUrl: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                          id="githubUrl"
                          type="url"
                          placeholder="e.g. github.com/johndoe"
                          value={personalInfo.githubUrl}
                          onChange={e => setPersonalInfo({...personalInfo, githubUrl: e.target.value})}
                        />
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
                    {education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`school_${edu.id}`}>School</Label>
                            <Input
                              id={`school_${edu.id}`}
                              value={edu.school}
                              onChange={e => updateEducation(edu.id, "school", e.target.value)}
                              className={formErrors[`edu_${index}_school`] ? "border-destructive" : ""}
                            />
                            {formErrors[`edu_${index}_school`] && (
                              <p className="text-xs text-destructive">{formErrors[`edu_${index}_school`]}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`degree_${edu.id}`}>Degree</Label>
                            <Input
                              id={`degree_${edu.id}`}
                              value={edu.degree}
                              onChange={e => updateEducation(edu.id, "degree", e.target.value)}
                              className={formErrors[`edu_${index}_degree`] ? "border-destructive" : ""}
                            />
                            {formErrors[`edu_${index}_degree`] && (
                              <p className="text-xs text-destructive">{formErrors[`edu_${index}_degree`]}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`graduationDate_${edu.id}`}>Graduation Date</Label>
                            <Input
                              id={`graduationDate_${edu.id}`}
                              placeholder="MM/YYYY"
                              value={edu.graduationDate}
                              onChange={e => updateEducation(edu.id, "graduationDate", e.target.value)}
                               className={formErrors[`edu_${index}_graduationDate`] ? "border-destructive" : ""}
                            />
                             {formErrors[`edu_${index}_graduationDate`] && (
                              <p className="text-xs text-destructive">{formErrors[`edu_${index}_graduationDate`]}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`score_${edu.id}`}>Score (Optional)</Label>
                            <Input
                              id={`score_${edu.id}`}
                              placeholder="e.g. 3.8/4.0"
                              value={edu.score || ""}
                              onChange={e => updateEducation(edu.id, "score", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <Button variant="destructive" size="sm" onClick={() => deleteEducation(edu.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button variant="secondary" onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience" className="p-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Work Experience</CardTitle>
                    <CardDescription>
                      Add your work experience details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`jobTitle_${exp.id}`}>Job Title</Label>
                            <Input
                              id={`jobTitle_${exp.id}`}
                              value={exp.jobTitle}
                              onChange={e => updateExperience(exp.id, "jobTitle", e.target.value)}
                               className={formErrors[`exp_${index}_jobTitle`] ? "border-destructive" : ""}
                            />
                             {formErrors[`exp_${index}_jobTitle`] && (
                              <p className="text-xs text-destructive">{formErrors[`exp_${index}_jobTitle`]}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`companyName_${exp.id}`}>Company Name</Label>
                            <Input
                              id={`companyName_${exp.id}`}
                              value={exp.companyName}
                              onChange={e => updateExperience(exp.id, "companyName", e.target.value)}
                               className={formErrors[`exp_${index}_companyName`] ? "border-destructive" : ""}
                            />
                             {formErrors[`exp_${index}_companyName`] && (
                              <p className="text-xs text-destructive">{formErrors[`exp_${index}_companyName`]}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate_${exp.id}`}>Start Date</Label>
                            <Input
                              id={`startDate_${exp.id}`}
                              placeholder="MM/YYYY"
                              value={exp.startDate}
                              onChange={e => updateExperience(exp.id, "startDate", e.target.value)}
                               className={formErrors[`exp_${index}_startDate`] ? "border-destructive" : ""}
                            />
                             {formErrors[`exp_${index}_startDate`] && (
                              <p className="text-xs text-destructive">{formErrors[`exp_${index}_startDate`]}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`endDate_${exp.id}`}>End Date (or Present)</Label>
                            <Input
                              id={`endDate_${exp.id}`}
                              placeholder="MM/YYYY or Present"
                              value={exp.endDate || ""}
                              onChange={e => updateExperience(exp.id, "endDate", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`description_${exp.id}`}>Description</Label>
                          <Textarea
                            id={`description_${exp.id}`}
                            placeholder="Describe your responsibilities and achievements"
                            value={exp.description}
                            onChange={e => updateExperience(exp.id, "description", e.target.value)}
                          />
                        </div>
                        
                        <Button variant="destructive" size="sm" onClick={() => deleteExperience(exp.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button variant="secondary" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="p-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Projects</CardTitle>
                    <CardDescription>
                      Add details about the projects you have worked on
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title_${project.id}`}>Title</Label>
                          <Input
                            id={`title_${project.id}`}
                            value={project.title}
                            onChange={e => updateProject(project.id, "title", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`link_${project.id}`}>Link</Label>
                          <Input
                            id={`link_${project.id}`}
                            type="url"
                            placeholder="e.g. github.com/johndoe/project"
                            value={project.link || ""}
                            onChange={e => updateProject(project.id, "link", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`technologies_${project.id}`}>Technologies Used</Label>
                          <Input
                            id={`technologies_${project.id}`}
                            placeholder="e.g. React, Node.js, PostgreSQL"
                            value={project.technologies || ""}
                            onChange={e => updateProject(project.id, "technologies", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`description_${project.id}`}>Description</Label>
                          <Textarea
                            id={`description_${project.id}`}
                            placeholder="Describe the project and your contributions"
                            value={project.description}
                            onChange={e => updateProject(project.id, "description", e.target.value)}
                          />
                        </div>

                        <Button variant="destructive" size="sm" onClick={() => deleteProject(project.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button variant="secondary" onClick={addProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="p-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Skills</CardTitle>
                    <CardDescription>
                      Showcase your key skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="professional">Professional Skills</Label>
                      <Textarea
                        id="professional"
                        placeholder="e.g. Leadership, Communication, Problem-solving"
                        value={skills.professional}
                        onChange={e => setSkills({...skills, professional: e.target.value})}
                         className={formErrors.professional ? "border-destructive" : ""}
                      />
                       <FormValidator 
                          value={skills.professional} 
                          required={true}
                          errorMessage="Professional skills are required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="technical">Technical Skills</Label>
                      <Textarea
                        id="technical"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={skills.technical}
                        onChange={e => setSkills({...skills, technical: e.target.value})}
                         className={formErrors.technical ? "border-destructive" : ""}
                      />
                       <FormValidator 
                          value={skills.technical} 
                          required={true}
                          errorMessage="Technical skills are required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="soft">Soft Skills</Label>
                      <Textarea
                        id="soft"
                        placeholder="e.g. Teamwork, Adaptability, Time Management"
                        value={skills.soft}
                        onChange={e => setSkills({...skills, soft: e.target.value})}
                         className={formErrors.soft ? "border-destructive" : ""}
                      />
                       <FormValidator 
                          value={skills.soft} 
                          required={true}
                          errorMessage="Soft skills are required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="objectives" className="p-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Career Objective</CardTitle>
                    <CardDescription>
                      Write a brief summary of your career goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="objective">Objective</Label>
                      <Textarea
                        id="objective"
                        placeholder="e.g. A highly motivated software engineer..."
                        value={objective}
                        onChange={e => setObjective(e.target.value)}
                         className={formErrors.objective ? "border-destructive" : ""}
                      />
                       <FormValidator 
                          value={objective} 
                          required={true}
                          errorMessage="Career Objective is required"
                          showMessage={false}
                          highlightOnly={true}
                        />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGenerate}>Generate Resume</Button>
            </div>
          </div>
          
          {showLivePreview && (
            <ResumePreviewContent data={getResumeData()} templateId={selectedTemplate} isPreview={true} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
