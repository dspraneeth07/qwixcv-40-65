
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle } from "lucide-react";
import { ATSScoreData } from "@/utils/atsScoreApi";

export interface ATSScoreDisplayProps {
  scoreData: ATSScoreData | null;
  isLoading: boolean;
}

export const ATSScoreDisplay = ({ scoreData, isLoading }: ATSScoreDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>ATS Score Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Analyzing your resume...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>ATS Score Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">Complete your resume to see ATS analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle>ATS Score Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Score</span>
              <span className={`text-lg font-bold ${getScoreColor(scoreData.overallScore)}`}>
                {scoreData.overallScore}/100
              </span>
            </div>
            <Progress value={scoreData.overallScore} className="h-2" style={{ 
              '--progress-background': getProgressColor(scoreData.overallScore) 
            } as React.CSSProperties} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs">Keywords</span>
                <span className={`text-sm font-semibold ${getScoreColor(scoreData.keywordScore)}`}>
                  {scoreData.keywordScore}%
                </span>
              </div>
              <Progress value={scoreData.keywordScore} className="h-1.5" style={{ 
                '--progress-background': getProgressColor(scoreData.keywordScore) 
              } as React.CSSProperties} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs">Format</span>
                <span className={`text-sm font-semibold ${getScoreColor(scoreData.formatScore)}`}>
                  {scoreData.formatScore}%
                </span>
              </div>
              <Progress value={scoreData.formatScore} className="h-1.5" style={{ 
                '--progress-background': getProgressColor(scoreData.formatScore) 
              } as React.CSSProperties} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs">Content</span>
                <span className={`text-sm font-semibold ${getScoreColor(scoreData.contentScore)}`}>
                  {scoreData.contentScore}%
                </span>
              </div>
              <Progress value={scoreData.contentScore} className="h-1.5" style={{ 
                '--progress-background': getProgressColor(scoreData.contentScore) 
              } as React.CSSProperties} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Improvement Suggestions:</h3>
          <ul className="space-y-1">
            {scoreData.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Best Job Match:</h3>
          <p className="text-sm">{scoreData.jobMatch}</p>
        </div>
      </CardContent>
    </Card>
  );
};
