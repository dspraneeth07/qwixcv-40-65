
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  {
    id: "modern1",
    name: "Modern Professional",
    category: "modern",
    image: "/placeholder.svg",
    description: "Clean and professional design with a modern touch",
  },
  {
    id: "classic1",
    name: "Classic Elegant",
    category: "classic",
    image: "/placeholder.svg",
    description: "Timeless design suitable for all industries",
  },
  {
    id: "creative1",
    name: "Creative Bold",
    category: "creative",
    image: "/placeholder.svg",
    description: "Stand out with a unique creative layout",
  },
  {
    id: "ats1",
    name: "ATS Optimized",
    category: "ats",
    image: "/placeholder.svg",
    description: "Designed specifically to pass ATS systems",
  },
  {
    id: "modern2",
    name: "Modern Minimal",
    category: "modern",
    image: "/placeholder.svg",
    description: "Sleek and minimal with perfect whitespace balance",
  },
  {
    id: "classic2",
    name: "Classic Traditional",
    category: "classic",
    image: "/placeholder.svg",
    description: "Traditional format respected in conservative fields",
  },
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Professional Resume Templates
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose from our collection of professionally designed templates that will help you stand out
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mx-auto flex justify-center">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="ats">ATS-Friendly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => setSelectedTemplate(template.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          {["modern", "classic", "creative", "ats"].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates
                  .filter((t) => t.category === category)
                  .map((template) => (
                    <TemplateCard 
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button 
            asChild 
            size="lg" 
            disabled={!selectedTemplate}
          >
            <Link to={selectedTemplate ? `/builder?template=${selectedTemplate}` : "#"}>
              Use Selected Template
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    category: string;
    image: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg relative ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-primary rounded-full p-1">
          <CheckCircle className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
      <div className="relative h-60 overflow-hidden group">
        <img 
          src={template.image} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" onClick={onSelect}>
            Select Template
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>
    </Card>
  );
};

export default Templates;
