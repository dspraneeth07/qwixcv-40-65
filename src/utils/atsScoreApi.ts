
import { toast } from "@/components/ui/use-toast";

// Mock ATS analysis data - in production this would come from a real ATS analysis API
export interface ATSScoreData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// This is a mock implementation - in production, this would use a real ATS API
export const generateATSScore = async (resumeData: any): Promise<ATSScoreData> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get basic score based on data completion
    const personalScore = calculatePersonalScore(resumeData.personalInfo);
    const educationScore = calculateEducationScore(resumeData.education);
    const experienceScore = calculateExperienceScore(resumeData.experience);
    const skillsScore = calculateSkillsScore(resumeData.skills);
    const objectiveScore = calculateObjectiveScore(resumeData.objective);
    const projectsScore = calculateProjectsScore(resumeData.projects);
    
    // Calculate overall score
    const totalScore = (
      personalScore * 0.15 + 
      educationScore * 0.15 + 
      experienceScore * 0.3 + 
      skillsScore * 0.2 + 
      objectiveScore * 0.1 + 
      projectsScore * 0.1
    );
    
    return {
      score: Math.round(totalScore * 100),
      strengths: generateStrengths(resumeData, totalScore),
      weaknesses: generateWeaknesses(resumeData, totalScore),
      suggestions: generateSuggestions(resumeData, totalScore)
    };
  } catch (error) {
    console.error("Error generating ATS score:", error);
    toast({
      title: "Error",
      description: "Failed to generate ATS score. Please try again.",
      variant: "destructive"
    });
    
    return {
      score: 0,
      strengths: [],
      weaknesses: ["Could not analyze resume"],
      suggestions: ["Please try again later"]
    };
  }
};

// Helper functions for score calculation
const calculatePersonalScore = (personalInfo: any): number => {
  if (!personalInfo) return 0;
  
  let score = 0;
  const totalFields = 8; // Total number of personal info fields
  
  if (personalInfo.firstName && personalInfo.firstName.length > 1) score += 1;
  if (personalInfo.lastName && personalInfo.lastName.length > 1) score += 1;
  if (personalInfo.jobTitle && personalInfo.jobTitle.length > 2) score += 1;
  if (personalInfo.email && personalInfo.email.includes('@')) score += 1;
  if (personalInfo.phone && personalInfo.phone.length > 5) score += 1;
  if (personalInfo.location && personalInfo.location.length > 2) score += 1;
  if (personalInfo.linkedinUrl && personalInfo.linkedinUrl.includes('linkedin.com')) score += 1;
  if (personalInfo.githubUrl && personalInfo.githubUrl.includes('github.com')) score += 1;
  
  return score / totalFields;
};

const calculateEducationScore = (education: any[]): number => {
  if (!education || education.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const edu of education) {
    let itemScore = 0;
    if (edu.school && edu.school.length > 2) itemScore += 0.4;
    if (edu.degree && edu.degree.length > 2) itemScore += 0.3;
    if (edu.graduationDate) itemScore += 0.2;
    if (edu.score) itemScore += 0.1;
    
    totalScore += itemScore;
  }
  
  return Math.min(1, totalScore / Math.max(1, education.length));
};

const calculateExperienceScore = (experience: any[]): number => {
  if (!experience || experience.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const exp of experience) {
    let itemScore = 0;
    if (exp.jobTitle && exp.jobTitle.length > 2) itemScore += 0.25;
    if (exp.companyName && exp.companyName.length > 2) itemScore += 0.25;
    if (exp.startDate) itemScore += 0.1;
    if (exp.endDate) itemScore += 0.1;
    
    // Description quality - checking for length and action verbs
    if (exp.description) {
      const descLength = exp.description.length;
      if (descLength > 200) itemScore += 0.3;
      else if (descLength > 100) itemScore += 0.2;
      else if (descLength > 50) itemScore += 0.1;
      
      const actionVerbs = [
        "achieved", "improved", "trained", "managed", "created", 
        "reduced", "increased", "developed", "implemented", "designed",
        "launched", "built", "led", "delivered", "organized"
      ];
      
      const descLower = exp.description.toLowerCase();
      const hasActionVerbs = actionVerbs.some(verb => descLower.includes(verb));
      if (hasActionVerbs) itemScore += 0.1;
    }
    
    totalScore += itemScore;
  }
  
  return Math.min(1, totalScore / Math.max(1, experience.length));
};

const calculateSkillsScore = (skills: any): number => {
  if (!skills) return 0;
  
  let score = 0;
  
  if (skills.professional && skills.professional.length > 5) {
    // More points for comma separated lists
    score += skills.professional.includes(",") ? 0.4 : 0.2;
  }
  
  if (skills.technical && skills.technical.length > 5) {
    score += skills.technical.includes(",") ? 0.4 : 0.2;
  }
  
  if (skills.soft && skills.soft.length > 5) {
    score += skills.soft.includes(",") ? 0.2 : 0.1;
  }
  
  return Math.min(1, score);
};

const calculateObjectiveScore = (objective: string): number => {
  if (!objective) return 0;
  
  let score = 0;
  
  // Basic length check
  if (objective.length > 200) score += 0.4;
  else if (objective.length > 100) score += 0.3;
  else if (objective.length > 50) score += 0.2;
  
  // Check for keywords
  const keywords = ["experience", "skills", "passionate", "expertise", "contribute", "goals", "career"];
  const objectiveLower = objective.toLowerCase();
  
  const keywordMatches = keywords.filter(word => objectiveLower.includes(word));
  score += (keywordMatches.length / keywords.length) * 0.6;
  
  return Math.min(1, score);
};

const calculateProjectsScore = (projects: any[]): number => {
  if (!projects || projects.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const project of projects) {
    let itemScore = 0;
    if (project.title && project.title.length > 2) itemScore += 0.3;
    if (project.description && project.description.length > 30) itemScore += 0.4;
    if (project.technologies && project.technologies.length > 5) itemScore += 0.2;
    if (project.link) itemScore += 0.1;
    
    totalScore += itemScore;
  }
  
  return Math.min(1, totalScore / Math.max(1, projects.length));
};

// Helper functions to generate feedback
const generateStrengths = (resumeData: any, totalScore: number): string[] => {
  const strengths: string[] = [];
  
  if (!resumeData) return strengths;
  
  // Personal info
  if (resumeData.personalInfo?.githubUrl && resumeData.personalInfo?.linkedinUrl) {
    strengths.push("Strong online presence with both GitHub and LinkedIn profiles");
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 1) {
    strengths.push("Multiple educational qualifications demonstrate academic progression");
  }
  
  // Experience
  if (resumeData.experience) {
    const longDescriptions = resumeData.experience.filter((exp: any) => 
      exp.description && exp.description.length > 150
    );
    
    if (longDescriptions.length > 0) {
      strengths.push("Detailed work experience descriptions with sufficient content");
    }
    
    if (resumeData.experience.length > 2) {
      strengths.push("Multiple work experiences demonstrate career progression");
    }
  }
  
  // Skills
  if (resumeData.skills?.technical && resumeData.skills.technical.split(",").length > 5) {
    strengths.push("Strong technical skill set with multiple technologies listed");
  }
  
  // Projects
  if (resumeData.projects) {
    const projectsWithLinks = resumeData.projects.filter((proj: any) => proj.link);
    if (projectsWithLinks.length > 0) {
      strengths.push("Project portfolio with live links enhances credibility");
    }
  }
  
  // Add more general strengths for higher scores
  if (totalScore > 0.7) {
    strengths.push("Well-structured resume with comprehensive information");
  }
  
  return strengths.length > 0 ? strengths : ["No specific strengths identified yet"];
};

const generateWeaknesses = (resumeData: any, totalScore: number): string[] => {
  const weaknesses: string[] = [];
  
  if (!resumeData) return ["Empty resume"];
  
  // Personal info
  if (!resumeData.personalInfo?.githubUrl && !resumeData.personalInfo?.linkedinUrl) {
    weaknesses.push("Missing online professional profiles (LinkedIn/GitHub)");
  }
  
  // Education
  if (!resumeData.education || resumeData.education.length === 0) {
    weaknesses.push("No education information provided");
  } else if (resumeData.education.some((edu: any) => !edu.score)) {
    weaknesses.push("Education entries missing GPA/scores");
  }
  
  // Experience
  if (!resumeData.experience || resumeData.experience.length === 0) {
    weaknesses.push("No work experience information provided");
  } else {
    const shortDescriptions = resumeData.experience.filter((exp: any) => 
      !exp.description || exp.description.length < 100
    );
    
    if (shortDescriptions.length > 0) {
      weaknesses.push("Some work experience descriptions are too brief");
    }
  }
  
  // Projects
  if (!resumeData.projects || resumeData.projects.length === 0) {
    weaknesses.push("No projects showcased");
  } else if (resumeData.projects.some((proj: any) => !proj.technologies)) {
    weaknesses.push("Some projects missing technology stack information");
  }
  
  // For lower scores, add more general weaknesses
  if (totalScore < 0.5) {
    weaknesses.push("Resume lacks sufficient detail across multiple sections");
  }
  
  return weaknesses.length > 0 ? weaknesses : ["No specific weaknesses identified"];
};

const generateSuggestions = (resumeData: any, totalScore: number): string[] => {
  const suggestions: string[] = [];
  
  if (!resumeData) return ["Start filling in your resume information"];
  
  // Personal info suggestions
  if (!resumeData.personalInfo?.githubUrl) {
    suggestions.push("Add a GitHub profile to showcase your coding projects");
  }
  if (!resumeData.personalInfo?.linkedinUrl) {
    suggestions.push("Include your LinkedIn profile for better professional networking");
  }
  
  // Work experience suggestions
  if (resumeData.experience) {
    const needsImprovement = resumeData.experience.filter((exp: any) => 
      !exp.description || exp.description.length < 100
    );
    
    if (needsImprovement.length > 0) {
      suggestions.push("Add more details to your work experience descriptions using action verbs and quantifiable achievements");
    }
  } else {
    suggestions.push("Add relevant work experience, even internships or volunteer work");
  }
  
  // Skills suggestions
  if (!resumeData.skills?.technical || resumeData.skills.technical.split(",").length < 3) {
    suggestions.push("List more technical skills relevant to your target position");
  }
  
  // Project suggestions
  if (resumeData.projects) {
    const projectsWithoutLinks = resumeData.projects.filter((proj: any) => !proj.link);
    if (projectsWithoutLinks.length > 0) {
      suggestions.push("Add links to your projects to make them verifiable");
    }
  }
  
  // Keywords suggestions
  suggestions.push("Include industry-specific keywords that match job descriptions you're targeting");
  
  // If near a threshold, give encouraging message
  if (totalScore > 0.65 && totalScore < 0.7) {
    suggestions.push("You're close to a high ATS score! Add more details to push your score higher");
  }
  
  return suggestions;
};
