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
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
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

    // ── Orbiting photon particles ──────────────────────────────────────────
    type Particle = {
      angle: number;       // current angle on the ellipse
      speed: number;       // radians per frame
      ringScale: number;   // which ring (0-1 normalized radius multiplier)
      tiltFactor: number;  // how much the ring is compressed vertically
      opacity: number;
      size: number;
    };

    const NUM_PARTICLES = 55;
    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.006 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      ringScale: 0.72 + Math.random() * 0.72, // spread across inner to outer
      tiltFactor: 0.06 + Math.random() * 0.18,
      opacity: 0.15 + Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.4,
    }));

    // ── Draw a tilted ellipse ring with optional lensing arcs ──────────────
    const drawRing = (
      rX: number,
      rY: number,
      rotAngle: number,
      opacity: number,
      lineWidth: number,
      dash: number[],
      lensArc?: { start: number; end: number; brightOpacity: number; lineWidth?: number }
    ) => {
      ctx.save();
      ctx.rotate(rotAngle);

      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.setLineDash(dash);
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      if (lensArc) {
        // bright lensing arc — bottom half "bent" toward viewer
        ctx.beginPath();
        ctx.ellipse(0, 0, rX, rY, 0, lensArc.start, lensArc.end);
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(255,255,255,${lensArc.brightOpacity})`;
        ctx.lineWidth = lensArc.lineWidth ?? 2;
        ctx.stroke();
      }

      ctx.restore();
    };

    // ── Draw particles orbiting a given ring ──────────────────────────────
    const drawParticles = (
      baseR: number,
      baseTilt: number,
      tiltMod: number,
      rotOffset: number
    ) => {
      for (const p of particles) {
        p.angle += p.speed;
        const rX = baseR * p.ringScale;
        const compression = Math.max(0.04, p.tiltFactor + tiltMod * 0.7);
        const rY = rX * compression;

        // Apply the slow orbital rotation of the disk itself
        const a = p.angle + rotOffset * p.ringScale * 0.3;
        const px = Math.cos(a) * rX;
        const py = Math.sin(a) * rY;

        // Depth-based brightness: particles "behind" the singularity are dimmer
        const behindFactor = Math.sin(a) < 0 ? 0.35 : 1.0;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity * behindFactor})`;
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      // Smooth damp mouse
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.28;

      // ── Wide outer nebula glow (very faint) ──
      const nebula = ctx.createRadialGradient(cx, cy, baseR * 0.3, cx, cy, baseR * 2.0);
      nebula.addColorStop(0,    'rgba(255,255,255,0)');
      nebula.addColorStop(0.45, 'rgba(255,255,255,0.008)');
      nebula.addColorStop(0.7,  'rgba(255,255,255,0.028)');
      nebula.addColorStop(0.88, 'rgba(255,255,255,0.012)');
      nebula.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = nebula;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Mouse parallax shift
      const px = cx + mouseX * 16;
      const py = cy + mouseY * 9;

      // Tilt = perspective compression; mouse Y tilts the disk
      const baseTilt = 0.18;
      const tiltMod  = mouseY * 0.05;

      ctx.save();
      ctx.translate(px, py);

      // ── Particles (drawn first, behind rings) ──
      drawParticles(baseR, baseTilt, tiltMod, time);

      // ── 5 Accretion Disk Rings ── (outermost → innermost)

      // Ring 5 — outermost ghost ring, barely visible, slow
      drawRing(
        baseR * 1.62,
        baseR * 1.62 * Math.max(0.06, baseTilt - 0.02 + tiltMod),
        time * 0.08,
        0.04,
        0.8,
        [3, 22]
      );

      // Ring 4 — outer ring
      drawRing(
        baseR * 1.38,
        baseR * 1.38 * Math.max(0.08, baseTilt + tiltMod),
        time * 0.14,
        0.08,
        1.0,
        [5, 12],
        { start: Math.PI * 0.1, end: Math.PI * 0.9, brightOpacity: 0.22, lineWidth: 1.8 }
      );

      // Ring 3 — middle, counter-rotates
      drawRing(
        baseR * 1.12,
        baseR * 1.12 * Math.max(0.07, baseTilt - 0.04 + tiltMod * 0.85),
        -time * 0.22,
        0.12,
        1.1,
        [2, 8],
        { start: Math.PI * 0.08, end: Math.PI * 0.92, brightOpacity: 0.30, lineWidth: 2.0 }
      );

      // Ring 2 — denser, slightly faster
      drawRing(
        baseR * 0.88,
        baseR * 0.88 * Math.max(0.06, baseTilt - 0.08 + tiltMod * 0.7),
        time * 0.35,
        0.16,
        1.2,
        [1, 7],
        { start: Math.PI * 0.06, end: Math.PI * 0.94, brightOpacity: 0.40, lineWidth: 2.2 }
      );

      // Ring 1 — innermost, nearly edge-on, fastest — the photon ring
      drawRing(
        baseR * 0.64,
        baseR * 0.64 * Math.max(0.04, baseTilt - 0.12 + tiltMod * 0.5),
        -time * 0.55,
        0.22,
        1.4,
        [1, 18],
        { start: Math.PI * 0.03, end: Math.PI * 0.97, brightOpacity: 0.65, lineWidth: 2.6 }
      );

      ctx.restore();

      // ── Singularity: absolute void — drawn AFTER rings ──
      // Hard cutoff at event horizon radius
      const eR = baseR * 0.46;
      const singularity = ctx.createRadialGradient(cx, cy, 0, cx, cy, eR * 1.18);
      singularity.addColorStop(0,    'rgba(0,0,0,1)');
      singularity.addColorStop(0.82, 'rgba(0,0,0,1)');
      singularity.addColorStop(0.94, 'rgba(0,0,0,0.92)');
      singularity.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = singularity;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // ── Photon ring at exact event horizon — bright, thin halo ──
      const pRing = ctx.createRadialGradient(cx, cy, eR * 0.88, cx, cy, eR * 1.14);
      pRing.addColorStop(0,    'rgba(255,255,255,0)');
      pRing.addColorStop(0.35, 'rgba(255,255,255,0.03)');
      pRing.addColorStop(0.6,  'rgba(255,255,255,0.12)');
      pRing.addColorStop(0.8,  'rgba(255,255,255,0.05)');
      pRing.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = pRing;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.14, 0, Math.PI * 2);
      ctx.fill();

      // ── Hawking shimmer: subtle pulsing corona ──
      const shimmerAlpha = 0.018 + Math.sin(time * 2.2) * 0.010;
      const hawking = ctx.createRadialGradient(cx, cy, eR * 0.78, cx, cy, eR * 1.08);
      hawking.addColorStop(0,   'rgba(255,255,255,0)');
      hawking.addColorStop(0.5, `rgba(255,255,255,${shimmerAlpha})`);
      hawking.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = hawking;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // ── Gravitational lensing crescent — bright arc "above" the disk ──
      // Simulates light bending around the far side of the black hole
      const lensX = cx + mouseX * 6;
      const lensY = cy - eR * 0.28 + mouseY * 4;
      ctx.save();
      ctx.translate(lensX, lensY);
      ctx.beginPath();
      ctx.ellipse(0, 0, eR * 1.02, eR * 0.18, Math.PI * -0.08, Math.PI * 1.08, Math.PI * 1.92);
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(255,255,255,0.32)`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // soft glow behind the crescent
      ctx.beginPath();
      ctx.ellipse(0, 0, eR * 1.04, eR * 0.22, Math.PI * -0.08, Math.PI * 1.05, Math.PI * 1.95);
      ctx.strokeStyle = `rgba(255,255,255,0.09)`;
      ctx.lineWidth = 5;
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
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120vmin',
        height: '120vmin',
        pointerEvents: 'none',
        zIndex: 1,
        maskImage: 'radial-gradient(circle at center, black 32%, transparent 74%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 32%, transparent 74%)',
      }}
    />
  );
}
