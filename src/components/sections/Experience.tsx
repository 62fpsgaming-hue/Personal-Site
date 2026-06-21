'use client';
import { useEffect, useRef, createRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlapIn } from '@/hooks/useSlapIn';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: '2006',
    event: 'BORN, BENGALURU',
    detail: '12.9716° N, 77.5946° E — Earth_Grid initialized.',
    blur: false,
  },
  {
    year: '2024',
    event: 'ENROLLED IN CS',
    detail: 'Picked a direction. Started building instead of consuming.',
    blur: false,
  },
  {
    year: '2025',
    event: 'CO-FOUNDER & COO — CollabKaro',
    detail: 'Building the infrastructure layer for creator-brand collaborations. Focus: Product architecture, operations, go-to-market.',
    blur: false,
  },
  {
    year: '2026',
    event: 'FOUNDER — Cognita',
    detail: 'Adaptive AI tutor. Early research & prototype phase.',
    blur: false,
  },
  {
    year: '2026',
    event: 'BUILDING IN PUBLIC',
    detail: 'Foundation phase begins. Everything tracked. Nothing hidden.',
    blur: false,
    current: true,
  },
  {
    year: '2027',
    event: '??? [REDACTED]',
    detail: 'Next chapter loading...',
    blur: true,
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [itemRefs] = useState(() => TIMELINE.map(() => createRef<HTMLDivElement>()));

  // Slap effect for timeline items sliding from left
  useSlapIn(itemRefs, { triggerRef: containerRef, xOffset: -50, yOffset: 0, scale: 1, stagger: 0.08, start: 'top 60%' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the timeline line
      const scrollSettings = {
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'bottom 80%',
        scrub: 1,
      };

      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        scrollTrigger: scrollSettings,
      });

      // Animate the playhead dot along the line
      gsap.fromTo(playheadRef.current,
        { top: '0%' },
        { top: '100%', ease: 'none', scrollTrigger: scrollSettings }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Section label */}
        <p className="section-label" style={{ marginBottom: '4rem' }}>
          — EXPERIENCE / THE JOURNEY
        </p>

        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Vertical timeline line container */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '6px',
              bottom: '6px',
              width: '1px',
            }}
          >
            {/* The line that draws */}
            <div
              ref={lineRef}
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 4px, transparent 4px, transparent 10px)',
              }}
            />
            {/* The glowing playhead */}
            <div
              ref={playheadRef}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '7px',
                height: '7px',
                background: 'var(--color-accent)',
                borderRadius: '50%',
                boxShadow: '0 0 12px var(--color-accent-dim), 0 0 20px rgba(110,231,247,0.3)',
                zIndex: 10,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {TIMELINE.map((entry, i) => (
              <div
                key={i}
                ref={itemRefs[i]}
                style={{ position: 'relative' }}
              >
                {/* Dot on timeline */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '6px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: entry.blur ? 'rgba(255,255,255,0.15)' : (entry.current ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)'),
                  boxShadow: entry.current ? '0 0 8px rgba(110,231,247,0.5)' : 'none',
                  transform: 'translateX(-2px)',
                }} />

                {/* Year */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>
                    {entry.year}
                  </p>
                  {entry.current && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.06)',
                      padding: '2px 6px', border: '1px solid rgba(255,255,255,0.2)',
                      animation: 'pulse-current 2.5s ease-in-out infinite',
                    }}>
                      CURRENT
                    </span>
                  )}
                  {entry.blur && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)',
                      padding: '2px 6px', border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      CLASSIFIED
                    </span>
                  )}
                </div>

                {/* Event */}
                <h3 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  color: entry.blur ? 'rgba(255,255,255,0.2)' : '#fff',
                  marginBottom: '0.5rem',
                  filter: entry.blur ? 'blur(2.5px)' : 'none',
                  userSelect: entry.blur ? 'none' : 'auto',
                }}>
                  {entry.event}
                </h3>

                {/* Detail */}
                <p className="body-text" style={{
                  filter: entry.blur ? 'blur(1.5px)' : 'none',
                  maxWidth: '500px',
                }}>
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
