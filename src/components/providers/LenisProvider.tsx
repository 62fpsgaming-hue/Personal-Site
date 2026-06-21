'use client';
import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect prefers-reduced-motion — skip smooth scroll entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Fix #3: Integrate Lenis with GSAP ticker instead of a raw RAF loop.
    // This keeps GSAP's ScrollTrigger in sync with Lenis's virtual scroll position.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Proxy native scroll reads through Lenis so trigger start/end positions are accurate
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      // Fix #1: Remove the GSAP ticker callback so the loop stops on unmount.
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
      ScrollTrigger.removeEventListener('refresh', () => lenis.resize());
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
