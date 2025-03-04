
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Star, Search, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const templates = [
  {
    id: "modern1",
    name: "Modern Professional",
    category: "modern",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Clean and professional design with a modern touch",
    featured: true,
  },
  {
    id: "classic1",
    name: "Classic Elegant",
    category: "classic",
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Timeless design suitable for all industries",
    featured: false,
  },
  {
    id: "creative1",
    name: "Creative Bold",
    category: "creative",
    image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Stand out with a unique creative layout",
    featured: true,
  },
  {
    id: "ats1",
    name: "ATS Optimized",
    category: "ats",
    image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Designed specifically to pass ATS systems",
    featured: true,
  },
  {
    id: "modern2",
    name: "Modern Minimal",
    category: "modern",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Sleek and minimal with perfect whitespace balance",
    featured: false,
  },
  {
    id: "classic2",
    name: "Classic Traditional",
    category: "classic",
    image: "https://images.unsplash.com/photo-1623119223055-45e2d22d9d26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Traditional format respected in conservative fields",
    featured: false,
  },
  {
    id: "creative2",
    name: "Vibrant Portfolio",
    category: "creative",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Showcase your work with vibrant colors and layouts",
    featured: false,
  },
  {
    id: "ats2",
    name: "ATS Professional",
    category: "ats",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Professional design with optimal ATS compatibility",
    featured: false,
  },
  {
    id: "modern3",
    name: "Executive Modern",
    category: "modern",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Sophisticated design for executive positions",
    featured: false,
  },
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0].id);
      toast({
        title: "Default Template Selected",
        description: `We've selected "${templates[0].name}" as your default template.`
      });
    }
  }, []);

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    navigate(`/builder?template=${templateId}`);
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Professional Resume Templates
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-6">
            Choose from our collection of professionally designed templates that will help you stand out
          </p>
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mx-auto flex justify-center">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="ats">ATS-Friendly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => handleSelectTemplate(template.id)}
                  onPreview={() => setPreviewTemplate(template.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates
                .filter((t) => t.featured)
                .map((template) => (
                  <TemplateCard 
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => handleSelectTemplate(template.id)}
                    onPreview={() => setPreviewTemplate(template.id)}
                  />
                ))}
            </div>
          </TabsContent>
          
          {["modern", "classic", "creative", "ats"].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates
                  .filter((t) => t.category === category)
                  .map((template) => (
                    <TemplateCard 
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => handleSelectTemplate(template.id)}
                      onPreview={() => setPreviewTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={previewTemplate !== null} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl">
            {previewTemplate && (
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">
                  {templates.find(t => t.id === previewTemplate)?.name} Preview
                </h2>
                <div className="aspect-[8.5/11] bg-muted rounded-md overflow-hidden">
                  <img 
                    src={templates.find(t => t.id === previewTemplate)?.image || "/placeholder.svg"} 
                    alt={templates.find(t => t.id === previewTemplate)?.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    const selectedId = previewTemplate;
                    setPreviewTemplate(null);
                    handleSelectTemplate(selectedId);
                  }}>
                    Use This Template
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
    featured: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

const TemplateCard = ({ template, isSelected, onSelect, onPreview }: TemplateCardProps) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg relative ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => {}}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-primary rounded-full p-1">
          <CheckCircle className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
      
      {template.featured && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3" />
          Featured
        </div>
      )}
      
      <div className="relative h-60 overflow-hidden group">
        <img 
          src={template.image} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg"; // Improved fallback handling
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}>
            Select
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
            {template.category}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }} 
            className="text-primary"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Templates;
