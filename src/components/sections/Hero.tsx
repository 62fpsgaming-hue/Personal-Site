'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveRings from '@/components/ui/InteractiveRings';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const TARGET = 'NEERAJ SAINI';

function useScramble(target: string, startDelay = 0) {
  const [text, setText] = useState(''.padEnd(target.length, '_'));
  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++;
        setText(
          target.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (frame > (i / target.length) * totalFrames + 10) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join('')
        );
        if (frame > totalFrames + 10) clearInterval(interval);
      }, 40);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [target, startDelay]);
  return text;
}

const LEFT_DATA = [
  { label: 'SYS', value: 'BENGALURU_NODE' },
  { label: 'PHASE', value: 'FOUNDATION_01' },
  { label: 'BUILD', value: '2025_ACTIVE' },
];
const RIGHT_DATA = [
  { label: 'CS', value: 'YEAR_02' },
  { label: 'STACK', value: 'BACKEND' },
  { label: 'VERSION', value: '1.0.3' },
];

const SUBTITLE_WORDS = ['Founder', '·', 'Builder', '·', 'Systems Engineer'];

export default function Hero({ isBooted }: { isBooted: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const subtitleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const leftDataRef = useRef<HTMLDivElement>(null);
  const rightDataRef = useRef<HTMLDivElement>(null);
  const ruleTopRef = useRef<HTMLDivElement>(null);
  const ruleBottomRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  const [bracketsVisible, setBracketsVisible] = useState(false);

  const name = useScramble(TARGET, isBooted ? 200 : 99999);

  useEffect(() => {
    if (!isBooted) return;

    const bracketTimer = setTimeout(() => setBracketsVisible(true), 600);

    const ctx = gsap.context(() => {
      // Subtitle word-by-word reveal with stagger
      const words = subtitleWordsRef.current.filter(Boolean);
      gsap.from(words, {
        opacity: 0,
        y: 6,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.8,
        ease: 'power2.out',
      });

      // Scroll indicator fade in
      gsap.from(scrollIndicatorRef.current, {
        opacity: 0, y: 10, duration: 0.8, delay: 1.2, ease: 'power2.out',
      });

      // Side data labels slide in
      gsap.from(leftDataRef.current, {
        opacity: 0, x: -20, duration: 0.8, delay: 0.8, ease: 'power2.out',
      });
      gsap.from(rightDataRef.current, {
        opacity: 0, x: 20, duration: 0.8, delay: 0.9, ease: 'power2.out',
      });

      // Expanding rules
      gsap.from([ruleTopRef.current, ruleBottomRef.current], {
        width: 0, duration: 1.0, delay: 0.6, stagger: 0.1, ease: 'power2.out',
      });

      // Name glow on settle (after scramble finishes ~1.8s)
      if (nameRef.current) {
        gsap.to(nameRef.current, {
          textShadow: '0 0 80px rgba(255,255,255,0.14), 0 0 30px rgba(255,255,255,0.06)',
          duration: 0.8,
          delay: 1.9,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          repeatDelay: 0.4,
          onComplete: () => {
            gsap.set(nameRef.current, { textShadow: 'none' });
          }
        });
      }

      // Scroll fade-out
      gsap.to(sectionRef.current, {
        opacity: 0, scale: 0.98,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: '30% top', scrub: 1,
        }
      });
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: '10% top', scrub: 1,
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      clearTimeout(bracketTimer);
    };
  }, [isBooted]);

  const dataLabelStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    lineHeight: 1.6,
  };

  const dataValueStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ zIndex: 10 }}
    >
      {/* Orbital rings / Globe */}
      <InteractiveRings />

      {/* Primary scan line */}
      <div className="hero-scanline" />

      {/* Secondary scan line — offset phase */}
      <div className="hero-scanline" style={{ animationDelay: '-4s', opacity: 0.4 }} />

      {/* Radial glow behind name */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Corner brackets */}
      <div className={`corner-bracket tl ${bracketsVisible ? 'visible' : ''}`} />
      <div className={`corner-bracket tr ${bracketsVisible ? 'visible' : ''}`} />
      <div className={`corner-bracket bl ${bracketsVisible ? 'visible' : ''}`} />
      <div className={`corner-bracket br ${bracketsVisible ? 'visible' : ''}`} />

      {/* Left side telemetry data */}
      <div
        ref={leftDataRef}
        style={{
          position: 'absolute',
          left: '2.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 5,
          opacity: isBooted ? 1 : 0,
        }}
      >
        {LEFT_DATA.map(item => (
          <div key={item.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={dataLabelStyle}>{item.label}:</span>
            <span style={dataValueStyle}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Right side telemetry data */}
      <div
        ref={rightDataRef}
        style={{
          position: 'absolute',
          right: '2.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          alignItems: 'flex-end',
          zIndex: 5,
          opacity: isBooted ? 1 : 0,
        }}
      >
        {RIGHT_DATA.map(item => (
          <div key={item.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={dataLabelStyle}>{item.label}:</span>
            <span style={dataValueStyle}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Expanding rule above name */}
      <div
        ref={ruleTopRef}
        className="name-rule"
        style={{ width: isBooted ? 'clamp(120px, 25vw, 280px)' : '0', marginBottom: '1.5rem', zIndex: 10 }}
      />

      {/* Name */}
      <h1
        ref={nameRef}
        className="font-display text-center z-10 select-none"
        style={{
          fontSize: 'clamp(4rem, 12vw, 11rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: '#fff',
        }}
      >
        {name}
      </h1>

      {/* Expanding rule below name */}
      <div
        ref={ruleBottomRef}
        className="name-rule"
        style={{ width: isBooted ? 'clamp(120px, 25vw, 280px)' : '0', marginTop: '1.5rem', zIndex: 10 }}
      />

      {/* Tagline — word-by-word stagger */}
      <p
        ref={subtitleRef}
        className="font-body z-10 mt-8 text-center"
        style={{
          fontSize: 'clamp(13px, 1.8vw, 15px)',
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.75)',
          textTransform: 'uppercase',
          display: 'flex',
          gap: '0.6em',
          alignItems: 'center',
        }}
      >
        {SUBTITLE_WORDS.map((word, i) => (
          <span
            key={i}
            ref={el => { subtitleWordsRef.current[i] = el; }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </span>
        ))}
      </p>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="font-mono" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
          Scroll to initiate
        </span>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '40%',
            background: 'rgba(255,255,255,0.5)',
            animation: 'scrollDot 1.8s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
}
