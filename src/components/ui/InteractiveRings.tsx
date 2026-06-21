'use client';
import { useEffect, useRef } from 'react';

// ── 3D Black Hole with accretion disk color gradient ──────────────────────
// Color palette: inner disk = hot white/amber/orange, outer = deep purple/violet
// Simulates relativistic temperature gradient: hotter near event horizon
const DISK_COLORS = [
  { stop: 0.00, r: 255, g: 255, b: 255 }, // photon ring: white-hot
  { stop: 0.18, r: 255, g: 220, b: 140 }, // inner edge: bright amber
  { stop: 0.35, r: 255, g: 160, b: 60  }, // inner disk: deep orange
  { stop: 0.55, r: 200, g: 90,  b: 180 }, // mid disk: warm magenta
  { stop: 0.72, r: 120, g: 60,  b: 200 }, // outer disk: violet
  { stop: 0.88, r: 60,  b: 130, g: 30  }, // far outer: deep purple
  { stop: 1.00, r: 20,  g: 10,  b: 60  }, // edge: near-black purple
];

function lerpColor(t: number) {
  // clamp
  const s = Math.max(0, Math.min(1, t));
  for (let i = 0; i < DISK_COLORS.length - 1; i++) {
    const a = DISK_COLORS[i];
    const b = DISK_COLORS[i + 1];
    if (s >= a.stop && s <= b.stop) {
      const f = (s - a.stop) / (b.stop - a.stop);
      return {
        r: Math.round(a.r + (b.r - a.r) * f),
        g: Math.round(a.g + (b.g - a.g) * f),
        b: Math.round(a.b + (b.b - a.b) * f),
      };
    }
  }
  const last = DISK_COLORS[DISK_COLORS.length - 1];
  return { r: last.r, g: last.g, b: last.b };
}

export default function InteractiveRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
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

    // ── Particles orbiting the disk ──────────────────────────────────────────
    type Particle = {
      angle: number;
      speed: number;
      radiusFrac: number; // 0=inner, 1=outer edge of disk
      opacity: number;
      size: number;
    };

    const PARTICLES = Array.from<unknown, Particle>({ length: 70 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      radiusFrac: Math.random(),
      opacity: 0.3 + Math.random() * 0.6,
      size: 0.7 + Math.random() * 1.6,
    }));

    // ── Draw one 3D-projected ring ───────────────────────────────────────────
    // radiusFrac 0=innermost, 1=outermost ring
    // tiltY = disk tilt (y-scale factor, e.g. 0.18 for nearly edge-on)
    // rotAngle = slow precession angle
    const drawDiskRing = (
      radiusFrac: number,
      baseR: number,
      tiltY: number,
      rotAngle: number,
      segments = 120
    ) => {
      const rX = baseR * (0.60 + radiusFrac * 0.85); // inner 0.60x → outer 1.45x
      const rY = rX * Math.max(0.04, tiltY);

      // Color at this radius
      const col = lerpColor(radiusFrac);

      // Relativistic beaming: bottom half (closer to viewer) is brighter
      // We draw in two halves with different opacities
      const baseOpacity = 0.08 + radiusFrac * 0.06;
      const lensOpacity = 0.18 + (1 - radiusFrac) * 0.45; // inner = much brighter

      ctx.save();
      ctx.rotate(rotAngle);

      // Far half (top — behind singularity): dimmer
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${baseOpacity * 0.4})`;
      ctx.lineWidth = 1.2 + (1 - radiusFrac) * 0.8;
      ctx.setLineDash([]);
      ctx.stroke();

      // Near half (bottom — in front): full brightness with glow
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI);
      ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${lensOpacity})`;
      ctx.lineWidth = 1.8 + (1 - radiusFrac) * 1.2;
      ctx.stroke();

      // Bright lensing highlight — concentrated bottom arc
      if (radiusFrac < 0.5) {
        ctx.beginPath();
        ctx.ellipse(0, 0, rX, rY, 0, Math.PI * 0.1, Math.PI * 0.9);
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${lensOpacity * 1.6})`;
        ctx.lineWidth = 3.0 - radiusFrac * 1.5;
        ctx.stroke();
      }

      ctx.restore();
    };

    // ── Draw all particles ───────────────────────────────────────────────────
    const drawParticles = (baseR: number, tiltY: number) => {
      for (const p of PARTICLES) {
        p.angle += p.speed;
        const rX = baseR * (0.60 + p.radiusFrac * 0.85);
        const rY = rX * Math.max(0.04, tiltY);

        const px = Math.cos(p.angle) * rX;
        const py = Math.sin(p.angle) * rY;

        // Particles behind singularity are hidden
        const isBehind = Math.sin(p.angle) < 0;
        const depthAlpha = isBehind ? 0.12 : 1.0;

        const col = lerpColor(p.radiusFrac);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${p.opacity * depthAlpha})`;
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.0025;

      mouseX += (targetMouseX - mouseX) * 0.032;
      mouseY += (targetMouseY - mouseY) * 0.032;

      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.28;

      // ── Wide nebula glow (very subtle warm tint) ──
      const nebula = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 2.2);
      nebula.addColorStop(0,    'rgba(0,0,0,0)');
      nebula.addColorStop(0.4,  'rgba(120,40,180,0.018)');  // purple tint
      nebula.addColorStop(0.65, 'rgba(200,80,30,0.025)');   // orange tint
      nebula.addColorStop(0.85, 'rgba(80,20,120,0.012)');
      nebula.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = nebula;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // ── 3D perspective tilt ──
      // baseTilt controls how edge-on the disk looks (0 = face-on, 1 = perfectly flat)
      const baseTilt = 0.20;
      const tiltMod = mouseY * 0.045; // mouse tilts the disk
      const tiltY = Math.max(0.05, baseTilt + tiltMod);

      // Mouse parallax shift
      const px = cx + mouseX * 14;
      const py = cy + mouseY * 8;

      ctx.save();
      ctx.translate(px, py);

      // ── Disk rings: outermost → innermost (painter's algo — far first) ──
      // Far half drawn first (behind singularity), then near half on top
      const NUM_RINGS = 12;
      for (let i = NUM_RINGS; i >= 0; i--) {
        const frac = i / NUM_RINGS;
        // Rings counter-rotate alternately for a turbulent disk feel
        const rotDir = i % 2 === 0 ? 1 : -1;
        const rotSpeed = 0.05 + (1 - frac) * 0.3; // inner rings rotate faster
        drawDiskRing(frac, baseR, tiltY, rotDir * time * rotSpeed, 120);
      }

      // ── Particles ──
      drawParticles(baseR, tiltY);

      ctx.restore();

      // ── Singularity: absolute black void, drawn AFTER disk ──────────────
      const eR = baseR * 0.44;
      const singularity = ctx.createRadialGradient(cx, cy, 0, cx, cy, eR * 1.15);
      singularity.addColorStop(0,    'rgba(0,0,0,1)');
      singularity.addColorStop(0.80, 'rgba(0,0,0,1)');
      singularity.addColorStop(0.93, 'rgba(0,0,0,0.9)');
      singularity.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = singularity;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // ── Photon ring: ultra-bright thin halo at event horizon ──
      const pRing = ctx.createRadialGradient(cx, cy, eR * 0.85, cx, cy, eR * 1.12);
      pRing.addColorStop(0,    'rgba(255,255,255,0)');
      pRing.addColorStop(0.3,  'rgba(255,240,200,0.06)');
      pRing.addColorStop(0.62, 'rgba(255,200,100,0.22)');  // warm amber glow
      pRing.addColorStop(0.8,  'rgba(200,100,255,0.08)');  // purple fringe
      pRing.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = pRing;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // ── Hawking shimmer: pulsing warm corona ──
      const pulse = 0.5 + Math.sin(time * 2.0) * 0.5; // 0→1 oscillation
      const hawking = ctx.createRadialGradient(cx, cy, eR * 0.75, cx, cy, eR * 1.05);
      hawking.addColorStop(0,   'rgba(0,0,0,0)');
      hawking.addColorStop(0.5, `rgba(255,180,80,${0.012 + pulse * 0.016})`);
      hawking.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = hawking;
      ctx.beginPath();
      ctx.arc(cx, cy, eR * 1.05, 0, Math.PI * 2);
      ctx.fill();

      // ── Gravitational lensing crescent ──
      // Bright bent-light arc above the disk, shifts slightly with mouse
      const lensShiftX = cx + mouseX * 5;
      const lensShiftY = cy - eR * 0.30 + mouseY * 3;
      ctx.save();
      ctx.translate(lensShiftX, lensShiftY);

      // Glow halo behind the crescent
      ctx.beginPath();
      ctx.ellipse(0, 0, eR * 0.98, eR * 0.20, Math.PI * -0.06,
        Math.PI * 1.06, Math.PI * 1.94);
      ctx.strokeStyle = 'rgba(255,160,60,0.10)';
      ctx.lineWidth = 7;
      ctx.stroke();

      // Sharp crescent line
      ctx.beginPath();
      ctx.ellipse(0, 0, eR * 0.96, eR * 0.18, Math.PI * -0.06,
        Math.PI * 1.08, Math.PI * 1.92);
      ctx.strokeStyle = 'rgba(255,220,120,0.38)';
      ctx.lineWidth = 1.6;
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
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 72%)',
      }}
    />
  );
}
