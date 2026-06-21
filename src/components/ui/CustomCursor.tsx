'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUI } from '@/components/providers/UIProvider';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useUI();

  useEffect(() => {
    const xTo = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'power3' });
    const yTo = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'power3' });
    const xToRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3' });
    const yToRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3' });

    let isMagnetic = false;
    let hoverTarget: HTMLElement | null = null;

    const move = (e: MouseEvent) => {
      if (isMagnetic && hoverTarget) {
        // Magnetic snap: pull cursor toward the center of the target element
        const rect = hoverTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 50% pull towards center
        const magneticX = e.clientX + (centerX - e.clientX) * 0.5;
        const magneticY = e.clientY + (centerY - e.clientY) * 0.5;
        
        xTo(magneticX);
        yTo(magneticY);
        xToRing(centerX);
        yToRing(centerY);
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
        xToRing(e.clientX);
        yToRing(e.clientY);
      }
    };

    const enter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], [data-magnetic]');
      
      if (interactive) {
        hoverTarget = interactive as HTMLElement;
        const isMag = interactive.hasAttribute('data-magnetic');
        isMagnetic = isMag;

        playHover();
        
        if (isMag) {
          // Simple circular snap
          gsap.to(ringRef.current, { 
            width: 46, 
            height: 46, 
            borderRadius: '50%',
            opacity: 0.8, 
            duration: 0.3,
            ease: 'back.out(1.5)'
          });
        } else {
          // Standard hover (scale up)
          gsap.to(ringRef.current, { scale: 1.8, opacity: 0.8, duration: 0.2 });
        }
        
        gsap.to(dotRef.current, { scale: 0.4, opacity: 0.5, duration: 0.2 });
      } else {
        const textNode = target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote');
        if (textNode) {
          // I-beam morph
          gsap.to(dotRef.current, { width: 2, height: 18, borderRadius: 0, scale: 1, opacity: 0.6, duration: 0.2 });
          gsap.to(ringRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
        }
      }
    };

    const leave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [data-magnetic]')) {
        isMagnetic = false;
        hoverTarget = null;
        
        gsap.to(ringRef.current, { 
          width: 28, 
          height: 28, 
          scale: 1, 
          borderRadius: '50%',
          opacity: 0.4, 
          duration: 0.25,
          ease: 'power3.out'
        });
        gsap.to(dotRef.current, { width: 5, height: 5, borderRadius: '50%', scale: 1, opacity: 1, duration: 0.25 });
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote')) {
        gsap.to(dotRef.current, { width: 5, height: 5, borderRadius: '50%', scale: 1, opacity: 1, duration: 0.25 });
        gsap.to(ringRef.current, { opacity: 0.4, scale: 1, duration: 0.25 });
      }
    };

    const clickDown = () => {
      gsap.to(ringRef.current, { scale: 0.8, duration: 0.1 });
    };

    const clickUp = () => {
      const targetScale = isMagnetic ? 1 : (hoverTarget ? 1.8 : 1);
      gsap.to(ringRef.current, { scale: targetScale, duration: 0.3, ease: 'back.out(2)' });
      playClick();
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', enter);
    window.addEventListener('mouseout', leave);
    window.addEventListener('mousedown', clickDown);
    window.addEventListener('mouseup', clickUp);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', enter);
      window.removeEventListener('mouseout', leave);
      window.removeEventListener('mousedown', clickDown);
      window.removeEventListener('mouseup', clickUp);
    };
  }, [playHover, playClick]);

  const base: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 99999,
    transform: 'translate(-50%, -50%)',
    willChange: 'transform, width, height',
  };

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: '5px', height: '5px', background: '#fff', borderRadius: '50%' }} />
      <div ref={ringRef} style={{ ...base, width: '28px', height: '28px', border: '1px solid rgba(110,231,247,0.5)', opacity: 0.4, borderRadius: '50%' }} />
    </>
  );
}
