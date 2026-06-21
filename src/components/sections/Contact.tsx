'use client';
import { useState, useRef, createRef, useEffect } from 'react';
import { useSlapIn } from '@/hooks/useSlapIn';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/62fpsgaming-hue',
    display: 'github.com/62fpsgaming-hue',
    suffix: '↗',
    action: () => window.open('https://github.com/62fpsgaming-hue', '_blank', 'noopener,noreferrer'),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/neeraj-saini-464318232/',
    display: 'linkedin.com/in/neeraj-saini',
    suffix: '↗',
    action: () => window.open('https://www.linkedin.com/in/neeraj-saini-464318232/', '_blank', 'noopener,noreferrer'),
  },
  {
    label: 'Email',
    href: 'mailto:neeraj200621@gmail.com',
    display: 'neeraj200621@gmail.com',
    suffix: '→',
    copyable: true,
    copyValue: 'neeraj200621@gmail.com',
    action: null, // handled by handleCopy
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);
  
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [linkRefs] = useState(() => LINKS.map(() => createRef<HTMLAnchorElement>()));

  // Slap effect for headline
  useSlapIn([headlineRef], { triggerRef: containerRef, yOffset: -80, scale: 1.1 });
  
  // Slap effect for links
  useSlapIn(linkRefs, { triggerRef: containerRef, xOffset: -40, yOffset: 0, scale: 1, stagger: 0.07, delay: 0.2 });

  // Animate the 52% progress bar on scroll into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { p: 0 };
      gsap.to(obj, {
        p: 52,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          once: true,
        },
        onUpdate: () => {
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.round(obj.p)}%`;
          }
          if (progressNumRef.current) {
            progressNumRef.current.textContent = `${Math.round(obj.p)}%`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Ghost >_ background element */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '-2%',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(14rem, 28vw, 32rem)',
        fontWeight: 700,
        lineHeight: 1,
        color: 'rgba(255,255,255,0.025)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        letterSpacing: '-0.06em',
      }}>
        &gt;_
      </div>

      <div style={{ width: '100%', maxWidth: '900px', position: 'relative', zIndex: 1 }}>
        {/* Headline */}
        <h2
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            color: '#fff',
            marginBottom: '3rem',
          }}
        >
          LET&apos;S BUILD<br />
          SOMETHING REAL.
        </h2>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '3rem' }} />

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              ref={linkRefs[i]}
              href={link.copyable ? undefined : link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              role={link.copyable ? 'button' : undefined}
              tabIndex={0}
              onClick={link.copyable
                ? (e) => handleCopy(e, link.copyValue!)
                : link.action
                ? (e) => { e.preventDefault(); link.action!(); }
                : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (link.copyable) {
                    navigator.clipboard.writeText(link.copyValue!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } else if (link.action) {
                    link.action();
                  }
                }
              }}
              data-magnetic="true"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 1rem',
                margin: '0 -1rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(13px, 2vw, 18px)',
                letterSpacing: '0.06em',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                cursor: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              onFocus={e => { e.currentTarget.style.color = '#fff'; }}
              onBlur={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.7em', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
                  {link.label.toUpperCase()}
                </span>
                <span>{link.display}</span>
              </div>
              <span style={{ fontSize: '0.85em', opacity: 0.5, transition: 'opacity 0.2s' }}>
                {link.copyable && copied ? 'COPIED ✓' : link.suffix}
              </span>
            </a>
          ))}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginTop: '0', marginBottom: '4rem' }} />

        {/* Final status — animated progress bar */}
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          <p className="row-label" style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.3)' }}>
            CURRENT STATUS
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
              <div
                ref={progressBarRef}
                style={{ width: '0%', height: '100%', background: 'rgba(255,255,255,0.5)', transition: 'none' }}
              />
            </div>
            <span ref={progressNumRef} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>0%</span>
          </div>
          <p style={{ fontSize: '12px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
            Next Chapter Loading...&nbsp;
            <span style={{ animation: 'blink 1s step-end infinite', display: 'inline-block', color: 'rgba(255,255,255,0.7)' }}>▋</span>
          </p>
        </div>
      </div>

      {/* Footer closing mark */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.2em',
      }}>
        <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        {'// END OF TRANSMISSION.'}
        <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>
    </div>
  );
}
