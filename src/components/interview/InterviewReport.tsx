
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Star, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { InterviewReport as IInterviewReport } from '@/types/interview';
import { useToast } from '@/components/ui/use-toast';

// Sample colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface InterviewReportProps {
  report: IInterviewReport;
  onDownload?: () => void;
}

const InterviewReport: React.FC<InterviewReportProps> = ({ report, onDownload }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    skills: false,
    questions: false,
    transcript: false
  });
  const { toast } = useToast();
  
  // Prepare data for radar chart
  const radarData = [
    {
      subject: 'Communication',
      value: report.performanceMetrics.communication,
      fullMark: 100,
    },
    {
      subject: 'Technical',
      value: report.performanceMetrics.technicalKnowledge,
      fullMark: 100,
    },
    {
      subject: 'Problem Solving',
      value: report.performanceMetrics.problemSolving,
      fullMark: 100,
    },
    {
      subject: 'Culture Fit',
      value: report.performanceMetrics.cultureFit,
      fullMark: 100,
    },
    {
      subject: 'Confidence',
      value: report.performanceMetrics.confidence,
      fullMark: 100,
    },
  ];
  
  // Prepare data for questions bar chart
  const questionsData = report.questions.map(q => ({
    name: q.question.substring(0, 15) + '...',
    confidence: q.confidenceScore,
    content: q.contentScore,
  }));
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Matched Skills', value: report.skillsAnalysis.matched.length },
    { name: 'Missing Skills', value: report.skillsAnalysis.missing.length },
  ];
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Report Download",
        description: "Your interview report PDF is being prepared...",
      });
      
      // Simulate PDF generation delay
      setTimeout(() => {
        toast({
          title: "Download Complete",
          description: "Your interview report has been downloaded",
        });
      }, 2000);
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interview Report</h1>
          <p className="text-muted-foreground">
            Analysis for {report.jobTitle} position at {report.targetCompany}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(report.date).toLocaleDateString()}
          </Badge>
          
          <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-muted/30 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
              <p className="text-sm text-muted-foreground">{report.yearsOfExperience} years experience level</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl">{report.overallScore}%</span>
              <div className={`p-1.5 rounded-full ${
                report.overallScore >= 80 ? 'bg-green-100 text-green-700' :
                report.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Summary Section */}
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('summary')}
            >
              <h3 className="font-medium flex items-center">
                <Award className="h-4 w-4 mr-2 text-blue-500" />
                Overall Assessment
              </h3>
              {expandedSections.summary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {expandedSections.summary && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Communication</span>
                          <span>{report.performanceMetrics.communication}%</span>
                        </div>
                        <Progress value={report.performanceMetrics.communication} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technical Knowledge</span>
                          <span>{report.performanceMetrics.technicalKnowledge}%</span>
                        </div>
                        <Progress value={report.performanceMetrics.technicalKnowledge} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Problem Solving</span>
                          <span>{report.performanceMetrics.problemSolving}%</span>
                        </div>
                        <Progress value={report.performanceMetrics.problemSolving} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Culture Fit</span>
                          <span>{report.performanceMetrics.cultureFit}%</span>
                        </div>
                        <Progress value={report.performanceMetrics.cultureFit} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confidence</span>
                          <span>{report.performanceMetrics.confidence}%</span>
                        </div>
                        <Progress value={report.performanceMetrics.confidence} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <h4 className="text-sm font-medium mb-2 text-center">Performance Radar</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Suggested Improvements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {report.suggestedImprovements.map((suggestion, index) => (
                      <li key={index} className="text-muted-foreground">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Skills Section */}
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('skills')}
            >
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-green-500" />
                Skills Analysis
              </h3>
              {expandedSections.skills ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {expandedSections.skills && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills Coverage</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-medium text-green-600">Matched Skills</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {report.skillsAnalysis.matched.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-50">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-medium text-red-600">Missing Skills</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {report.skillsAnalysis.missing.map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-red-200 text-red-500">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <h4 className="text-sm font-medium mb-2 text-center">Skills Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Questions Section */}
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('questions')}
            >
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-500" />
                Question Responses
              </h3>
              {expandedSections.questions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {expandedSections.questions && (
              <div className="space-y-6 animate-fade-in">
                <div className="h-64">
                  <h4 className="text-sm font-medium mb-2 text-center">Response Performance</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={questionsData.slice(0, 5)} // Show just first few questions to avoid crowding
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confidence" fill="#8884d8" name="Confidence" />
                      <Bar dataKey="content" fill="#82ca9d" name="Content Quality" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  {report.questions.map((q, index) => (
                    <Card key={index} className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Q{index + 1}: {q.question}</h4>
                            <Badge variant={q.confidenceScore > 70 ? "default" : "outline"}>
                              {q.confidenceScore}%
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground italic">{q.answer}</p>
                          
                          <Separator className="my-2" />
                          
                          <div className="text-sm">
                            <p className="font-medium">Feedback:</p>
                            <p className="text-muted-foreground">{q.feedback}</p>
                          </div>
                          
                          <div className="text-xs">
                            <span className="font-medium">Key points covered: </span>
                            <span className="text-muted-foreground">{q.keyPointsCovered.join(', ')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Transcript Section */}
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('transcript')}
            >
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Full Interview Transcript
              </h3>
              {expandedSections.transcript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {expandedSections.transcript && (
              <div className="animate-fade-in">
                <div className="bg-muted/20 p-4 rounded-md max-h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {report.interviewTranscript}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewReport;
