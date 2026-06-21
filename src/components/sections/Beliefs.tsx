'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BELIEFS = [
  { statement: 'Build before\nyou speak.', sub: 'Ship code. Then talk.' },
  { statement: 'Skill compounds.', sub: 'Every day you build is interest earned.' },
  { statement: 'Systems outlast\nindividuals.', sub: 'Build the machine, not just the output.' },
  { statement: 'Constraints are\nthe product.', sub: 'Limitations force clarity.' },
];

// Number of scroll "steps" = panels - 1 (3 transitions)
const STEPS = BELIEFS.length - 1;

export default function Beliefs() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressDots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {

      // Set initial panel states
      panelRefs.current.forEach((panel, idx) => {
        if (!panel) return;
        gsap.set(panel, {
          opacity: idx === 0 ? 1 : 0,
          scale: idx === 0 ? 1 : 0.96,
          filter: idx === 0 ? 'blur(0px)' : 'blur(10px)',
          x: idx === 0 ? 0 : 40,
        });
      });

      // Set initial dot states
      progressDots.current.forEach((dot, idx) => {
        if (!dot) return;
        gsap.set(dot, { 
          width: idx === 0 ? '32px' : '16px',
          opacity: idx === 0 ? 1 : 0.2,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          // Only scroll for STEPS * 100vh, not BELIEFS.length * 100vh
          end: `+=${STEPS * 100}%`,
          scrub: 1,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      // Transition between each panel
      BELIEFS.forEach((_, i) => {
        if (i >= STEPS) return;
        const fromPanel = panelRefs.current[i];
        const toPanel = panelRefs.current[i + 1];
        const fromDot = progressDots.current[i];
        const toDot = progressDots.current[i + 1];

        if (!fromPanel || !toPanel) return;

        // Each transition occupies a 1-unit slot — slide + fade
        tl.to(fromPanel, { opacity: 0, scale: 1.04, filter: 'blur(8px)', x: -40, duration: 0.4, ease: 'power2.inOut' }, i)
          .to(toPanel, { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, duration: 0.4, ease: 'power2.out' }, i + 0.25)
          .to(fromDot, { width: '16px', opacity: 0.2, duration: 0.3 }, i)
          .to(toDot, { width: '32px', opacity: 1, duration: 0.3 }, i + 0.25);
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    // Height is STEPS * 100vh = 300vh (3 transitions) + 100vh for sticky view = 400vh - but pinning covers STEPS scrolls
    <div ref={wrapperRef} style={{ height: `${(STEPS + 1) * 100}vh`, position: 'relative' }}>
      <div
        ref={stickyRef}
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Section label */}
        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
          <p className="section-label">— WHAT I BELIEVE</p>
        </div>

        {/* Progress bar indicators */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 10,
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
        }}>
          {BELIEFS.map((_, i) => (
            <span
              key={i}
              ref={el => { progressDots.current[i] = el; }}
              style={{
                display: 'inline-block',
                width: i === 0 ? '32px' : '16px',
                height: '1px',
                background: 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Accent horizontal rule */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(110,231,247,0.15), transparent)',
          zIndex: 5,
        }} />

        {/* Giant quotation mark bg */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(18rem, 36vw, 42rem)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 1,
          pointerEvents: 'none',
          zIndex: 0,
          userSelect: 'none',
        }}>
          &rdquo;
        </div>

        {/* Panels */}
        {BELIEFS.map((b, i) => (
          <div
            key={i}
            ref={el => { panelRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '4rem 2rem',
              zIndex: 2,
            }}
          >
            {/* Index */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.4em',
              color: 'rgba(110,231,247,0.7)',
              opacity: 1,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              {String(i + 1).padStart(2, '0')} / {String(BELIEFS.length).padStart(2, '0')}
            </p>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: '#fff',
                whiteSpace: 'pre-line',
                marginBottom: '1.8rem',
                maxWidth: '700px',
              }}
            >
              {b.statement}
            </h2>

            {/* Accent line under heading */}
            <div style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(to right, rgba(110,231,247,0.6), transparent)',
              marginBottom: '1.5rem',
            }} />

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(11px, 1.3vw, 13px)',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}>
              {b.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
