
// Speech synthesis utility functions

// Initialize speech synthesis
export const initSpeechSynthesis = () => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported in this browser");
    return null;
  }
  return window.speechSynthesis;
};

// Get available voices
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};

// Get the best voice for interviews (prefer natural-sounding, professional voices)
export const getBestInterviewVoice = (): SpeechSynthesisVoice | null => {
  const voices = getVoices();
  if (voices.length === 0) return null;
  
  // First, look for premium voices that tend to sound more natural
  const premiumVoiceKeywords = ['premium', 'enhanced', 'neural', 'wavenet', 'studio'];
  for (const keyword of premiumVoiceKeywords) {
    const premiumVoice = voices.find(
      v => v.name.toLowerCase().includes(keyword) && v.lang.startsWith('en')
    );
    if (premiumVoice) return premiumVoice;
  }
  
  // Then look for specific voice names that are known to be good
  const preferredVoiceNames = [
    'Google UK English Female', 
    'Microsoft Jessa', 
    'Microsoft Guy',
    'Samantha', // MacOS
    'Alex',     // MacOS
    'Daniel'    // UK English
  ];
  
  for (const name of preferredVoiceNames) {
    const voice = voices.find(v => v.name === name);
    if (voice) return voice;
  }
  
  // Otherwise, just get any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;
  
  // Fallback to first available voice
  return voices[0];
};

// Speak text with specified parameters
export const speakText = (
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void, 
  voice?: SpeechSynthesisVoice | null
): void => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    return;
  }
  
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice
  if (voice) {
    utterance.voice = voice;
  } else {
    const bestVoice = getBestInterviewVoice();
    if (bestVoice) utterance.voice = bestVoice;
  }
  
  // Configure properties for natural speech
  utterance.rate = 1.0;  // Normal speed
  utterance.pitch = 1.0; // Normal pitch
  utterance.volume = 1.0; // Full volume
  
  // Set callbacks
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  
  // Handle errors
  utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event.error);
    if (onEnd) onEnd();
  };
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Speech recognition utility functions

// Initialize speech recognition
export const initSpeechRecognition = () => {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    console.error("Speech recognition not supported in this browser");
    return null;
  }
  
  // Use the appropriate implementation
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();
  
  // Configure recognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  return recognition;
};

// Analyze speech for tone, pace, and filler words
export const analyzeSpeech = (text: string): {
  paceScore: number;
  toneScore: number;
  fillerWordCount: number;
  fillerWords: string[];
  suggestions: string[];
} => {
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of'];
  const lowConfidenceWords = ['maybe', 'perhaps', 'i think', 'i guess', 'not sure', 'if possible'];
  
  // Count filler words
  const fillerWordMatches: string[] = [];
  let fillerWordCount = 0;
  
  fillerWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) {
      fillerWordCount += matches.length;
      fillerWordMatches.push(`"${word}" (${matches.length}x)`);
    }
  });
  
  // Check for confidence indicators
  let confidenceScore = 100;
  lowConfidenceWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) {
      confidenceScore -= matches.length * 5; // Reduce 5 points per low confidence phrase
    }
  });
  
  // Analyze pace (word count per sentence)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const wordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // Score pace (ideal is 10-20 words per sentence)
  let paceScore = 100;
  if (wordsPerSentence > 25) {
    paceScore = Math.max(50, 100 - (wordsPerSentence - 25) * 5);
  } else if (wordsPerSentence < 5) {
    paceScore = Math.max(50, 100 - (5 - wordsPerSentence) * 10);
  }
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (fillerWordCount > 3) {
    suggestions.push(`Try to reduce filler words like ${fillerWordMatches.slice(0, 3).join(', ')}.`);
  }
  
  if (confidenceScore < 80) {
    suggestions.push("Use more confident language by avoiding phrases like 'I think' or 'maybe'.");
  }
  
  if (wordsPerSentence > 25) {
    suggestions.push("Try using shorter, more concise sentences for clarity.");
  } else if (wordsPerSentence < 5) {
    suggestions.push("Consider providing more detailed answers with fuller sentences.");
  }
  
  return {
    paceScore: Math.min(100, Math.max(0, paceScore)),
    toneScore: Math.min(100, Math.max(0, confidenceScore)),
    fillerWordCount,
    fillerWords: fillerWordMatches,
    suggestions
  };
};

// Types for TypeScript - moved to global.d.ts
