
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoRecorderProps {
  isActive: boolean;
  onVideoRecorded: (videoBlob: Blob) => void;
  videoURL?: string;
  isPlaybackOnly?: boolean;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  isActive, 
  onVideoRecorded,
  videoURL,
  isPlaybackOnly = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // Initialize camera or set playback video
  useEffect(() => {
    if (isPlaybackOnly && videoURL) {
      // In playback mode, just set the video source
      if (videoRef.current) {
        videoRef.current.src = videoURL;
      }
      return;
    }

    if (isActive && cameraEnabled && !isPlaybackOnly) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, cameraEnabled, isPlaybackOnly, videoURL]);

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = { 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { max: 24 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraEnabled(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check your permissions.");
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      onVideoRecorded(videoBlob);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCamera = () => {
    if (cameraEnabled) {
      stopCamera();
      setCameraEnabled(false);
    } else {
      startCamera();
    }
  };

  const downloadVideo = () => {
    if (!videoURL) return;
    
    const a = document.createElement('a');
    a.href = videoURL;
    a.download = `interview-recording-${new Date().toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative rounded-md overflow-hidden bg-gray-100 w-full h-full min-h-[240px] flex items-center justify-center">
      {error && (
        <Alert variant="destructive" className="absolute top-2 left-2 right-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        muted={!isPlaybackOnly}
        playsInline
        controls={isPlaybackOnly}
        className={`w-full h-full object-cover ${isPlaybackOnly ? 'bg-black' : ''}`}
      />
      
      {!isPlaybackOnly && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/60 rounded-full px-4 py-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={toggleCamera}
          >
            {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          </Button>
          
          {cameraEnabled && !isRecording && (
            <Button 
              size="sm" 
              variant="default" 
              className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              onClick={startRecording}
            >
              Start Recording
            </Button>
          )}
          
          {isRecording && (
            <Button 
              size="sm" 
              variant="destructive" 
              className="rounded-full"
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </div>
      )}
      
      {isPlaybackOnly && videoURL && (
        <Button 
          className="absolute bottom-3 right-3"
          size="sm" 
          variant="secondary"
          onClick={downloadVideo}
        >
          <Download className="mr-1 h-4 w-4" /> Download
        </Button>
      )}
    </div>
  );
};

export default VideoRecorder;
