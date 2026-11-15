/**
 * Chuông Chánh Niệm & Đồng Hồ Tọa Thiền (Zen Meditation Bell & Timer)
 * Tạo âm thanh chuông xoay / chuông gia trì thuần khiết bằng Web Audio API
 */
class ZenBellSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Phát tiếng chuông đồng thanh tịnh với các họa âm tự nhiên
   * @param {number} baseFreq - Tần số gốc (mặc định 432Hz)
   * @param {number} duration - Độ dài ngân vang (giây)
   */
  ring(baseFreq = 432, duration = 4.5) {
    try {
      this.init();
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // Bảng tần số họa âm chuông đồng thiền môn (Singing bowl partials)
      const partials = [
        { freqRatio: 1.000, gain: 0.65, decay: duration },
        { freqRatio: 2.760, gain: 0.35, decay: duration * 0.8 },
        { freqRatio: 5.404, gain: 0.18, decay: duration * 0.6 },
        { freqRatio: 8.931, gain: 0.08, decay: duration * 0.4 },
        { freqRatio: 1.006, gain: 0.25, decay: duration * 0.9 } // Beating effect (hiệu ứng rung lượn nhẹ)
      ];

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * p.freqRatio, now);

        // Nhẹ nhàng điều biến tần số tạo cảm giác chuông thật
        osc.frequency.exponentialRampToValueAtTime(baseFreq * p.freqRatio * 0.998, now + p.decay);

        pGain.gain.setValueAtTime(p.gain, now);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + p.decay);
      });

      // Tiếng gõ chạm mộc (mallet tap click)
      const tapOsc = ctx.createOscillator();
      const tapGain = ctx.createGain();
      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(baseFreq * 0.5, now);
      tapGain.gain.setValueAtTime(0.2, now);
      tapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      tapOsc.connect(tapGain);
      tapGain.connect(masterGain);

      tapOsc.start(now);
      tapOsc.stop(now + 0.08);

      return true;
    } catch (e) {
      console.warn('Web Audio Bell Error:', e);
      return false;
    }
  }

  /**
   * Âm thanh thiên nhiên nền thiền định thuần khiết bằng Web Audio API
   * @param {string} type - 'stream' (suối ngàn) hoặc 'rain' (mưa thiền)
   */
  startAmbient(type = 'stream') {
    try {
      this.init();
      this.stopAmbient();
      const ctx = this.audioCtx;
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.11; // Pink noise
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 950;
      filter.Q.value = type === 'rain' ? 1.0 : 2.5;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      this.ambientSource = { noise, lfo, gain };
      this.currentAmbientType = type;
      return true;
    } catch (e) {
      console.warn('Ambient Audio Error:', e);
      return false;
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        const { noise, lfo, gain } = this.ambientSource;
        const now = this.audioCtx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
        setTimeout(() => {
          try { noise.stop(); lfo.stop(); } catch {}
        }, 1600);
      } catch {}
      this.ambientSource = null;
      this.currentAmbientType = 'off';
    }
  }
}

// Global Zen Timer Controller
class MeditationTimerController {
  constructor() {
    this.bell = new ZenBellSynthesizer();
    this.totalSeconds = 15 * 60;
    this.remainingSeconds = this.totalSeconds;
    this.timerInterval = null;
    this.isRunning = false;
    this.intervalBellMinutes = 5;
    this.onTick = null;
    this.onComplete = null;
    this.onBreathingPhase = null;
    this.ambientMode = 'off';
  }

  setDuration(minutes) {
    if (this.isRunning) this.pause();
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);
  }

  setAmbient(mode) {
    this.ambientMode = mode;
    if (mode === 'off') {
      this.bell.stopAmbient();
    } else if (this.isRunning) {
      this.bell.startAmbient(mode);
    }
  }

  start() {
    if (this.isRunning) return;
    this.bell.init();
    this.bell.ring(432, 5.0); // Chuông bắt đầu
    if (this.ambientMode !== 'off') {
      this.bell.startAmbient(this.ambientMode);
    }
    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);

      // Chu kỳ hơi thở 4 thì (Hít 4s - Giữ 4s - Thở 6s - Buông 2s = 16s)
      if (this.onBreathingPhase) {
        const secInCycle = (this.totalSeconds - this.remainingSeconds) % 16;
        let phase = 'inhale';
        let text = 'Hít vào nhẹ nhàng · Thân tâm thanh tịnh';
        if (secInCycle >= 4 && secInCycle < 8) {
          phase = 'hold';
          text = 'An trú chánh niệm · Ghi nhận hiện tại';
        } else if (secInCycle >= 8 && secInCycle < 14) {
          phase = 'exhale';
          text = 'Thở ra êm dịu · Mỉm cười buông thư';
        } else if (secInCycle >= 14) {
          phase = 'rest';
          text = 'Buông xả vạn duyên · Tâm không vướng bận';
        }
        this.onBreathingPhase(phase, text, secInCycle);
      }

      // Chuông nhắc nhở từng mốc
      if (this.intervalBellMinutes > 0 && this.remainingSeconds > 0) {
        const elapsed = this.totalSeconds - this.remainingSeconds;
        if (elapsed % (this.intervalBellMinutes * 60) === 0) {
          this.bell.ring(528, 3.5); // Chuông nhắc chánh niệm
        }
      }

      // Hết giờ
      if (this.remainingSeconds <= 0) {
        this.pause();
        this.bell.stopAmbient();
        this.bell.ring(432, 6.0); // 3 tiếng chuông xả thiền
        setTimeout(() => this.bell.ring(432, 6.0), 2500);
        setTimeout(() => this.bell.ring(432, 7.0), 5000);
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.bell.stopAmbient();
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);
  }

  ringBellManually() {
    this.bell.ring(432, 5.0);
  }
}

window.zenBell = new ZenBellSynthesizer();
window.meditationTimer = new MeditationTimerController();
