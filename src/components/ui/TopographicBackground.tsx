'use client';
import { useEffect, useRef } from 'react';

export default function TopographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    // We want the grid to cover the screen even when rotating it
    const oversize = 1.5; 

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
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
      time += 0.0015; // Animation speed

      // Center the drawing context to allow rotation
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI * 0.05); // slight angle for better aesthetic
      ctx.translate(-width * oversize / 2, -height * oversize / 2);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      
      // Use additive blending for glowing intersections
      ctx.globalCompositeOperation = 'screen';

      const numLines = 60;
      const w = width * oversize;
      const h = height * oversize;
      
      for (let i = 0; i < numLines; i++) {
        const progress = i / numLines; // 0 to 1
        const yBase = progress * h;

        ctx.beginPath();
        
        // Draw the line across the width
        for (let x = 0; x <= w; x += 15) {
          // Normalize coordinates for the noise functions
          const nx = x * 0.0015;
          const ny = progress * 3;
          
          // Layer multiple sine waves to approximate Perlin noise
          // 1. Low frequency, high amplitude (large hills)
          const wave1 = Math.sin(nx * 3.2 + time + ny) * 60;
          // 2. Medium frequency (details)
          const wave2 = Math.cos(nx * 6.5 - time * 0.8 + ny * 2) * 25;
          // 3. High frequency (fine ripples)
          const wave3 = Math.sin(nx * 12.0 + time * 1.5 - ny * 1.5) * 8;
          
          // Create a fade out at the left/right edges
          const edgeFade = Math.sin((x / w) * Math.PI);
          
          const yOffset = (wave1 + wave2 + wave3) * Math.pow(edgeFade, 0.5);
          const y = yBase + yOffset;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      ctx.restore();

      reqId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0, // Behind everything
      }}
    />
  );
}
