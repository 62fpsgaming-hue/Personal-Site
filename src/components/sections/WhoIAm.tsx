'use client';
import { useEffect, useRef, createRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlapIn } from '@/hooks/useSlapIn';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  { label: 'ROLE', value: 'Student Founder' },
  { label: 'LOCATION', value: 'Bengaluru, India', live: true },
  { label: 'BACKGROUND', value: 'Computer Science' },
  { label: 'CORE FOCUS', value: 'Backend Engineering' },
  { label: 'BUILDING', value: 'CollabKaro · Cognita · InTrip' },
  { label: 'LEARNING', value: 'Distributed Systems · AI' },
  { label: 'STATUS', value: 'BUILDING IN PUBLIC', live: true },
];

export default function WhoIAm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowRefs] = useState(() => ROWS.map(() => createRef<HTMLDivElement>()));

  // Apply slap effect
  useSlapIn(rowRefs, {
    triggerRef: containerRef,
    yOffset: -40,
    scale: 1.04,
    stagger: 0.06,
    start: 'top 70%',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=60%',
        pin: true,
        pinSpacing: true,
      });

      // Fade in section container
      gsap.from(containerRef.current, {
        opacity: 0,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
      });

      // Fade out section on exit
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.97,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 60%',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative' }}>
      
      {/* Giant BG number */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(20rem, 35vw, 40rem)',
        fontWeight: 700,
        lineHeight: 0.8,
        color: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
      }}>
        01
      </div>

      <div style={{ width: '100%', maxWidth: '900px', padding: '0 2rem', zIndex: 1, position: 'relative' }}>
        {/* Section label */}
        <p className="section-label" style={{ marginBottom: '3rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(110,231,247,0.15)' }}>
          — CURRENT OPERATING STATE
        </p>

        {/* Dashboard rows wrapper */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              ref={rowRefs[i]}
              data-magnetic="true"
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(50px, 8vw, 80px) clamp(130px, 20vw, 220px) 1fr',
                alignItems: 'center',
                padding: '1.2rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                borderLeft: row.live ? '2px solid rgba(255,255,255,0.18)' : '2px solid transparent',
                gap: '1rem',
                transition: 'all 0.3s ease',
                cursor: 'none',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.paddingLeft = '1.5rem';
                e.currentTarget.style.paddingRight = '0.5rem';
                const idx = e.currentTarget.querySelector('[data-idx]') as HTMLElement;
                if (idx) idx.style.color = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderLeftColor = row.live ? 'rgba(255,255,255,0.18)' : 'transparent';
                e.currentTarget.style.paddingLeft = '1rem';
                e.currentTarget.style.paddingRight = '1rem';
                const idx = e.currentTarget.querySelector('[data-idx]') as HTMLElement;
                if (idx) idx.style.color = 'rgba(255,255,255,0.25)';
              }}
            >
              {/* Hover scanline sweep */}
              <span style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '60%',
                height: '100%',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.025), transparent)',
                pointerEvents: 'none',
                animation: 'none',
              }} className="row-scanline" />
              <span data-idx className="section-index" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', transition: 'color 0.2s ease' }}>
                [{String(i + 1).padStart(2, '0')}]
              </span>
              <span className="row-label" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                {row.label}
              </span>
              <span className="row-value" style={{ 
                fontFamily: row.value.includes('·') || row.label === 'STATUS' ? 'var(--font-mono)' : 'var(--font-body)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                color: row.live ? '#fff' : 'rgba(255,255,255,0.9)',
                fontWeight: row.live ? 600 : 500,
              }}>
                {row.live && (
                  <span className="live-dot" />
                )}
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
