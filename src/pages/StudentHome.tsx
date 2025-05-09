
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, BookOpen, ArrowRight, Book, Route, Briefcase, Shield, MessageSquare, BarChart, Sparkles, Code, Rocket, TrendingUp, Star, Brain, Linkedin } from "lucide-react";
import QwikzTeamBanner from "@/components/QwikzTeamBanner";

const FeatureCard = ({ title, description, icon: Icon, path, points }: { 
  title: string;
  description: string;
  icon: any;
  path: string;
  points: string[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 transition-all hover:shadow-md h-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-2">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2 text-sm">
            {points.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to={path}>
              <span>Explore {title}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const FeatureSection = ({ title, description, features, bgClass }: { 
  title: string; 
  description: string;
  features: any[];
  bgClass: string;
}) => {
  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              points={feature.points}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const StudentHome = () => {
  // CV Tools
  const cvTools = [
    {
      title: "Resume Builder",
      description: "Create ATS-optimized resumes with AI guidance",
      icon: FileText,
      path: "/builder",
      points: [
        "AI-powered content suggestions",
        "Section-by-section guidance",
        "Multiple professional templates"
      ]
    },
    {
      title: "ATS Scanner",
      description: "Optimize your resume for job applications",
      icon: BarChart,
      path: "/ats-scanner",
      points: [
        "Real-time resume scoring",
        "Keyword optimization",
        "Side-by-side comparison with job descriptions"
      ]
    },
    {
      title: "LinkedIn Optimizer",
      description: "Enhance your LinkedIn profile visibility",
      icon: Linkedin,
      path: "/linkedin-optimizer",
      points: [
        "Profile optimization analysis",
        "Keyword recommendation engine",
        "Content suggestion for engagement"
      ]
    },
    {
      title: "Resume Compare",
      description: "Compare multiple resume versions",
      icon: FileText,
      path: "/resume-compare",
      points: [
        "Side-by-side visual comparison",
        "Impact analysis",
        "Industry benchmark against peers"
      ]
    }
  ];
  
  // Career Tools
  const careerTools = [
    {
      title: "Career Path Simulator",
      description: "Visualize your future career trajectory",
      icon: Route,
      path: "/career-path-simulator",
      points: [
        "Career growth visualization",
        "Skill development roadmaps",
        "Personalized advancement strategies"
      ]
    },
    {
      title: "Interview Coach",
      description: "Prepare for job interviews with AI",
      icon: MessageSquare,
      path: "/interview-coach",
      points: [
        "Practice with AI interviewer",
        "Industry-specific question sets",
        "Performance feedback and analysis"
      ]
    },
    {
      title: "Job Board",
      description: "Find opportunities matched to your profile",
      icon: Briefcase,
      path: "/job-board",
      points: [
        "Resume-matched job recommendations",
        "Application tracking system",
        "Direct employer connections"
      ]
    },
    {
      title: "AI Job Switch Planner",
      description: "Plan your career transition effectively",
      icon: Sparkles,
      path: "/ai-job-switch-planner",
      points: [
        "Switch feasibility calculation",
        "Learning paths identification",
        "Transition timeline planning"
      ]
    },
    {
      title: "AI Shadow Career Simulator",
      description: "Experience different career paths virtually",
      icon: Briefcase,
      path: "/ai-shadow-career-simulator",
      points: [
        "Day-in-the-life simulations",
        "Career challenge scenarios",
        "Skill compatibility assessment"
      ]
    },
    {
      title: "AI Layoff Readiness Toolkit",
      description: "Prepare for career uncertainties",
      icon: Shield,
      path: "/ai-layoff-readiness-toolkit",
      points: [
        "Job stability assessment",
        "Emergency career planning",
        "Market transferable skills identification"
      ]
    }
  ];

  // QwiX Learn Tools
  const learnTools = [
    {
      title: "AI Coding Coach",
      description: "Improve your coding skills with AI guidance",
      icon: Code,
      path: "/ai-coding-coach",
      points: [
        "Real-time code feedback",
        "Algorithm optimization tips",
        "Interview preparation exercises"
      ]
    },
    {
      title: "QwiXPro Builder",
      description: "Create professional portfolios",
      icon: Rocket,
      path: "/qwixpro-builder",
      points: [
        "Dynamic project showcases",
        "Integrated GitHub projects",
        "Customizable design options"
      ]
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify and bridge your skill gaps",
      icon: TrendingUp,
      path: "/skill-gap-analysis",
      points: [
        "Current vs. required skills mapping",
        "Personalized learning recommendations",
        "Progress tracking dashboard"
      ]
    },
    {
      title: "Mindprint Assessment",
      description: "Discover your ideal career path",
      icon: Brain,
      path: "/mindprint-assessment",
      points: [
        "Cognitive ability assessment",
        "Personal values alignment",
        "Career compatibility recommendations"
      ]
    },
  ];

  // Blockchain Tools
  const blockchainTools = [
    {
      title: "QwiXCert",
      description: "Blockchain-verified certifications",
      icon: Shield,
      path: "/certification-center",
      points: [
        "Tamper-proof certification storage",
        "Verifiable credentials for employers",
        "Certification assessment exams"
      ]
    },
    {
      title: "Blockchain Vault",
      description: "Secure document storage using blockchain",
      icon: Shield,
      path: "/blockchain-vault",
      points: [
        "Tamper-proof document storage",
        "Universal verification system",
        "Decentralized security protocol"
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QwiXEd360°Suite</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Your AI-powered career development platform
          </p>
        </motion.div>
        
        {/* Hero Banner */}
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-modern-blue-600 to-soft-purple mb-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute w-20 h-20 rounded-full bg-white/30 blur-xl top-1/4 left-1/4 animate-pulse"></div>
            <div className="absolute w-32 h-32 rounded-full bg-white/20 blur-xl top-2/3 left-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Empower Your Career Journey</h2>
              <p className="text-lg text-white/90 mb-6">
                QwiXEd360°Suite combines AI, blockchain, and precision tools to help you excel in your professional journey.
                From resumes to readiness, our platform is built to solve the real challenges job seekers face every day.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-modern-blue-600 hover:bg-white/90">
                  <Link to="/builder">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <QwikzTeamBanner />
        
        {/* CV Tools Section */}
        <FeatureSection
          title="CV Tools: Craft Your Professional Image"
          description="Our suite of CV and profile optimization tools designed to help you stand out in the job market with AI-powered assistance."
          features={cvTools}
          bgClass="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-transparent rounded-xl"
        />
        
        {/* Career Tools Section */}
        <FeatureSection
          title="QwiX Career Guide: Navigate Your Professional Journey"
          description="Tools to help you plan, visualize, and optimize your career path with AI-driven insights and practical guidance."
          features={careerTools}
          bgClass="bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-transparent rounded-xl"
        />
        
        {/* QwiX Learn Section */}
        <FeatureSection
          title="QwiX Learn: Upskill with Intelligence"
          description="Advanced learning tools that analyze your skill gaps and provide tailored learning paths to keep you competitive in your field."
          features={learnTools}
          bgClass="bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-transparent rounded-xl"
        />
        
        {/* Blockchain Tools */}
        <FeatureSection
          title="Blockchain Security: Protect Your Professional Identity"
          description="Leverage the power of blockchain to secure and verify your professional credentials and documents with tamper-proof technology."
          features={blockchainTools}
          bgClass="bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-transparent rounded-xl"
        />

        <div className="mt-16 mb-8 bg-gray-50 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Built by Visionaries, Not Corporates</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              QwiXEd360°Suite is a flagship innovation by QwikZen Group India – A zero-investment, 
              mission-driven startup founded by Dhadi Sai Praneeth Reddy, a student innovator who blends AI, 
              sacred knowledge, and real-world needs into intelligent systems that make a difference.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="flex flex-col items-center max-w-md">
              <div className="w-32 h-32 rounded-full mb-4 overflow-hidden border-4 border-modern-blue-200 shadow-xl">
                <img 
                  src="/lovable-uploads/f5d06c81-a24b-4c51-8bf0-c6fd139438e3.png" 
                  alt="Dhadi Sai Praneeth Reddy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Dhadi Sai Praneeth Reddy</h3>
              <p className="text-modern-blue-600 mb-2">Founder & CTO</p>
              <p className="text-center text-muted-foreground mb-4">
                Visionary technologist combining AI expertise with a passion for creating solutions 
                that address real-world career challenges.
              </p>
            </div>
          </div>
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
