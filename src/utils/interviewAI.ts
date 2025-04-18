
import { InterviewSettings } from '@/components/interview/InterviewSetup';
import { InterviewMessage } from '@/types/interview';

// Analyze resume and generate questions based on the resume and job details
export const analyzeResumeAndGenerateQuestions = async (
  settings: InterviewSettings,
  apiKey: string
): Promise<string[]> => {
  try {
    console.log('Analyzing resume and generating questions...');
    
    // Prepare prompt for Gemini
    const prompt = `
    You're an AI interview coach conducting a job interview. 
    I'm applying for: ${settings.jobTitle} (${settings.jobLevel} level).
    This is a ${settings.duration} minute interview.
    
    Here is my resume:
    ${settings.resumeText}
    
    Based on my resume and the job I'm applying for:
    1. Generate 8-10 thoughtful interview questions that are specifically tailored to my background, skills, and the job requirements.
    2. Include a mix of behavioral, technical, and situational questions relevant to the position.
    3. Focus on my experience and skills mentioned in the resume.
    4. Include questions about specific projects or achievements mentioned in my resume.
    5. ONLY return the list of questions, with each question on its own line.
    6. Do not include any other text, explanations, or numbering.
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the questions from the response
    const text = data.candidates[0].content.parts[0].text.trim();
    
    // Split by newlines and filter out empty strings
    const questions = text.split('\n').filter(q => q.trim() !== '');
    
    return questions;
    
  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    // Return fallback questions if the API fails
    return [
      "Can you walk me through your background and experience?",
      "What makes you interested in this position?",
      "Tell me about a challenging project you worked on.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "What are your greatest strengths related to this role?",
      "Where do you see yourself professionally in 5 years?",
      "Describe a situation where you had to learn something new quickly.",
      "How do you handle feedback or criticism?"
    ];
  }
};

// Evaluate user's answer and provide feedback
export const evaluateAnswer = async (
  question: string,
  answer: string,
  jobTitle: string,
  jobLevel: string,
  apiKey: string
): Promise<string> => {
  try {
    console.log('Evaluating answer...');
    
    // Prepare prompt for Gemini
    const prompt = `
    You're an AI interview coach conducting a job interview for a ${jobLevel} level ${jobTitle} position.
    
    The question was: "${question}"
    
    The candidate's answer was: "${answer}"
    
    Please analyze the answer and provide constructive feedback:
    1. Identify strengths in the answer 
    2. Suggest improvements
    3. If needed, provide example statements that would make the answer stronger
    
    Keep your response concise, friendly, and focused on helping the candidate improve.
    Remain supportive and encouraging while providing honest evaluation.
    Speak directly to the candidate using "you" language.
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const feedback = data.candidates[0].content.parts[0].text.trim();
    
    return feedback;
    
  } catch (error) {
    console.error('Error evaluating answer:', error);
    
    // Return a generic response if the API fails
    return "That's an interesting response. As we continue, try to provide specific examples and quantify your achievements when possible. Let's move to the next question.";
  }
};

// Generate a summary of the interview
export const generateInterviewSummary = async (
  messages: InterviewMessage[],
  jobTitle: string,
  jobLevel: string,
  apiKey: string
): Promise<string> => {
  try {
    console.log('Generating interview summary...');
    
    // Extract the conversation
    const conversation = messages
      .map(msg => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
      .join('\n\n');
    
    // Prepare prompt for Gemini
    const prompt = `
    You're an AI interview coach that just conducted a job interview for a ${jobLevel} level ${jobTitle} position.
    
    Here is the interview transcript:
    ${conversation}
    
    Based on this interview, please provide:
    1. A brief summary of the candidate's performance (2-3 sentences)
    2. 3 key strengths demonstrated in the interview
    3. 2 areas for improvement with specific advice
    4. Overall assessment and preparation advice
    
    Format your response in a professional, constructive manner. Focus on being helpful and actionable.
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text.trim();
    
    return summary;
    
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Return a generic summary if the API fails
    return `
    # Interview Summary
    
    You demonstrated good communication skills and provided relevant examples from your experience. Your answers showed enthusiasm for the ${jobTitle} position.
    
    ## Strengths
    - Clear communication style
    - Good examples from past experience
    - Strong understanding of the role
    
    ## Areas for Improvement
    - Provide more specific, quantifiable achievements
    - Structure answers using the STAR method (Situation, Task, Action, Result)
    
    ## Overall Assessment
    You're on the right track! Continue practicing structured responses and researching the company more deeply before your actual interviews.
    `;
  }
};
