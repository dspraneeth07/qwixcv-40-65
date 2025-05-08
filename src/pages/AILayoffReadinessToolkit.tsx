
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { GEMINI_API_KEY } from '@/utils/apiKeys';
import { Shield, FileText, Briefcase, Linkedin, Github, MessageCircle, Download } from 'lucide-react';

const AILayoffReadinessToolkit: React.FC = () => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolkit, setToolkit] = useState<any>(null);

  // Generate the layoff readiness toolkit
  const generateToolkit = async () => {
    if (!currentRole || !skills) {
      toast({
        title: "Missing information",
        description: "Please provide your current role and skills.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Generating toolkit",
      description: "Creating your layoff readiness toolkit and emergency resume.",
    });

    try {
      // In a production app, we would make an actual API call to Gemini API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sample toolkit data
      const mockToolkit = {
        emergencyResume: {
          headline: `Experienced ${currentRole} with ${experience || 'proven'} track record`,
          summary: `Results-driven ${currentRole} with ${experience || 'significant'} experience, specializing in ${skills.split(',')[0] || 'relevant skills'}. Demonstrated success in delivering high-quality solutions and driving business outcomes through technical expertise and collaborative approach.`,
          keyAchievements: [
            "Led cross-functional teams to deliver projects on time and under budget",
            "Improved process efficiency resulting in 20% cost reduction",
            "Implemented innovative solutions that increased customer satisfaction by 15%",
            "Recognized for excellence with top performer award",
          ],
          skillsHighlighted: skills.split(',').map(skill => skill.trim()).filter(Boolean),
        },
        demandJobs: [
          {
            title: `Senior ${currentRole}`,
            description: "Advanced role with leadership responsibilities",
            demandLevel: "Very High",
            salaryRange: "$100,000 - $140,000",
            skills: ["Leadership", "Strategic planning", "Advanced technical skills"]
          },
          {
            title: `${currentRole} Consultant`,
            description: "Advisory role helping businesses improve their processes",
            demandLevel: "High",
            salaryRange: "$90,000 - $130,000",
            skills: ["Consulting", "Problem-solving", "Communication"]
          },
          {
            title: `${currentRole} Manager`,
            description: "Oversee department operations and team performance",
            demandLevel: "Moderate",
            salaryRange: "$110,000 - $150,000",
            skills: ["Management", "Team leadership", "Budgeting"]
          },
          {
            title: "Project Manager",
            description: "Lead projects from inception to completion",
            demandLevel: "High",
            salaryRange: "$85,000 - $120,000",
            skills: ["Project management", "Risk assessment", "Stakeholder management"]
          },
          {
            title: "Business Analyst",
            description: "Analyze business needs and recommend solutions",
            demandLevel: "High",
            salaryRange: "$75,000 - $110,000",
            skills: ["Data analysis", "Requirements gathering", "Process improvement"]
          }
        ],
        platformImprovements: {
          linkedin: [
            "Update headline with quantifiable achievements",
            "Add recommendations from peers and supervisors",
            "Join and participate in relevant professional groups",
            "Share industry insights and articles weekly",
            "Complete skills assessments to verify expertise"
          ],
          github: [
            "Pin your best repositories to showcase top skills",
            "Update README files with clear project descriptions",
            "Contribute to open-source projects in your field",
            "Create a clean, professional profile with contact information",
            "Document your code thoroughly with comments"
          ]
        },
        motivationalMessage: "Remember that career transitions, even unexpected ones, often lead to growth and new opportunities. Your skills and experience are valuable assets that can be applied in various contexts. Focus on your strengths, be open to new possibilities, and use this time to reflect on what truly matters in your career journey. With preparation and resilience, you'll emerge stronger and more focused than before. Your career is a marathon, not a sprint, and this is simply another milestone on your path to success."
      };

      setToolkit(mockToolkit);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating toolkit:", error);
      toast({
        title: "Error",
        description: "Failed to generate layoff readiness toolkit. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const downloadEmergencyResume = () => {
    toast({
      title: "Resume downloading",
      description: "Your emergency resume is being generated and downloaded.",
    });
    
    // In a production app, we would generate a real PDF here
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Emergency Resume - For Demo Purposes Only'));
      element.setAttribute('download', `Emergency_Resume_${currentRole}_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-7 w-7 text-red-500" />
          <h1 className="text-3xl font-bold">AI Layoff Readiness Toolkit</h1>
        </div>
        <p className="text-muted-foreground mb-8">Prepare for unexpected career transitions with an AI-powered emergency toolkit</p>

        {!toolkit ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Layoff Readiness Plan</CardTitle>
              <CardDescription>
                Provide some basic information about your current role and skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-role">Current Role/Title</Label>
                  <Input 
                    id="current-role"
                    value={currentRole} 
                    onChange={(e) => setCurrentRole(e.target.value)} 
                    placeholder="e.g., Software Engineer"
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience"
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)} 
                    placeholder="e.g., 5 years"
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="skills">Key Skills (comma separated)</Label>
                  <Textarea 
                    id="skills"
                    value={skills} 
                    onChange={(e) => setSkills(e.target.value)} 
                    placeholder="e.g., JavaScript, React, Project Management, Team Leadership"
                    rows={3}
                    className="mt-1.5 resize-none"
                  />
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-100 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <p className="font-medium text-red-700">Be Prepared, Not Scared</p>
                </div>
                <p className="text-sm text-red-600">
                  This toolkit will help you create an emergency resume, identify in-demand jobs 
                  matching your skills, and suggest platform improvements for LinkedIn and GitHub 
                  to make you more visible to recruiters.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateToolkit} 
                disabled={!currentRole || !skills || isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Generating..." : "Generate Emergency Toolkit"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="resume">
              <TabsList className="mb-4">
                <TabsTrigger value="resume">Emergency Resume</TabsTrigger>
                <TabsTrigger value="jobs">Demand Jobs</TabsTrigger>
                <TabsTrigger value="platforms">Platform Improvements</TabsTrigger>
                <TabsTrigger value="motivation">Motivation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Emergency Resume</CardTitle>
                      <CardDescription>
                        Ready-to-use resume highlights for quick applications
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadEmergencyResume} className="flex gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl">{toolkit.emergencyResume.headline}</h3>
                      <p className="text-gray-700">{toolkit.emergencyResume.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Key Achievements</h4>
                      <ul className="space-y-2">
                        {toolkit.emergencyResume.keyAchievements.map((achievement: string, i: number) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Highlighted Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {toolkit.emergencyResume.skillsHighlighted.map((skill: string, i: number) => (
                          <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">Pro Tip:</span> Customize this emergency resume for each job application 
                    by highlighting relevant achievements and skills for the specific role.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="jobs" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">5 High-Demand Jobs Matching Your Skills</h3>
                
                {toolkit.demandJobs.map((job: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-lg">{job.title}</h4>
                          <p className="text-muted-foreground">{job.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            job.demandLevel === "Very High" ? "destructive" :
                            job.demandLevel === "High" ? "default" :
                            "outline"
                          }>
                            {job.demandLevel} Demand
                          </Badge>
                          <div className="text-sm font-medium">{job.salaryRange}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm text-muted-foreground mb-1">Required skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.map((skill: string, j: number) => (
                            <Badge key={j} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">Pro Tip:</span> Focus on roles with "High" or "Very High" demand 
                    to increase your chances of finding new opportunities quickly.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="platforms" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                        LinkedIn Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {toolkit.platformImprovements.linkedin.map((tip: string, i: number) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        GitHub Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {toolkit.platformImprovements.github.map((tip: string, i: number) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mt-1.5"></div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">Pro Tip:</span> Implement these improvements gradually, starting 
                    with your LinkedIn headline and GitHub profile, to increase visibility to recruiters.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="motivation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      Your Motivational Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
                      <p className="italic text-lg text-gray-800 leading-relaxed">
                        "{toolkit.motivationalMessage}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setToolkit(null)}>
                Start Over
              </Button>
              <Button onClick={downloadEmergencyResume} className="gap-2">
                <FileText className="h-4 w-4" />
                Download Emergency Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AILayoffReadinessToolkit;
