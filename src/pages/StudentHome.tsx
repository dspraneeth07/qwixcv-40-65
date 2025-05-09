
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, User, ArrowRight, Book, LayoutDashboard, Users, Info } from "lucide-react";
import QwikzTeamBanner from "@/components/QwikzTeamBanner";

const StudentHome = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QwiX CV</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Your AI-powered career development platform
          </p>
        </div>
        
        <QwikzTeamBanner />
        
        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Builder Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>Create ATS-optimized resumes with AI guidance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>AI-powered content suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>Section-by-section guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>Multiple professional templates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/builder">
                  <span>Build Your Resume</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* ATS Scanner Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle>ATS Scanner</CardTitle>
              <CardDescription>Optimize your resume for job applications</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Real-time resume scoring</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Keyword optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Side-by-side comparison with job descriptions</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/ats-scanner">
                  <span>Scan Your Resume</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Career Path Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <LayoutDashboard className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle>Career Path Simulator</CardTitle>
              <CardDescription>Visualize your future career trajectory</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>Career growth visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>Skill development roadmaps</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>Personalized advancement strategies</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/career-path-simulator">
                  <span>Explore Career Paths</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Blockchain Certificates Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
              <CardTitle>Blockchain Certifications</CardTitle>
              <CardDescription>Secure your credentials on blockchain</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Tamper-proof certification storage</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Verifiable credentials for employers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Certification assessment exams</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/certification-center">
                  <span>Manage Certificates</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Interview Coach Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
              <User className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-2" />
              <CardTitle>Interview Coach</CardTitle>
              <CardDescription>Prepare for job interviews with AI</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Practice with AI interviewer</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Industry-specific question sets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Performance feedback and analysis</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/interview-coach">
                  <span>Practice Interviews</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Job Board Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20">
              <Users className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
              <CardTitle>Job Board</CardTitle>
              <CardDescription>Find opportunities matched to your profile</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Resume-matched job recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Application tracking system</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Direct employer connections</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/job-board">
                  <span>Browse Jobs</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to boost your career?</h2>
          <p className="text-muted-foreground mb-6">
            Explore all our tools designed to help you succeed in your professional journey
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default StudentHome;
