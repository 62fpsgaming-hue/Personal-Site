import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useSlapIn(
  refs: React.RefObject<HTMLElement | null>[],
  options: {
    stagger?: number;
    delay?: number;
    triggerRef?: React.RefObject<HTMLElement | null>;
    yOffset?: number;
    xOffset?: number;
    scale?: number;
    start?: string;
  } = {}
) {
  useEffect(() => {
    const elements = refs.map((r) => r.current).filter(Boolean);
    if (elements.length === 0) return;

    const triggerElement = options.triggerRef?.current || elements[0];

    // A11y #10: If the user prefers reduced motion, immediately reveal elements
    // without any animation instead of a jarring entrance effect.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(elements, {
        y: options.yOffset ?? -50,
        x: options.xOffset ?? 0,
        scale: options.scale ?? 1.06,
        opacity: 0,
        filter: 'blur(4px)',
      });

      // Animate in
      gsap.to(elements, {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'back.out(2.8)',
        stagger: options.stagger ?? 0.08,
        delay: options.delay ?? 0,
        scrollTrigger: {
          trigger: triggerElement,
          start: options.start ?? 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [refs, options.stagger, options.delay, options.triggerRef, options.yOffset, options.xOffset, options.scale, options.start]);
}
