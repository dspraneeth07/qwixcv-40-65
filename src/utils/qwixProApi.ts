
import { apiKeys } from "./apiKeys";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Generate content using the Gemini API for QwiX Pro Builder
 * @param prompt The prompt to send to the API
 * @returns The generated content
 */
export const generateQwiXProContent = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}?key=${apiKeys.GEMINI_API_KEY}`, {
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
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw error;
  }
};

/**
 * Generate professional profile content for QwiX Pro Builder
 * @param name User's name
 * @param role User's role
 * @param skills User's skills
 * @returns Generated professional profile
 */
export const generateProfessionalProfile = async (name: string, role: string, skills: string[]): Promise<string> => {
  const prompt = `
    Create a professional profile summary for ${name}, who works as a ${role}.
    Their key skills include: ${skills.join(', ')}.
    
    Write a concise, professional paragraph that:
    1. Highlights their expertise in their field
    2. Emphasizes their key skills
    3. Makes them stand out as a professional
    
    Keep the response under 200 words and make it compelling for professional networks.
  `;

  return generateQwiXProContent(prompt);
};

/**
 * Generate project description for QwiX Pro Builder
 * @param projectTitle Project title
 * @param technologies Technologies used
 * @param role User's role in the project
 * @returns Generated project description
 */
export const generateProjectDescription = async (
  projectTitle: string, 
  technologies: string[], 
  role: string
): Promise<string> => {
  const prompt = `
    Create a professional project description for a portfolio entry titled "${projectTitle}".
    Technologies used: ${technologies.join(', ')}.
    Role in the project: ${role}.
    
    Write a concise description that:
    1. Explains the project purpose and functionality
    2. Highlights technical challenges overcome
    3. Describes specific contributions and impact
    
    Keep the response under 150 words and focus on achievements and technical skills demonstrated.
  `;

  return generateQwiXProContent(prompt);
};

/**
 * Generate career advice for QwiX Pro Builder
 * @param currentRole User's current role
 * @param targetRole User's target role
 * @param yearsExperience User's years of experience
 * @returns Generated career advice
 */
export const generateCareerAdvice = async (
  currentRole: string,
  targetRole: string,
  yearsExperience: number
): Promise<string> => {
  const prompt = `
    Provide career development advice for a professional with ${yearsExperience} years of experience
    currently working as a ${currentRole} who wants to transition to becoming a ${targetRole}.
    
    Include:
    1. Specific skills they should develop
    2. Learning resources they might consider
    3. Professional networking suggestions
    4. Timeline expectations for the transition
    
    Keep the response practical, actionable, and under 250 words.
  `;

  return generateQwiXProContent(prompt);
};
