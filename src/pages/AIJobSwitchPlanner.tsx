
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Clock, Briefcase, GraduationCap, Brain, List, ArrowRight, Lightbulb, Target, Share, User } from 'lucide-react';

// Force Canvas for rendering, as WebGL might not be available in all browsers
import { ForceGraph2D } from 'react-force-graph';

import { HackathonBadge } from '@/components/career/HackathonBadge';

const AIJobSwitchPlanner: React.FC = () => {
  const { toast } = useToast();
  const [currentJob, setCurrentJob] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [experience, setExperience] = useState('3'); // in years
  const [education, setEducation] = useState('bachelors');
  const [desiredTimeline, setDesiredTimeline] = useState([12]); // in months
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [careerPlan, setCareerPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planStage, setPlanStage] = useState('plan'); // plan or tasks
  const [apiKey, setApiKey] = useState('');
  const [tasksGraph, setTasksGraph] = useState<any | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Check if API key is valid
  const isValidApiKey = apiKey.length > 20;

  // Generate career switch plan
  const generateCareerSwitchPlan = async () => {
    if (!currentJob || !targetJob || !currentSkills) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a production app, we would call the Gemini AI API here
      setTimeout(() => {
        // Simulated AI response
        const simulatedResponse = generateSimulatedCareerPlan();
        setCareerPlan(simulatedResponse);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating career plan:', error);
      toast({
        title: "Generation failed",
        description: "There was a problem generating your career switch plan. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Generate detailed task plan
  const generateTaskPlan = () => {
    setIsLoading(true);
    
    try {
      // In a production app, we would call the Gemini AI API again here
      setTimeout(() => {
        // Simulated task plan graph
        const graph = generateSimulatedTaskGraph();
        setTasksGraph(graph);
        setIsLoading(false);
        setPlanStage('tasks');
      }, 1500);
    } catch (error) {
      console.error('Error generating task graph:', error);
      toast({
        title: "Task generation failed",
        description: "There was a problem generating your task plan. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Handle task node click in the graph
  const handleNodeClick = (node: any) => {
    setSelectedTask(node);
  };
  
  // Simulated career plan generator function
  const generateSimulatedCareerPlan = () => {
    const timeline = parseInt(desiredTimeline[0].toString(), 10);
    
    // Calculate feasibility based on inputs
    const feasibilityScore = calculateFeasibilityScore(timeline);
    
    // Determine if the timeline is feasible based on job distance
    const isTimelineFeasible = feasibilityScore >= 70;
    
    // Adjust timeline if it's not feasible
    const actualTimeline = isTimelineFeasible ? timeline : timeline + Math.floor((100 - feasibilityScore) / 10 * 2);
    
    return {
      feasibility: {
        score: feasibilityScore,
        isRealistic: isTimelineFeasible,
        actualMonths: actualTimeline
      },
      roadmap: {
        phases: [
          {
            title: "Foundation Building",
            duration: `1-${Math.ceil(actualTimeline / 3)} months`,
            description: `Build fundamental skills required for ${targetJob} through online courses and projects.`,
            keySkills: generateSkillsForPhase(targetJob, 1),
            resources: [
              { type: "Course", name: `${targetJob} Fundamentals`, platform: "Coursera", estimatedHours: 40 },
              { type: "Book", name: `${targetJob} for Beginners`, author: "Industry Expert", estimatedHours: 20 },
              { type: "Project", name: "Simple portfolio project", difficulty: "Beginner", estimatedHours: 30 }
            ]
          },
          {
            title: "Specialized Knowledge",
            duration: `${Math.ceil(actualTimeline / 3)}-${Math.ceil(actualTimeline * 2 / 3)} months`,
            description: `Develop specialized skills and knowledge required for ${targetJob} roles.`,
            keySkills: generateSkillsForPhase(targetJob, 2),
            resources: [
              { type: "Course", name: `Advanced ${targetJob} Techniques`, platform: "Udemy", estimatedHours: 60 },
              { type: "Community", name: `${targetJob} Professionals Group`, platform: "LinkedIn/Discord", estimatedHours: 10 },
              { type: "Project", name: "Industry-standard project implementation", difficulty: "Intermediate", estimatedHours: 50 }
            ]
          },
          {
            title: "Real-world Application",
            duration: `${Math.ceil(actualTimeline * 2 / 3)}-${actualTimeline} months`,
            description: "Apply your skills in real-world scenarios and prepare for job applications.",
            keySkills: generateSkillsForPhase(targetJob, 3),
            resources: [
              { type: "Workshop", name: `${targetJob} Best Practices Workshop`, platform: "In-person/Online", estimatedHours: 16 },
              { type: "Mentorship", name: "Industry mentor sessions", platform: "ADPList/MentorCruise", estimatedHours: 12 },
              { type: "Project", name: "Capstone project for portfolio", difficulty: "Advanced", estimatedHours: 80 }
            ]
          }
        ],
        transferableSkills: generateTransferableSkills(currentJob, targetJob),
        challengesAndSolutions: generateChallengesAndSolutions(currentJob, targetJob),
        milestones: generateMilestones(actualTimeline)
      }
    };
  };
  
  // Calculate feasibility score based on inputs
  const calculateFeasibilityScore = (timeline: number) => {
    // This would ideally be calculated by the AI based on the job distance
    // For simulation, we'll use a basic algorithm
    
    // Base score
    let score = 80;
    
    // Adjust based on experience
    score += parseInt(experience) * 2;
    
    // Adjust based on education
    if (education === 'phd') score += 10;
    else if (education === 'masters') score += 5;
    else if (education === 'bachelors') score += 0;
    else score -= 5;
    
    // Adjust based on timeline (shorter timelines are harder)
    if (timeline <= 6) score -= 20;
    else if (timeline <= 12) score -= 10;
    else if (timeline >= 24) score += 10;
    
    // Cap at 100
    return Math.min(100, Math.max(0, score));
  };
  
  // Generate skills based on target job and phase
  const generateSkillsForPhase = (job: string, phase: number) => {
    const skillSets: Record<string, string[]> = {
      'Product Manager': ['User Research', 'Agile/Scrum', 'Product Strategy', 'Data Analysis', 'Stakeholder Management'],
      'Data Scientist': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      'Software Engineer': ['JavaScript', 'React', 'Node.js', 'Database Design', 'API Development'],
      'UX Designer': ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'UI Design'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Cloud Platforms'],
      'default': ['Technical Writing', 'Project Management', 'Communication', 'Problem Solving', 'Industry Knowledge']
    };
    
    // Get skills for the job or use default
    const allSkills = skillSets[job] || skillSets['default'];
    
    // Return a subset based on the phase
    const startIdx = (phase - 1) * 2;
    return allSkills.slice(startIdx, startIdx + 3);
  };
  
  // Generate transferable skills
  const generateTransferableSkills = (currentJob: string, targetJob: string) => {
    // This would ideally be generated by the AI
    const transferableSkills = [
      "Project Management",
      "Problem Solving",
      "Communication Skills",
      "Critical Thinking",
      "Collaboration"
    ];
    
    return transferableSkills;
  };
  
  // Generate challenges and solutions
  const generateChallengesAndSolutions = (currentJob: string, targetJob: string) => {
    return [
      {
        challenge: "Lack of relevant experience",
        solution: "Complete hands-on projects to demonstrate practical skills in lieu of professional experience."
      },
      {
        challenge: "Knowledge gaps in technical areas",
        solution: "Follow guided learning paths through online courses and structured learning resources."
      },
      {
        challenge: "Building a professional network in new field",
        solution: "Attend industry meetups, join online communities, and connect with professionals for informational interviews."
      }
    ];
  };
  
  // Generate milestones
  const generateMilestones = (months: number) => {
    const quarterPoint = Math.ceil(months / 4);
    const halfPoint = Math.ceil(months / 2);
    const threeQuarterPoint = Math.ceil(months * 3 / 4);
    
    return [
      {
        timeline: `Month ${quarterPoint}`,
        milestone: "Complete foundational courses and small projects",
        tip: "Focus on building a solid knowledge foundation before rushing to advanced topics."
      },
      {
        timeline: `Month ${halfPoint}`,
        milestone: "Develop intermediate skills through more complex projects",
        tip: "Start networking with professionals in your target field to gain insights."
      },
      {
        timeline: `Month ${threeQuarterPoint}`,
        milestone: "Create an industry-standard portfolio showcasing your best work",
        tip: "Get feedback on your portfolio from professionals in the field."
      },
      {
        timeline: `Month ${months}`,
        milestone: "Begin applying for entry-level positions or internships",
        tip: "Highlight transferable skills from your previous role in your applications."
      }
    ];
  };
  
  // Generate simulated task graph
  const generateSimulatedTaskGraph = () => {
    // Base nodes for different types of tasks
    const nodes = [
      { id: "start", name: "Start Your Journey", level: 0, type: "milestone", timeEstimate: 0, description: "Begin your career transition journey", prerequisites: [], status: "completed" },
      { id: "skill-1", name: "Learn Fundamentals", level: 1, type: "learning", timeEstimate: 40, description: "Master the core concepts and principles", prerequisites: ["start"], status: "in-progress" },
      { id: "skill-2", name: "Build Projects", level: 1, type: "project", timeEstimate: 60, description: "Create hands-on projects to apply your knowledge", prerequisites: ["skill-1"], status: "not-started" },
      { id: "milestone-1", name: "Foundation Complete", level: 1, type: "milestone", timeEstimate: 0, description: "Milestone: Foundational knowledge acquired", prerequisites: ["skill-1", "skill-2"], status: "not-started" },
      { id: "skill-3", name: "Advanced Techniques", level: 2, type: "learning", timeEstimate: 50, description: "Learn advanced methodologies and techniques", prerequisites: ["milestone-1"], status: "not-started" },
      { id: "network-1", name: "Join Communities", level: 2, type: "networking", timeEstimate: 10, description: "Connect with professionals in your target field", prerequisites: ["milestone-1"], status: "not-started" },
      { id: "project-1", name: "Portfolio Project", level: 2, type: "project", timeEstimate: 80, description: "Create a substantial project for your portfolio", prerequisites: ["skill-3"], status: "not-started" },
      { id: "milestone-2", name: "Intermediate Level", level: 2, type: "milestone", timeEstimate: 0, description: "Milestone: Reached intermediate proficiency", prerequisites: ["skill-3", "project-1"], status: "not-started" },
      { id: "skill-4", name: "Specialized Skills", level: 3, type: "learning", timeEstimate: 40, description: "Develop specialized skills for your target role", prerequisites: ["milestone-2"], status: "not-started" },
      { id: "network-2", name: "Informational Interviews", level: 3, type: "networking", timeEstimate: 15, description: "Conduct informational interviews with professionals", prerequisites: ["network-1", "milestone-2"], status: "not-started" },
      { id: "project-2", name: "Capstone Project", level: 3, type: "project", timeEstimate: 100, description: "Create a comprehensive capstone project", prerequisites: ["skill-4"], status: "not-started" },
      { id: "job-1", name: "Resume Building", level: 3, type: "job-prep", timeEstimate: 20, description: "Craft a competitive resume highlighting transferable skills", prerequisites: ["milestone-2"], status: "not-started" },
      { id: "milestone-3", name: "Ready to Apply", level: 3, type: "milestone", timeEstimate: 0, description: "Milestone: Ready to apply for positions", prerequisites: ["skill-4", "project-2", "job-1"], status: "not-started" },
      { id: "job-2", name: "Job Applications", level: 4, type: "job-prep", timeEstimate: 60, description: "Apply to relevant positions in your target field", prerequisites: ["milestone-3"], status: "not-started" },
      { id: "job-3", name: "Interview Preparation", level: 4, type: "job-prep", timeEstimate: 40, description: "Prepare for technical and behavioral interviews", prerequisites: ["milestone-3"], status: "not-started" },
      { id: "finish", name: "Career Transition", level: 4, type: "milestone", timeEstimate: 0, description: "Successfully transition to your new career", prerequisites: ["job-2", "job-3"], status: "not-started" }
    ];
    
    // Generate links based on prerequisites
    const links = [];
    
    for (const node of nodes) {
      for (const prereq of node.prerequisites) {
        links.push({
          source: prereq,
          target: node.id,
          value: 1
        });
      }
    }
    
    return { nodes, links };
  };
  
  // Get color for node based on type
  const getNodeColor = (node: any) => {
    if (!node) return '#aaa';
    
    const colors: Record<string, string> = {
      'milestone': '#3b82f6', // blue
      'learning': '#10b981', // green
      'project': '#8b5cf6', // purple
      'networking': '#f59e0b', // amber
      'job-prep': '#ef4444'  // red
    };
    
    return colors[node.type] || '#aaa';
  };
  
  // Get color for node based on status
  const getNodeStatusColor = (node: any) => {
    if (!node) return '#aaa';
    
    const colors: Record<string, string> = {
      'completed': '#10b981', // green
      'in-progress': '#3b82f6', // blue
      'not-started': '#6b7280'  // gray
    };
    
    return colors[node.status] || '#aaa';
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI Job Switch Planner</h1>
            <p className="text-muted-foreground">Plan your career transition with AI-powered guidance and task planning</p>
          </div>
          <HackathonBadge />
        </div>
        
        <Tabs defaultValue="plan">
          <TabsList className="mb-6">
            <TabsTrigger value="plan" className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              Career Plan
            </TabsTrigger>
            {careerPlan && (
              <TabsTrigger value="tasks" className="flex items-center gap-1.5" onClick={() => setPlanStage('tasks')}>
                <List className="h-4 w-4" />
                Task Scheduler
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="plan">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Career Information</CardTitle>
                    <CardDescription>
                      Provide details about your current role and target position
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">Gemini AI API Key</Label>
                      <Input 
                        id="api-key"
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                        placeholder="Enter your Gemini AI API Key"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Required for AI-powered career planning
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="current-job">Current Job Role</Label>
                      <Input 
                        id="current-job"
                        value={currentJob} 
                        onChange={(e) => setCurrentJob(e.target.value)} 
                        placeholder="e.g., Quality Assurance Engineer"
                        className="mt-1.5"
                        disabled={!isValidApiKey}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="target-job">Target Job Role</Label>
                      <Input 
                        id="target-job"
                        value={targetJob} 
                        onChange={(e) => setTargetJob(e.target.value)} 
                        placeholder="e.g., Product Manager"
                        className="mt-1.5"
                        disabled={!isValidApiKey}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="current-skills">Current Skills</Label>
                      <Textarea 
                        id="current-skills"
                        value={currentSkills} 
                        onChange={(e) => setCurrentSkills(e.target.value)} 
                        placeholder="List your current skills, separated by commas"
                        rows={3}
                        className="mt-1.5 resize-none"
                        disabled={!isValidApiKey}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select 
                        value={experience} 
                        onValueChange={setExperience} 
                        disabled={!isValidApiKey}
                      >
                        <SelectTrigger id="experience" className="mt-1.5">
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Less than 1 year</SelectItem>
                          <SelectItem value="2">1-2 years</SelectItem>
                          <SelectItem value="3">3-5 years</SelectItem>
                          <SelectItem value="6">6-10 years</SelectItem>
                          <SelectItem value="10">More than 10 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="education">Highest Education</Label>
                      <Select 
                        value={education} 
                        onValueChange={setEducation} 
                        disabled={!isValidApiKey}
                      >
                        <SelectTrigger id="education" className="mt-1.5">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="associates">Associate's Degree</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="timeline">Desired Timeline (months)</Label>
                        <span className="text-sm text-muted-foreground">{desiredTimeline[0]} months</span>
                      </div>
                      <Slider
                        id="timeline"
                        min={3}
                        max={36}
                        step={1}
                        value={desiredTimeline}
                        onValueChange={setDesiredTimeline}
                        disabled={!isValidApiKey}
                      />
                      <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                        <span>3 months</span>
                        <span>36 months</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                      <Textarea 
                        id="additional-info"
                        value={additionalInfo} 
                        onChange={(e) => setAdditionalInfo(e.target.value)} 
                        placeholder="Any additional context or constraints"
                        rows={3}
                        className="mt-1.5 resize-none"
                        disabled={!isValidApiKey}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={generateCareerSwitchPlan} 
                      disabled={isLoading || !isValidApiKey || !currentJob || !targetJob || !currentSkills}
                      className="w-full"
                    >
                      {isLoading ? "Generating Plan..." : "Generate Career Switch Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Results */}
              <div className="lg:col-span-2">
                {!careerPlan && !isLoading && (
                  <div className="h-full flex items-center justify-center border border-dashed rounded-lg p-12">
                    <div className="text-center">
                      <div className="mx-auto bg-muted/60 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Enter Your Details</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Fill in the form with your current and desired career information to generate a personalized transition plan.
                      </p>
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="h-full flex items-center justify-center border rounded-lg p-12">
                    <div className="text-center">
                      <div className="mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Generating Your Plan</h3>
                      <p className="text-muted-foreground">
                        Our AI is analyzing your career transition from {currentJob} to {targetJob}...
                      </p>
                    </div>
                  </div>
                )}
                
                {careerPlan && !isLoading && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{currentJob} → {targetJob}</CardTitle>
                            <CardDescription>
                              Your personalized career transition plan
                            </CardDescription>
                          </div>
                          <Badge variant={careerPlan.feasibility.isRealistic ? "default" : "outline"}>
                            {careerPlan.feasibility.score}% Feasibility
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                          <h3 className="font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Transition Timeline
                          </h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">You want to switch in:</span>
                              <Badge variant="secondary">{desiredTimeline[0]} months</Badge>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Realistic timeline:</span>
                              <Badge variant="outline" className={careerPlan.feasibility.isRealistic ? "text-green-600" : "text-amber-600"}>
                                {careerPlan.feasibility.actualMonths} months
                              </Badge>
                            </div>
                            {!careerPlan.feasibility.isRealistic && (
                              <p className="text-xs text-amber-600 mt-2">
                                Your desired timeline may be challenging. Consider extending your transition period for better results.
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="font-medium">Transition Roadmap</h3>
                        <div className="space-y-4">
                          {careerPlan.roadmap.phases.map((phase: any, index: number) => (
                            <Card key={index} className="border">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">Phase {index + 1}: {phase.title}</CardTitle>
                                  <Badge variant="outline">{phase.duration}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-2 space-y-3">
                                <p className="text-sm">{phase.description}</p>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Key Skills to Develop:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {phase.keySkills.map((skill: string, i: number) => (
                                      <Badge key={i} variant="secondary">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Recommended Resources:</h4>
                                  <div className="space-y-2">
                                    {phase.resources.map((resource: any, i: number) => (
                                      <div key={i} className="text-sm p-2 bg-muted rounded flex justify-between items-center">
                                        <div>
                                          <span className="font-medium">{resource.name}</span>
                                          <span className="text-xs text-muted-foreground ml-2">({resource.type})</span>
                                        </div>
                                        <Badge variant="outline">{resource.estimatedHours}h</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                          <div>
                            <h3 className="font-medium mb-3">Transferable Skills</h3>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="space-y-2">
                                  {careerPlan.roadmap.transferableSkills.map((skill: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>{skill}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-3">Challenges & Solutions</h3>
                            <Card>
                              <CardContent className="pt-6 space-y-4">
                                {careerPlan.roadmap.challengesAndSolutions.map((item: any, index: number) => (
                                  <div key={index}>
                                    <p className="font-medium text-sm">{item.challenge}</p>
                                    <p className="text-sm text-muted-foreground">{item.solution}</p>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Key Milestones</h3>
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-muted"></div>
                            
                            {/* Timeline items */}
                            <div className="space-y-6">
                              {careerPlan.roadmap.milestones.map((milestone: any, index: number) => (
                                <div key={index} className="relative pl-12">
                                  {/* Timeline node */}
                                  <div className="absolute left-0 top-0 w-5 h-5 rounded-full border-4 border-background bg-primary"></div>
                                  
                                  <div>
                                    <Badge variant="outline" className="mb-2">{milestone.timeline}</Badge>
                                    <h4 className="font-medium">{milestone.milestone}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{milestone.tip}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={generateTaskPlan} className="w-full">
                          <List className="mr-2 h-4 w-4" />
                          Generate Detailed Task Scheduler
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            {!tasksGraph && careerPlan && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>Task Scheduler</CardTitle>
                  <CardDescription>
                    Generate a dynamic task schedule to implement your career transition plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="mx-auto bg-muted/60 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <List className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Break Down Your Plan?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Generate a detailed task scheduler with dependencies, timelines, and milestones to track your progress.
                  </p>
                  <Button onClick={generateTaskPlan} className="mt-6">
                    Generate Task Schedule
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {isLoading && (
              <div className="h-96 flex items-center justify-center border rounded-lg p-12">
                <div className="text-center">
                  <div className="mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Generating Task Schedule</h3>
                  <p className="text-muted-foreground">
                    Creating your personalized task roadmap with dependencies and milestones...
                  </p>
                </div>
              </div>
            )}
            
            {tasksGraph && !isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Dynamic Task Scheduler</span>
                        <Badge variant="outline">Based on SingularityNET METTA framework</Badge>
                      </CardTitle>
                      <CardDescription>
                        Task dependency graph showing your career transition path
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[600px] border rounded overflow-hidden bg-background">
                        {tasksGraph && (
                          <ForceGraph2D
                            graphData={tasksGraph}
                            nodeLabel={(node: any) => `${node.name} (${node.timeEstimate}h)`}
                            nodeAutoColorBy="type"
                            nodeColor={(node: any) => getNodeColor(node)}
                            nodeRelSize={8}
                            linkWidth={1.5}
                            linkColor={() => "#ddd"}
                            onNodeClick={handleNodeClick}
                            cooldownTime={2000}
                          />
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor({ type: 'learning' }) }}></div>
                          <span className="text-xs">Learning</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor({ type: 'project' }) }}></div>
                          <span className="text-xs">Projects</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor({ type: 'networking' }) }}></div>
                          <span className="text-xs">Networking</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor({ type: 'milestone' }) }}></div>
                          <span className="text-xs">Milestones</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor({ type: 'job-prep' }) }}></div>
                          <span className="text-xs">Job Prep</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1.5" /> Export Plan
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="lg:col-span-1">
                  {selectedTask ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: getNodeColor(selectedTask) }}></div>
                          {selectedTask.name}
                        </CardTitle>
                        <CardDescription>
                          Task details and completion status
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Description</h4>
                          <p className="text-sm">{selectedTask.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <h4 className="text-xs font-medium mb-1 text-muted-foreground">Time Estimate</h4>
                            <p className="text-sm font-medium">{selectedTask.timeEstimate} hours</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium mb-1 text-muted-foreground">Type</h4>
                            <Badge variant="outline" className="capitalize">{selectedTask.type}</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Status</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Select defaultValue={selectedTask.status}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-1">
                              <div 
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: getNodeStatusColor(selectedTask) }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Dependencies</h4>
                            <span className="text-xs text-muted-foreground">
                              {selectedTask.prerequisites.length} prerequisites
                            </span>
                          </div>
                          {selectedTask.prerequisites.length > 0 ? (
                            <div className="space-y-2">
                              {selectedTask.prerequisites.map((prereqId: string) => {
                                const prereq = tasksGraph.nodes.find((n: any) => n.id === prereqId);
                                return (
                                  <div key={prereqId} className="text-sm flex items-center justify-between p-2 bg-muted rounded">
                                    <span>{prereq ? prereq.name : prereqId}</span>
                                    <Badge variant="outline" className="capitalize">{prereq ? prereq.status : 'unknown'}</Badge>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No prerequisites for this task</p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Resources</h4>
                          <div className="space-y-2">
                            <div className="text-sm p-2 border rounded flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span>AI-suggested learning path</span>
                              </div>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                            <div className="text-sm p-2 border rounded flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Connect with mentors</span>
                              </div>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="w-full flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Mark as complete</span>
                          <Switch id="complete-task" />
                        </div>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="mx-auto bg-muted/60 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                          <Lightbulb className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Task Details</h3>
                        <p className="text-sm text-muted-foreground">
                          Click on any node in the graph to view details and update task status
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-base">Weekly Goals</CardTitle>
                      <CardDescription>
                        Your personalized task schedule for this week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["Learn Fundamentals", "Join Communities", "Start Portfolio Project"].map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Switch id={`task-${i}`} />
                            <Label htmlFor={`task-${i}`} className="text-sm">{task}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        View Learning Resources
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIJobSwitchPlanner;
