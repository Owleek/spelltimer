export const SOUND = '/sounds/sound.mp3';
export const RUN_SOUND = '/sounds/silence.mp3';
export const END_SOUND = '/sounds/end.mp3';
export const AUTOEND = 'autoend';

// Singleton AudioContext and in-memory buffer cache to achieve near-zero latency playback
let audioContext: AudioContext | null = null;
const urlToAudioBuffer: Map<string, AudioBuffer> = new Map();

function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    return audioContext;
  } catch {
    return null;
  }
}

export async function unlockAudio(): Promise<void> {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  // Resume context on user gesture to allow playback on iOS/Safari
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch {}
  }
}

export async function preloadSound(url: string): Promise<void> {
  const ctx = ensureAudioContext();
  if (!ctx || urlToAudioBuffer.has(url)) return;
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    urlToAudioBuffer.set(url, audioBuffer);
  } catch (error) {
    console.warn('Failed to preload sound:', url, error);
  }
}

export async function playSound(src: string, withsound?: boolean): Promise<void> {
  if (!withsound) return;

  const ctx = ensureAudioContext();
  if (!ctx) {
    // Fallback to HTMLAudio if WebAudio is not available
    try {
      const audio = new Audio(src);
      await audio.play();
    } catch (e) {
      console.warn('Sound blocked or failed (fallback):', e);
    }
    return;
  }

  // Ensure unlocked for iOS/Safari
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch {}
  }

  try {
    let buffer = urlToAudioBuffer.get(src);
    if (!buffer) {
      // Lazy-load if not preloaded
      const response = await fetch(src, { cache: 'force-cache' });
      const arrayBuffer = await response.arrayBuffer();
      buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      urlToAudioBuffer.set(src, buffer);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 1;
    source.connect(gain).connect(ctx.destination);
    source.start(0);
  } catch (e) {
    console.warn('Sound play failed:', e);
  }
}

export function clearSoundCache(): void {
  urlToAudioBuffer.clear();
}

