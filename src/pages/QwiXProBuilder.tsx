
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Code, Check, Rocket, PenTool, GraduationCap, Briefcase, Award } from "lucide-react";

const QwiXProBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your professional profile has been successfully updated.",
      variant: "success",
    });
  };

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold">QwiXPro Builder</h1>
          <p className="text-gray-500 max-w-3xl">
            Create and enhance your professional portfolio. Showcase your skills, experience, 
            and achievements to stand out to potential employers.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Education</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  This information will be displayed on your public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" placeholder="e.g. Senior Software Engineer" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Write a brief summary about yourself and your professional experience" 
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input id="website" placeholder="https://yourwebsite.com" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  Highlight your technical and professional skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="newSkill">Add New Skill</Label>
                    <Button size="sm">Add</Button>
                  </div>
                  <Input id="newSkill" placeholder="Enter a skill (e.g. JavaScript, Project Management)" />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Current Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'UI/UX Design', 'Project Management', 'Data Analysis', 'Agile Methodology'].map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="py-1.5 px-3 flex items-center gap-1">
                        {skill}
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add your professional work history
                  </CardDescription>
                </div>
                <Button>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Senior Frontend Developer</h3>
                      <p className="text-gray-500">TechCorp Inc.</p>
                      <p className="text-sm text-gray-500">Jan 2021 - Present • Remote</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </div>
                  <p className="text-sm mt-3">
                    Developed and maintained responsive web applications using React, TypeScript, and modern frontend technologies.
                    Led a team of 5 developers and implemented CI/CD pipelines that reduced deployment time by 60%.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Frontend Developer</h3>
                      <p className="text-gray-500">WebSolutions Ltd.</p>
                      <p className="text-sm text-gray-500">Mar 2018 - Dec 2020 • New York, NY</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </div>
                  <p className="text-sm mt-3">
                    Built and optimized interactive web applications for various clients.
                    Implemented performance improvements that increased page load speed by 40%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </div>
                <Button>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Master of Computer Science</h3>
                      <p className="text-gray-500">Stanford University</p>
                      <p className="text-sm text-gray-500">2016 - 2018 • California, USA</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </div>
                  <p className="text-sm mt-3">
                    Specialized in Artificial Intelligence and Machine Learning.
                    GPA: 3.8/4.0
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Bachelor of Science in Computer Engineering</h3>
                      <p className="text-gray-500">MIT</p>
                      <p className="text-sm text-gray-500">2012 - 2016 • Massachusetts, USA</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </div>
                  <p className="text-sm mt-3">
                    Minor in Business Administration.
                    Graduated with Honors.
                    GPA: 3.7/4.0
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>
                  Add professional certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">AWS Certified Solutions Architect</p>
                      <p className="text-sm text-gray-500">Amazon Web Services • 2022</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Google Professional Cloud Developer</p>
                      <p className="text-sm text-gray-500">Google • 2021</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Add New Certification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QwiXProBuilder;
