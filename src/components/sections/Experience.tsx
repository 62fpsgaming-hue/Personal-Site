'use client';
import { useEffect, useRef, createRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlapIn } from '@/hooks/useSlapIn';

gsap.registerPlugin(ScrollTrigger);

type TimelineEntry = {
  year: string;
  period?: string;
  event: string;
  role?: string;
  detail: string;
  contributions?: string[];
  focusAreas?: string[];
  blur?: boolean;
  current?: boolean;
};

const TIMELINE: TimelineEntry[] = [
  {
    year: '2025',
    event: ' BENGALURU',
    detail: '12.9716° N, 77.5946° E — Earth_Grid initialized.',
  },
  {
    year: '2024',
    event: 'ENROLLED IN CS',
    detail: 'Picked a direction. Started building instead of consuming.',
  },
  {
    year: '2026',
    period: 'JAN 2026 — PRESENT',
    event: 'CO-FOUNDER — CollabKaro',
    role: 'Product · Operations · Finance',
    detail: "Building India's Deal-Room-native creator-brand collaboration platform. Defining the infrastructure layer for how creators and brands work together.",
    contributions: [
      'Designed creator discovery and trust systems',
      'Built Deal Room workflow concepts',
      'Defined matching, reputation, and collaboration systems',
      'Scaled onboarding processes for creators and brands',
      'Led product roadmap and platform direction',
    ],
    focusAreas: ['Product Strategy', 'Marketplace Design', 'Operations', 'Finance'],
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
  const lineRef      = useRef<HTMLDivElement>(null);
  const playheadRef  = useRef<HTMLDivElement>(null);
  const [itemRefs]   = useState(() => TIMELINE.map(() => createRef<HTMLDivElement>()));

  useSlapIn(itemRefs, {
    triggerRef: containerRef,
    xOffset: -50,
    yOffset: 0,
    scale: 1,
    stagger: 0.08,
    start: 'top 60%',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        playheadRef.current,
        { top: '0%' },
        { top: '100%', ease: 'none', scrollTrigger: scrollSettings }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        overflowX: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: '820px' }}>
        <p className="section-label" style={{ marginBottom: '4rem' }}>
          — TIMELINE / FOUNDER JOURNEY
        </p>

        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Vertical timeline line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '6px',
              bottom: '6px',
              width: '1px',
            }}
          >
            <div
              ref={lineRef}
              style={{
                width: '100%',
                height: '100%',
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 4px, transparent 4px, transparent 10px)',
              }}
            />
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
              <div key={i} ref={itemRefs[i]} style={{ position: 'relative' }}>

                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-2.5rem',
                    top: '6px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: entry.blur
                      ? 'rgba(255,255,255,0.15)'
                      : entry.current
                      ? 'var(--color-accent)'
                      : 'rgba(255,255,255,0.6)',
                    boxShadow: entry.current ? '0 0 8px rgba(110,231,247,0.5)' : 'none',
                    transform: 'translateX(-2px)',
                  }}
                />

                {/* Year / period + status badges */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.4rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {entry.period ?? entry.year}
                  </p>

                  {entry.current && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        color: 'rgba(255,255,255,0.8)',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '2px 6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: 'pulse-current 2.5s ease-in-out infinite',
                      }}
                    >
                      CURRENT
                    </span>
                  )}

                  {entry.blur && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        color: 'rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '2px 6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      CLASSIFIED
                    </span>
                  )}
                </div>

                {/* Event title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    color: entry.blur ? 'rgba(255,255,255,0.2)' : '#fff',
                    marginBottom: entry.role ? '0.2rem' : '0.5rem',
                    filter: entry.blur ? 'blur(2.5px)' : 'none',
                    userSelect: entry.blur ? 'none' : 'auto',
                  }}
                >
                  {entry.event}
                </h3>

                {/* Role subtitle */}
                {entry.role && (
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'rgba(255,255,255,0.32)',
                      textTransform: 'uppercase',
                      marginBottom: '0.7rem',
                    }}
                  >
                    {entry.role}
                  </p>
                )}

                {/* Detail / description */}
                <p
                  className="body-text"
                  style={{
                    filter: entry.blur ? 'blur(1.5px)' : 'none',
                    maxWidth: '520px',
                    marginBottom: entry.contributions ? '1.6rem' : 0,
                  }}
                >
                  {entry.detail}
                </p>

                {/* Key Contributions */}
                {entry.contributions && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.32em',
                        color: 'rgba(255,255,255,0.28)',
                        textTransform: 'uppercase',
                        marginBottom: '0.85rem',
                      }}
                    >
                      Key Contributions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {entry.contributions.map((c, j) => (
                        <div
                          key={j}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              color: 'rgba(255,255,255,0.18)',
                              marginTop: '3px',
                              flexShrink: 0,
                            }}
                          >
                            —
                          </span>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 'clamp(13px, 1.4vw, 14px)',
                              color: 'rgba(255,255,255,0.52)',
                              lineHeight: 1.65,
                            }}
                          >
                            {c}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Focus area tags */}
                {entry.focusAreas && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {entry.focusAreas.map((area) => (
                      <span key={area} className="tag">
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
