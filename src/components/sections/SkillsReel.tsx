'use client';
import { useEffect, useRef, createRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlapIn } from '@/hooks/useSlapIn';

gsap.registerPlugin(ScrollTrigger);

const SKILL_GROUPS = [
  { category: 'BACKEND', skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'REST APIs', 'GraphQL', 'Microservices', 'Docker'] },
  { category: 'FRONTEND', skills: ['React', 'Next.js', 'TypeScript', 'HTML/CSS'] },
  { category: 'SYSTEMS', skills: ['Linux', 'CI/CD', 'Git', 'Cloud Arch.', 'Nginx'] },
  { category: 'LEARNING', skills: ['Distributed Systems', 'Rust', 'AI/ML Pipelines', 'WebSockets'] },
];

export default function SkillsReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [headerRefs] = useState(() => SKILL_GROUPS.map(() => createRef<HTMLParagraphElement>()));
  
  const totalSkills = SKILL_GROUPS.reduce((acc, g) => acc + g.skills.length, 0);
  const [tagRefs] = useState(() => Array.from({ length: totalSkills }).map(() => createRef<HTMLSpanElement>()));

  useSlapIn(headerRefs, { triggerRef: containerRef, yOffset: -30, scale: 1.05, stagger: 0 });
  useSlapIn(tagRefs, { triggerRef: containerRef, yOffset: -20, xOffset: -20, scale: 1.1, stagger: 0.04, delay: 0.1 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade out on exit
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 50%',
          end: 'bottom 0%',
          scrub: 1,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  let tagIndex = 0;

  return (
    <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', padding: '4rem 2rem 6rem 2rem', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        {/* Section label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem' }}>
          <p className="section-label" style={{ margin: 0 }}>
            — TECHNICAL STACK
          </p>
          <p className="section-label" style={{ margin: 0, color: 'rgba(255,255,255,0.2)' }}>
            {totalSkills} SKILLS
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {SKILL_GROUPS.map((group, i) => (
            <div key={group.category}>
              <p ref={headerRefs[i]} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(15px, 2.2vw, 18px)',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.88)',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.6rem',
              }}>
                <span>{group.category}</span>
                <span style={{ color: 'rgba(110,231,247,0.5)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: 'normal' }}>({group.skills.length})</span>
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.5rem' }}>
                {group.skills.map((skill) => {
                  const currentIndex = tagIndex++;
                  return (
                    <span
                      key={skill}
                      ref={tagRefs[currentIndex]}
                      className="tag"
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
