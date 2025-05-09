
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Users, Shield, Briefcase, Building, MessageSquare } from "lucide-react";

const OrganizationHome = () => {
  const features = [
    {
      title: "AI Interviewer",
      description: "Streamline your interview process with AI-powered candidate screening",
      icon: MessageSquare,
      link: "/organization/ai-interviewer",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Resume Parser",
      description: "Automatically extract and analyze information from candidate resumes",
      icon: FileText,
      link: "/organization/resume-parser",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Aptitude Exams",
      description: "Create customized assessments to evaluate candidate skills",
      icon: Users,
      link: "/organization/aptitude-exams",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Blockchain Verification",
      description: "Verify candidate credentials and certificates using blockchain technology",
      icon: Shield,
      link: "/organization/blockchain-verification",
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "Document Generator",
      description: "Generate official documents and certificates for candidates and employees",
      icon: FileText,
      link: "/organization/document-generator",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Talent Sourcing",
      description: "Find qualified candidates that match your organization's requirements",
      icon: Briefcase,
      link: "/job-board",
      color: "bg-teal-100 text-teal-700"
    },
  ];

  return (
    <Layout>
      <div className="container max-w-7xl py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to QwiXEd360° Organization Hub</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive platform for talent acquisition, assessment, and credential verification
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
                    Access Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mb-6">
            <Building className="h-10 w-10 mx-auto text-primary mb-2" />
            <h2 className="text-2xl font-bold mb-2">Streamline Your Recruitment Process</h2>
            <p className="text-muted-foreground">
              QwiXEd360° helps organizations find, assess, and verify talent more effectively
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" variant="default">
              <Link to="/organization/ai-interviewer">
                Start Screening Candidates
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/organization/dashboard">
                View Dashboard
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

export default OrganizationHome;
