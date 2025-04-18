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
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.error("Speech recognition not supported in this browser");
    return null;
  }
  
  // Use the appropriate implementation
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  return recognition;
};

// Types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
