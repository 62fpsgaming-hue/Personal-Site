'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlapIn } from '@/hooks/useSlapIn';

gsap.registerPlugin(ScrollTrigger);

const SYSTEMS = [
  {
    name: 'KNOWLEDGE SYSTEM',
    inputs: ['Books', 'Courses', 'Research', 'Reflection'],
    output: 'PROJECTS · SKILLS',
  },
  {
    name: 'BUSINESS SYSTEM',
    inputs: ['Ideas', 'Validation', 'Build', 'Distribution'],
    output: 'REVENUE',
  },
];

function SystemFlow({ system, index }: { system: typeof SYSTEMS[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);

  useSlapIn([rowRef], { yOffset: -60, scale: 1.06, delay: index * 0.15 });

  useEffect(() => {
    // Bug #4 fix: pass rowRef as scope so cleanup targets only this component's subtree
    const ctx = gsap.context(() => {
      if (arrowRef.current) {
        const length = arrowRef.current.getTotalLength?.() || 200;
        gsap.set(arrowRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(arrowRef.current, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          delay: index * 0.15 + 0.3,
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          },
        });
      }
    }, rowRef);
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={rowRef} style={{ padding: '3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '2rem' }}>
        {system.name}
      </p>

      {/* Flow visualization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Inputs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {system.inputs.map((input, j) => (
            <span key={input} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="tag" style={{ fontSize: '12px', padding: '6px 14px' }}>
                {input}
              </span>
              {j < system.inputs.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>+</span>
              )}
            </span>
          ))}
        </div>

        {/* Arrow SVG */}
        <svg width="60" height="20" style={{ overflow: 'visible', flexShrink: 0 }}>
          <path
            ref={arrowRef}
            d="M 0 10 L 48 10 M 42 4 L 54 10 L 42 16"
            stroke="rgba(110,231,247,0.5)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Output */}
        <span style={{
          padding: '6px 18px',
          border: '1px dashed rgba(110,231,247,0.15)',
          background: 'rgba(110,231,247,0.02)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.12em',
          color: '#fff',
        }}>
          {system.output}
        </span>
      </div>
    </div>
  );
}

export default function Systems() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ minHeight: '60vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <p className="section-label" style={{ marginBottom: '3rem' }}>
          — HOW I THINK / SYSTEMS
        </p>
        {SYSTEMS.map((system, i) => (
          <SystemFlow key={system.name} system={system} index={i} />
        ))}
      </div>
    </div>
  );
}
