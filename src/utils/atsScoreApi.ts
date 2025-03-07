
// This file contains the API for generating ATS (Applicant Tracking System) scores

export interface ATSScoreData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

/**
 * Generates an ATS score based on resume data
 * This is a mock implementation that simulates a real ATS scoring system
 */
export const generateATSScore = async (resumeData: any): Promise<ATSScoreData> => {
  // In a real app, you'd call an actual API here
  // For now, we'll simulate processing by adding a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate a base score based on content completeness
      let baseScore = 50;
      
      // Review personal info
      if (resumeData.personalInfo?.firstName && resumeData.personalInfo?.lastName) baseScore += 3;
      if (resumeData.personalInfo?.email) baseScore += 3;
      if (resumeData.personalInfo?.phone) baseScore += 3;
      if (resumeData.personalInfo?.location) baseScore += 3;
      if (resumeData.personalInfo?.linkedinUrl) baseScore += 3;
      if (resumeData.personalInfo?.githubUrl) baseScore += 3;
      
      // Review education
      const educationScore = Math.min(10, resumeData.education?.length * 5);
      baseScore += educationScore;
      
      // Review experience
      const experienceScore = Math.min(15, resumeData.experience?.length * 7);
      baseScore += experienceScore;
      
      // Review projects
      const projectsScore = Math.min(10, resumeData.projects?.length * 5);
      baseScore += projectsScore;
      
      // Check keyword density
      const hasKeywords = checkKeywordDensity(resumeData);
      if (hasKeywords) baseScore += 10;
      
      // Clamp the score between 0 and 100
      const finalScore = Math.min(100, Math.max(0, baseScore));
      
      // Generate strengths, weaknesses, and suggestions
      const { strengths, weaknesses, suggestions } = generateFeedback(resumeData, finalScore);
      
      resolve({
        score: finalScore,
        strengths,
        weaknesses,
        suggestions
      });
    }, 1000); // Simulate a 1-second API call
  });
};

/**
 * Check for industry keywords in the resume data
 */
const checkKeywordDensity = (resumeData: any): boolean => {
  const jobTitle = resumeData.personalInfo?.jobTitle?.toLowerCase() || '';
  const skills = [
    resumeData.skills?.professional || '',
    resumeData.skills?.technical || '',
    resumeData.skills?.soft || ''
  ].join(' ').toLowerCase();
  
  const objective = resumeData.objective?.toLowerCase() || '';
  
  // Common tech keywords - would be industry specific in a real implementation
  const techKeywords = [
    'javascript', 'react', 'angular', 'vue', 'node', 'express', 'mongodb', 'sql',
    'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'devops', 'ci/cd', 'git',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'kanban', 'product',
    'leadership', 'management', 'strategy', 'analytics', 'data', 'ml', 'ai'
  ];
  
  // Count how many tech keywords are present in the resume
  const allText = `${jobTitle} ${skills} ${objective}`.toLowerCase();
  const keywordsFound = techKeywords.filter(keyword => allText.includes(keyword));
  
  return keywordsFound.length >= 5; // Consider it good if at least 5 tech keywords are present
};

/**
 * Generate feedback based on the resume data and score
 */
const generateFeedback = (resumeData: any, score: number): { strengths: string[], weaknesses: string[], suggestions: string[] } => {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  
  // Add strengths
  if (resumeData.personalInfo?.linkedinUrl) {
    strengths.push("LinkedIn profile included, which improves credibility");
  }
  
  if (resumeData.personalInfo?.githubUrl) {
    strengths.push("GitHub profile included, which shows practical coding experience");
  }
  
  if (resumeData.education?.length > 0) {
    strengths.push("Educational background is well-documented");
  }
  
  if (resumeData.experience?.length > 1) {
    strengths.push("Multiple work experiences demonstrate career progression");
  }
  
  if (resumeData.projects?.length > 0) {
    strengths.push("Projects section highlights practical application of skills");
  }
  
  if (resumeData.skills?.technical?.length > 20) {
    strengths.push("Comprehensive list of technical skills improves keyword matching");
  }
  
  if (resumeData.objective?.length > 50) {
    strengths.push("Detailed career objective helps align with job requirements");
  }
  
  // If we don't have enough strengths, add generic ones based on score
  if (strengths.length < 3) {
    if (score > 70) {
      strengths.push("Overall resume structure follows industry best practices");
      strengths.push("Content is well-organized and easy to scan");
    }
  }
  
  // Add weaknesses
  if (!resumeData.personalInfo?.linkedinUrl) {
    weaknesses.push("Missing LinkedIn profile reduces professional networking visibility");
    suggestions.push("Add your LinkedIn profile to showcase your professional network");
  }
  
  if (!resumeData.personalInfo?.githubUrl && resumeData.personalInfo?.jobTitle?.toLowerCase().includes('develop')) {
    weaknesses.push("No GitHub profile for a technical role may limit showcasing your code");
    suggestions.push("Include your GitHub profile to showcase your code and projects");
  }
  
  if (resumeData.experience?.length <= 1) {
    weaknesses.push("Limited work experience may reduce competitiveness");
    suggestions.push("If possible, add more varied work experiences, including volunteer work or internships");
  }
  
  if (resumeData.projects?.length === 0) {
    weaknesses.push("No projects section to demonstrate practical skills");
    suggestions.push("Add a projects section to showcase your hands-on experience and problem-solving abilities");
  }
  
  // Check experience descriptions
  let shortDescriptions = false;
  resumeData.experience?.forEach((exp: any) => {
    if (exp.description?.length < 100) {
      shortDescriptions = true;
    }
  });
  
  if (shortDescriptions) {
    weaknesses.push("Some job descriptions are too brief to highlight accomplishments");
    suggestions.push("Expand job descriptions with quantifiable achievements and specific responsibilities");
  }
  
  // Check skills sections
  if (!resumeData.skills?.technical || resumeData.skills.technical.length < 10) {
    weaknesses.push("Technical skills section lacks depth for ATS keyword matching");
    suggestions.push("Expand your technical skills section with more specific technologies and tools");
  }
  
  if (!resumeData.skills?.soft || resumeData.skills.soft.length < 10) {
    weaknesses.push("Soft skills section is underdeveloped");
    suggestions.push("Include more soft skills that are relevant to your target position");
  }
  
  // Add generic suggestions based on score
  if (score < 60) {
    suggestions.push("Consider using industry-specific keywords that match job descriptions");
    suggestions.push("Quantify your achievements with numbers and percentages where possible");
  }
  
  if (suggestions.length < 3) {
    suggestions.push("Regularly update your resume to reflect your most recent skills and experiences");
    suggestions.push("Tailor your resume for each job application by emphasizing relevant skills");
  }
  
  // Ensure we have at least some feedback in each category
  if (strengths.length === 0) {
    strengths.push("Resume structure follows basic professional standards");
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push("Could benefit from more specific industry keywords");
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Continuously update your skills to stay relevant in your field");
  }
  
  return { strengths, weaknesses, suggestions };
};
