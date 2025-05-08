
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { GEMINI_API_KEY } from '@/utils/apiKeys';
import { BarChart2, ChevronRight, Clock, Calendar, Briefcase, Award, FileText, DollarSign } from 'lucide-react';

const CareerPathSimulator: React.FC = () => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [pathData, setPathData] = useState<any>(null);

  // Generate the career path simulation
  const generatePath = async () => {
    if (!currentRole || !targetRole) {
      toast({
        title: "Missing information",
        description: "Please provide both your current and target roles.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Generating career path",
      description: `Creating your path from ${currentRole} to ${targetRole}.`,
    });

    try {
      // In a production app, we would make an actual API call to Gemini API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sample path data
      const mockPath = {
        summary: `Transitioning from ${currentRole} to ${targetRole} typically takes 3-5 years with focused effort on acquiring relevant skills and experience.`,
        stages: [
          {
            title: "Knowledge Building",
            duration: "6-12 months",
            description: "Build foundational knowledge through courses and certifications",
            milestones: [
              "Complete 2-3 relevant online courses",
              "Obtain entry-level certification",
              "Join professional communities in target field"
            ],
            skills: ["Technical fundamentals", "Industry knowledge", "Networking"]
          },
          {
            title: "Skill Application",
            duration: "12-18 months",
            description: "Apply new skills in current role or side projects",
            milestones: [
              "Take on projects that use target role skills",
              "Build portfolio with 2-3 relevant projects",
              "Find a mentor in the target field"
            ],
            skills: ["Practical application", "Problem-solving", "Project management"]
          },
          {
            title: "Transition Role",
            duration: "12-18 months",
            description: "Move to a hybrid role that combines current and target skills",
            milestones: [
              "Find an internal transfer opportunity",
              "Take a junior position in target field",
              "Obtain advanced certification"
            ],
            skills: ["Adaptability", "Communication", "Technical proficiency"]
          },
          {
            title: "Target Role Achievement",
            duration: "6-12 months",
            description: "Fully transition into target role and continue growth",
            milestones: [
              "Apply for full target role positions",
              "Develop specialized expertise",
              "Establish professional reputation in field"
            ],
            skills: ["Leadership", "Strategic thinking", "Advanced technical skills"]
          }
        ],
        opportunities: [
          {
            role: "Junior " + targetRole,
            timeframe: "1-2 years",
            salary: "$65,000 - $85,000",
            requirements: ["Basic technical skills", "Entry-level certification", "Portfolio projects"]
          },
          {
            role: targetRole,
            timeframe: "3-4 years",
            salary: "$85,000 - $110,000",
            requirements: ["2+ years relevant experience", "Advanced technical skills", "Project leadership"]
          },
          {
            role: "Senior " + targetRole,
            timeframe: "5+ years",
            salary: "$110,000 - $150,000",
            requirements: ["5+ years experience", "Strategic thinking", "Team leadership", "Advanced certifications"]
          }
        ],
        resources: [
          {
            type: "Course",
            name: "Foundations of " + targetRole,
            provider: "Coursera",
            duration: "3 months",
            cost: "$49/month"
          },
          {
            type: "Certification",
            name: targetRole + " Professional Certification",
            provider: "Industry Association",
            duration: "6 months prep",
            cost: "$300"
          },
          {
            type: "Book",
            name: "The Complete Guide to " + targetRole,
            author: "Industry Expert",
            cost: "$40"
          },
          {
            type: "Community",
            name: targetRole + " Professionals Network",
            description: "Online community with mentorship",
            cost: "Free"
          }
        ]
      };

      setPathData(mockPath);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating career path:", error);
      toast({
        title: "Error",
        description: "Failed to generate career path. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">Career Path Simulator</h1>
        <p className="text-muted-foreground mb-8">Visualize your journey to your dream role</p>

        {!pathData ? (
          <Card>
            <CardHeader>
              <CardTitle>Career Path Information</CardTitle>
              <CardDescription>
                Enter your current role and your target dream role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="current-role">Current Role</Label>
                  <Input 
                    id="current-role"
                    value={currentRole} 
                    onChange={(e) => setCurrentRole(e.target.value)} 
                    placeholder="e.g., Software Developer"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="target-role">Target Role</Label>
                  <Input 
                    id="target-role"
                    value={targetRole} 
                    onChange={(e) => setTargetRole(e.target.value)} 
                    placeholder="e.g., Technical Director"
                    className="mt-1.5"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select 
                  value={experience} 
                  onValueChange={setExperience}
                >
                  <SelectTrigger id="experience" className="mt-1.5">
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-blue-700">AI-Powered Path Generation</p>
                </div>
                <p className="text-sm text-blue-600">
                  Our AI will analyze thousands of career paths to create a realistic roadmap
                  with skill recommendations, time estimates, and resource suggestions.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generatePath} 
                disabled={!currentRole || !targetRole || isLoading}
              >
                {isLoading ? "Generating..." : "Generate Career Path"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Career Path Summary</h2>
              <p className="text-blue-700">{pathData.summary}</p>
            </div>
            
            <Tabs defaultValue="stages">
              <TabsList className="mb-4">
                <TabsTrigger value="stages">Path Stages</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="resources">Learning Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stages" className="space-y-4">
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-blue-200"></div>
                  
                  {pathData.stages.map((stage: any, i: number) => (
                    <div key={i} className="mb-8 relative">
                      <div className="absolute left-8 top-6 -ml-[11px] h-5 w-5 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10"></div>
                      <div className="pl-16">
                        <div className="mb-1 flex items-center">
                          <h3 className="text-lg font-bold text-blue-800 mr-2">{stage.title}</h3>
                          <Badge variant="outline" className="bg-blue-50">
                            <Clock className="h-3 w-3 mr-1" />
                            {stage.duration}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{stage.description}</p>
                        
                        <div className="bg-white p-4 rounded-md border">
                          <h4 className="font-medium mb-2">Key Milestones:</h4>
                          <ul className="space-y-1">
                            {stage.milestones.map((milestone: string, j: number) => (
                              <li key={j} className="flex items-baseline gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <span>{milestone}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="font-medium mb-2">Focus Skills:</h4>
                            <div className="flex flex-wrap gap-1">
                              {stage.skills.map((skill: string, j: number) => (
                                <Badge key={j} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="opportunities" className="space-y-4">
                {pathData.opportunities.map((opportunity: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{opportunity.role}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>Timeframe: {opportunity.timeframe}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3.5 w-3.5 mr-1" />
                              <span>{opportunity.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                        <ul className="space-y-1">
                          {opportunity.requirements.map((req: string, j: number) => (
                            <li key={j} className="flex items-baseline gap-2 text-sm">
                              <div className="h-1 w-1 rounded-full bg-blue-500 mt-1.5"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pathData.resources.map((resource: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-1">
                          <Badge variant={
                            resource.type === "Course" ? "default" :
                            resource.type === "Certification" ? "destructive" :
                            resource.type === "Book" ? "secondary" :
                            "outline"
                          }>
                            {resource.type}
                          </Badge>
                          <span className="text-sm">{resource.cost}</span>
                        </div>
                        <h3 className="font-bold mt-1">{resource.name}</h3>
                        {resource.provider && <p className="text-sm">Provider: {resource.provider}</p>}
                        {resource.author && <p className="text-sm">Author: {resource.author}</p>}
                        {resource.duration && <p className="text-sm">Duration: {resource.duration}</p>}
                        {resource.description && <p className="text-sm mt-1">{resource.description}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPathData(null)}>
                Start Over
              </Button>
              <Button>
                Save Career Path
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CareerPathSimulator;
