
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Award, BarChart3, BookOpen, Users, Building2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InterviewCoachCard from '@/components/dashboard/InterviewCoachCard';

interface UserStats {
  interviews_attempted: number;
  resume_score: number;
  certifications_earned: number;
  resumes_generated: number;
  career_track_progress: number;
}

interface OrgStats {
  candidates_interviewed: number;
  certificates_issued: number;
  applications_received: number;
  active_job_posts: number;
}

const StudentDashboard = ({ stats }: { stats: UserStats }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resumes Generated</span>
                <span className="font-medium">{stats.resumes_generated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="font-medium">{stats.resume_score}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Earned</span>
                <span className="font-medium">{stats.certifications_earned}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Interview Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Attempts</span>
                <span className="font-medium">{stats.interviews_attempted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-medium">{stats.career_track_progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InterviewCoachCard />
      </div>
    </div>
  );
};

const OrganizationDashboard = ({ stats }: { stats: OrgStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Interviewed</span>
              <span className="font-medium">{stats.candidates_interviewed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Issued</span>
              <span className="font-medium">{stats.certificates_issued}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Job Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-medium">{stats.active_job_posts}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Received</span>
              <span className="font-medium">{stats.applications_received}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | OrgStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'organization') {
          const { data, error } = await supabase
            .from('organization_stats')
            .select('*')
            .eq('organization_id', user.id)
            .single();
            
          if (error) throw error;
          setStats(data);
        } else {
          const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user?.id)
            .single();
            
          if (error) throw error;
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) fetchStats();
  }, [user]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-10">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.role === 'organization' ? 'Organization' : user?.name}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'organization' 
              ? 'Manage your recruitment process and issue certifications'
              : 'Track your career progress and manage your professional development'
            }
          </p>
        </div>

        {user?.role === 'organization' ? (
          <>
            {stats && <OrganizationDashboard stats={stats as OrgStats} />}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild className="w-full">
                <Link to="/post-job">
                  <Building2 className="mr-2 h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/issue-certificate">
                  <Award className="mr-2 h-4 w-4" />
                  Issue Certificate
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/schedule-interviews">
                  <Users className="mr-2 h-4 w-4" />
                  Schedule Interviews
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Certifications
              </TabsTrigger>
              <TabsTrigger value="resumes" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Resumes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {stats && <StudentDashboard stats={stats as UserStats} />}
            </TabsContent>

            <TabsContent value="certifications">
              <Card>
                <CardContent className="pt-6">
                  {/* Certifications content */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resumes">
              <Card>
                <CardContent className="pt-6">
                  {/* Resume list content */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
