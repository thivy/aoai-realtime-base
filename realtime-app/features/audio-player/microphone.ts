"use client";

const SAMPLE_RATE = 24000;
const BUFFER_SIZE = 4800;

export class Microphone {
  audioContext: AudioContext | null = null;
  mediaStream: MediaStream | null = null;
  mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  workletNode: AudioWorkletNode | null = null;
  buffer: Uint8Array = new Uint8Array();
  onDataAvailable: (buffer: Int16Array) => void;

  public constructor(onDataAvailable: (int16Array: Int16Array) => void) {
    this.onDataAvailable = onDataAvailable;
  }

  async start() {
    await this.init();
  }

  async stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
    }

    this.mediaStreamSource = null;
    this.workletNode = null;
    this.audioContext = null;
    this.buffer = new Uint8Array();
  }

  handleAudioData(data: Int16Array) {
    const uint8Array = new Uint8Array(data);

    // Append new data to the buffer
    const newBuffer = new Uint8Array(this.buffer.length + uint8Array.length);
    newBuffer.set(this.buffer);
    newBuffer.set(uint8Array, this.buffer.length);
    this.buffer = newBuffer;

    // Check if the buffer has reached the BUFFER_SIZE
    if (newBuffer.length >= BUFFER_SIZE) {
      const toSend = new Uint8Array(newBuffer.slice(0, BUFFER_SIZE));
      const remainingBuffer = new Uint8Array(newBuffer.slice(BUFFER_SIZE));
      this.buffer = remainingBuffer;

      // Convert to Int16Array and handle the recorded audio data
      const int16Array = new Int16Array(toSend.buffer);
      this.onDataAvailable(int16Array);
    }
  }

  private async init() {
    this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    await this.audioContext.audioWorklet.addModule(
      "./audio-processor-worklet.js"
    );

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(
      this.mediaStream
    );

    this.workletNode = new AudioWorkletNode(
      this.audioContext,
      "audio-processor-worklet"
    );

    this.workletNode.port.onmessage = (event) => {
      this.handleAudioData(event.data.buffer);
    };

    this.mediaStreamSource.connect(this.workletNode);
    this.workletNode.connect(this.audioContext.destination);
  }
}
