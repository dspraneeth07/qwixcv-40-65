
// Speech synthesis utility functions

// Initialize speech synthesis with caching
let _speechSynthesis: SpeechSynthesis | null = null;
let _voices: SpeechSynthesisVoice[] = [];

// Initialize speech synthesis
export const initSpeechSynthesis = (): SpeechSynthesis | null => {
  if (_speechSynthesis) return _speechSynthesis;
  
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported in this browser");
    return null;
  }
  
  _speechSynthesis = window.speechSynthesis;
  return _speechSynthesis;
};

// Get available voices with caching
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (_voices.length > 0) return _voices;
  
  if (!window.speechSynthesis) return [];
  
  _voices = window.speechSynthesis.getVoices();
  
  // If voices are not available yet, set up an event listener
  if (_voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      _voices = window.speechSynthesis.getVoices();
    };
  }
  
  return _voices;
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

// Speak text with specified parameters and better error handling
export const speakText = (
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void, 
  voice?: SpeechSynthesisVoice | null,
  rate: number = 1.0
): void => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    if (onEnd) onEnd();
    return;
  }
  
  // Split long text into chunks if needed for better browser compatibility
  const maxChunkLength = 150; // Maximum chunk length for reliable speech
  const chunks = splitTextIntoChunks(text, maxChunkLength);
  
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  // Process all chunks sequentially
  let chunkIndex = 0;
  
  const speakNextChunk = () => {
    if (chunkIndex >= chunks.length) {
      if (onEnd) onEnd();
      return;
    }
    
    // Create utterance for current chunk
    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    
    // Set voice
    if (voice) {
      utterance.voice = voice;
    } else {
      const bestVoice = getBestInterviewVoice();
      if (bestVoice) utterance.voice = bestVoice;
    }
    
    // Configure properties for natural speech
    utterance.rate = rate;  // Speed
    utterance.pitch = 1.0;  // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Set callbacks
    if (chunkIndex === 0 && onStart) utterance.onstart = onStart;
    
    // Move to next chunk when done
    utterance.onend = () => {
      chunkIndex++;
      speakNextChunk();
    };
    
    // Handle errors
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      chunkIndex++;
      speakNextChunk();
    };
    
    // Start speaking the chunk
    window.speechSynthesis.speak(utterance);
  };
  
  // Start the first chunk
  speakNextChunk();
};

// Split text into chunks at sentence boundaries for better speech synthesis
function splitTextIntoChunks(text: string, maxChunkLength: number): string[] {
  // First, split by natural sentence boundaries
  const sentenceBreaks = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentenceBreaks) {
    // If adding this sentence would exceed the max length, start a new chunk
    if (currentChunk.length + sentence.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Initialize speech recognition with caching
let _speechRecognition: SpeechRecognition | null = null;

// Initialize speech recognition
export const initSpeechRecognition = () => {
  if (_speechRecognition) return _speechRecognition;
  
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
  
  _speechRecognition = recognition;
  return recognition;
};

// Analyze speech for tone, pace, and filler words with enhanced algorithms
export const analyzeSpeech = (text: string): {
  paceScore: number;
  toneScore: number;
  fillerWordCount: number;
  fillerWords: string[];
  suggestions: string[];
} => {
  // Extended filler words list
  const fillerWords = [
    'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 
    'sort of', 'kind of', 'so', 'well', 'i mean', 'right', 'okay', 'uhm'
  ];
  
  const lowConfidenceWords = [
    'maybe', 'perhaps', 'i think', 'i guess', 'not sure', 'if possible',
    'might be', 'could be', 'probably', 'i feel like', 'i\'m not an expert',
    'i don\'t know'
  ];
  
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
      // More severe penalty for more occurrences
      confidenceScore -= Math.min(40, matches.length * 5); // Cap the maximum deduction
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
  
  // Check for repeated words (could indicate nervousness)
  const wordFrequency: Record<string, number> = {};
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  words.forEach(word => {
    if (word.length > 3) { // Only count meaningful words
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  const repeatedWords = Object.entries(wordFrequency)
    .filter(([word, count]) => count > 3 && !fillerWords.includes(word))
    .map(([word, count]) => `"${word}" (${count}x)`);
  
  if (repeatedWords.length > 2) {
    confidenceScore -= Math.min(15, repeatedWords.length * 3);
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
  
  if (repeatedWords.length > 2) {
    suggestions.push(`Watch for repetition of words like ${repeatedWords.slice(0, 2).join(', ')}.`);
  }
  
  return {
    paceScore: Math.min(100, Math.max(0, paceScore)),
    toneScore: Math.min(100, Math.max(0, confidenceScore)),
    fillerWordCount,
    fillerWords: fillerWordMatches,
    suggestions
  };
};
