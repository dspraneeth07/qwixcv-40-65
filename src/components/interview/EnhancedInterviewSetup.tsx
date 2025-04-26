
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, Clock, Brain, Camera, Globe, Lightbulb } from 'lucide-react';
import { InterviewSettings } from '@/types/interview';
import ResumeUploader from './ResumeUploader';

interface InterviewSetupProps {
  onStartInterview: (settings: InterviewSettings) => void;
  isProcessing: boolean;
}

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  targetCompany: z.string().min(1, { message: "Target company is required" }),
  yearsOfExperience: z.enum(["0-1", "1-3", "3-5", "5+"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  interviewType: z.enum(["technical", "behavioral", "mixed"]),
  preferredLanguage: z.string().default("English"),
  enableRealTimeFeedback: z.boolean().default(true),
  useCamera: z.boolean().default(false),
  duration: z.number().min(5).max(60).default(15),
});

const EnhancedInterviewSetup = ({ onStartInterview, isProcessing }: InterviewSetupProps) => {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      targetCompany: "",
      yearsOfExperience: "1-3",
      difficulty: "medium",
      interviewType: "mixed",
      preferredLanguage: "English",
      enableRealTimeFeedback: true,
      useCamera: false,
      duration: 15,
    },
  });

  const handleResumeProcessed = (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!resumeText || !resumeFileName) {
      form.setError("jobTitle", {
        type: "manual",
        message: "Please upload your resume first",
      });
      return;
    }

    // Combine form values with resume data
    const settings: InterviewSettings = {
      ...values,
      resumeText,
      resumeFileName,
      jobLevel: getJobLevel(values.yearsOfExperience),
    };

    onStartInterview(settings);
  };

  const getJobLevel = (yearsExp: string): string => {
    switch(yearsExp) {
      case "0-1": return "Entry Level";
      case "1-3": return "Junior";
      case "3-5": return "Mid-Level";
      case "5+": return "Senior";
      default: return "Mid-Level";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Interview Setup
        </CardTitle>
        <CardDescription>
          Configure your AI interview session
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <ResumeUploader 
            onResumeProcessed={handleResumeProcessed}
            isProcessing={isProcessing}
          />
          
          {resumeText && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Job Information */}
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                    Job Details
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Software Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="targetCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Company</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Google" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isProcessing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select years" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                              <SelectItem value="1-3">1-3 years (Junior)</SelectItem>
                              <SelectItem value="3-5">3-5 years (Mid-Level)</SelectItem>
                              <SelectItem value="5+">5+ years (Senior)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interviewType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interview Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isProcessing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="behavioral">Behavioral</SelectItem>
                              <SelectItem value="mixed">Mixed (Both)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Interview Settings */}
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-purple-500" />
                    Interview Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isProcessing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy (Supportive)</SelectItem>
                              <SelectItem value="medium">Medium (Balanced)</SelectItem>
                              <SelectItem value="hard">Hard (Challenging)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input
                                type="number"
                                min={5}
                                max={60}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                                disabled={isProcessing}
                              />
                            </FormControl>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isProcessing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Telugu">Telugu</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Advanced Options */}
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium">Advanced Options</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="enableRealTimeFeedback"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Real-Time Feedback</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Show live feedback on your responses
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isProcessing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="useCamera"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Camera Analysis</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Enable video for posture and expression analysis
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isProcessing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isProcessing || !resumeText}
                >
                  {isProcessing ? "Preparing Interview..." : "Start AI Interview"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedInterviewSetup;
