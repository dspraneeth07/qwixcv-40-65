
// This file contains API functions for ATS scoring using Google Gemini API

const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface ATSScoreData {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  contentScore: number;
  suggestions: string[];
  jobMatch: string;
}

/**
 * Ensure text is limited to exactly 4 lines or fewer (copied from geminiApi.ts)
 */
const limitToFourLines = (text: string): string => {
  const lines = text.split('\n');
  if (lines.length <= 4) return text;
  return lines.slice(0, 4).join('\n');
};

/**
 * Generate ATS score for a resume
 */
export const generateATSScore = async (resumeData: any): Promise<ATSScoreData> => {
  // Create a plain text version of the resume for analysis
  const { personalInfo, education, experience, skills, objective } = resumeData;
  
  // Format resume data as text for analysis
  const resumeText = `
    ${personalInfo.firstName} ${personalInfo.lastName}
    ${personalInfo.jobTitle}
    ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
    ${personalInfo.linkedinUrl ? `LinkedIn: ${personalInfo.linkedinUrl}` : ''}
    ${personalInfo.githubUrl ? `GitHub: ${personalInfo.githubUrl}` : ''}

    OBJECTIVE
    ${objective}

    SKILLS
    Professional: ${skills.professional}
    Technical: ${skills.technical}
    Soft: ${skills.soft}

    EXPERIENCE
    ${experience.map((exp: any) => `
    ${exp.jobTitle} at ${exp.companyName}
    ${exp.startDate} - ${exp.endDate || 'Present'}
    ${exp.description}
    `).join('\n')}

    EDUCATION
    ${education.map((edu: any) => `
    ${edu.degree} from ${edu.school}
    Graduated: ${edu.graduationDate}
    ${edu.score ? `GPA/Score: ${edu.score}` : ''}
    `).join('\n')}
  `;

  const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer. Review the following resume and provide a detailed analysis:

    ${resumeText}

    Analyze this resume for:
    1. Overall ATS compatibility (score 1-100)
    2. Keyword relevance and density (score 1-100)
    3. Format and structure clarity (score 1-100)
    4. Content quality and impact (score 1-100)
    5. List 3-5 specific improvement suggestions
    6. Job match description (one short paragraph about what jobs this resume is best suited for)

    Return ONLY JSON data in this exact format:
    {
      "overallScore": number,
      "keywordScore": number,
      "formatScore": number,
      "contentScore": number,
      "suggestions": [string, string, string],
      "jobMatch": string
    }
  `;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const scoreData = JSON.parse(jsonMatch[0]);
        return {
          overallScore: scoreData.overallScore || 70,
          keywordScore: scoreData.keywordScore || 65,
          formatScore: scoreData.formatScore || 75,
          contentScore: scoreData.contentScore || 70,
          suggestions: scoreData.suggestions || [
            "Add more industry-specific keywords related to your role",
            "Quantify achievements with specific metrics",
            "Ensure consistent formatting throughout"
          ],
          jobMatch: limitToFourLines(scoreData.jobMatch) || "This resume is well-suited for mid-level positions in the specified field, highlighting relevant technical and soft skills."
        };
      }
    } catch (parseError) {
      console.error("Error parsing ATS score data:", parseError);
    }
    
    // Fallback values
    return {
      overallScore: 70,
      keywordScore: 65,
      formatScore: 75,
      contentScore: 70,
      suggestions: [
        "Add more industry-specific keywords related to your role",
        "Quantify achievements with specific metrics",
        "Ensure consistent formatting throughout"
      ],
      jobMatch: "This resume is well-suited for mid-level positions in the specified field, highlighting relevant technical and soft skills."
    };
  } catch (error) {
    console.error("Error generating ATS score:", error);
    throw error;
  }
};
