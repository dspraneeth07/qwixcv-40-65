import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Download, 
  Plus, 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Eye, 
  EyeOff, 
  Trash2,
  Save,
  ListChecks,
  GraduationCap,
  Briefcase,
  User
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  
  const handleNext = () => {
    const tabs = ["personal", "education", "experience", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    const tabs = ["personal", "education", "experience", "skills", "objectives"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  const handleGenerate = () => {
    toast({
      title: "Resume Generated!",
      description: "Your professional resume has been created successfully.",
    });
  };

  useEffect(() => {
    if (templateId) {
      toast({
        title: "Template Selected",
        description: `You've selected template ${templateId}. Customize it now!`,
      });
    }
  }, [templateId]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
            Build Your Professional Resume
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and let our AI help you create a standout resume
          </p>
        </div>
        
        <div className="relative">
          {templateId && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Using template: {templateId}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/templates">Change Template</a>
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card shadow-sm rounded-lg border mb-6">
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Resume Information</span>
                    <span className="bg-muted text-xs px-2 py-0.5 rounded">Draft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Eye className="h-4 w-4 mr-1" /> Preview
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[90%] sm:w-[540px] p-0">
                        <div className="h-full overflow-auto bg-white">
                          <div className="p-8">
                            <h2 className="text-2xl font-bold text-center">John Doe</h2>
                            <p className="text-muted-foreground text-center">Marketing Specialist</p>
                            
                            <div className="flex justify-center space-x-4 text-sm text-muted-foreground my-4">
                              <span>john.doe@example.com</span>
                              <span>•</span>
                              <span>(123) 456-7890</span>
                              <span>•</span>
                              <span>New York, NY</span>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-semibold border-b pb-1 mb-2">Professional Summary</h3>
                                <p className="text-sm">Experienced marketing professional with 5+ years in digital strategy...</p>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold border-b pb-1 mb-2">Work Experience</h3>
                                <div className="mb-3">
                                  <div className="flex justify-between">
                                    <p className="font-medium">Marketing Manager</p>
                                    <p className="text-sm">June 2018 - Present</p>
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground">Acme Inc.</p>
                                  <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                                    <li>Increased sales by 20% through strategic digital marketing initiatives</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold border-b pb-1 mb-2">Education</h3>
                                <div>
                                  <div className="flex justify-between">
                                    <p className="font-medium">Bachelor of Science in Computer Science</p>
                                    <p className="text-sm">May 2020</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Harvard University</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold border-b pb-1 mb-2">Skills</h3>
                                <p className="text-sm">Social Media Marketing, Content Strategy, SEO/SEM, Google Analytics, JavaScript, React, Leadership, Communication</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hidden lg:flex"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" /> Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" /> Show Preview
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex justify-between px-4 py-2 bg-muted/50">
                    <TabsTrigger value="personal" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      <span className="hidden sm:inline">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="objectives" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Objectives</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Personal Details</CardTitle>
                        <CardDescription>
                          Enter your personal information to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" className="max-w-md" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" className="max-w-md" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Professional Title</Label>
                          <Input id="jobTitle" placeholder="Marketing Specialist" className="max-w-md" />
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span>AI suggests titles that match your experience</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" className="max-w-md" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder="(123) 456-7890" className="max-w-md" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" placeholder="New York, NY" className="max-w-md" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea 
                            id="summary" 
                            placeholder="Experienced marketing professional with 5+ years in digital strategy..."
                            rows={4}
                            className="max-w-full"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="sm" className="gap-1 text-sm">
                              <Lightbulb className="h-3 w-3" />
                              AI Suggestions
                            </Button>
                            <span className="text-sm text-muted-foreground">Let AI write a compelling summary for you</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="education" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Education</CardTitle>
                        <CardDescription>
                          Add your educational background
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-6">
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">Education #1</h4>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="school">School/University</Label>
                                <Input id="school" placeholder="Harvard University" className="max-w-md" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input id="degree" placeholder="Bachelor of Science" className="max-w-md" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                                <Input id="fieldOfStudy" placeholder="Computer Science" className="max-w-md" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="graduationDate">Graduation Date</Label>
                                <Input id="graduationDate" placeholder="May 2020" className="max-w-md" />
                              </div>
                            </div>
                            
                            <div className="space-y-2 mt-4">
                              <Label htmlFor="eduDescription">Description</Label>
                              <Textarea 
                                id="eduDescription" 
                                placeholder="Relevant coursework, honors, activities..."
                                rows={3}
                                className="max-w-full"
                              />
                            </div>
                          </div>
                          
                          <Button variant="outline" className="gap-2 w-full">
                            <Plus className="h-4 w-4" />
                            Add Another Education
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Work Experience</CardTitle>
                        <CardDescription>
                          Add your work history, starting with the most recent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-6">
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">Experience #1</h4>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="jobTitle">Job Title</Label>
                                <Input id="jobTitle" placeholder="Marketing Manager" className="max-w-md" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="employer">Employer</Label>
                                <Input id="employer" placeholder="Acme Inc." className="max-w-md" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" placeholder="June 2018" className="max-w-md" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" placeholder="Present" className="max-w-md" />
                              </div>
                            </div>
                            
                            <div className="space-y-2 mt-4">
                              <Label htmlFor="jobDescription">Description</Label>
                              <Textarea 
                                id="jobDescription" 
                                placeholder="• Increased sales by 20% through strategic digital marketing initiatives..."
                                rows={4}
                                className="max-w-full"
                              />
                              <div className="flex items-center gap-2 mt-1">
                                <Button variant="outline" size="sm" className="gap-1 text-sm">
                                  <Lightbulb className="h-3 w-3" />
                                  AI Enhancement
                                </Button>
                                <span className="text-sm text-muted-foreground">Let AI improve your bullet points</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="gap-2 w-full">
                            <Plus className="h-4 w-4" />
                            Add Another Experience
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Skills</CardTitle>
                        <CardDescription>
                          Add your key skills and competencies
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="skills">Professional Skills</Label>
                            <Textarea 
                              id="skills" 
                              placeholder="Social Media Marketing, Content Strategy, SEO/SEM, Google Analytics, Adobe Creative Suite..."
                              rows={3}
                              className="max-w-full"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="technicalSkills">Technical Skills</Label>
                            <Textarea 
                              id="technicalSkills" 
                              placeholder="JavaScript, React, Python, SQL, HTML/CSS..."
                              rows={2}
                              className="max-w-full"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="softSkills">Soft Skills</Label>
                            <Textarea 
                              id="softSkills" 
                              placeholder="Leadership, Communication, Problem-solving, Teamwork..."
                              rows={2}
                              className="max-w-full"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Sparkles className="h-4 w-4" />
                              AI Skill Suggestions
                            </Button>
                            <span className="text-sm text-muted-foreground">Get suggestions based on your job title</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="objectives" className="p-0">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Career Objectives</CardTitle>
                        <CardDescription>
                          Define your career goals and objectives
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="objective">Career Objective</Label>
                          <Textarea 
                            id="objective" 
                            placeholder="Seeking a challenging position in marketing that allows me to leverage my experience in digital strategies to drive business growth..."
                            rows={4}
                            className="max-w-full"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="sm" className="gap-1 text-sm">
                              <Lightbulb className="h-3 w-3" />
                              AI Writer
                            </Button>
                            <span className="text-sm text-muted-foreground">Get AI to write a powerful objective statement</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between p-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={activeTab === "personal"}
                  >
                    Previous
                  </Button>
                  
                  {activeTab === "objectives" ? (
                    <Button onClick={handleGenerate} className="gap-2">
                      <Download className="h-4 w-4" />
                      Generate Resume
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Next</Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`hidden lg:block ${showPreview ? 'block' : 'hidden'}`}>
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Live Preview</h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Preview PDF
                  </Button>
                </div>
                <div className="border rounded-md bg-card overflow-hidden h-[650px]">
                  <div className="p-8 h-full bg-white overflow-auto">
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold">John Doe</h2>
                      <p className="text-muted-foreground">Marketing Specialist</p>
                    </div>
                    
                    <div className="flex justify-center space-x-4 text-sm text-muted-foreground mb-6">
                      <span>john.doe@example.com</span>
                      <span>•</span>
                      <span>(123) 456-7890</span>
                      <span>•</span>
                      <span>New York, NY</span>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold border-b pb-1 mb-2">Professional Summary</h3>
                      <p className="text-sm">Experienced marketing professional with 5+ years in digital strategy...</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold border-b pb-1 mb-2">Work Experience</h3>
                      <div className="mb-3">
                        <div className="flex justify-between">
                          <p className="font-medium">Marketing Manager</p>
                          <p className="text-sm">June 2018 - Present</p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Acme Inc.</p>
                        <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                          <li>Increased sales by 20% through strategic digital marketing initiatives</li>
                          <li>Led a team of 5 marketing specialists to execute multi-channel campaigns</li>
                          <li>Optimized website SEO resulting in 40% increase in organic traffic</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold border-b pb-1 mb-2">Education</h3>
                      <div>
                        <div className="flex justify-between">
                          <p className="font-medium">Bachelor of Science in Computer Science</p>
                          <p className="text-sm">May 2020</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Harvard University</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold border-b pb-1 mb-2">Skills</h3>
                      <p className="text-sm">Social Media Marketing, Content Strategy, SEO/SEM, Google Analytics, JavaScript, React, Leadership, Communication</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
