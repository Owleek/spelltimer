export const SOUND = '/sounds/sound.mp3';
export const RUN_SOUND = '/sounds/run.mp3';
export const PAUSE_SOUND = '/sounds/pause.mp3';
export const END_SOUND = '/sounds/end.mp3';
export const AUTOEND = 'autoend';

export const playSound = (src: string, withsound?: boolean) => {
  if (!withsound) return;
  const audio = new Audio(src);
  audio.play().catch((e) => {
    console.warn('Sound blocked or failed:', e);
  });
};