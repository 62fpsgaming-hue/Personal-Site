'use client';
import { useEffect, useRef } from 'react';

export default function TopologyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      // Set actual size in memory (scaled to account for extra pixel ratio)
      const dpr = window.devicePixelRatio || 1;
      // Use window innerHeight to prevent resizing issues on mobile
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; // Monochromatic, ultra-faint
      ctx.lineWidth = 1;

      const linesCount = 40;
      const step = height / linesCount;

      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        const yBase = i * step;

        for (let x = 0; x <= width + 50; x += 50) {
          // Complex interference pattern to simulate topographical contours
          const nx = x * 0.002;
          const ny = yBase * 0.002;
          
          const dy = Math.sin(nx + time * 0.3) * 40 
                   + Math.cos(ny - time * 0.2) * 30 
                   + Math.sin(nx * 2 + ny + time * 0.5) * 20;

          if (x === 0) {
            ctx.moveTo(x, yBase + dy);
          } else {
            ctx.lineTo(x, yBase + dy);
          }
        }
        ctx.stroke();
      }

      time += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
