
import { useState } from "react";
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
import { Download, Plus, Lightbulb, Sparkles } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="objectives">Objectives</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>
                      Enter your personal information to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Professional Title</Label>
                      <Input id="jobTitle" placeholder="Marketing Specialist" />
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>AI suggests titles that match your experience</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="(123) 456-7890" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="New York, NY" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea 
                        id="summary" 
                        placeholder="Experienced marketing professional with 5+ years in digital strategy..."
                        rows={4}
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
              
              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>
                      Add your educational background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      <div className="p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="school">School/University</Label>
                            <Input id="school" placeholder="Harvard University" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="degree">Degree</Label>
                            <Input id="degree" placeholder="Bachelor of Science" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="fieldOfStudy">Field of Study</Label>
                            <Input id="fieldOfStudy" placeholder="Computer Science" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="graduationDate">Graduation Date</Label>
                            <Input id="graduationDate" placeholder="May 2020" />
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="eduDescription">Description</Label>
                          <Textarea 
                            id="eduDescription" 
                            placeholder="Relevant coursework, honors, activities..."
                            rows={3}
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
              
              <TabsContent value="experience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>
                      Add your work history, starting with the most recent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      <div className="p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input id="jobTitle" placeholder="Marketing Manager" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="employer">Employer</Label>
                            <Input id="employer" placeholder="Acme Inc." />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" placeholder="June 2018" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" placeholder="Present" />
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="jobDescription">Description</Label>
                          <Textarea 
                            id="jobDescription" 
                            placeholder="• Increased sales by 20% through strategic digital marketing initiatives..."
                            rows={4}
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
              
              <TabsContent value="skills" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
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
                        />
                        <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="technicalSkills">Technical Skills</Label>
                        <Textarea 
                          id="technicalSkills" 
                          placeholder="JavaScript, React, Python, SQL, HTML/CSS..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="softSkills">Soft Skills</Label>
                        <Textarea 
                          id="softSkills" 
                          placeholder="Leadership, Communication, Problem-solving, Teamwork..."
                          rows={2}
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
              
              <TabsContent value="objectives" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Objectives</CardTitle>
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
            
            <div className="flex justify-between mt-6">
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
          
          {/* Preview Section */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-lg font-medium mb-4">Live Preview</h3>
              <div className="border rounded-md bg-card overflow-hidden h-[600px]">
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
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Preview PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeBuilder;
