
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Download, AlertCircle, Video, VideoOff, Play, Pause } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [hasUserMedia, setHasUserMedia] = useState(false);

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
      
      // First check if user media is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported by your browser");
      }
      
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
        setHasUserMedia(true);
        
        // Double-check that video is actually showing
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          setIsVideoReady(true);
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playback started");
                // Force browser to show the video
                setTimeout(() => {
                  if (videoRef.current) {
                    const currentDisplay = videoRef.current.style.display;
                    videoRef.current.style.display = 'none';
                    // Force a reflow
                    void videoRef.current.offsetHeight;
                    videoRef.current.style.display = currentDisplay;
                  }
                }, 100);
              })
              .catch(e => {
                console.error("Error playing video:", e);
                setError("Error starting video playback. Please try reloading the page.");
              });
          }
        };
        
        // Add error handler for video element
        videoRef.current.onerror = (e) => {
          console.error("Video element error:", e);
          setError("Error with video display. Please check your camera permissions.");
        };
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      const errorMessage = err.name === 'NotAllowedError' 
        ? "Camera access denied. Please allow camera access in your browser settings."
        : err.name === 'NotFoundError'
          ? "No camera found. Please connect a camera and try again."
          : "Unable to access camera. Please check your permissions and make sure no other app is using your camera.";
      
      setError(errorMessage);
      setCameraEnabled(false);
      setIsVideoReady(false);
      setHasUserMedia(false);
      
      // Show toast for better visibility
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
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
      setHasUserMedia(false);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.error("No stream available for recording");
      setError("No camera stream available. Please enable your camera.");
      toast({
        title: "Recording Error",
        description: "No camera stream available. Please enable your camera.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      chunksRef.current = [];
      // Try multiple mime types for better browser compatibility
      let options;
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          options = { mimeType };
          console.log(`Using supported MIME type: ${mimeType}`);
          break;
        }
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      
      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available from recorder", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing video...");
        if (chunksRef.current.length === 0) {
          console.error("No data recorded");
          toast({
            title: "Recording Error",
            description: "No data was recorded. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        const videoBlob = new Blob(chunksRef.current, { type: options?.mimeType || 'video/webm' });
        console.log("Video blob created:", videoBlob);
        
        // Create a URL for the blob to verify it's valid
        try {
          const testURL = URL.createObjectURL(videoBlob);
          URL.revokeObjectURL(testURL); // Clean up
        } catch (e) {
          console.error("Failed to create blob URL:", e);
          toast({
            title: "Recording Error",
            description: "Failed to process recorded video. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        onVideoRecorded(videoBlob);
        toast({
          title: "Recording Complete",
          description: "Your video has been successfully recorded.",
        });
        console.log("Video blob created and passed to parent component", videoBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Capture data every second for more reliable recording
      setIsRecording(true);
      console.log("Recording started");
      
      toast({
        title: "Recording Started",
        description: "Your response is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Error starting video recording. Please try again or use a different browser.");
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your browser's permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log("Recording stopped manually");
      } catch (e) {
        console.error("Error stopping recording:", e);
        setError("Error stopping recording. Your video might not be saved correctly.");
      }
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
          <AlertTitle>Camera Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!isVideoReady && !isPlaybackOnly && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white z-10">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
            <p>Initializing camera...</p>
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={() => startCamera()}
            >
              Retry Camera Access
            </Button>
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
        style={{ backgroundColor: '#000' }} // Ensure black background for better visibility
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
          
          {cameraEnabled && hasUserMedia && !isRecording && (
            <Button 
              size="sm" 
              variant="default" 
              className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              onClick={startRecording}
            >
              <Video className="h-4 w-4 mr-1" />
              Record
            </Button>
          )}
          
          {isRecording && (
            <Button 
              size="sm" 
              variant="destructive" 
              className="rounded-full animate-pulse"
              onClick={stopRecording}
            >
              <Pause className="h-4 w-4 mr-1" />
              Stop
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
      {!hasUserMedia && !isPlaybackOnly && (
        <Button
          className="absolute top-3 right-3 z-20"
          size="sm"
          variant="outline"
          onClick={() => startCamera()}
        >
          <Play className="mr-1 h-4 w-4" /> Enable Camera
        </Button>
      )}
    </div>
  );
};

export default VideoRecorder;
