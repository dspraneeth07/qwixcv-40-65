
// This file contains API functions to interact with Google's Gemini API

const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Get skill suggestions based on job title
 */
export const getAISkillSuggestions = async (jobTitle: string): Promise<{ professional: string; technical: string; soft: string }> => {
  const prompt = `
    You're a professional resume writer. Generate skills for a ${jobTitle} resume.
    I need three types of skills:
    1. Professional skills - skills related to job management and domain expertise
    2. Technical skills - specific tools, technologies, and platforms
    3. Soft skills - interpersonal and character traits
    
    Return only the skills as a JSON object with three properties: professional, technical, and soft.
    Each property should be a comma-separated list of 5-8 relevant skills.
    DO NOT include any additional text, explanations or formatting.
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
    
    // Extract the JSON from the response
    try {
      // The response might contain markdown code blocks, so we need to extract just the JSON
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const skills = JSON.parse(jsonMatch[0]);
        return {
          professional: skills.professional || "Project Management, Time Management, Documentation, Business Analysis, Strategic Planning",
          technical: skills.technical || "HTML, CSS, JavaScript, React, TypeScript, Git, REST APIs, GraphQL",
          soft: skills.soft || "Communication, Teamwork, Problem Solving, Adaptability, Time Management, Leadership"
        };
      }
    } catch (parseError) {
      console.error("Error parsing skills JSON:", parseError);
    }
    
    // Fallback values in case the parsing fails
    return {
      professional: "Project Management, Time Management, Documentation, Business Analysis, Strategic Planning",
      technical: "HTML, CSS, JavaScript, React, TypeScript, Git, REST APIs, GraphQL",
      soft: "Communication, Teamwork, Problem Solving, Adaptability, Time Management, Leadership"
    };
  } catch (error) {
    console.error("Error getting AI skill suggestions:", error);
    throw error;
  }
};

/**
 * Get career objective suggestion
 */
export const getAIObjectiveSuggestion = async (jobTitle: string, firstName: string, lastName: string): Promise<string> => {
  const name = firstName && lastName ? `${firstName} ${lastName}` : "a professional";
  
  const prompt = `
    You're a professional resume writer. Generate a compelling career objective for ${name}'s resume.
    The objective is for a ${jobTitle} position.
    
    Write a concise, professional paragraph (3-4 sentences) that:
    1. Mentions years of experience (use 5+ if no context given)
    2. Highlights key skills and strengths
    3. States career goals and value proposition
    4. Includes relevant keywords for ATS systems
    
    DO NOT use bullet points.
    DO NOT include a title or any formatting.
    Return only the career objective text.
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
    const textResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Return the text directly, or a fallback if it's empty
    return textResponse || `Results-driven ${jobTitle} with 5+ years of experience delivering innovative solutions in fast-paced environments. Adept at leveraging technical expertise and collaborative skills to exceed project objectives and drive business growth. Seeking to contribute my knowledge and passion to a forward-thinking organization while continuing to expand my skillset and take on new challenges.`;
  } catch (error) {
    console.error("Error getting AI objective suggestion:", error);
    throw error;
  }
};

/**
 * Get project description suggestion
 */
export const getAIProjectDescription = async (projectTitle: string, technologies?: string): Promise<string> => {
  const tech = technologies ? `using technologies like ${technologies}` : "";
  
  const prompt = `
    You're a professional resume writer. Generate a concise project description for a resume project titled "${projectTitle}" ${tech}.
    
    Write 2-3 sentences that:
    1. Explain the purpose and functionality of the project
    2. Highlight the implementation approach and challenges overcome
    3. Mention quantifiable outcomes or impacts (user metrics, performance improvements, etc.)
    4. Include relevant technical keywords
    
    DO NOT use bullet points.
    DO NOT include a title or any formatting.
    Return only the project description text.
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
    const textResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Return the text directly, or a fallback if it's empty
    return textResponse || `Developed ${projectTitle}, a scalable solution that improved operational efficiency by 30%. Implemented industry best practices and innovative approaches to overcome technical challenges while maintaining code quality and performance. The project received positive user feedback and was completed ahead of schedule.`;
  } catch (error) {
    console.error("Error getting AI project description:", error);
    throw error;
  }
};
