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
    // Cover screen even when rotated
    const oversize = 1.6;

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
      time += 0.0012; // slow, meditative drift

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI * 0.06); // subtle tilt
      ctx.translate((-width * oversize) / 2, (-height * oversize) / 2);

      // Additive blending — lines glow where they overlap
      ctx.globalCompositeOperation = 'screen';

      const w = width * oversize;
      const h = height * oversize;

      // ── Two passes: far (dim) + close (brighter) ──────────────────────────
      // Pass 1: dense background lines — very faint
      const totalLines = 80;
      for (let i = 0; i < totalLines; i++) {
        const progress = i / totalLines;
        const yBase = progress * h;

        // Distance from vertical center — lines near edges are dimmer
        const centeredProgress = Math.abs(progress - 0.5) * 2; // 0 (center) → 1 (edge)
        const centralBoost = 1 - centeredProgress * 0.6;

        // Low-frequency large swell
        const wave1 = Math.sin(progress * Math.PI * 2.8 + time * 0.9) * (h * 0.065);
        // Mid-frequency terrain detail
        const wave2 = Math.cos(progress * Math.PI * 6.5 - time * 0.6) * (h * 0.022);
        // High-frequency fine ridges
        const wave3 = Math.sin(progress * Math.PI * 14 + time * 1.3) * (h * 0.008);

        ctx.beginPath();

        for (let x = 0; x <= w; x += 10) {
          const nx = x / w; // 0 → 1

          // Horizontal edge fade — soften line endpoints
          const edgeFade = Math.pow(Math.sin(nx * Math.PI), 0.6);

          // Per-x displacement adds undulation along each line
          const localWave =
            Math.sin(nx * 8 + time * 0.7 + progress * 4) * (h * 0.012) +
            Math.cos(nx * 14 - time * 1.1 + progress * 2) * (h * 0.005);

          const yOffset = (wave1 + wave2 + wave3 + localWave) * edgeFade;
          const y = yBase + yOffset;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Bright "elevation contour" lines at regular intervals (every ~10 lines)
        const isContour = i % 9 === 0;
        const isMajorContour = i % 27 === 0;

        if (isMajorContour) {
          ctx.strokeStyle = `rgba(255,255,255,${0.14 * centralBoost})`;
          ctx.lineWidth = 1.2;
        } else if (isContour) {
          ctx.strokeStyle = `rgba(255,255,255,${0.09 * centralBoost})`;
          ctx.lineWidth = 0.9;
        } else {
          ctx.strokeStyle = `rgba(255,255,255,${0.045 * centralBoost})`;
          ctx.lineWidth = 0.7;
        }

        ctx.setLineDash([]);
        ctx.stroke();
      }

      // Pass 2: sparse highlight ridgelines — slightly brighter, fewer
      for (let i = 0; i < 12; i++) {
        const progress = (i / 12) * 0.85 + 0.075; // keep away from very top/bottom
        const yBase = progress * h;

        const wave1 = Math.sin(progress * Math.PI * 2.8 + time * 0.9) * (h * 0.065);
        const wave2 = Math.cos(progress * Math.PI * 6.5 - time * 0.6) * (h * 0.022);
        const wave3 = Math.sin(progress * Math.PI * 14 + time * 1.3) * (h * 0.008);

        ctx.beginPath();

        for (let x = 0; x <= w; x += 8) {
          const nx = x / w;
          const edgeFade = Math.pow(Math.sin(nx * Math.PI), 0.5);
          const localWave =
            Math.sin(nx * 8 + time * 0.7 + progress * 4) * (h * 0.012) +
            Math.cos(nx * 14 - time * 1.1 + progress * 2) * (h * 0.005);

          const yOffset = (wave1 + wave2 + wave3 + localWave) * edgeFade;
          const y = yBase + yOffset;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(255,255,255,0.18)`;
        ctx.lineWidth = 1.0;
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
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        // Fade the canvas edges so it blends cleanly into the black bg
        maskImage:
          'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
      }}
    />
  );
}
