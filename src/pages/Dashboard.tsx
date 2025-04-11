
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileEdit, FileSpreadsheet, BarChart3, Award } from "lucide-react";
import CertificationsTab from "@/components/dashboard/CertificationsTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('resume');
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your resume, track applications, and view your certifications
          </p>
        </div>
        
        <Tabs 
          defaultValue="resume" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="resume" className="flex items-center">
              <FileEdit className="h-4 w-4 mr-2" />
              Resume Builder
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="ats" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              ATS Scores
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Certifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume">
            <div className="text-center py-10">
              <p>Resume Builder content would go here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="text-center py-10">
              <p>Applications tracker content would go here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="ats">
            <div className="text-center py-10">
              <p>ATS Scores content would go here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <CertificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
