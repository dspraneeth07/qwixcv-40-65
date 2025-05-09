
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, BarChart, Linkedin, Route, MessageSquare, Code, Shield, Briefcase, GraduationCap, Sparkles } from "lucide-react";

const StudentHome = () => {
  const features = [
    {
      title: "Resume Builder",
      description: "Create professional, ATS-optimized resumes with our AI-powered builder",
      icon: FileText,
      link: "/builder",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "ATS Scanner",
      description: "Check how well your resume performs against Applicant Tracking Systems",
      icon: BarChart,
      link: "/ats-scanner",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "LinkedIn Optimizer",
      description: "Enhance your LinkedIn profile to attract more recruiters and opportunities",
      icon: Linkedin,
      link: "/linkedin-optimizer",
      color: "bg-sky-100 text-sky-700"
    },
    {
      title: "Career Path Simulator",
      description: "Visualize your career trajectory and plan your professional growth",
      icon: Route,
      link: "/career-path-simulator",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Interview Coach",
      description: "Practice with AI-powered interview simulations tailored to your field",
      icon: MessageSquare,
      link: "/interview-coach",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "AI Coding Coach",
      description: "Improve your coding skills with personalized AI tutoring",
      icon: Code,
      link: "/ai-coding-coach",
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "QwiXCert Certification",
      description: "Earn industry-recognized certifications to boost your credentials",
      icon: Shield,
      link: "/certification-center",
      color: "bg-red-100 text-red-700"
    },
    {
      title: "Job Board",
      description: "Access curated job opportunities matching your skills and interests",
      icon: Briefcase,
      link: "/job-board",
      color: "bg-teal-100 text-teal-700"
    },
    {
      title: "AI Job Switch Planner",
      description: "Plan your career transition with AI-powered guidance and roadmaps",
      icon: Sparkles,
      link: "/ai-job-switch-planner",
      color: "bg-pink-100 text-pink-700"
    }
  ];

  return (
    <Layout>
      <div className="container max-w-7xl py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to QwiXEd360° Student Hub</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your one-stop platform for career development, skill enhancement, and job placement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={feature.link}>
                    Explore Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mb-6">
            <GraduationCap className="h-10 w-10 mx-auto text-primary mb-2" />
            <h2 className="text-2xl font-bold mb-2">Start Your Career Journey Today</h2>
            <p className="text-muted-foreground">
              QwiXEd360° provides all the tools you need to succeed in today's competitive job market
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" variant="default">
              <Link to="/builder">
                Build Your Resume
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/certification-center">
                Get Certified
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center py-6 border-t">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ by Team QwikZen
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default StudentHome;
