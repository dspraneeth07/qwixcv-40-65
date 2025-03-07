
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ATSScoreData } from "@/utils/atsScoreApi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Check, X, AlertTriangle, Award, TrendingUp } from "lucide-react";

interface ATSScoreDisplayProps {
  atsData: ATSScoreData | null;
  isLoading: boolean;
}

export const ATSScoreDisplay = ({ atsData, isLoading }: ATSScoreDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="h-full border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">ATS Score Analysis</CardTitle>
          <CardDescription>Analyzing your resume...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!atsData) {
    return (
      <Card className="h-full border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">ATS Score Analysis</CardTitle>
          <CardDescription>Fill in your resume to see your ATS score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
            <AlertTriangle className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Start filling in your resume to generate an ATS score</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score < 40) return "#ea384c"; // Red for low scores
    if (score < 70) return "#F97316"; // Orange for medium scores
    return "#0EA5E9"; // Blue for high scores
  };

  const scoreColor = getScoreColor(atsData.score);

  return (
    <Card className="h-full border shadow-sm overflow-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">ATS Score Analysis</CardTitle>
        <CardDescription>Real-time resume optimization feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-4">
            <CircularProgressbar
              value={atsData.score}
              text={`${atsData.score}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: scoreColor,
                textColor: scoreColor,
                trailColor: '#d6d6d6',
              })}
            />
          </div>
          <div className="text-center">
            <p className="font-medium" style={{ color: scoreColor }}>
              {atsData.score < 40
                ? "Needs Improvement"
                : atsData.score < 70
                ? "Good Progress"
                : "Excellent"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Strengths */}
          <div>
            <h3 className="flex items-center text-sm font-medium mb-2 text-green-600 dark:text-green-400">
              <Award className="w-4 h-4 mr-2" /> STRENGTHS
            </h3>
            <ul className="space-y-1 text-sm">
              {atsData.strengths.map((strength, index) => (
                <li key={`strength-${index}`} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h3 className="flex items-center text-sm font-medium mb-2 text-red-600 dark:text-red-400">
              <X className="w-4 h-4 mr-2" /> WEAKNESSES
            </h3>
            <ul className="space-y-1 text-sm">
              {atsData.weaknesses.map((weakness, index) => (
                <li key={`weakness-${index}`} className="flex items-start">
                  <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="flex items-center text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4 mr-2" /> IMPROVEMENT IDEAS
            </h3>
            <ul className="space-y-1 text-sm">
              {atsData.suggestions.map((suggestion, index) => (
                <li key={`suggestion-${index}`} className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
