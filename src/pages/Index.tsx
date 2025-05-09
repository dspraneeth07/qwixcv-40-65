
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CertificationSection from "@/components/home/CertificationSection";
import CtaSection from "@/components/home/CtaSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, MessageSquare, BarChart, GraduationCap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <MainLayout>
      {/* Career Path Simulator Promo Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 text-center mb-4">
        <div className="container mx-auto">
          <p className="flex items-center justify-center text-lg font-medium text-indigo-900 gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            {isAuthenticated ? (
              <>
                Welcome back, {user?.name}! Continue exploring AI-powered career tools
              </>
            ) : (
              <>
                Try our new AI-powered Career Development Suite
              </>
            )}
            <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 ml-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <Link to="/login">
                  <LogIn className="mr-1 h-4 w-4" /> Log In
                </Link>
              )}
            </Button>
          </p>
        </div>
      </div>
      
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CertificationSection />
      
      {/* New Career Path Simulator Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-indigo-950">
                Map Your Professional Journey
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our AI-powered Career Path Simulator helps you visualize your career trajectory 
                and explore potential advancement opportunities based on your desired role.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Generate personalized career paths based on your desired job role
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    See clear advancement steps with required skills for each career stage
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Get time estimates and expected salary ranges for each position
                  </span>
                </li>
              </ul>
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                {isAuthenticated ? (
                  <Link to="/career-path-simulator">
                    Try Career Path Simulator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link to="/register">
                    Sign Up to Access <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25"></div>
                <Card className="relative bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <BarChart className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Career Progression</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {['Junior Developer', 'Mid-level Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'].map((role, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${index === 0 ? 'text-indigo-600' : 'text-gray-700'}`}>
                              {role}
                            </p>
                          </div>
                          {index < 4 && (
                            <ArrowRight className={`h-4 w-4 mx-2 ${index === 0 ? 'text-indigo-600' : 'text-gray-400'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Interview Prep Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25"></div>
                <Card className="relative bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Interview Questions</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium text-gray-700 mb-1">Tell me about your experience with React</p>
                        <p className="text-sm text-gray-600">I have 3 years of experience building responsive web applications with React...</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium text-gray-700 mb-1">How do you handle complex state management?</p>
                        <p className="text-sm text-gray-600">For complex applications, I typically use Redux or Context API depending on the needs...</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium text-gray-700 mb-1">Describe a challenging project</p>
                        <p className="text-sm text-gray-600">In my last role, I led the development of a real-time dashboard that...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-indigo-950">
                Ace Your Next Interview
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our AI analyzes your resume and generates personalized interview questions and 
                suggested answers, helping you prepare for your next big opportunity.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="bg-purple-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Get tailored interview questions based on your resume
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    See suggested answers crafted specifically for your experience
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Practice and refine your responses for common industry questions
                  </span>
                </li>
              </ul>
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                {isAuthenticated ? (
                  <Link to="/builder">
                    Create Resume & Get Interview Prep <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link to="/register">
                    Sign Up to Access <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      <CtaSection />
      
      {/* Team QwikZen Section */}
      <section className="py-10 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Built with ❤️ by Team QwikZen</h2>
            <p className="text-gray-600 mb-6">
              QwiXEd360° is proudly designed and developed by QwikZen, 
              a team passionate about leveraging AI to transform career development 
              and education. Our mission is to make professional growth accessible to everyone.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/about">
                  About Us
                </Link>
              </Button>
              <Button asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
