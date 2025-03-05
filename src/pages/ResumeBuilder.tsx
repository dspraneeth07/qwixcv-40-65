
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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

const STORAGE_KEY = "resumeData";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [showLivePreview, setShowLivePreview] = useState(false);
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
  const [countryCode, setCountryCode] = useState("+1");

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPersonalInfo(parsedData.personalInfo || personalInfo);
        setEducation(parsedData.education || education);
        setExperience(parsedData.experience || experience);
        setSkills(parsedData.skills || skills);
        setObjective(parsedData.objective || objective);
        setProjects(parsedData.projects || projects);
      } catch (error) {
        console.error("Error parsing stored resume data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveData = useCallback(() => {
    const data = {
      personalInfo,
      education,
      experience,
      skills,
      objective,
      projects
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [personalInfo, education, experience, skills, objective, projects]);

  const getResumeData = useCallback(() => ({
    personalInfo,
    education,
    experience,
    skills,
    objective,
    projects
  }), [personalInfo, education, experience, skills, objective, projects]);

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

  const handleGenerate = () => {
    const formValid = validateForm();
    
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
      navigate('/resume-preview', { 
        state: { 
          resumeData: JSON.parse(JSON.stringify(resumeData)) 
        } 
      });
    } catch (error) {
      console.error("Error navigating to resume preview:", error);
      
      // Fallback to URL parameters if state navigation fails
      try {
        const dataString = encodeURIComponent(JSON.stringify(resumeData));
        navigate(`/resume-preview?data=${dataString}`);
      } catch (urlError) {
        console.error("Error encoding resume data for URL:", urlError);
        toast({
          title: "Error",
          description: "Failed to generate resume. Please try again.",
          variant: "destructive"
        });
      }
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

  const getActiveContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Personal Details</h2>
              <p className="text-gray-500">Enter your personal information to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={e => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  placeholder="John"
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={e => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  placeholder="Doe"
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-base">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="Front-end Developer"
                value={personalInfo.jobTitle}
                onChange={e => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                className={formErrors.jobTitle ? "border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={personalInfo.email}
                onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})}
                className={formErrors.email ? "border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="United States..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">United States (+1)</SelectItem>
                    <SelectItem value="+44">United Kingdom (+44)</SelectItem>
                    <SelectItem value="+91">India (+91)</SelectItem>
                    <SelectItem value="+61">Australia (+61)</SelectItem>
                    <SelectItem value="+86">China (+86)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  value={personalInfo.phone}
                  onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className={`flex-1 ${formErrors.phone ? "border-red-500" : ""}`}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={personalInfo.location}
                onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})}
                className={formErrors.location ? "border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-base">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username"
                value={personalInfo.githubUrl}
                onChange={e => setPersonalInfo({...personalInfo, githubUrl: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-base">
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={personalInfo.linkedinUrl}
                onChange={e => setPersonalInfo({...personalInfo, linkedinUrl: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("education")} className="bg-gray-900" size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "education":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Education</h2>
                <p className="text-gray-500">Add your educational background</p>
              </div>
              <Button onClick={addEducation} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            </div>

            {education.length === 0 ? (
              <Card className="border border-dashed p-8">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <p className="text-center text-gray-500 mb-4">No education added yet</p>
                  <Button onClick={addEducation} variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Education
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={edu.id} className="relative border shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => deleteEducation(edu.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-500 mb-3">Education #{index + 1}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`school_${edu.id}`} className="text-base">
                            School/University <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`school_${edu.id}`}
                            placeholder="Harvard University"
                            value={edu.school}
                            onChange={e => updateEducation(edu.id, "school", e.target.value)}
                            className={formErrors[`edu_${index}_school`] ? "border-red-500" : ""}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`degree_${edu.id}`} className="text-base">
                            Degree <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`degree_${edu.id}`}
                            placeholder="Bachelor of Science in Computer Science"
                            value={edu.degree}
                            onChange={e => updateEducation(edu.id, "degree", e.target.value)}
                            className={formErrors[`edu_${index}_degree`] ? "border-red-500" : ""}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`graduationDate_${edu.id}`} className="text-base">
                            Graduation Year <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`graduationDate_${edu.id}`}
                            placeholder="2020"
                            value={edu.graduationDate}
                            onChange={e => updateEducation(edu.id, "graduationDate", e.target.value)}
                            className={formErrors[`edu_${index}_graduationDate`] ? "border-red-500" : ""}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`score_${edu.id}`} className="text-base">
                            Score/GPA (Optional)
                          </Label>
                          <Input
                            id={`score_${edu.id}`}
                            placeholder="3.8/4.0"
                            value={edu.score || ""}
                            onChange={e => updateEducation(edu.id, "score", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("personal")} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setActiveTab("experience")} className="bg-gray-900" size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "experience":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Work Experience</h2>
                <p className="text-gray-500">Add your professional experience</p>
              </div>
              <Button onClick={addExperience} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </div>

            {experience.length === 0 ? (
              <Card className="border border-dashed p-8">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <p className="text-center text-gray-500 mb-4">No experience added yet</p>
                  <Button onClick={addExperience} variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Experience
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card key={exp.id} className="relative border shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => deleteExperience(exp.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`jobTitle_${exp.id}`} className="text-base">
                            Job Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`jobTitle_${exp.id}`}
                            placeholder="Software Engineer"
                            value={exp.jobTitle}
                            onChange={e => updateExperience(exp.id, "jobTitle", e.target.value)}
                            className={formErrors[`exp_${index}_jobTitle`] ? "border-red-500" : ""}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`companyName_${exp.id}`} className="text-base">
                            Company <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`companyName_${exp.id}`}
                            placeholder="Google"
                            value={exp.companyName}
                            onChange={e => updateExperience(exp.id, "companyName", e.target.value)}
                            className={formErrors[`exp_${index}_companyName`] ? "border-red-500" : ""}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`startDate_${exp.id}`} className="text-base">
                            Start Date
                          </Label>
                          <Input
                            id={`startDate_${exp.id}`}
                            placeholder="Jun 2020"
                            value={exp.startDate}
                            onChange={e => updateExperience(exp.id, "startDate", e.target.value)}
                            className={formErrors[`exp_${index}_startDate`] ? "border-red-500" : ""}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`endDate_${exp.id}`} className="text-base">
                            End Date
                          </Label>
                          <Input
                            id={`endDate_${exp.id}`}
                            placeholder="Present (leave blank for current)"
                            value={exp.endDate || ""}
                            onChange={e => updateExperience(exp.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`description_${exp.id}`} className="text-base">
                            Job Description
                          </Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 gap-1 text-xs"
                            onClick={() => {
                              toast({
                                title: "AI Generation",
                                description: "This feature is coming soon!"
                              });
                            }}
                          >
                            <Sparkles className="h-3 w-3" /> Generate with AI
                          </Button>
                        </div>
                        <Textarea
                          id={`description_${exp.id}`}
                          placeholder="Describe your responsibilities and achievements..."
                          value={exp.description}
                          onChange={e => updateExperience(exp.id, "description", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("education")} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setActiveTab("projects")} className="bg-gray-900" size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Projects</h2>
                <p className="text-gray-500">Add your notable projects</p>
              </div>
              <Button onClick={addProject} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="border border-dashed p-8">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <p className="text-center text-gray-500 mb-4">No projects added yet</p>
                  <Button onClick={addProject} variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <Card key={project.id} className="relative border shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-6">
                      <div className="space-y-2 mb-6">
                        <Label htmlFor={`title_${project.id}`} className="text-base">
                          Project Title
                        </Label>
                        <Input
                          id={`title_${project.id}`}
                          placeholder="E-commerce Application"
                          value={project.title}
                          onChange={e => updateProject(project.id, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`description_${project.id}`} className="text-base">
                            Project Description
                          </Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 gap-1 text-xs"
                            onClick={() => {
                              toast({
                                title: "AI Generation",
                                description: "This feature is coming soon!"
                              });
                            }}
                          >
                            <Sparkles className="h-3 w-3" /> Generate with AI
                          </Button>
                        </div>
                        <Textarea
                          id={`description_${project.id}`}
                          placeholder="Describe the project, your role, and the technologies used..."
                          value={project.description}
                          onChange={e => updateProject(project.id, "description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2 mb-6">
                        <Label htmlFor={`technologies_${project.id}`} className="text-base">
                          Technologies Used
                        </Label>
                        <Input
                          id={`technologies_${project.id}`}
                          placeholder="React, Node.js, MongoDB"
                          value={project.technologies || ""}
                          onChange={e => updateProject(project.id, "technologies", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`link_${project.id}`} className="text-base">
                          Project Link
                        </Label>
                        <Input
                          id={`link_${project.id}`}
                          type="url"
                          placeholder="https://github.com/username/project"
                          value={project.link || ""}
                          onChange={e => updateProject(project.id, "link", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("experience")} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setActiveTab("skills")} className="bg-gray-900" size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "skills":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Skills</h2>
              <p className="text-gray-500">Showcase your professional and technical abilities</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professional" className="text-base">
                Professional Skills <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="professional"
                placeholder="Project Management, Team Leadership, Strategic Planning, etc."
                value={skills.professional}
                onChange={e => setSkills({...skills, professional: e.target.value})}
                className={formErrors.professional ? "border-red-500" : ""}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technical" className="text-base">
                Technical Skills <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="technical"
                placeholder="JavaScript, React, Node.js, CSS, etc."
                value={skills.technical}
                onChange={e => setSkills({...skills, technical: e.target.value})}
                className={formErrors.technical ? "border-red-500" : ""}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="soft" className="text-base">
                Soft Skills <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="soft"
                placeholder="Communication, Teamwork, Problem Solving, etc."
                value={skills.soft}
                onChange={e => setSkills({...skills, soft: e.target.value})}
                className={formErrors.soft ? "border-red-500" : ""}
                rows={3}
              />
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 gap-1 text-xs mt-1"
                  onClick={() => {
                    toast({
                      title: "AI Suggestion",
                      description: "This feature is coming soon!"
                    });
                  }}
                >
                  <Sparkles className="h-3 w-3" /> AI Suggest Skills
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("projects")} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setActiveTab("objectives")} className="bg-gray-900" size="lg">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "objectives":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Career Objective</h2>
              <p className="text-gray-500">Summarize your career goals and what you bring to the table</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="objective" className="text-base">
                  Career Objective <span className="text-red-500">*</span>
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 gap-1 text-xs"
                  onClick={() => {
                    toast({
                      title: "AI Generation",
                      description: "This feature is coming soon!"
                    });
                  }}
                >
                  <Sparkles className="h-3 w-3" /> Generate with AI
                </Button>
              </div>
              <Textarea
                id="objective"
                placeholder="A concise statement about your career goals and what you bring to a potential employer..."
                value={objective}
                onChange={e => setObjective(e.target.value)}
                className={formErrors.objective ? "border-red-500" : ""}
                rows={6}
              />
            </div>
            
            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("skills")} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleGenerate} className="bg-gray-900" size="lg">
                Generate Resume
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <Button 
              variant="outline" 
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="hidden md:flex"
            >
              {showLivePreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
          <p className="text-gray-500">Create a professional resume in minutes</p>
        </div>

        <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8`}>
          <div className="space-y-6">
            {getActiveContent()}
          </div>
          
          {showLivePreview && (
            <div className="hidden lg:block sticky top-20 h-fit">
              <ResumePreviewContent data={getResumeData()} templateId={selectedTemplate} isPreview={true} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
