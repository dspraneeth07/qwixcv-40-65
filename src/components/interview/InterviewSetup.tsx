
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ClipboardCheck, Timer } from "lucide-react";
import ResumeUploader from './ResumeUploader';

export type JobLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface InterviewSettings {
  jobTitle: string;
  jobLevel: JobLevel;
  resumeText: string;
  resumeFileName: string;
  duration: number;
}

interface InterviewSetupProps {
  onStartInterview: (settings: InterviewSettings) => void;
  isProcessing: boolean;
}

const InterviewSetup = ({ onStartInterview, isProcessing }: InterviewSetupProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobLevel, setJobLevel] = useState<JobLevel>('mid');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [duration, setDuration] = useState(15);
  
  const handleResumeProcessed = (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
  };
  
  const handleStartInterview = () => {
    onStartInterview({
      jobTitle,
      jobLevel,
      resumeText,
      resumeFileName,
      duration
    });
  };
  
  const isValid = jobTitle.trim() !== '' && resumeText !== '';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 text-primary mr-2" />
          Interview Setup
        </CardTitle>
        <CardDescription>
          Upload your resume and specify the job details to get started
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input 
              id="job-title" 
              placeholder="e.g. Software Engineer, Project Manager, UX Designer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job-level">Experience Level</Label>
            <Select 
              value={jobLevel} 
              onValueChange={(value: JobLevel) => setJobLevel(value)}
              disabled={isProcessing}
            >
              <SelectTrigger id="job-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid-Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Interview Duration</Label>
            <div className="flex items-center gap-2">
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
                disabled={isProcessing}
              >
                <SelectTrigger id="duration" className="flex gap-2">
                  <Timer className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="block mb-2">Resume</Label>
            <ResumeUploader 
              onResumeProcessed={handleResumeProcessed} 
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleStartInterview} 
          disabled={!isValid || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Start Interview
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
