
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VoiceAnalysis } from '@/types/interview';
import { Mic } from 'lucide-react';

interface VoiceAnalysisDisplayProps {
  analysis: VoiceAnalysis | null;
}

const VoiceAnalysisDisplay: React.FC<VoiceAnalysisDisplayProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <Card className="mt-3">
        <CardContent className="p-3 text-center text-sm text-muted-foreground">
          <Mic className="h-4 w-4 mx-auto mb-1" />
          Waiting for voice analysis...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-3">
      <CardContent className="p-3">
        <h3 className="text-sm font-medium mb-2">Voice Analysis</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Tone & Confidence</span>
              <span className={`font-medium ${
                analysis.toneScore > 80 ? "text-green-600" : 
                analysis.toneScore > 60 ? "text-amber-600" : "text-red-600"
              }`}>
                {analysis.toneScore}%
              </span>
            </div>
            <Progress value={analysis.toneScore} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Speech Pace</span>
              <span className={`font-medium ${
                analysis.paceScore > 80 ? "text-green-600" : 
                analysis.paceScore > 60 ? "text-amber-600" : "text-red-600"
              }`}>
                {analysis.paceScore}%
              </span>
            </div>
            <Progress value={analysis.paceScore} className="h-1.5" />
          </div>
          
          {analysis.fillerWordCount > 0 && (
            <div className="text-xs">
              <span className="text-muted-foreground">Filler Words: </span>
              <span className={analysis.fillerWordCount > 5 ? "text-red-600 font-medium" : "text-amber-600"}>
                {analysis.fillerWordCount} detected
              </span>
              {analysis.fillerWords.length > 0 && (
                <div className="mt-1 text-muted-foreground">
                  {analysis.fillerWords.slice(0, 3).join(', ')}
                  {analysis.fillerWords.length > 3 && '...'}
                </div>
              )}
            </div>
          )}
          
          {analysis.suggestions.length > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
              <strong>Tip:</strong> {analysis.suggestions[0]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAnalysisDisplay;
