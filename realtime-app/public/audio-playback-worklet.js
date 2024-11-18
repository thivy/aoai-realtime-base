class AudioPlaybackWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.port.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    if (event.data === null) {
      this.buffer = [];
    } else {
      this.buffer.push(...event.data);
    }
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];

    if (this.buffer.length >= channel.length) {
      const samples = this.buffer.splice(0, channel.length);
      channel.set(samples.map((v) => v / 32768));
    } else {
      channel.set(new Float32Array(channel.length));
    }

    return true;
  }
}

registerProcessor("audio-playback-worklet", AudioPlaybackWorklet);
