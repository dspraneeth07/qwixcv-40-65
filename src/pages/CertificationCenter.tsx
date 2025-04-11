
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import MCQTestList from '@/components/certification/MCQTestList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Award, BookOpen, Cpu } from "lucide-react";
import { TestInfo } from '@/types/certification';
import { getMockTests } from '@/utils/mockData';

const CertificationCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get mock test data
  const allTests = getMockTests();

  // Filter tests based on search and category
  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && test.category === activeTab;
  });
  
  // Mock data for user certificates (in a real app, this would come from your user state)
  const userCertificates = ["test-123", "test-456"]; // IDs of tests the user has certificates for
  
  return (
    <MainLayout>
      <div className="container py-10">
        <QwiXCertHeader 
          title="QwiXCertChain Certification Center" 
          subtitle="Take assessments, earn blockchain-verified certifications, and showcase your skills on your resume"
        />
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by skill, topic, or keyword..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                All Topics
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center">
                <Cpu className="h-4 w-4 mr-2" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Career
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <MCQTestList tests={filteredTests} userCertificates={userCertificates} />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="technical" className="mt-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <MCQTestList 
                  tests={filteredTests} 
                  userCertificates={userCertificates}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="career" className="mt-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <MCQTestList 
                  tests={filteredTests} 
                  userCertificates={userCertificates}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default CertificationCenter;
