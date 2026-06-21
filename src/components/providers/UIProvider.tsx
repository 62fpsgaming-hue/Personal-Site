'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

type AudioContextType = {
  playHover: () => void;
  playClick: () => void;
  playScrollTick: () => void;
  playBoot: () => void;
  toggleMute: () => void;
  isMuted: boolean;
};

const UIContext = createContext<AudioContextType>({
  playHover: () => {},
  playClick: () => {},
  playScrollTick: () => {},
  playBoot: () => {},
  toggleMute: () => {},
  isMuted: true,
});

export function UIProvider({ children }: { children: ReactNode }) {
  // Start muted to comply with browser autoplay policies
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Only initialize AudioContext when unmuted to prevent console warnings
    if (!isMuted && !audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
  }, [isMuted]);

  const playTone = (freq: number, type: OscillatorType, duration: number, vol: number) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio errors gracefully
    }
  };

  const playHover = () => playTone(800, 'sine', 0.05, 0.03);
  const playClick = () => playTone(1200, 'square', 0.08, 0.05);
  const playScrollTick = () => playTone(200, 'triangle', 0.03, 0.01);
  const playBoot = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    // Complex chord for boot sequence
    [300, 450, 600].forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.8, 0.05), i * 150);
    });
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <UIContext.Provider value={{ playHover, playClick, playScrollTick, playBoot, toggleMute, isMuted }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
