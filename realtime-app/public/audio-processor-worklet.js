const MIN_INT16 = -0x8000;
const MAX_INT16 = 0x7fff;

class PCMAudioProcessor extends AudioWorkletProcessor {
  // Removed empty constructor

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const float32Buffer = input[0];
      const int16Buffer = this.float32ToInt16(float32Buffer);
      this.port.postMessage(int16Buffer);
    }
    return true;
  }

  float32ToInt16(float32Array) {
    // Optimized conversion without loop
    return Int16Array.from(float32Array, (sample) => {
      let val = sample * MAX_INT16;
      return Math.max(MIN_INT16, Math.min(MAX_INT16, val));
    });
  }
}

registerProcessor("audio-processor-worklet", PCMAudioProcessor);
