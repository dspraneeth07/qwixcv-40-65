
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
    
    Write a concise, professional paragraph that:
    1. Mentions years of experience (use 5+ if no context given)
    2. Highlights key skills and strengths
    3. States career goals and value proposition
    
    IMPORTANT: Keep the response to EXACTLY 4 lines MAXIMUM when viewed on a resume.
    Be direct and concise. Avoid unnecessary adjectives and filler phrases.
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
    
    // Return the text directly, or a fallback if it's empty (now shorter)
    return textResponse || `Results-driven ${jobTitle} with 5+ years of experience delivering innovative solutions. Skilled in problem-solving and collaboration, consistently exceeding targets while adapting to evolving requirements. Seeking to leverage my expertise in a challenging role that offers growth opportunities.`;
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
    
    Write a description that:
    1. Explains the purpose and functionality of the project
    2. Briefly highlights implementation approach or key technologies
    3. Mentions one quantifiable outcome or impact (user metrics, performance improvements, etc.)
    
    IMPORTANT: Keep the response to EXACTLY 4 lines MAXIMUM when viewed on a resume.
    DO NOT exceed 4 lines under any circumstances.
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
    
    // Return the text directly, or a fallback if it's empty (now shorter)
    return textResponse || `Developed ${projectTitle}, a solution that improved efficiency by 30%. Implemented best practices while overcoming technical challenges to deliver a high-quality product ahead of schedule.`;
  } catch (error) {
    console.error("Error getting AI project description:", error);
    throw error;
  }
};

/**
 * Get work experience description suggestion
 */
export const getAIExperienceDescription = async (jobTitle: string, companyName: string): Promise<string> => {
  const prompt = `
    You're a professional resume writer. Generate a concise work experience description for a ${jobTitle} position at ${companyName}.
    
    Write a description that:
    1. Describes key responsibilities relevant to the position
    2. Mentions specific technologies or methodologies used (if applicable)
    3. Highlights one measurable achievement or impact
    
    IMPORTANT: Keep the response to EXACTLY 4 lines MAXIMUM when viewed on a resume.
    DO NOT exceed 4 lines under any circumstances.
    DO NOT use bullet points.
    DO NOT include a title or any formatting.
    Return only the work experience description text.
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
    return textResponse || `Led cross-functional teams and implemented innovative solutions as a ${jobTitle} at ${companyName}, improving overall efficiency by 30%. Utilized industry best practices and cutting-edge technologies to solve complex problems, while consistently delivering projects on time and under budget.`;
  } catch (error) {
    console.error("Error getting AI experience description:", error);
    throw error;
  }
};
