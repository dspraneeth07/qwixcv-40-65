
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle, Target, FileText, Key, Layout } from "lucide-react";
import { ATSScoreData } from "@/utils/atsScoreApi";
import * as THREE from "three";

export interface ATSScoreDisplayProps {
  scoreData: ATSScoreData | null;
  isLoading: boolean;
}

// 3D Speedometer for the ATS score
const ATSScoreGauge = ({ score }: { score: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(200, 200);
    
    // Create the gauge background
    const gaugeGeometry = new THREE.RingGeometry(0.6, 0.8, 64);
    const gaugeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333,
      side: THREE.DoubleSide
    });
    const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
    scene.add(gauge);
    
    // Create the gauge progress indicator
    const scoreRatio = score / 100;
    const progressGeometry = new THREE.RingGeometry(0.6, 0.8, 64, 1, 0, scoreRatio * Math.PI * 2);
    
    // Determine color based on score
    let color;
    if (score >= 80) color = 0x22c55e; // Green
    else if (score >= 60) color = 0xf59e0b; // Amber
    else color = 0xef4444; // Red
    
    const progressMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      side: THREE.DoubleSide
    });
    const progress = new THREE.Mesh(progressGeometry, progressMaterial);
    scene.add(progress);
    
    // Add needle
    const needleGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.01);
    const needleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.y = 0.2;
    scene.add(needle);
    
    // Animate the needle to point to the score
    const targetRotation = -Math.PI / 2 + (scoreRatio * Math.PI);
    let currentRotation = -Math.PI / 2;
    
    // Position camera
    camera.position.z = 2;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smoothly animate needle rotation
      const rotationDiff = targetRotation - currentRotation;
      currentRotation += rotationDiff * 0.05;
      
      needle.rotation.z = currentRotation;
      gauge.rotation.z = -Math.PI / 2;
      progress.rotation.z = -Math.PI / 2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      renderer.dispose();
    };
  }, [score]);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[200px] h-[200px]">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="block text-4xl font-bold">{score}</span>
            <span className="text-gray-400 text-sm">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ATSScoreDisplay = ({ scoreData, isLoading }: ATSScoreDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-white">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Analyzing your resume...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) {
    return (
      <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-white">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">Complete your resume to see ATS analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="border shadow-sm h-full bg-black/20 backdrop-blur-lg border-white/10 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-white">
          <Target className="mr-2 h-5 w-5 text-blue-500" />
          ATS Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-6">
            {/* 3D Speedometer */}
            <ATSScoreGauge score={scoreData.overallScore} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center">
                    <Key className="h-3 w-3 mr-1 text-blue-400" /> Keywords
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.keywordScore)}`}>
                    {scoreData.keywordScore}%
                  </span>
                </div>
                <Progress value={scoreData.keywordScore} className="h-1.5" style={{ 
                  '--progress-background': getProgressColor(scoreData.keywordScore) 
                } as React.CSSProperties} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center">
                    <Layout className="h-3 w-3 mr-1 text-purple-400" /> Format
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.formatScore)}`}>
                    {scoreData.formatScore}%
                  </span>
                </div>
                <Progress value={scoreData.formatScore} className="h-1.5" style={{ 
                  '--progress-background': getProgressColor(scoreData.formatScore) 
                } as React.CSSProperties} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-1 text-emerald-400" /> Content
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.contentScore)}`}>
                    {scoreData.contentScore}%
                  </span>
                </div>
                <Progress value={scoreData.contentScore} className="h-1.5" style={{ 
                  '--progress-background': getProgressColor(scoreData.contentScore) 
                } as React.CSSProperties} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            Improvement Suggestions:
          </h3>
          <ul className="space-y-2">
            {scoreData.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm flex items-start gap-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-102 transform">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Best Job Match:
          </h3>
          <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <p className="text-sm text-gray-300">{scoreData.jobMatch}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
