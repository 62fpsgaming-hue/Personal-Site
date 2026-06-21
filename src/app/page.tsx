'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import BootSequence from '@/components/sections/BootSequence';
import Hero from '@/components/sections/Hero';
import WhoIAm from '@/components/sections/WhoIAm';
import Experience from '@/components/sections/Experience';
import Artifacts from '@/components/sections/Artifacts';
import SkillsReel from '@/components/sections/SkillsReel';
import Beliefs from '@/components/sections/Beliefs';
import Systems from '@/components/sections/Systems';
import Contact from '@/components/sections/Contact';
import HUD from '@/components/layout/HUD';
import TopographicBackground from '@/components/ui/TopographicBackground';

// Cursor only on client (no SSR)
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });

export default function HomePage() {
  const [booted, setBooted] = useState(false);

  return (
    <main style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Ambient background orbs */}
      <div className="ambient-orbs">
        <div className="ambient-orb-c" />
      </div>

      {/* Global background layers */}
      <TopographicBackground />
      <div className="grain" />
      <div className="grid-overlay" />
      <div className="vignette" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Global HUD overlay */}
      <HUD isBooted={booted} />

      {/* Boot Sequence (blocks until done) */}
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {/* Main content — Founder-first narrative order */}
      <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
        <Hero isBooted={booted} />
        <WhoIAm />
        <Experience />
        <Artifacts />
        <SkillsReel />
        <Beliefs />
        <Systems />
        <Contact />
      </div>
    </main>
  );
}
