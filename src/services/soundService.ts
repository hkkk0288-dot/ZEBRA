/**
 * Web Audio API Sound Synthesizer for Kookoos
 * Generates realistic restaurant bells, kitchen dings, and cashier chimes
 * without relying on external MP3 assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Pleasant restaurant reception / kitchen order bell (brass chime)
 */
export function playOrderBellSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Harmonics for a pleasant brass bell
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(870, now + 1.2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1760, now); // A6 overtone
    osc2.frequency.exponentialRampToValueAtTime(1740, now + 0.8);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
  } catch (e) {
    console.warn('Audio playback not permitted yet:', e);
  }
}

/**
 * Two-tone Ding-Dong for Waiter Call & Notifications
 */
export function playWaiterCallSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Ding (Higher pitch)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.55);

    // Dong (Lower pitch after 250ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.25); // C5
    gain2.gain.setValueAtTime(0.001, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.35, now + 0.27);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.2);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

/**
 * Cash register / Payment success sound (cheerful arpeggio)
 */
export function playPaymentSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

/**
 * Celebratory fanfare for Scratch Card Win
 */
export function playCelebrationSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const now = ctx.currentTime;

    chords.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.001, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.9);
    });
  } catch (e) {
    console.warn('Celebration sound error:', e);
  }
}
