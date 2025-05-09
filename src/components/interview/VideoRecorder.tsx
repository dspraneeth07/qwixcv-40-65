
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
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Initialize camera or set playback video
  useEffect(() => {
    if (isPlaybackOnly && videoURL) {
      // In playback mode, just set the video source
      if (videoRef.current) {
        videoRef.current.src = videoURL;
        setIsVideoReady(true);
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
      // Stop any existing stream first to prevent multiple instances
      stopCamera();
      
      const constraints = { 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { max: 30 } // Increased frame rate for smoother video
        },
        audio: true // Always include audio to ensure it's available for recording
      };
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted!", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraEnabled(true);
        setIsVideoReady(true);
        
        // Double-check that video is actually showing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => console.log("Video playback started"))
              .catch(e => {
                console.error("Error playing video:", e);
                setError("Error starting video playback");
              });
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check your permissions and make sure no other app is using your camera.");
      setCameraEnabled(false);
      setIsVideoReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Track ${track.kind} stopped`);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      setIsVideoReady(false);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.error("No stream available for recording");
      setError("No camera stream available. Please enable your camera.");
      return;
    }
    
    try {
      chunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      
      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available from recorder", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing video...");
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        onVideoRecorded(videoBlob);
        console.log("Video blob created and passed to parent component", videoBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Error starting video recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped manually");
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
        <Alert variant="destructive" className="absolute top-2 left-2 right-2 z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!isVideoReady && !isPlaybackOnly && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white z-10">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={!isPlaybackOnly}
        controls={isPlaybackOnly}
        className={`w-full h-full object-cover ${isVideoReady ? 'opacity-100' : 'opacity-0'} ${isPlaybackOnly ? 'bg-black' : ''}`}
      />
      
      {!isPlaybackOnly && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/60 rounded-full px-4 py-2 z-20">
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
              className="rounded-full animate-pulse"
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </div>
      )}
      
      {isPlaybackOnly && videoURL && (
        <Button 
          className="absolute bottom-3 right-3 z-20"
          size="sm" 
          variant="secondary"
          onClick={downloadVideo}
        >
          <Download className="mr-1 h-4 w-4" /> Download
        </Button>
      )}

      {/* Camera troubleshooting button */}
      {!isVideoReady && !isPlaybackOnly && (
        <Button
          className="absolute top-3 right-3 z-20"
          size="sm"
          variant="outline"
          onClick={() => startCamera()}
        >
          Retry Camera
        </Button>
      )}
    </div>
  );
};

export default VideoRecorder;
