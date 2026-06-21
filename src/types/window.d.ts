// Extend Window interface for Web Audio API
interface Window {
  webkitAudioContext?: typeof AudioContext;
}
