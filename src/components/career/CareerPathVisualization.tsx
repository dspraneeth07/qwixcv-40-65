
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { CareerPath, CareerNode } from "@/types/career";

interface CareerPathVisualizationProps {
  path: CareerPath;
  onRoleSelect: (role: CareerNode) => void;
}

export const CareerPathVisualization = ({ path, onRoleSelect }: CareerPathVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; } | null>(null);
  const [tooltipContent, setTooltipContent] = useState<CareerNode | null>(null);

  useEffect(() => {
    if (!containerRef.current || !path.nodes) return;

    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Add a point light for glow effect
    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Career path visualization objects
    const nodes: THREE.Mesh[] = [];
    const nodeObjects: { node: CareerNode, mesh: THREE.Mesh }[] = [];
    
    // Create nodes and connections
    path.nodes.forEach((careerNode, index) => {
      // Create node sphere with a professional color scheme
      const nodeGeometry = new THREE.SphereGeometry(1, 32, 32);
      
      // Use professional colors based on path type
      let nodeColor;
      if (path.type === "ambitious") {
        nodeColor = new THREE.Color(0x3b82f6); // Blue
      } else if (path.type === "skills") {
        nodeColor = new THREE.Color(0x10b981); // Green
      } else {
        nodeColor = new THREE.Color(0x8b5cf6); // Purple
      }
      
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: nodeColor,
        metalness: 0.3,
        roughness: 0.4,
        emissive: nodeColor,
        emissiveIntensity: 0.3,
      });
      
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      // Position nodes in a straight professional line with consistent spacing
      const spacing = 10;
      const x = index * spacing - ((path.nodes.length - 1) * spacing) / 2;
      
      nodeMesh.position.set(x, 0, 0);
      scene.add(nodeMesh);
      nodes.push(nodeMesh);
      nodeObjects.push({ node: careerNode, mesh: nodeMesh });
      
      // Add a text label for the node
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(careerNode.title, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
        });
        
        const textGeometry = new THREE.PlaneGeometry(8, 4);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x, -2.5, 0);
        scene.add(textMesh);
      }
      
      // Connect nodes with arrow tubes (except for the first node)
      if (index > 0) {
        const prevNode = nodes[index - 1];
        
        // Create arrow connector between nodes
        const start = new THREE.Vector3(prevNode.position.x + 1.2, prevNode.position.y, prevNode.position.z);
        const end = new THREE.Vector3(nodeMesh.position.x - 1.2, nodeMesh.position.y, nodeMesh.position.z);
        
        // Create the arrow shaft as a cylinder
        const direction = new THREE.Vector3().subVectors(end, start);
        const arrowLength = direction.length();
        direction.normalize();
        
        const arrowShaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, arrowLength, 12);
        const arrowShaftMaterial = new THREE.MeshStandardMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.7,
          emissive: nodeColor,
          emissiveIntensity: 0.3,
        });
        
        const arrowShaft = new THREE.Mesh(arrowShaftGeometry, arrowShaftMaterial);
        
        // Position and rotate the arrow shaft to point from start to end
        arrowShaft.position.copy(start).add(direction.clone().multiplyScalar(arrowLength / 2));
        
        // Calculate rotation to align cylinder with direction
        const axis = new THREE.Vector3(0, 1, 0);
        arrowShaft.quaternion.setFromUnitVectors(axis, direction);
        arrowShaft.rotateX(Math.PI / 2);
        
        scene.add(arrowShaft);
        
        // Create arrow head as a cone
        const arrowHeadGeometry = new THREE.ConeGeometry(0.4, 1, 12);
        const arrowHeadMaterial = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.5,
        });
        
        const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
        arrowHead.position.copy(end);
        
        // Align arrow head with direction
        arrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        arrowHead.rotateX(Math.PI / 2);
        
        scene.add(arrowHead);
      }
      
      // Add year labels
      if (careerNode.yearsFromNow >= 0) {
        const yearCanvas = document.createElement('canvas');
        yearCanvas.width = 128;
        yearCanvas.height = 64;
        const yearContext = yearCanvas.getContext('2d');
        
        if (yearContext) {
          yearContext.fillStyle = 'rgba(255, 255, 255, 0)';
          yearContext.fillRect(0, 0, yearCanvas.width, yearCanvas.height);
          
          yearContext.font = '18px Arial';
          yearContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
          yearContext.textAlign = 'center';
          yearContext.fillText(
            careerNode.yearsFromNow > 0 ? `+${careerNode.yearsFromNow} years` : 'Now', 
            yearCanvas.width / 2, 
            yearCanvas.height / 2
          );
          
          const yearTexture = new THREE.CanvasTexture(yearCanvas);
          const yearMaterial = new THREE.MeshBasicMaterial({
            map: yearTexture,
            transparent: true,
            depthWrite: false,
          });
          
          const yearGeometry = new THREE.PlaneGeometry(4, 2);
          const yearMesh = new THREE.Mesh(yearGeometry, yearMaterial);
          yearMesh.position.set(x, 2.5, 0);
          scene.add(yearMesh);
        }
      }
    });
    
    // Raycaster for node interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(nodes);
      
      if (intersects.length > 0) {
        const clickedNode = intersects[0].object as THREE.Mesh;
        const nodeObject = nodeObjects.find(obj => obj.mesh === clickedNode);
        
        if (nodeObject) {
          onRoleSelect(nodeObject.node);
          
          // Highlight the selected node
          nodes.forEach(node => {
            const material = node.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.3;
          });
          
          const clickedMaterial = clickedNode.material as THREE.MeshStandardMaterial;
          clickedMaterial.emissiveIntensity = 0.8;
        }
      }
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(nodes);
      
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        
        const hoveredNode = intersects[0].object as THREE.Mesh;
        const nodeObject = nodeObjects.find(obj => obj.mesh === hoveredNode);
        
        if (nodeObject) {
          // Show tooltip
          setTooltipContent(nodeObject.node);
          setTooltipPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
      } else {
        container.style.cursor = 'default';
        setTooltipContent(null);
      }
    };
    
    // Add event listeners
    container.addEventListener('click', handleClick);
    container.addEventListener('mousemove', handleMouseMove);
    
    // Add professional camera movement
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.001;
      camera.position.y = Math.sin(time) * 1.5;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resizing
    const handleResize = () => {
      if (!container) return;
      
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Remove renderer
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [path, onRoleSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full"></div>
      {tooltipContent && tooltipPosition && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-3 z-50 w-64 text-left pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)',
            border: '1px solid rgba(226, 232, 240, 1)'
          }}
        >
          <p className="font-medium text-gray-900">{tooltipContent.title}</p>
          <p className="text-sm text-gray-600 mt-1">
            {tooltipContent.yearsFromNow > 0 ? `+${tooltipContent.yearsFromNow} years` : 'Current Position'}
          </p>
          <p className="text-xs mt-2 text-gray-500">Click to view details</p>
        </div>
      )}
    </div>
  );
};
