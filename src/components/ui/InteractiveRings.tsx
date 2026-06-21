'use client';
import { useEffect, useRef, useState } from 'react';

export default function InteractiveRings() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configure video for production
    video.muted = true;
    video.playbackRate = 1;
    video.volume = 0;

    // Attempt to play on mount
    const attemptPlay = async () => {
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasError(false);
            })
            .catch(() => {
              // Autoplay blocked - will retry on user interaction
              console.debug('Video autoplay policy prevented auto-play');
            });
        }
      } catch (error) {
        console.debug('Video play attempt failed', error);
      }
    };

    // Delay play to ensure DOM is fully ready
    const playTimeout = setTimeout(attemptPlay, 150);

    // Fallback: play on first user interaction
    const handleUserInteraction = async () => {
      if (!isPlaying && video && !hasError) {
        try {
          await video.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Video play failed on user interaction:', error);
          setHasError(true);
        }
      }
    };

    // Listen for user interactions to trigger play
    const events = ['click', 'touchstart', 'keydown', 'mousedown'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { once: false, passive: true });
    });

    // Monitor video lifecycle
    const handlePlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    
    const handlePause = () => setIsPlaying(false);
    
    const handleError = (e: Event) => {
      const mediaError = (e.target as HTMLVideoElement)?.error;
      console.error('Video error:', mediaError?.message);
      setHasError(true);
    };
    
    const handleEnded = () => {
      // Ensure loop continues (some browsers need explicit restart)
      if (video?.loop) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    const handleLoadedData = () => {
      console.debug('Video loaded successfully');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      clearTimeout(playTimeout);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isPlaying, hasError]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        backgroundColor: '#000',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        title="Animated black hole background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: '200vw',
          maxHeight: '200vh',
          objectFit: 'cover',
          pointerEvents: 'none',
          display: 'block',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      >
        <source src="/black-hole.m4a" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark vignette overlay to ensure center is visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 80%, #000 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Fallback solid background if video fails */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          zIndex: 0,
          display: hasError ? 'block' : 'none',
        }}
      />
    </div>
  );
}
