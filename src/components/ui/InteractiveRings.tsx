'use client';
import { useEffect, useRef } from 'react';

export default function InteractiveRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    
    // Mouse tracking for parallax and interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1 to 1
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    let reqId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      time += 0.003; // Base rotation speed
      
      // Smooth damp mouse position
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const baseRadius = Math.min(width, height) * 0.35;
      
      ctx.globalCompositeOperation = 'screen';

      const drawRing = (radiusOff: number, dashArr: number[], rotSpeed: number, opacity: number, parallaxScale: number) => {
        ctx.save();
        // Apply parallax offset
        ctx.translate(centerX + mouseX * parallaxScale, centerY + mouseY * parallaxScale);
        ctx.rotate(time * rotSpeed);
        
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius + radiusOff, 0, Math.PI * 2);
        
        ctx.setLineDash(dashArr);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
      };

      // Outer dashed ring
      drawRing(60, [4, 12], 0.2, 0.15, -30);
      
      // Middle dense dashed ring
      drawRing(0, [2, 6], -0.3, 0.1, -15);
      
      // Inner sparse ring
      drawRing(-40, [1, 20], 0.5, 0.2, -5);
      
      // Dynamic pulsing data ring
      ctx.save();
      ctx.translate(centerX + mouseX * -20, centerY + mouseY * -20);
      ctx.rotate(-time * 0.1);
      ctx.beginPath();
      // Draw a ring made of varying segments
      const segments = 120;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        // The length of each segment pulses based on time and index
        const pulse = Math.sin(time * 10 + i * 0.5) * 0.5 + 0.5;
        const r = baseRadius + 20 + pulse * 12;
        
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      reqId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120vmin',
        height: '120vmin',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.8,
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
      }} 
    />
  );
}
