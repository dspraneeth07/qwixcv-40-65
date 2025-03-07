
import { ATSScoreData } from './atsScoreApi';

const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface ComparisonReportData {
  resumeA: {
    atsScore: number;
    keywordScore: number;
    formatScore: number;
    contentScore: number;
    strengths: string[];
    weaknesses: string[];
  };
  resumeB: {
    atsScore: number;
    keywordScore: number;
    formatScore: number;
    contentScore: number;
    strengths: string[];
    weaknesses: string[];
  };
  winner: 'resumeA' | 'resumeB';
  reason: string;
  improvementSuggestions: string[];
}

/**
 * Generate a comprehensive comparison report between two resumes using Gemini API
 */
export const generateComparisonReport = async (
  resumeDataA: any, 
  resumeDataB: any,
  scoreDataA: ATSScoreData,
  scoreDataB: ATSScoreData
): Promise<ComparisonReportData> => {
  // Create a plain text version of the resumes for analysis
  const formatResumeText = (resumeData: any) => {
    const { personalInfo, education, experience, skills, objective } = resumeData;
    
    return `
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
  };

  const resumeTextA = formatResumeText(resumeDataA);
  const resumeTextB = formatResumeText(resumeDataB);

  const prompt = `
    You are an expert resume analyst and ATS optimization consultant. You need to compare two resumes and provide a detailed analysis on which one is better for job applications.

    RESUME A:
    ${resumeTextA}

    RESUME B:
    ${resumeTextB}

    Compare these two resumes on the following criteria:
    1. ATS compatibility
    2. Keyword optimization
    3. Content quality and impact
    4. Formatting and structure
    5. Professionalism and readability

    Determine which resume is better overall and provide specific reasons why.
    Also provide actionable improvement suggestions for both resumes.

    Return ONLY JSON data in this exact format:
    {
      "resumeA": {
        "atsScore": ${scoreDataA.overallScore},
        "keywordScore": ${scoreDataA.keywordScore},
        "formatScore": ${scoreDataA.formatScore},
        "contentScore": ${scoreDataA.contentScore},
        "strengths": [
          "specific strength 1",
          "specific strength 2",
          "specific strength 3"
        ],
        "weaknesses": [
          "specific weakness 1",
          "specific weakness 2",
          "specific weakness 3"
        ]
      },
      "resumeB": {
        "atsScore": ${scoreDataB.overallScore},
        "keywordScore": ${scoreDataB.keywordScore},
        "formatScore": ${scoreDataB.formatScore},
        "contentScore": ${scoreDataB.contentScore},
        "strengths": [
          "specific strength 1",
          "specific strength 2",
          "specific strength 3"
        ],
        "weaknesses": [
          "specific weakness 1",
          "specific weakness 2",
          "specific weakness 3"
        ]
      },
      "winner": "resumeA OR resumeB (whichever is better overall)",
      "reason": "A detailed explanation of why the winner is better",
      "improvementSuggestions": [
        "actionable suggestion 1 that applies to both resumes",
        "actionable suggestion 2 that applies to both resumes",
        "actionable suggestion 3 that applies to both resumes",
        "actionable suggestion 4 that applies to both resumes"
      ]
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
        const reportData = JSON.parse(jsonMatch[0]);
        
        // Clean up any potential issues with the response
        return {
          resumeA: {
            atsScore: reportData.resumeA.atsScore || scoreDataA.overallScore,
            keywordScore: reportData.resumeA.keywordScore || scoreDataA.keywordScore,
            formatScore: reportData.resumeA.formatScore || scoreDataA.formatScore,
            contentScore: reportData.resumeA.contentScore || scoreDataA.contentScore,
            strengths: reportData.resumeA.strengths || [
              "Good structure and organization",
              "Clear contact information",
              "Relevant education details"
            ],
            weaknesses: reportData.resumeA.weaknesses || [
              "Missing quantifiable achievements",
              "Could use more industry keywords",
              "Experience section needs more impact"
            ]
          },
          resumeB: {
            atsScore: reportData.resumeB.atsScore || scoreDataB.overallScore,
            keywordScore: reportData.resumeB.keywordScore || scoreDataB.keywordScore,
            formatScore: reportData.resumeB.formatScore || scoreDataB.formatScore,
            contentScore: reportData.resumeB.contentScore || scoreDataB.contentScore,
            strengths: reportData.resumeB.strengths || [
              "Strong use of action verbs",
              "Well-optimized keywords",
              "Good balance of technical and soft skills"
            ],
            weaknesses: reportData.resumeB.weaknesses || [
              "Format could be more ATS-friendly",
              "Some bullet points are too long",
              "Missing specific achievements"
            ]
          },
          winner: reportData.winner === "resumeB" ? "resumeB" : "resumeA",
          reason: reportData.reason || "This resume has better keyword optimization and more impactful content, making it more likely to pass ATS systems and impress hiring managers.",
          improvementSuggestions: reportData.improvementSuggestions || [
            "Add more industry-specific keywords to both resumes",
            "Quantify achievements with metrics where possible",
            "Keep bullet points concise and action-oriented",
            "Ensure consistent formatting throughout both documents"
          ]
        };
      }
    } catch (parseError) {
      console.error("Error parsing comparison report data:", parseError);
    }
    
    // Fallback with the ATS scores we already have
    return {
      resumeA: {
        atsScore: scoreDataA.overallScore,
        keywordScore: scoreDataA.keywordScore,
        formatScore: scoreDataA.formatScore,
        contentScore: scoreDataA.contentScore,
        strengths: [
          "Good structure and organization",
          "Clear contact information",
          "Relevant education details"
        ],
        weaknesses: [
          "Missing quantifiable achievements",
          "Could use more industry keywords",
          "Experience section needs more impact"
        ]
      },
      resumeB: {
        atsScore: scoreDataB.overallScore,
        keywordScore: scoreDataB.keywordScore,
        formatScore: scoreDataB.formatScore,
        contentScore: scoreDataB.contentScore,
        strengths: [
          "Strong use of action verbs",
          "Well-optimized keywords",
          "Good balance of technical and soft skills"
        ],
        weaknesses: [
          "Format could be more ATS-friendly",
          "Some bullet points are too long",
          "Missing specific achievements"
        ]
      },
      winner: scoreDataB.overallScore > scoreDataA.overallScore ? "resumeB" : "resumeA",
      reason: "This resume has better keyword optimization and more impactful content, making it more likely to pass ATS systems and impress hiring managers.",
      improvementSuggestions: [
        "Add more industry-specific keywords to both resumes",
        "Quantify achievements with metrics where possible",
        "Keep bullet points concise and action-oriented",
        "Ensure consistent formatting throughout both documents"
      ]
    };
  } catch (error) {
    console.error("Error generating comparison report:", error);
    throw error;
  }
};
