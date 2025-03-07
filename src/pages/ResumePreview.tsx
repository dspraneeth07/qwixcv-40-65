import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  ArrowLeft, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon,
  Share2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import html2pdf from 'html2pdf.js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Skills {
  professional?: string;
  technical?: string;
  soft?: string;
}

interface ResumeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    jobTitle?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    graduationDate: string;
    score?: string;
  }>;
  experience?: Array<{
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: Skills;
  objective?: string;
  projects?: Array<{
    id: string;
    title: string;
    technologies?: string;
    link?: string;
    description?: string;
  }>;
  countryCode?: string;
}

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (location.state && location.state.resumeData) {
        console.log("Found resume data in location state", location.state.resumeData);
        setResumeData(location.state.resumeData);
        setLoading(false);
        return;
      }
      
      const searchParams = new URLSearchParams(location.search);
      const dataParam = searchParams.get('data');
      
      if (!dataParam) {
        setError("No resume data found. Please go back to the builder and try again.");
        setLoading(false);
        return;
      }
      
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        console.log("Parsed data from URL param", parsedData);
        setResumeData(parsedData);
        setLoading(false);
      } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        setError("Invalid resume data format. Please go back and try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error loading resume data:", err);
      setError("Error loading resume data. Please go back and try again.");
      setLoading(false);
    }
  }, [location]);

  const handleDownload = () => {
    const resumeElement = document.getElementById('resume-content');
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const opt = {
      margin: 1,
      filename: `${resumeData?.personalInfo?.firstName || ''}_${resumeData?.personalInfo?.lastName || ''}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast({
      title: "Generating PDF",
      description: "Your resume is being prepared for download"
    });

    html2pdf().from(resumeElement).set(opt).save()
      .then(() => {
        toast({
          title: "Download Complete",
          description: "Your resume has been downloaded successfully"
        });
      })
      .catch(err => {
        console.error("PDF generation error:", err);
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive"
        });
      });
  };

  const handleShareToMedia = async () => {
    try {
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Could not generate PDF for sharing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Preparing Resume",
        description: "Getting your resume ready for sharing..."
      });

      const opt = {
        margin: 1,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().from(resumeElement).set(opt).outputPdf('blob');
      
      if (navigator.share) {
        const file = new File([pdfBlob], `${resumeData?.personalInfo?.firstName || ''}_${resumeData?.personalInfo?.lastName || ''}_Resume.pdf`, { 
          type: 'application/pdf' 
        });
        
        await navigator.share({
          title: `${resumeData?.personalInfo?.firstName || ''} ${resumeData?.personalInfo?.lastName || ''} Resume`,
          files: [file]
        });
        
        toast({
          title: "Shared Successfully",
          description: "Your resume has been shared"
        });
      } else {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
        
        toast({
          title: "Resume Ready",
          description: "Your resume is ready to download and share manually"
        });
        
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not share your resume. Please try downloading it instead.",
        variant: "destructive"
      });
    }
  };

  const handleShareToCompany = () => {
    if (!resumeData) {
      toast({
        title: "Error",
        description: "Resume data not available. Please try again.",
        variant: "destructive"
      });
      return;
    }

    navigate('/share-to-company', { 
      state: { 
        resumeData 
      } 
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ats">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0" align="end">
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none py-3 px-4"
                    onClick={handleShareToMedia}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share to Media
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none py-3 px-4"
                    onClick={handleShareToCompany}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share to Company
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
    <Card id="resume-content" className={`p-8 bg-white shadow-lg print:shadow-none ${isPreview ? 'max-h-full overflow-auto' : 'max-w-3xl w-full'}`}>
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-center">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h2>
        <p className="text-primary font-medium text-center">{personalInfo?.jobTitle || ""}</p>
        
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mt-2">
          {personalInfo?.email && (
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.githubUrl && personalInfo.githubUrl.trim() !== "" && (
            <a 
              href={personalInfo.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <Github className="h-3.5 w-3.5 mr-1" />
              {personalInfo.githubUrl}
            </a>
          )}
          {personalInfo?.linkedinUrl && personalInfo.linkedinUrl.trim() !== "" && (
            <a 
              href={personalInfo.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <Linkedin className="h-3.5 w-3.5 mr-1" />
              {personalInfo.linkedinUrl}
            </a>
          )}
        </div>
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
                    <p className="font-medium">{edu.school || "University/School"}</p>
                    <p className="text-sm">{edu.degree || "Degree"}</p>
                  </div>
                  <p className="text-sm text-right">{edu.graduationDate || "Graduation Year"}</p>
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
                </div>
                {proj.link && proj.link.trim() !== "" && (
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline flex items-center mt-1"
                  >
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                    {proj.link}
                  </a>
                )}
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
        Object.values(skills as Skills).some(val => 
          typeof val === 'string' && val.trim() !== ""
        )) && (
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

export const ResumePreviewContent = ({ 
  data, 
  templateId,
  isPreview = false 
}: { 
  data: any; 
  templateId?: string;
  isPreview?: boolean;
}) => {
  return (
    <div className="h-full overflow-auto p-4 bg-muted border-l">
      {!isPreview && <h3 className="text-sm font-medium mb-3">Live Preview</h3>}
      {data && <MiniResumeContent data={data} isPreview={isPreview} />}
    </div>
  );
};

const MiniResumeContent = ({ data, isPreview = false }: { data: ResumeData, isPreview?: boolean }) => {
  if (!data || !data.personalInfo) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <p className="text-sm text-muted-foreground text-center py-8">
          Fill in your details to see a preview of your resume here
        </p>
      </Card>
    );
  }
  
  const { personalInfo, education, experience, skills, objective, projects, countryCode } = data;
  
  return (
    <Card className={`p-4 bg-white shadow-lg print:shadow-none ${isPreview ? 'max-h-full overflow-auto' : 'max-w-3xl w-full'}`}>
      <div className="border-b pb-2 mb-3 text-center">
        <h2 className="text-xl font-bold">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h2>
        <p className="text-primary font-medium text-sm">{personalInfo?.jobTitle || ""}</p>
        
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground mt-1">
          {personalInfo?.email && (
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {countryCode || "+91"} {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.githubUrl && personalInfo.githubUrl.trim() !== "" && (
            <span className="inline-flex items-center text-xs text-primary truncate">
              <Github className="h-3 w-3 mr-1" />
              <span className="truncate">{personalInfo.githubUrl}</span>
            </span>
          )}
          {personalInfo?.linkedinUrl && personalInfo.linkedinUrl.trim() !== "" && (
            <span className="inline-flex items-center text-xs text-primary truncate">
              <Linkedin className="h-3 w-3 mr-1" />
              <span className="truncate">{personalInfo.linkedinUrl}</span>
            </span>
          )}
        </div>
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
                    <p className="font-medium text-xs">{edu.school || "University/School"}</p>
                    <p className="text-xs">{edu.degree || "Degree"}</p>
                  </div>
                  <p className="text-xs text-right">{edu.graduationDate || "Graduation Year"}</p>
                </div>
                {edu.score && <p className="text-xs text-muted-foreground mt-1">{edu.score}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Projects</h3>
          <div className="space-y-2">
            {projects.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{proj.title || "Project Title"}</p>
                    {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
                  </div>
                </div>
                {proj.link && proj.link.trim() !== "" && (
                  <span className="text-xs text-primary flex items-center mt-1 truncate">
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{proj.link}</span>
                  </span>
                )}
                {proj.description && (
                  <div className="text-xs mt-1">
                    {proj.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {experience && experience.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Work Experience</h3>
          <div className="space-y-2">
            {experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{exp.jobTitle || "Job Title"}</p>
                    <p className="text-xs text-muted-foreground">{exp.companyName || "Company"}</p>
                  </div>
                  <p className="text-xs text-right">
                    {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                  </p>
                </div>
                {exp.description && (
                  <div className="text-xs mt-1">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && (Object.values(skills).some(val => val && val.trim() !== "")) && (
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
