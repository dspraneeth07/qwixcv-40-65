
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TemplatesShowcase from "@/components/home/TemplatesShowcase";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      {/* Career Path Simulator Promo Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 text-center mb-4">
        <div className="container mx-auto">
          <p className="flex items-center justify-center text-lg font-medium text-indigo-900 gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Try our new AI-powered Career Path Simulator™
            <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 ml-4">
              <Link to="/career-path-simulator">
                Explore Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </p>
        </div>
      </div>
      
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesShowcase />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
