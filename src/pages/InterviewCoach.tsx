
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InterviewSetup from '@/components/interview/InterviewSetup';
import InterviewSimulation from '@/components/interview/InterviewSimulation';
import InterviewResults from '@/components/interview/InterviewResults';
import { Briefcase, Activity, FileText } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

const InterviewCoach: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("setup");
  const [interviewData, setInterviewData] = useState<any>(null);
  const [interviewResults, setInterviewResults] = useState<any>(null);
  const { toast } = useToast();
  
  const handleSetupComplete = (data: any) => {
    setInterviewData(data);
    toast({
      title: "Interview Ready",
      description: "Your virtual interview session is prepared. Good luck!",
    });
    setActiveTab("simulation");
  };
  
  const handleInterviewComplete = (results: any) => {
    setInterviewResults(results);
    toast({
      title: "Interview Completed",
      description: "Your interview has been analyzed. View your detailed results.",
    });
    setActiveTab("results");
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-modern-blue-600 to-soft-purple">
            QwiX AI Interview Coach
          </h1>
          <p className="mt-2 text-xl text-muted-foreground">
            Practice interviews with our AI-powered virtual interviewer in a realistic 3D environment
          </p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full p-0 bg-gradient-to-r from-modern-blue-600/10 to-soft-purple/10 rounded-t-lg">
                <TabsTrigger 
                  value="setup" 
                  disabled={activeTab === "simulation" || activeTab === "results"}
                  className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary rounded-none flex-1 py-3"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Interview Setup</span>
                  <span className="sm:hidden">Setup</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="simulation" 
                  disabled={!interviewData || activeTab === "results"}
                  className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary rounded-none flex-1 py-3"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Interview Simulation</span>
                  <span className="sm:hidden">Simulation</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  disabled={!interviewResults}
                  className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-primary rounded-none flex-1 py-3"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Interview Results</span>
                  <span className="sm:hidden">Results</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="setup" className="p-0 m-0">
                <InterviewSetup onComplete={handleSetupComplete} />
              </TabsContent>
              
              <TabsContent value="simulation" className="p-0 m-0">
                <InterviewSimulation 
                  interviewData={interviewData} 
                  onComplete={handleInterviewComplete} 
                />
              </TabsContent>
              
              <TabsContent value="results" className="p-0 m-0">
                <InterviewResults results={interviewResults} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InterviewCoach;
