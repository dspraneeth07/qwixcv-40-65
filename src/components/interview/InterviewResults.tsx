
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Video, MessageSquare, BarChart2, Printer, Share2, PieChart, CheckCircle2 } from "lucide-react";
import html2pdf from 'html2pdf.js';

interface InterviewResultsProps {
  results: any;
}

const InterviewResults: React.FC<InterviewResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const generatePDF = () => {
    const element = document.getElementById('interview-report');
    
    if (element) {
      const opt = {
        margin: 10,
        filename: 'interview-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Interview Performance Report</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis of your mock interview session
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Overall Performance</h3>
                <p className="text-muted-foreground">
                  {results?.overallScore >= 90 ? "Excellent! You're ready for the real interview." :
                   results?.overallScore >= 80 ? "Very good performance with some areas to polish." :
                   results?.overallScore >= 70 ? "Good job with several improvement opportunities." :
                   "You have the foundations, but need more practice."}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-modern-blue-500 to-soft-purple text-white font-bold text-3xl shadow-lg">
                  {results?.overallScore}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-200" />
            </div>
            <h3 className="text-2xl font-bold">{results?.technicalScore}%</h3>
            <p className="text-muted-foreground">Technical Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-200" />
            </div>
            <h3 className="text-2xl font-bold">{results?.behavioralScore}%</h3>
            <p className="text-muted-foreground">Behavioral Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <BarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-200" />
            </div>
            <h3 className="text-2xl font-bold">{results?.confidenceScore}%</h3>
            <p className="text-muted-foreground">Confidence Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Video className="h-6 w-6 text-amber-600 dark:text-amber-200" />
            </div>
            <h3 className="text-2xl font-bold">{results?.bodyLanguageScore}%</h3>
            <p className="text-muted-foreground">Body Language</p>
          </CardContent>
        </Card>
      </div>
      
      <div id="interview-report">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Key Observations</h3>
              <ul className="space-y-2">
                {results?.feedback.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Strength Analysis</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Communication Skills</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div 
                        className="h-full rounded-full bg-green-500" 
                        style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Technical Knowledge</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div 
                        className="h-full rounded-full bg-blue-500" 
                        style={{ width: `${results?.technicalScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Confidence Level</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div 
                        className="h-full rounded-full bg-purple-500" 
                        style={{ width: `${results?.confidenceScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Body Language</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div 
                        className="h-full rounded-full bg-yellow-500" 
                        style={{ width: `${results?.bodyLanguageScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Interview Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Job Title</p>
                        <p className="font-medium">{results?.interviewData?.jobTitle || "Software Engineer"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Job Category</p>
                        <p className="font-medium">{results?.interviewData?.jobCategory || "software-development"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interview Duration</p>
                        <p className="font-medium">12 minutes</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Questions Answered</p>
                        <p className="font-medium">{results?.transcript?.filter((item: any) => item.role === "user").length || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transcript" className="space-y-6 pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Interview Transcript</h3>
                <div className="space-y-4">
                  {results?.transcript.map((item: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="font-medium text-sm">
                        {item.role === "interviewer" ? "Interviewer" : "You"}
                      </div>
                      <p className={`p-3 rounded-md ${
                        item.role === "interviewer" 
                          ? "bg-gray-100 dark:bg-gray-800" 
                          : "bg-blue-50 dark:bg-blue-900/20"
                      }`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6 pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Improvement Areas</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Technical Knowledge</h4>
                    <p className="text-amber-700 dark:text-amber-300">
                      Consider providing more specific examples from your past projects. When discussing technical challenges, be more precise about your role and contributions.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Body Language</h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      Work on maintaining more consistent eye contact with the interviewer. Try to reduce hand fidgeting during responses, as it can signal nervousness.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Communication</h4>
                    <p className="text-green-700 dark:text-green-300">
                      Your communication is generally clear, but try to avoid filler words like "um" and "uh". Practice speaking at a slightly slower pace to give yourself time to formulate complete thoughts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Next Steps</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Schedule another practice interview focusing on your technical responses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Review recommended resources for improving body language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Practice answering the most challenging questions again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Complete the behavioral skills assessment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewResults;
