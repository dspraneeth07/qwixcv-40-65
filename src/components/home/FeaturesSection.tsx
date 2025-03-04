
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileSearch, Layout } from "lucide-react";

const features = [
  {
    name: "AI-Powered Resume Creation",
    description: "Our advanced AI assists you in crafting perfect content for each section, suggesting improvements for maximum impact.",
    icon: Brain,
  },
  {
    name: "ATS Optimization",
    description: "Built-in ATS compatibility ensures your resume passes through applicant tracking systems and reaches human recruiters.",
    icon: FileSearch,
  },
  {
    name: "Customizable Templates",
    description: "Choose from a wide range of professionally designed templates that can be fully customized to match your personal style.",
    icon: Layout,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Features that empower your job search
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to create professional, ATS-friendly resumes that get you noticed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
