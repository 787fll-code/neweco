
class SoundService {
  private ctx: AudioContext | null = null;

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playRoll() {
    this.playTone(150, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(200, 'square', 0.1, 0.05), 50);
  }

  playMove() {
    this.playTone(400, 'sine', 0.05, 0.05);
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.1), 200); // G5
  }

  playError() {
    this.playTone(110, 'sawtooth', 0.3, 0.1);
  }

  playClick() {
    this.playTone(800, 'sine', 0.02, 0.02);
  }
}

export const sounds = new SoundService();
