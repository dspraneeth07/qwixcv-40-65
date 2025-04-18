
// This file stores API keys that are already known to the application
// In a production app, these would be stored securely in environment variables

// Gemini API key (if provided in the past)
export const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

// Function to update Gemini API key at runtime
export const updateGeminiApiKey = (key: string): void => {
  localStorage.setItem('gemini_api_key', key);
};

// Function to get Gemini API key
export const getGeminiApiKey = (): string => {
  const storedKey = localStorage.getItem('gemini_api_key');
  return storedKey || GEMINI_API_KEY;
};

// Check if Gemini API key is set
export const hasGeminiApiKey = (): boolean => {
  const key = getGeminiApiKey();
  return key !== 'YOUR_GEMINI_API_KEY' && key !== '';
};
