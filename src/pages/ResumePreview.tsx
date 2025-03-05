
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ArrowLeft, Github, Linkedin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // First try to get data from location state (direct navigation)
      if (location.state && location.state.resumeData) {
        setResumeData(location.state.resumeData);
        setLoading(false);
        return;
      }
      
      // Then try URL parameters
      const searchParams = new URLSearchParams(location.search);
      const dataParam = searchParams.get('data');
      
      if (!dataParam) {
        setError("No resume data found. Please go back to the builder and try again.");
        setLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(decodeURIComponent(dataParam));
      setResumeData(parsedData);
      setLoading(false);
    } catch (err) {
      console.error("Error parsing resume data:", err);
      setError("Error loading resume data. Please go back and try again.");
      setLoading(false);
    }
  }, [location]);

  const handleDownload = () => {
    window.print();
    toast({
      title: "Downloading Resume",
      description: "Your resume is being prepared for download"
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse w-full max-w-3xl h-[800px] bg-muted rounded-md"></div>
          <p className="mt-4 text-muted-foreground">Loading your resume...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/builder')}>Return to Resume Builder</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Preview</h1>
            <p className="text-muted-foreground">Review your generated resume</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/builder')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <ResumeContent data={resumeData} />
        </div>
      </div>
    </MainLayout>
  );
};

const ResumeContent = ({ data, isPreview = false }: { data: any, isPreview?: boolean }) => {
  if (!data) return null;
  
  const { personalInfo, education, experience, skills, objective, projects } = data;
  
  return (
    <Card className={`p-8 bg-white shadow-lg print:shadow-none ${isPreview ? 'max-h-full overflow-auto' : 'max-w-3xl w-full'}`}>
      <div className="border-b pb-4 mb-4 text-center">
        <h2 className="text-2xl font-bold">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h2>
        <p className="text-primary font-medium">{personalInfo?.jobTitle || ""}</p>
        
        <div className="flex flex-wrap justify-center space-x-3 text-sm text-muted-foreground mt-2">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
        </div>
        
        {(personalInfo?.githubUrl || personalInfo?.linkedinUrl) && (
          <div className="flex justify-center space-x-4 mt-2">
            {personalInfo?.githubUrl && (
              <a 
                href={personalInfo.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </a>
            )}
            {personalInfo?.linkedinUrl && (
              <a 
                href={personalInfo.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
      
      {objective && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Career Objective</h3>
          <p className="text-sm">{objective}</p>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Education</h3>
          <div className="space-y-4">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{edu.school}</p>
                    <p className="text-sm">{edu.degree}</p>
                  </div>
                  <p className="text-sm text-right">{edu.graduationDate}</p>
                </div>
                {edu.score && <p className="text-sm text-muted-foreground mt-1">{edu.score}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && projects[0].title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Projects</h3>
          <div className="space-y-4">
            {projects
              .filter((proj: any) => proj.title.trim() !== "")
              .map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{proj.title}</p>
                    {proj.technologies && <p className="text-sm text-muted-foreground">{proj.technologies}</p>}
                  </div>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                {proj.description && (
                  <div className="text-sm mt-1" 
                       dangerouslySetInnerHTML={{ __html: proj.description.replace(/\n/g, '<br/>') }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {experience && experience.length > 0 && experience[0].jobTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Work Experience</h3>
          <div className="space-y-4">
            {experience
              .filter((exp: any) => exp.jobTitle.trim() !== "")
              .map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{exp.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                    {exp.role && <p className="text-sm">{exp.role}</p>}
                  </div>
                  <p className="text-sm text-right">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                </div>
                {exp.description && (
                  <div className="text-sm mt-1" 
                       dangerouslySetInnerHTML={{ __html: exp.description.replace(/\n/g, '<br/>') }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.professional && (
              <div>
                <p className="font-medium text-sm">Professional</p>
                <p className="text-sm">{skills.professional}</p>
              </div>
            )}
            {skills.technical && (
              <div>
                <p className="font-medium text-sm">Technical</p>
                <p className="text-sm">{skills.technical}</p>
              </div>
            )}
            {skills.soft && (
              <div>
                <p className="font-medium text-sm">Soft Skills</p>
                <p className="text-sm">{skills.soft}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export { ResumePreview };

// Update the ResumePreviewContent to better handle live updates
export const ResumePreviewContent = ({ 
  data, 
  templateId,
  isPreview = false 
}: { 
  data: any; 
  templateId?: string;
  isPreview?: boolean;
}) => {
  // Use key to force re-render when data changes
  const [key, setKey] = useState(Date.now());
  
  // Update key when data changes to force re-render
  useEffect(() => {
    setKey(Date.now());
  }, [data]);
  
  return (
    <div className="h-full overflow-auto p-4 bg-muted border-l">
      <h3 className="text-sm font-medium mb-3">Live Preview</h3>
      <div key={key}>
        <MiniResumeContent data={data} isPreview={isPreview} />
      </div>
    </div>
  );
};

// Separate component for the mini preview to avoid duplicate code
const MiniResumeContent = ({ data, isPreview = false }: { data: any, isPreview?: boolean }) => {
  if (!data) return null;
  
  const { personalInfo, education, experience, skills, objective, projects } = data;
  
  return (
    <Card className={`p-4 bg-white shadow-lg print:shadow-none ${isPreview ? 'max-h-full overflow-auto' : 'max-w-3xl w-full'}`}>
      <div className="border-b pb-2 mb-3 text-center">
        <h2 className="text-xl font-bold">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h2>
        <p className="text-primary font-medium text-sm">{personalInfo?.jobTitle || ""}</p>
        
        <div className="flex flex-wrap justify-center space-x-2 text-xs text-muted-foreground mt-1">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
        </div>
        
        {(personalInfo?.githubUrl || personalInfo?.linkedinUrl) && (
          <div className="flex justify-center space-x-3 mt-1">
            {personalInfo?.githubUrl && (
              <a 
                href={personalInfo.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-primary hover:underline"
              >
                <Github className="h-3 w-3 mr-1" />
                GitHub
              </a>
            )}
            {personalInfo?.linkedinUrl && (
              <a 
                href={personalInfo.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-primary hover:underline"
              >
                <Linkedin className="h-3 w-3 mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
      
      {objective && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Career Objective</h3>
          <p className="text-xs">{objective}</p>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Education</h3>
          <div className="space-y-2">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{edu.school}</p>
                    <p className="text-xs">{edu.degree}</p>
                  </div>
                  <p className="text-xs text-right">{edu.graduationDate}</p>
                </div>
                {edu.score && <p className="text-xs text-muted-foreground mt-1">{edu.score}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && projects[0].title && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Projects</h3>
          <div className="space-y-2">
            {projects
              .filter((proj: any) => proj.title.trim() !== "")
              .map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-xs">{proj.title}</p>
                      {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
                    </div>
                    {proj.link && (
                      <p className="text-xs text-primary">Link</p>
                    )}
                  </div>
                  {proj.description && (
                    <div className="text-xs mt-1" 
                        dangerouslySetInnerHTML={{ __html: proj.description.replace(/\n/g, '<br/>') }} />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      
      {experience && experience.length > 0 && experience[0].jobTitle && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Work Experience</h3>
          <div className="space-y-2">
            {experience
              .filter((exp: any) => exp.jobTitle.trim() !== "")
              .map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-xs">{exp.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{exp.companyName}</p>
                    </div>
                    <p className="text-xs text-right">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  {exp.description && (
                    <div className="text-xs mt-1" 
                        dangerouslySetInnerHTML={{ __html: exp.description.replace(/\n/g, '<br/>') }} />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      
      {skills && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Skills</h3>
          <div className="grid grid-cols-1 gap-2">
            {skills.professional && (
              <div>
                <p className="font-medium text-xs">Professional</p>
                <p className="text-xs">{skills.professional}</p>
              </div>
            )}
            {skills.technical && (
              <div>
                <p className="font-medium text-xs">Technical</p>
                <p className="text-xs">{skills.technical}</p>
              </div>
            )}
            {skills.soft && (
              <div>
                <p className="font-medium text-xs">Soft Skills</p>
                <p className="text-xs">{skills.soft}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumePreview;
