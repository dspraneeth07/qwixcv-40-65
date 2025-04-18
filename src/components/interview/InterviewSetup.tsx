import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  RefreshCw, 
  ChevronRight, 
  Briefcase 
} from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface InterviewSetupProps {
  onComplete: (data: any) => void;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onComplete }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'standard' | 'technical' | 'behavioral'>('standard');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
    }
  };
  
  const handleStartInterview = async () => {
    if (!jobTitle) {
      toast({
        title: "Required Field Missing",
        description: "Please enter the job title you're applying for.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobCategory) {
      toast({
        title: "Required Field Missing",
        description: "Please select a job category.",
        variant: "destructive",
      });
      return;
    }
    
    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing time
    try {
      // In a real implementation, we would upload the resume and process it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const setupData = {
        jobTitle,
        jobCategory,
        resumeFile: resumeFile.name,
        interviewMode,
        userId: user?.id,
        timestamp: new Date().toISOString()
      };
      
      onComplete(setupData);
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an error setting up your interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Configure Your Interview Session</h2>
        <p className="text-muted-foreground">
          Set up your virtual interview environment based on the job you're applying for.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title You're Applying For</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Software Engineer, Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-white dark:bg-gray-950"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobCategory">Job Category</Label>
            <Select value={jobCategory} onValueChange={setJobCategory}>
              <SelectTrigger id="jobCategory" className="bg-white dark:bg-gray-950">
                <SelectValue placeholder="Select job category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-development">Software Development</SelectItem>
                <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                <SelectItem value="product-management">Product Management</SelectItem>
                <SelectItem value="design">UX/UI Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="customer-support">Customer Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resumeUpload">Upload Your Resume (PDF Only)</Label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="resumeUpload"
                className="flex justify-center items-center w-full h-32 px-4 transition bg-white dark:bg-gray-950 border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-modern-blue-300 focus:outline-none"
              >
                <span className="flex flex-col items-center space-y-2">
                  {resumeFile ? (
                    <>
                      <Upload className="h-10 w-10 text-green-500" />
                      <span className="font-medium text-green-600">
                        {resumeFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">
                        Drop your resume here or click to browse
                      </span>
                    </>
                  )}
                </span>
                <Input
                  id="resumeUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Interview Mode</Label>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <Button
                type="button"
                variant={interviewMode === 'standard' ? "default" : "outline"}
                className={`justify-start px-4 py-6 h-auto ${
                  interviewMode === 'standard'
                    ? "border-2 border-modern-blue-500"
                    : ""
                }`}
                onClick={() => setInterviewMode('standard')}
              >
                <div className="flex items-center">
                  <div className="bg-modern-blue-100 dark:bg-modern-blue-900 p-2 rounded-full mr-4">
                    <Briefcase className="h-6 w-6 text-modern-blue-600 dark:text-modern-blue-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Standard Interview</div>
                    <div className="text-sm text-muted-foreground">
                      Balanced mix of general, behavioral, and technical questions
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={interviewMode === 'technical' ? "default" : "outline"}
                className={`justify-start px-4 py-6 h-auto ${
                  interviewMode === 'technical'
                    ? "border-2 border-modern-blue-500"
                    : ""
                }`}
                onClick={() => setInterviewMode('technical')}
              >
                <div className="flex items-center">
                  <div className="bg-modern-blue-100 dark:bg-modern-blue-900 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-modern-blue-600 dark:text-modern-blue-300"
                    >
                      <path d="M18 16.98h-5.99c-1.1 0-1.95.5-2.01 1l-.44 4.02h2.5l-.51-2h5.99c.55 0 .99-.45.99-1v-2.01c0-.57-.4-1.01-.99-1.01z"></path>
                      <path d="M9 7h9l.01 4c0 .55-.45 1-1.01 1H9c-.57 0-1 .45-1 1v1"></path>
                      <path d="M5.5 7C6.33 7 7 6.33 7 5.5S6.33 4 5.5 4 4 4.67 4 5.5 4.67 7 5.5 7z"></path>
                      <path d="M10 5h6"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Technical Focus</div>
                    <div className="text-sm text-muted-foreground">
                      Emphasis on technical skills, coding challenges, and problem-solving
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={interviewMode === 'behavioral' ? "default" : "outline"}
                className={`justify-start px-4 py-6 h-auto ${
                  interviewMode === 'behavioral'
                    ? "border-2 border-modern-blue-500"
                    : ""
                }`}
                onClick={() => setInterviewMode('behavioral')}
              >
                <div className="flex items-center">
                  <div className="bg-modern-blue-100 dark:bg-modern-blue-900 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-modern-blue-600 dark:text-modern-blue-300"
                    >
                      <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.479m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Behavioral Focus</div>
                    <div className="text-sm text-muted-foreground">
                      Focus on soft skills, past experiences, and situational scenarios
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleStartInterview} 
          className="px-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Preparing Interview...
            </>
          ) : (
            <>
              Start Interview
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InterviewSetup;
