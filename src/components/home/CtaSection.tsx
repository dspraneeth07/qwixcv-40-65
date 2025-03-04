
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Ready to transform your job search?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 mb-10">
          Join thousands of job seekers who've landed their dream jobs with SmartResume's AI-powered platform.
        </p>
        <Button asChild size="lg" variant="secondary" className="animate-pulse">
          <Link to="/builder">
            Build Your Resume Now
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
