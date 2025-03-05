
const GEMINI_API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Makes a request to the Gemini API
 */
async function geminiRequest(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Gets AI skill suggestions based on job title
 */
export async function getAISkillSuggestions(jobTitle: string): Promise<{
  professional: string;
  technical: string;
  soft: string;
}> {
  try {
    const prompt = `Generate professional skills, technical skills, and soft skills for a ${jobTitle} position. 
    Format the response exactly in this JSON structure without any explanation or additional text:
    {
      "professional": "comma separated list of 5-7 professional skills",
      "technical": "comma separated list of 5-7 technical skills",
      "soft": "comma separated list of 5-7 soft skills"
    }`;

    const response = await geminiRequest(prompt);
    
    try {
      // Extract the JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const skills = JSON.parse(jsonMatch[0]);
        return {
          professional: skills.professional || "",
          technical: skills.technical || "",
          soft: skills.soft || ""
        };
      }
      throw new Error("Could not find valid JSON in response");
    } catch (jsonError) {
      console.error("Failed to parse JSON from API response:", jsonError);
      // Fallback to default skills
      return {
        professional: "Project Management, Team Collaboration, Strategy Development, Problem Solving, Quality Assurance",
        technical: "Microsoft Office, Google Workspace, Project Management Software, Basic Programming, Data Analysis",
        soft: "Communication, Leadership, Time Management, Adaptability, Critical Thinking"
      };
    }
  } catch (error) {
    console.error("Error generating AI skill suggestions:", error);
    // Fallback to default skills
    return {
      professional: "Project Management, Team Collaboration, Strategy Development, Problem Solving, Quality Assurance",
      technical: "Microsoft Office, Google Workspace, Project Management Software, Basic Programming, Data Analysis",
      soft: "Communication, Leadership, Time Management, Adaptability, Critical Thinking"
    };
  }
}

/**
 * Gets AI objective suggestion based on job title and name
 */
export async function getAIObjectiveSuggestion(jobTitle: string, firstName: string = "", lastName: string = ""): Promise<string> {
  try {
    const name = `${firstName} ${lastName}`.trim() || "Professional";
    
    const prompt = `Write a professional career objective for a ${jobTitle} named ${name}. 
    Keep it under 3 sentences and make it sound professional, focusing on their experience, skills, and goals.
    Do not include any explanations, just write the career objective paragraph.`;

    return await geminiRequest(prompt);
  } catch (error) {
    console.error("Error generating AI objective suggestion:", error);
    // Fallback to a default objective
    return `Dedicated ${jobTitle} with a passion for excellence and continuous improvement. Combining technical expertise with strong interpersonal skills to deliver outstanding results. Seeking to leverage my experience and skills in a challenging position where I can make meaningful contributions while continuing to grow professionally.`;
  }
}

/**
 * Gets AI project description based on title and technologies
 */
export async function getAIProjectDescription(title: string, technologies: string = ""): Promise<string> {
  if (!title) return "";
  
  try {
    const techPrompt = technologies ? ` using ${technologies}` : "";
    
    const prompt = `Write a professional project description for a software project titled "${title}"${techPrompt}.
    The description should be 3-4 sentences long, highlight the problem solved, technologies used, and key features.
    Do not include any explanations, just write the project description paragraph.`;

    return await geminiRequest(prompt);
  } catch (error) {
    console.error("Error generating AI project description:", error);
    // Fallback to a default description
    const techString = technologies ? ` using ${technologies}` : "";
    return `Developed ${title}${techString} to address specific user needs and business requirements. Followed best practices in software development to ensure code quality, maintainability, and scalability. Collaborated with stakeholders throughout the development process to gather requirements and deliver a solution that exceeds expectations.`;
  }
}
