
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { GEMINI_API_KEY } from '@/utils/apiKeys';
import { User, Clock, ListChecks, BarChart2, Calendar, Activity, FileText } from 'lucide-react';

const AIShadowCareerSimulator: React.FC = () => {
  const { toast } = useToast();
  const [jobRole, setJobRole] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  // Generate the career simulation
  const generateSimulation = async () => {
    if (!jobRole) {
      toast({
        title: "Missing information",
        description: "Please provide a job role to simulate.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Generating simulation",
      description: `Creating a day in the life of a ${jobRole}${company ? ` at ${company}` : ''}.`,
    });

    try {
      // In a production app, we would make an actual API call to Gemini API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sample simulation data
      const mockSimulation = {
        role: jobRole,
        company: company || "typical company",
        schedule: [
          { time: "8:30 AM", activity: "Check email and Slack messages", category: "Communication" },
          { time: "9:00 AM", activity: "Morning standup meeting with team", category: "Meetings" },
          { time: "9:30 AM", activity: "Work on primary project tasks", category: "Core Work" },
          { time: "11:00 AM", activity: "Stakeholder meeting to discuss requirements", category: "Meetings" },
          { time: "12:00 PM", activity: "Lunch break", category: "Break" },
          { time: "1:00 PM", activity: "Review team's work and provide feedback", category: "Management" },
          { time: "2:30 PM", activity: "Cross-functional alignment meeting", category: "Meetings" },
          { time: "3:30 PM", activity: "Deep work on deliverables", category: "Core Work" },
          { time: "5:00 PM", activity: "Wrap up daily tasks and plan tomorrow", category: "Planning" },
        ],
        stressLevels: {
          morning: 40,
          midday: 70,
          afternoon: 65,
          overall: 60
        },
        meetingTypes: [
          { type: "Status updates", frequency: "Daily", duration: "15-30 min" },
          { type: "Stakeholder discussions", frequency: "Weekly", duration: "30-60 min" },
          { type: "Cross-functional alignment", frequency: "Bi-weekly", duration: "30-60 min" },
          { type: "Strategic planning", frequency: "Monthly", duration: "60-90 min" }
        ],
        keyPerformanceIndicators: [
          { name: "Project delivery timeliness", target: "90% on-time delivery" },
          { name: "Stakeholder satisfaction", target: ">85% positive feedback" },
          { name: "Quality metrics", target: "<5% defect rate" },
          { name: "Team productivity", target: "15% YoY improvement" }
        ],
        skills: {
          technical: [
            { name: "Industry knowledge", importance: 85 },
            { name: "Technical proficiency", importance: 75 },
            { name: "Data analysis", importance: 70 }
          ],
          soft: [
            { name: "Communication", importance: 90 },
            { name: "Leadership", importance: 85 },
            { name: "Problem solving", importance: 80 },
            { name: "Time management", importance: 85 }
          ]
        },
        challenges: [
          "Balancing multiple stakeholder priorities",
          "Managing tight deadlines and scope changes",
          "Ensuring team alignment and motivation",
          "Staying updated with industry trends and technologies"
        ],
        rewards: [
          "Seeing tangible impact of work on business outcomes",
          "Opportunities for professional growth and advancement",
          "Collaborative environment with diverse perspectives",
          "Recognition for successful project delivery"
        ]
      };

      setSimulationData(mockSimulation);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating simulation:", error);
      toast({
        title: "Error",
        description: "Failed to generate career simulation. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">AI Shadow Career Simulator</h1>
        <p className="text-muted-foreground mb-8">Experience a day in the life of any job role before applying</p>

        {!simulationData ? (
          <Card>
            <CardHeader>
              <CardTitle>Career Role Simulation</CardTitle>
              <CardDescription>
                Enter the job role you want to experience for a day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="job-role">Job Role</Label>
                  <Input
                    id="job-role"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Product Manager"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs">i</span>
                  </div>
                  <p className="font-medium text-blue-700">AI-Powered Career Simulation</p>
                </div>
                <p className="text-sm text-blue-600">
                  Our AI will generate a realistic simulation of a typical day in this role,
                  including tasks, stress levels, meetings, and performance metrics to help you
                  determine if this career is the right fit for you.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={generateSimulation}
                disabled={!jobRole || isLoading}
              >
                {isLoading ? "Generating..." : "Simulate a Day in this Role"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">
                    A Day as a {simulationData.role}
                    {simulationData.company && ` at ${simulationData.company}`}
                  </h2>
                  <p className="text-blue-600">
                    Generated simulation based on real-world data and AI analysis
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 px-3 py-1.5 text-sm">
                  Overall Stress Level: {simulationData.stressLevels.overall}/100
                </Badge>
              </div>
            </div>
            
            <Tabs defaultValue="schedule">
              <TabsList className="mb-4">
                <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
                <TabsTrigger value="metrics">KPIs & Metrics</TabsTrigger>
                <TabsTrigger value="skills">Required Skills</TabsTrigger>
                <TabsTrigger value="experience">Reality Check</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Typical Daily Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-16 top-0 h-full w-0.5 bg-gray-200"></div>
                      <div className="space-y-0">
                        {simulationData.schedule.map((item: any, i: number) => (
                          <div key={i} className="flex items-start py-3 relative">
                            <div className="w-16 flex-shrink-0 font-medium text-sm text-gray-600">
                              {item.time}
                            </div>
                            <div className={`
                              h-3 w-3 rounded-full absolute left-16 top-4 transform -translate-x-1.5
                              ${item.category === "Meetings" ? "bg-orange-400" :
                                item.category === "Core Work" ? "bg-green-500" :
                                item.category === "Break" ? "bg-blue-400" :
                                item.category === "Communication" ? "bg-purple-400" :
                                item.category === "Management" ? "bg-red-400" :
                                "bg-gray-400"
                              }
                            `}></div>
                            <div className="ml-6 flex-1">
                              <p className="font-medium">{item.activity}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-3">Stress Level Fluctuation</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Morning</div>
                        <Progress value={simulationData.stressLevels.morning} className="h-2" />
                        <div className="text-xs">{simulationData.stressLevels.morning}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Midday</div>
                        <Progress value={simulationData.stressLevels.midday} className="h-2" />
                        <div className="text-xs">{simulationData.stressLevels.midday}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Afternoon</div>
                        <Progress value={simulationData.stressLevels.afternoon} className="h-2" />
                        <div className="text-xs">{simulationData.stressLevels.afternoon}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Overall</div>
                        <Progress value={simulationData.stressLevels.overall} className="h-2" />
                        <div className="text-xs">{simulationData.stressLevels.overall}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Common Meeting Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {simulationData.meetingTypes.map((meeting: any, i: number) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-semibold">{meeting.type}</h4>
                          <div className="flex justify-between mt-1 text-sm text-gray-600">
                            <span>Frequency: {meeting.frequency}</span>
                            <span>Duration: {meeting.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-blue-600" />
                      Key Performance Indicators
                    </CardTitle>
                    <CardDescription>
                      How success is measured in this role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {simulationData.keyPerformanceIndicators.map((kpi: any, i: number) => (
                        <div key={i} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">{kpi.name}</h4>
                            <Badge variant="outline">{kpi.target}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Assessment</CardTitle>
                    <CardDescription>
                      Core skills needed to succeed in this role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                        <div className="space-y-4">
                          {simulationData.skills.technical.map((skill: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between">
                                <span>{skill.name}</span>
                                <span className="text-sm font-medium">{skill.importance}%</span>
                              </div>
                              <Progress value={skill.importance} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Soft Skills</h3>
                        <div className="space-y-4">
                          {simulationData.skills.soft.map((skill: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between">
                                <span>{skill.name}</span>
                                <span className="text-sm font-medium">{skill.importance}%</span>
                              </div>
                              <Progress value={skill.importance} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <Activity className="h-5 w-5" />
                        Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {simulationData.challenges.map((challenge: string, i: number) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5"></div>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <FileText className="h-5 w-5" />
                        Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {simulationData.rewards.map((reward: string, i: number) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5"></div>
                            <span>{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6 bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle>Is This Role Right For You?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Based on this simulation, a {simulationData.role} role might be a good fit if you:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Enjoy a mix of collaborative and independent work</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Are comfortable in a moderately high-pressure environment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Excel at both strategic thinking and execution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Are motivated by tangible results and growth opportunities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSimulationData(null)}>
                Simulate Another Role
              </Button>
              <Button>
                Save Career Insights
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIShadowCareerSimulator;
