'use client';
import { useEffect, useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';

function useLiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

export default function HUD({ isBooted }: { isBooted: boolean }) {
  const time = useLiveTime();
  const { isMuted, toggleMute } = useUI();

  const hudStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase' as const,
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 999,
    opacity: isBooted ? 1 : 0,
    transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <>
      {/* Top-left — OS label */}
      <div style={{ ...hudStyle, top: '1.8rem', left: '2rem', transform: isBooted ? 'translate(0, 0)' : 'translate(-20px, -20px)', transitionDelay: '0.6s' }}>
        <div>Founder OS v2.0</div>
      </div>

      {/* Top-right — coordinates */}
      <div style={{ ...hudStyle, top: '1.8rem', right: '2rem', textAlign: 'right', transform: isBooted ? 'translate(0, 0)' : 'translate(20px, -20px)', transitionDelay: '0.7s' }}>
        <div>12.9716° N</div>
        <div>77.5946° E</div>
      </div>

      {/* Bottom-left — status + audio toggle */}
      <div style={{ ...hudStyle, bottom: '1.8rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', transform: isBooted ? 'translate(0, 0)' : 'translate(-20px, 20px)', transitionDelay: '0.8s', pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
          <span className="live-dot" />
          ONLINE
        </div>
        
        <button 
          onClick={toggleMute}
          data-magnetic="true"
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'inherit',
            fontSize: '10px',
            padding: '4px 8px',
            cursor: 'none',
            outline: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.color = '#fff'; 
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; 
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          AUDIO: {isMuted ? 'OFF' : 'ON'}
        </button>
      </div>

      {/* Bottom-right — clock */}
      <div style={{ ...hudStyle, bottom: '1.8rem', right: '2rem', textAlign: 'right', transform: isBooted ? 'translate(0, 0)' : 'translate(20px, 20px)', transitionDelay: '0.9s' }}>
        <div>{time}</div>
      </div>
    </>
  );
}
