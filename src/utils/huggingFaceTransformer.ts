
// This file acts as a transformer utility using Gemini API under the hood
// It provides a simple interface for text transformation and embeddings

import { toast } from "@/components/ui/use-toast";

export const transformText = async (text: string) => {
  try {
    console.log("Transforming text:", text);
    
    // In a production environment, we would send this to Hugging Face or another AI service
    // For our prototype, we're using the Gemini API behind the scenes
    
    // Use the Gemini API (this will be changed to Hugging Face in production)
    const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc"; // This is just a placeholder for demo
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text }]
          }]
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        return text; // Return original text if API fails
      }
  
      const data = await response.json();
      const transformedText = data.candidates[0].content.parts[0].text.trim();
      return transformedText || text;
    } catch (error) {
      console.error("Error calling AI service:", error);
      return text; // Return original text if there's an error
    }
  } catch (error) {
    console.error("Error in transformText:", error);
    return text; // Return original text if there's an error
  }
};

export const generateEmbedding = async (text: string) => {
  console.log("Generating embedding for:", text);
  // In a real implementation, this would return an actual embedding vector
  // For now, we'll return a mock embedding
  return new Float32Array(384).fill(0.1);
};

// New function for resume analysis
export const analyzeResume = async (resumeData: any, analysisType: 'general' | 'questions' = 'general') => {
  console.log(`Analyzing resume for ${analysisType} analysis:`, resumeData);
  
  const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  let prompt = '';
  
  if (analysisType === 'general') {
    prompt = `
      You are a professional resume analyst. Analyze the following resume data and provide feedback.
      
      Resume data:
      ${JSON.stringify(resumeData, null, 2)}
      
      Provide a comprehensive analysis focusing on strengths, weaknesses, and suggestions.
    `;
  } else {
    prompt = `
      You are an interview preparation expert. Generate interview questions and answers based on this resume.
      
      Resume data:
      ${JSON.stringify(resumeData, null, 2)}
      
      Provide 6-8 likely interview questions and suggested answers based on this resume.
    `;
  }
  
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
      console.error("API error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

// More advanced transformer functions would be added here in a production environment
