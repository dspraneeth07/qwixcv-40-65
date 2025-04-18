
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SpeechControllerProps {
  isInterviewStarted: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
}

const SpeechController = ({
  isInterviewStarted,
  isSpeaking,
  isListening,
  onStartListening,
  onStopListening,
  onToggleSpeech
}: SpeechControllerProps) => {
  const [isMicSupported, setIsMicSupported] = useState(true);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  
  useEffect(() => {
    // Check for microphone support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsMicSupported(false);
    }
    
    // Check for speech synthesis support
    if (!window.speechSynthesis) {
      setIsSpeechSupported(false);
    }
  }, []);
  
  if (!isInterviewStarted) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3 border-t bg-background">
      <div className="flex items-center gap-2">
        {isListening && (
          <Badge variant="default" className="bg-red-500 animate-pulse">
            Listening...
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleSpeech}
                disabled={!isSpeechSupported}
              >
                {isSpeaking ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSpeaking ? "Mute voice" : "Unmute voice"}
              {!isSpeechSupported && " (Not supported in your browser)"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                onClick={isListening ? onStopListening : onStartListening}
                disabled={!isMicSupported}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isListening ? "Stop microphone" : "Start microphone"}
              {!isMicSupported && " (Not supported in your browser)"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SpeechController;
