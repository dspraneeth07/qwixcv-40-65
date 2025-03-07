
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import * as THREE from "three";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    // Set renderer size to match container
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Create resume 3D object
    const resumeWidth = 2.1;
    const resumeHeight = 3;
    const resumeGeometry = new THREE.PlaneGeometry(resumeWidth, resumeHeight);
    
    // Create texture for resume
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 800;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      context.fillStyle = '#4f46e5';
      context.fillRect(0, 0, canvas.width, 120);
      
      // Name
      context.font = 'bold 36px Arial';
      context.fillStyle = '#ffffff';
      context.fillText('JOHN DOE', 50, 70);
      
      // Title
      context.font = '24px Arial';
      context.fillStyle = '#e5e7eb';
      context.fillText('SOFTWARE ENGINEER', 50, 100);
      
      // Contact info
      context.font = '16px Arial';
      context.fillStyle = '#4f46e5';
      context.fillText('john.doe@example.com | (123) 456-7890', 50, 150);
      
      // Content sections
      context.fillStyle = '#111827';
      context.font = 'bold 20px Arial';
      context.fillText('EXPERIENCE', 50, 200);
      
      context.fillStyle = '#374151';
      context.font = '16px Arial';
      context.fillText('Software Engineer at Tech Corp', 50, 230);
      context.font = '14px Arial';
      context.fillText('2020 - Present', 50, 250);
      
      // Lines for text content
      context.fillStyle = '#9ca3af';
      for (let i = 0; i < 5; i++) {
        context.fillRect(50, 280 + (i * 20), 400, 2);
      }
      
      // Education section
      context.fillStyle = '#111827';
      context.font = 'bold 20px Arial';
      context.fillText('EDUCATION', 50, 400);
      
      context.fillStyle = '#374151';
      context.font = '16px Arial';
      context.fillText('Bachelor of Science in Computer Science', 50, 430);
      context.font = '14px Arial';
      context.fillText('University of Technology - 2019', 50, 450);
      
      // Skills section
      context.fillStyle = '#111827';
      context.font = 'bold 20px Arial';
      context.fillText('SKILLS', 50, 500);
      
      // Skill boxes
      const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
      skills.forEach((skill, index) => {
        const x = 50 + (index % 3) * 150;
        const y = 530 + Math.floor(index / 3) * 40;
        
        context.fillStyle = '#e5e7eb';
        context.fillRect(x, y, 120, 30);
        
        context.fillStyle = '#111827';
        context.font = '14px Arial';
        context.fillText(skill, x + 10, y + 20);
      });
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Material with the resume texture
    const resumeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    
    // Create mesh and add to scene
    const resumeMesh = new THREE.Mesh(resumeGeometry, resumeMaterial);
    scene.add(resumeMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate resume slowly
      resumeMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      resumeMesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', updateSize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* 3D Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 z-0"></div>
      
      {/* Animated particles background */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute w-20 h-20 rounded-full bg-indigo-500 blur-xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-32 h-32 rounded-full bg-purple-500 blur-xl top-2/3 left-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-24 h-24 rounded-full bg-blue-500 blur-xl top-1/3 left-3/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-16 h-16 rounded-full bg-pink-500 blur-xl top-3/4 left-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container relative z-20 mx-auto flex flex-col lg:flex-row items-center h-full py-20">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 animate-fade-in">
            AI-Enhanced Resumes, Built for Success
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-indigo-100 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Our AI-powered resume builder crafts ATS-optimized professional resumes 
            that help you stand out and land interviews faster. Built with cutting-edge technology.
          </p>
          
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-xl text-lg px-8 py-3 hover:scale-105 transform"
            >
              <Link to="/builder">
                Build Your Resume
              </Link>
            </Button>
          </div>
        </div>
        
        <div ref={containerRef} className="w-full lg:w-1/2 h-[400px] lg:h-[500px] relative">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
      </div>
      
      {/* Glassmorphism cards floating in background */}
      <div className="absolute bottom-10 right-10 w-64 h-40 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl animate-float z-10"></div>
      <div className="absolute top-20 right-20 w-48 h-48 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl animate-float z-10" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default HeroSection;
