
export interface InterviewQuestion {
  type: 'Technical' | 'Behavioral' | 'HR';
  question: string;
}

export interface InterviewFeedback {
  strengths: string;
  improvements: string;
  suggestions: string;
  scores: {
    relevance: number;
    clarity: number;
    depth: number;
  };
}
