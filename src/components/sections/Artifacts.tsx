'use client';
import { useState, useRef, createRef } from 'react';
import { useSlapIn } from '@/hooks/useSlapIn';

const PROJECTS = [
  {
    number: '01',
    name: 'COLLABKARO',
    status: 'ACTIVE',
    thesis: 'The infrastructure layer for creator-brand collaborations.',
    problem: 'Small brands struggle to discover reliable creators. Creators have no consistent, paid pipeline.',
    insight: "The problem isn't discovery. It's trust.",
    solution: 'Structured marketplace with creator verification, deal management, and payment escrow.',
    stack: ['Next.js', 'Node.js', 'Supabase', 'PostgreSQL'],
    milestone: 'First 100 creators onboarded',
    role: 'Co-Founder & COO',
    github: 'https://github.com/neerajsaini',
    live: null,
  },
  {
    number: '02',
    name: 'COGNITA',
    status: 'BUILDING',
    thesis: 'An adaptive AI tutor that learns how you learn.',
    problem: "Generic courses don't adapt. Every student gets the same content at the same pace. Most fail because of delivery, not material.",
    insight: 'The tutor should adapt, not the student.',
    solution: 'AI-driven adaptive curriculum with spaced repetition and learning-style detection.',
    stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Gemini API'],
    milestone: 'Prototype with 5 test students',
    role: 'Founder',
    github: null,
    live: null,
  },
  {
    number: '03',
    name: 'INTRIP',
    status: 'PROTOTYPE',
    thesis: 'Planning trips should take minutes, not hours.',
    problem: 'A single trip requires 6+ tools: Maps, Booking, Skyscanner, TripAdvisor, WhatsApp, Spreadsheets. Nobody built the single flow.',
    insight: "The friction isn't the booking. It's the planning that comes before.",
    solution: 'One AI-powered flow: Destination → Itinerary → Booked.',
    stack: ['Next.js', 'Node.js', 'AI APIs'],
    milestone: 'Working prototype',
    role: 'Founder',
    github: null,
    live: null,
  },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'var(--color-accent)',
  BUILDING: 'rgba(255,255,255,0.55)',
  PROTOTYPE: 'rgba(255,255,255,0.3)',
};

const STATUS_GLOW: Record<string, string> = {
  ACTIVE: 'rgba(110,231,247,0.5)',
  BUILDING: 'none',
  PROTOTYPE: 'none',
};

export default function Artifacts() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowRefs] = useState(() => PROJECTS.map(() => createRef<HTMLDivElement>()));

  useSlapIn(rowRefs, { triggerRef: containerRef, yOffset: -40, scale: 1.05, stagger: 0.1 });

  return (
    <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '1100px' }}>
        {/* Section label */}
        <p className="section-label" style={{ marginBottom: '3rem' }}>
          — ARTIFACTS / THINGS I&apos;M BUILDING
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {PROJECTS.map((project, i) => {
            const isExpanded = expanded === i;

            return (
              <div
                key={project.number}
                ref={rowRefs[i]}
                onClick={() => setExpanded(isExpanded ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpanded(isExpanded ? null : i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                data-magnetic="true"
                style={{
                  borderTop: i === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  borderLeft: isExpanded ? '2px solid rgba(110,231,247,0.3)' : '2px solid transparent',
                  padding: isExpanded ? '2.5rem 1rem' : '2rem 1rem',
                  margin: '0 -1rem',
                  cursor: 'none',
                  transition: 'padding 0.35s ease, background 0.3s ease, border-color 0.3s ease',
                  outline: 'none',
                  background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderLeftColor = 'rgba(110,231,247,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                {/* Collapsed header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'clamp(30px,4vw,50px) 1fr auto auto', alignItems: 'center', gap: '1.5rem' }}>
                  <span className="section-index" style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', fontSize: '12px' }}>
                    {project.number}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.2rem' }}>
                      {project.name}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'rgba(255,255,255,0.5)' }}>
                      {project.thesis}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', color: STATUS_COLORS[project.status], display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: STATUS_COLORS[project.status],
                      display: 'inline-block',
                      boxShadow: project.status === 'ACTIVE' ? `0 0 8px ${STATUS_GLOW[project.status]}` : 'none',
                      animation: project.status === 'ACTIVE' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                    }} />
                    {project.status}
                  </span>
                  {/* +/× toggle */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.4)',
                    transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease',
                    display: 'inline-block',
                    lineHeight: 1,
                  }}>
                    +
                  </span>
                </div>

                {/* Expanded content — terminal frame */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isExpanded ? '800px' : '0',
                  transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
                  opacity: isExpanded ? 1 : 0,
                }}>
                  {/* Terminal window top bar */}
                  <div style={{
                    marginTop: '2rem',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.015)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.6rem 1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {[0,1,2].map(d => (
                        <span key={d} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
                      ))}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginLeft: '0.5rem' }}>
                        {project.name}.log
                      </span>
                    </div>
                    <div style={{ paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: 'clamp(30px,4vw,50px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', paddingRight: '2rem' }}>
                      {/* Left */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '3rem' }}>
                        {[
                          { label: 'PROBLEM', text: project.problem },
                          { label: 'INSIGHT', text: project.insight },
                          { label: 'SOLUTION', text: project.solution },
                        ].map(({ label, text }) => (
                          <div key={label}>
                            <p className="row-label" style={{ marginBottom: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{label}</p>
                            <p className="body-text">{text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Right */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                          <p className="row-label" style={{ marginBottom: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>ROLE</p>
                          <p className="body-text" style={{ color: 'rgba(255,255,255,0.8)' }}>{project.role}</p>
                        </div>
                        <div>
                          <p className="row-label" style={{ marginBottom: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>STACK</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {project.stack.map(s => (
                              <span key={s} className="tag" style={{ cursor: 'auto' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="row-label" style={{ marginBottom: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>NEXT MILESTONE</p>
                          <p className="body-text" style={{ color: 'rgba(255,255,255,0.8)' }}>{project.milestone}</p>
                        </div>
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', marginTop: '1rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                          >
                            VIEW REPOSITORY ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
