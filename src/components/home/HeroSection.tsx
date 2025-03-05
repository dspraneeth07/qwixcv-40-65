
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,#4f46e550_0,transparent_100%)]" />
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-shrink-0 lg:max-w-xl">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Create professional resumes with AI in minutes
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our AI-powered resume builder crafts ATS-optimized, professional resumes 
            that help you stand out and land interviews faster. Choose from beautiful 
            templates and get expert suggestions as you build.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg" className="animate-fade-in">
              <Link to="/builder">
                Build your resume
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-1 lg:flex lg:justify-center">
          <div className="relative w-full max-w-lg lg:max-w-none">
            <div className="relative mx-auto w-full rounded-lg shadow-xl ring-1 ring-gray-900/10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop"
                alt="Resume preview"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
