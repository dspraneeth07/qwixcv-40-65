
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { GEMINI_API_KEY } from '@/utils/apiKeys';
import { ArrowRight, Calendar, CheckCircle, Clock, FileHeart, FileText, Lightbulb, Puzzle, ListTree } from 'lucide-react';

const AIJobSwitchPlanner: React.FC = () => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [taskSchedule, setTaskSchedule] = useState<any>(null);

  // Generate a career switch plan based on inputs
  const generatePlan = () => {
    if (!currentRole || !targetRole) {
      toast({
        title: "Missing information",
        description: "Please provide both your current and target roles.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analyzing career transition...",
      description: "Using AI to create your personalized transition plan.",
    });

    // For demo purposes, generate a mock plan
    // In a real application, this would use the GEMINI_API_KEY to call the API
    setTimeout(() => {
      const mockPlan = {
        summary: `Transitioning from ${currentRole} to ${targetRole} will take approximately 8-10 months with focused effort.`,
        timeframe: {
          months: 9,
          effort: "15-20 hours per week"
        },
        skillGaps: [
          { 
            name: "Technical skill 1", 
            proficiency: 30,
            targetProficiency: 80
          },
          { 
            name: "Technical skill 2", 
            proficiency: 10,
            targetProficiency: 70 
          },
          { 
            name: "Soft skill 1", 
            proficiency: 60,
            targetProficiency: 90 
          }
        ],
        milestones: [
          {
            title: "Foundation Building",
            duration: "2 months",
            description: "Build foundational knowledge through online courses and reading material",
            tasks: [
              "Complete online course on fundamental concepts",
              "Read 2-3 key books in the field",
              "Join relevant communities and forums"
            ]
          },
          {
            title: "Skill Development",
            duration: "3 months",
            description: "Develop practical skills through projects and hands-on experience",
            tasks: [
              "Complete 2-3 personal projects",
              "Contribute to open source if applicable",
              "Take advanced specialized courses"
            ]
          },
          {
            title: "Experience Building",
            duration: "2 months",
            description: "Gain relevant experience through volunteering, freelancing, or internships",
            tasks: [
              "Find volunteer opportunities",
              "Take on freelance projects",
              "Shadow professionals in the target role"
            ]
          },
          {
            title: "Job Search Preparation",
            duration: "2 months",
            description: "Prepare for job search and interviews",
            tasks: [
              "Update resume and portfolio",
              "Prepare for technical interviews",
              "Network with professionals in target field"
            ]
          }
        ],
        resources: [
          {
            type: "Course",
            name: "Foundational Course 1",
            provider: "Coursera",
            duration: "40 hours",
            cost: "$49"
          },
          {
            type: "Book",
            name: "Essential Guide to Target Field",
            author: "Industry Expert",
            cost: "$35"
          },
          {
            type: "Community",
            name: "Professional Network Group",
            description: "Active community with mentorship opportunities",
            cost: "Free"
          }
        ],
        // New: Dependency graph data
        dependencyGraph: {
          nodes: [
            { id: "fundamentals", label: "Learn Fundamentals", level: 1, status: "required" },
            { id: "tools", label: "Master Essential Tools", level: 1, status: "required" },
            { id: "projects", label: "Complete Practice Projects", level: 2, status: "required", depends: ["fundamentals", "tools"] },
            { id: "advanced", label: "Advanced Techniques", level: 2, status: "optional", depends: ["fundamentals"] },
            { id: "specialization", label: "Choose Specialization", level: 3, status: "required", depends: ["projects"] },
            { id: "networking", label: "Industry Networking", level: 3, status: "recommended", depends: ["projects"] },
            { id: "portfolio", label: "Build Portfolio", level: 3, status: "required", depends: ["projects", "specialization"] },
            { id: "certification", label: "Get Certified", level: 4, status: "optional", depends: ["specialization", "advanced"] },
            { id: "interviews", label: "Interview Practice", level: 4, status: "required", depends: ["portfolio"] },
            { id: "job", label: "Job Applications", level: 5, status: "required", depends: ["portfolio", "interviews", "networking"] }
          ],
          connections: [
            { from: "fundamentals", to: "projects" },
            { from: "tools", to: "projects" },
            { from: "fundamentals", to: "advanced" },
            { from: "projects", to: "specialization" },
            { from: "projects", to: "networking" },
            { from: "projects", to: "portfolio" },
            { from: "specialization", to: "portfolio" },
            { from: "specialization", to: "certification" },
            { from: "advanced", to: "certification" },
            { from: "portfolio", to: "interviews" },
            { from: "portfolio", to: "job" },
            { from: "interviews", to: "job" },
            { from: "networking", to: "job" }
          ]
        }
      };

      setPlan(mockPlan);
      generateTaskScheduler(mockPlan);
      
      toast({
        title: "Plan generated",
        description: "Your job transition plan is ready for review.",
      });
    }, 2000);
  };

  // Generate METTA-based task scheduler using SingularityNET concepts
  const generateTaskScheduler = (plan: any) => {
    // In a real app, this would call an API using the GEMINI_API_KEY
    // For demo purposes, generate a mock task schedule
    const mockTaskSchedule = {
      weeks: [
        {
          weekNumber: 1,
          theme: "Introduction and Assessment",
          description: "Understand the target role and assess current skills",
          tasks: [
            {
              id: "task-1-1",
              name: "Research target role requirements",
              status: "completed",
              dependencies: [],
              skillCategory: "Research",
              duration: "3 hours",
              resources: ["Job descriptions", "Industry reports"]
            },
            {
              id: "task-1-2",
              name: "Self-assessment of relevant skills",
              status: "in-progress",
              dependencies: ["task-1-1"],
              skillCategory: "Self-awareness",
              duration: "4 hours",
              resources: ["Assessment templates", "Skills matrix"]
            },
            {
              id: "task-1-3",
              name: "Set up learning environment",
              status: "pending",
              dependencies: ["task-1-2"],
              skillCategory: "Organization",
              duration: "2 hours",
              resources: ["Learning tools", "Calendar app"]
            }
          ],
          microSkills: ["Time management", "Career research", "Self-evaluation"]
        },
        {
          weekNumber: 2,
          theme: "Learning Fundamentals",
          description: "Begin acquiring basic knowledge required for the role",
          tasks: [
            {
              id: "task-2-1",
              name: "Complete introductory online course",
              status: "pending",
              dependencies: ["task-1-3"],
              skillCategory: "Technical",
              duration: "8 hours",
              resources: ["Online course", "Practice exercises"]
            },
            {
              id: "task-2-2",
              name: "Read first chapter of key textbook",
              status: "pending",
              dependencies: [],
              skillCategory: "Knowledge",
              duration: "5 hours",
              resources: ["Textbook", "Study notes template"]
            },
            {
              id: "task-2-3",
              name: "Join professional community",
              status: "pending",
              dependencies: [],
              skillCategory: "Networking",
              duration: "1 hour",
              resources: ["Industry forums", "LinkedIn groups"]
            }
          ],
          microSkills: ["Active learning", "Note-taking", "Critical thinking"]
        }
      ],
      graphData: {
        nodes: [
          { id: "Research", group: 1, size: 10 },
          { id: "Technical Skills", group: 2, size: 15 },
          { id: "Networking", group: 3, size: 8 },
          { id: "Projects", group: 2, size: 12 },
          { id: "Interview Prep", group: 4, size: 10 }
        ],
        links: [
          { source: "Research", target: "Technical Skills", value: 3 },
          { source: "Technical Skills", target: "Projects", value: 5 },
          { source: "Projects", target: "Networking", value: 2 },
          { source: "Networking", target: "Interview Prep", value: 4 },
          { source: "Technical Skills", target: "Interview Prep", value: 5 }
        ]
      }
    };

    setTaskSchedule(mockTaskSchedule);
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">AI Job Switch Planner</h1>
        <p className="text-muted-foreground mb-8">Plan your career transition with AI-powered guidance</p>
        
        {!plan ? (
          <Card>
            <CardHeader>
              <CardTitle>Career Transition Information</CardTitle>
              <CardDescription>
                Tell us about your current role and where you want to go
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
                    placeholder="e.g., QA Engineer"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="target-role">Target Role</Label>
                  <Input 
                    id="target-role"
                    value={targetRole} 
                    onChange={(e) => setTargetRole(e.target.value)} 
                    placeholder="e.g., Product Manager"
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
              
              <div>
                <Label htmlFor="skills">Current Skills</Label>
                <Textarea 
                  id="skills"
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  placeholder="List your current skills, certifications, and relevant experience"
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="font-medium text-blue-700">AI-Powered Analysis</p>
                </div>
                <p className="text-sm text-blue-600">
                  Our AI will analyze your current profile and generate a personalized transition plan
                  with skill recommendations, learning resources, and timeline estimates.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generatePlan} 
                disabled={!currentRole || !targetRole}
                className="gap-2"
              >
                Generate Career Transition Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Career Transition Summary</h2>
              <p className="text-blue-700">{plan.summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded p-3">
                  <div className="text-sm text-blue-600 font-medium">Estimated Timeframe</div>
                  <div className="text-xl font-bold">{plan.timeframe.months} months</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-sm text-blue-600 font-medium">Weekly Commitment</div>
                  <div className="text-xl font-bold">{plan.timeframe.effort}</div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="dependency-graph">
              <TabsList className="mb-4">
                <TabsTrigger value="dependency-graph">Learning Path</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="skills">Skills Gap Analysis</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              {/* New tab for dependency graph */}
              <TabsContent value="dependency-graph" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListTree className="h-5 w-5 text-blue-600" />
                      METTA-Based Learning Dependency Graph
                    </CardTitle>
                    <CardDescription>
                      Follow this path to efficiently build the skills needed for your target role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-lg bg-slate-50 overflow-x-auto">
                      {/* Visual dependency graph representation */}
                      <div className="min-w-[700px]">
                        {plan.dependencyGraph.nodes.map((node: any) => (
                          <div
                            key={node.id}
                            style={{
                              position: 'relative',
                              marginLeft: `${(node.level - 1) * 15}%`,
                              marginBottom: '20px',
                              width: '80%',
                            }}
                          >
                            <div className={`
                              p-3 rounded-lg shadow-sm flex items-center justify-between
                              ${node.status === 'required' ? 'bg-blue-100 border border-blue-200' : 
                                node.status === 'recommended' ? 'bg-green-100 border border-green-200' : 
                                'bg-gray-100 border border-gray-200'}
                            `}>
                              <div>
                                <div className="font-medium">{node.label}</div>
                                <Badge variant="outline" className="mt-1">
                                  {node.status === 'required' ? 'Required' : 
                                   node.status === 'recommended' ? 'Recommended' : 'Optional'}
                                </Badge>
                              </div>
                              {node.level === 1 && (
                                <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">1</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Lines connecting nodes */}
                            {plan.dependencyGraph.connections
                              .filter((conn: any) => conn.from === node.id)
                              .map((conn: any, idx: number) => {
                                const targetNode = plan.dependencyGraph.nodes.find(
                                  (n: any) => n.id === conn.to
                                );
                                return (
                                  <div 
                                    key={`${conn.from}-${conn.to}`}
                                    className="absolute border-r-2 border-b-2 border-blue-300"
                                    style={{
                                      right: '45%',
                                      top: '100%',
                                      height: '20px',
                                      width: '20px',
                                      borderBottomRightRadius: '10px',
                                    }}
                                  ></div>
                                );
                              })}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Learning Path Legend</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-blue-100 border border-blue-200 rounded"></div>
                          <span>Required Skills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-green-100 border border-green-200 rounded"></div>
                          <span>Recommended Skills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-gray-100 border border-gray-200 rounded"></div>
                          <span>Optional Skills</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    <p className="font-medium text-amber-700">METTA Learning Path</p>
                  </div>
                  <p className="text-sm text-amber-600">
                    This dependency graph shows what to learn first and which skills build on others. 
                    Complete the required steps in the recommended order for the most efficient learning path.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="milestones" className="space-y-4">
                <div className="relative">
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-8">
                    {plan.milestones.map((milestone: any, i: number) => (
                      <div key={i} className="relative pl-12">
                        <div className="absolute left-0 top-0 bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                          {i+1}
                        </div>
                        <h3 className="font-bold text-lg">{milestone.title} <span className="text-sm font-normal text-gray-500">({milestone.duration})</span></h3>
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        <ul className="space-y-2">
                          {milestone.tasks.map((task: string, j: number) => (
                            <li key={j} className="flex items-baseline gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-6">
                {plan.skillGaps.map((skill: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.proficiency}% → {skill.targetProficiency}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-blue-200" style={{width: `${skill.proficiency}%`}}></div>
                      <div className="absolute left-0 top-0 h-full bg-blue-500 border-r-2 border-white" style={{width: `${skill.proficiency}%`}}></div>
                      <div className="absolute right-0 top-0 h-full flex items-center" style={{left: `${skill.targetProficiency}%`}}>
                        <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-blue-50 border border-blue-100 rounded p-4 mt-6">
                  <h3 className="font-semibold mb-2">Skill Development Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs">1</span>
                      </div>
                      <span>Focus on closing technical skill gaps before applying to roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs">2</span>
                      </div>
                      <span>Take hands-on courses that provide practical experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs">3</span>
                      </div>
                      <span>Build a portfolio that demonstrates your capabilities in the target role</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4">
                {plan.resources.map((resource: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.cost}</div>
                      </div>
                      <div className="text-sm text-blue-600 mb-2">{resource.type}</div>
                      {resource.author && <div className="text-sm">By {resource.author}</div>}
                      {resource.provider && <div className="text-sm">Provider: {resource.provider}</div>}
                      {resource.duration && <div className="text-sm">Duration: {resource.duration}</div>}
                      {resource.description && <div className="text-sm mt-1">{resource.description}</div>}
                    </CardContent>
                  </Card>
                ))}
                
                <Button className="w-full mt-4">
                  Generate Detailed Learning Plan
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPlan(null)}>Start Over</Button>
              <Button>
                Save Plan
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">To-Do Task Scheduler</h2>
          <p className="text-muted-foreground mb-6">
            Plan your career transition using a dynamic METTA-based task scheduler
          </p>
          
          {!taskSchedule ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Generate a plan first</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complete the career transition planner above to generate a task schedule based on your specific needs
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>METTA-Based Task Scheduler</CardTitle>
                  <CardDescription>
                    Adaptive learning path with dynamic task adjustments based on your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {taskSchedule.weeks.map((week: any) => (
                      <div key={week.weekNumber} className="border rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Week {week.weekNumber}: {week.theme}</h3>
                            <Badge variant="outline" className="bg-white">
                              {week.tasks.filter((t: any) => t.status === 'completed').length}/{week.tasks.length} Tasks
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{week.description}</p>
                        </div>
                        
                        <div className="divide-y">
                          {week.tasks.map((task: any) => (
                            <div key={task.id} className="p-4 flex items-start gap-3">
                              <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 
                                ${task.status === 'completed' ? 'bg-green-100' : 
                                  task.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                {task.status === 'completed' ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : task.status === 'in-progress' ? (
                                  <Clock className="h-3 w-3 text-blue-600" />
                                ) : (
                                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                  <h4 className="font-medium">{task.name}</h4>
                                  <div className="text-xs text-muted-foreground">{task.duration}</div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {task.skillCategory}
                                  </Badge>
                                  {task.dependencies.length > 0 && (
                                    <Badge variant="outline" className="text-xs bg-amber-50">
                                      Depends on previous tasks
                                    </Badge>
                                  )}
                                </div>
                                
                                {task.resources.length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Resources: {task.resources.join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 p-3">
                          <div className="text-xs font-medium mb-1">Micro-skills developed this week:</div>
                          <div className="flex flex-wrap gap-1">
                            {week.microSkills.map((skill: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AIJobSwitchPlanner;
