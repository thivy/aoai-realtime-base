"use client";

const SAMPLE_RATE = 24000;

export class Speaker {
  audioContext: AudioContext | null = null;
  playbackNode: AudioWorkletNode | null = null;
  startTime: number = 0;
  offsetTime: number = 0;

  async init() {
    this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    await this.audioContext.audioWorklet.addModule("audio-playback-worklet.js");

    this.playbackNode = new AudioWorkletNode(
      this.audioContext,
      "audio-playback-worklet"
    );

    this.playbackNode.connect(this.audioContext.destination);
  }

  play(base64Audio: string) {
    const binary = atob(base64Audio);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const pcmData = new Int16Array(bytes.buffer);

    if (this.audioContext && this.playbackNode) {
      this.startTime = this.audioContext.currentTime;
      this.playbackNode.port.postMessage(pcmData);
    }
  }

  stop() {
    if (!this.audioContext || !this.playbackNode) {
      return;
    }

    this.offsetTime = this.audioContext.currentTime - this.startTime;
    // this.startTime = this.audioContext.currentTime;
    this.playbackNode.port.postMessage(null);
  }

  dispose() {
    if (!this.audioContext || !this.playbackNode) {
      return 0;
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    const newOffsetTime = this.audioContext.currentTime - this.startTime;

    this.playbackNode.port.postMessage(null);
    this.startTime = this.audioContext.currentTime;
    this.offsetTime = newOffsetTime;
    this.playbackNode = null;
    this.audioContext = null;

    return newOffsetTime;
  }
}
