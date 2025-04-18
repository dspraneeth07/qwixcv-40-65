
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  
  // Preload essential resources to improve performance
  useEffect(() => {
    // Preload voices for speech synthesis
    if ('speechSynthesis' in window) {
      // Trigger voice loading
      window.speechSynthesis.getVoices();
    }
    
    // Prefetch any assets that might be needed
    const prefetchImage = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'image';
      document.head.appendChild(link);
    };
    
    // Example of prefetching interview room assets
    // prefetchImage('/path-to-interview-background.jpg');
  }, []);
  
  const handleSetupComplete = (data: any) => {
    setInterviewData(data);
    toast({
      title: "Interview Ready",
      description: "Your professional interview simulation is prepared.",
    });
    setActiveTab("simulation");
  };
  
  const handleInterviewComplete = (results: any) => {
    setInterviewResults(results);
    toast({
      title: "Interview Completed",
      description: "Your performance has been analyzed. View your detailed assessment.",
    });
    setActiveTab("results");
  };
  
  return (
    <MainLayout>
      <div className="container py-8 bg-white">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            QwiX AI Interview Coach
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Practice professional interviews with our AI-powered interviewer in a realistic environment
          </p>
        </div>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full p-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <TabsTrigger 
                  value="setup" 
                  disabled={activeTab === "simulation" || activeTab === "results"}
                  className="flex items-center data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-none flex-1 py-3"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Interview Setup</span>
                  <span className="sm:hidden">Setup</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="simulation" 
                  disabled={!interviewData || activeTab === "results"}
                  className="flex items-center data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-none flex-1 py-3"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Interview Simulation</span>
                  <span className="sm:hidden">Simulation</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  disabled={!interviewResults}
                  className="flex items-center data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-none flex-1 py-3"
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
