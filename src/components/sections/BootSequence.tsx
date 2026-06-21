'use client';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface ProcessLine {
  label: string;
  status: string;
  triggerAt: number; // percentage (0-100)
}

const PROCESSES: ProcessLine[] = [
  { label: 'IDENTITY_MODULE', status: 'VERIFIED', triggerAt: 15 },
  { label: 'CORE_SYSTEMS', status: 'ONLINE', triggerAt: 35 },
  { label: 'NETWORK_UPLINK', status: 'ESTABLISHED', triggerAt: 55 },
  { label: 'UI_ENGINE', status: 'ACTIVE', triggerAt: 75 },
  { label: 'NEURAL_LINK', status: 'SYNCED', triggerAt: 90 },
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logRafRef = useRef<number>(0);

  useEffect(() => {
    const seen = typeof window !== 'undefined' ? sessionStorage.getItem('boot_done') : null;
    if (seen) {
      const t = setTimeout(() => {
        onComplete();
      }, 0);
      return () => clearTimeout(t);
    }

    const duration = 2800; // 2.8 seconds boot
    const progressObj = { p: 0 };

    anime({
      targets: progressObj,
      p: 100,
      duration: duration,
      easing: 'easeInOutExpo',
      update: () => {
        setProgress(Math.floor(progressObj.p));
      },
      complete: () => {
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            sessionStorage.setItem('boot_done', '1');
            onComplete();
          }, 700);
        }, 600);
      }
    });

    // Fast moving logs generator
    const chars = '0123456789ABCDEF';
    const generateLog = () => `0x${Array(8).fill(0).map(() => chars[Math.floor(Math.random() * 16)]).join('')} [SYS_OK]`;

    let lastLogTime = 0;
    const updateLogs = (time: number) => {
      if (progressObj.p >= 100) return;
      if (time - lastLogTime > 40) { // New log every 40ms
        setLogs(prev => {
          const newLogs = [...prev, generateLog()];
          if (newLogs.length > 5) newLogs.shift();
          return newLogs;
        });
        lastLogTime = time;
      }
      logRafRef.current = requestAnimationFrame(updateLogs);
    };
    logRafRef.current = requestAnimationFrame(updateLogs);

    return () => {
      if (logRafRef.current) cancelAnimationFrame(logRafRef.current);
    };
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="System initialization in progress"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(2rem, 10vw, 8rem)',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fadingOut ? 'none' : 'all',
      }}
    >
      {/* A11y Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {fadingOut ? 'Portfolio loaded. Welcome.' : `Loading portfolio, ${progress}% complete.`}
      </div>

      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            FOUNDER OS v2.0
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
              {'>'} INITIALIZING KERNEL...
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', letterSpacing: '0.05em', color: 'var(--color-accent)', fontWeight: 'bold' }}>
              {progress.toString().padStart(3, '0')}%
            </p>
          </div>
        </div>

        {/* Progress Bar with "effects" */}
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)', marginBottom: '3rem', position: 'relative' }}>
          {/* Main fill */}
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--color-accent)', 
            boxShadow: '0 0 10px rgba(110,231,247,0.5)',
            transition: 'width 0.1s linear'
          }} />
          {/* Scanning line effect over the filled portion */}
          <div style={{
            position: 'absolute',
            top: 0, height: '100%',
            width: '20px',
            background: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 15px #fff',
            left: `${Math.max(0, progress - 2)}%`,
            opacity: progress > 0 && progress < 100 ? 1 : 0,
            transition: 'left 0.1s linear'
          }} />
        </div>

        {/* Process lines and System Logs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Process Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {PROCESSES.map((proc) => {
              const active = progress >= proc.triggerAt;
              return (
                <div
                  key={proc.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'clamp(120px, 15vw, 200px) 1fr',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', 
                    color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', 
                    textTransform: 'uppercase',
                    transition: 'color 0.1s ease'
                  }}>
                    {proc.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em',
                    color: active ? 'var(--color-accent)' : 'transparent',
                    textTransform: 'uppercase',
                    textShadow: active ? '0 0 8px rgba(110,231,247,0.4)' : 'none',
                  }}>
                    [{proc.status}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: High Speed Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', justifyContent: 'flex-start', overflow: 'hidden', height: '120px' }}>
            {logs.map((log, i) => (
              <span key={i} style={{ 
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', 
                color: 'rgba(255,255,255,0.15)',
                whiteSpace: 'nowrap'
              }}>
                {log}
              </span>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          opacity: progress === 100 ? 1 : 0,
          marginTop: '4rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1.5rem',
          transition: 'opacity 0.4s ease'
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>
            {'>'} SYSTEM INITIALIZED — WELCOME
          </p>
        </div>

      </div>

      {/* Skip Button */}
      <button
        aria-label="Skip boot sequence and enter portfolio"
        onClick={() => {
          setFadingOut(true);
          setTimeout(() => { sessionStorage.setItem('boot_done', '1'); onComplete(); }, 400);
        }}
        style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.18)',
          background: 'none', border: 'none',
          textTransform: 'uppercase', cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
      >
        SKIP →
      </button>
    </div>
  );
}
