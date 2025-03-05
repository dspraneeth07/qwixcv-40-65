
// This file contains API functions to interact with Google's Gemini API

const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Get skill suggestions based on job title
 */
export const getAISkillSuggestions = async (jobTitle: string): Promise<{ professional: string; technical: string; soft: string }> => {
  const prompt = `
    Generate skills for a ${jobTitle} resume.
    I need three types of skills:
    1. Professional skills
    2. Technical skills
    3. Soft skills
    
    Return only the skills as a JSON object with three properties: professional, technical, and soft.
    Each property should be a comma-separated list of skills.
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
          professional: skills.professional || "Project Management, Time Management, Documentation",
          technical: skills.technical || "HTML, CSS, JavaScript, React",
          soft: skills.soft || "Communication, Teamwork, Problem Solving"
        };
      }
    } catch (parseError) {
      console.error("Error parsing skills JSON:", parseError);
    }
    
    // Fallback values in case the parsing fails
    return {
      professional: "Project Management, Time Management, Documentation",
      technical: "HTML, CSS, JavaScript, React",
      soft: "Communication, Teamwork, Problem Solving"
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
    Generate a professional career objective for ${name}'s resume.
    The career objective is for a ${jobTitle} position.
    Write a concise, professional paragraph (3-4 sentences) that highlights career goals and value proposition.
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
    return textResponse || `Dedicated ${jobTitle} with a passion for delivering high-quality solutions. Seeking to leverage my technical expertise and collaborative skills to contribute to innovative projects while continuously expanding my knowledge in the field.`;
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
    Generate a concise project description for a resume project titled "${projectTitle}" ${tech}.
    Write 2-3 sentences that highlight the purpose of the project, the implementation approach, and the outcome or impact.
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
    return textResponse || `Developed ${projectTitle} to solve real-world problems with efficient and scalable solutions. Implemented best practices in software development to ensure high performance and maintainability.`;
  } catch (error) {
    console.error("Error getting AI project description:", error);
    throw error;
  }
};
