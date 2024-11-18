import { create } from "zustand";
import { sendAudio } from "../realtime-client/realtime-client";
import { Microphone } from "./microphone";
import { Speaker } from "./speaker";

const onAudioReceived = (int16Array: Int16Array) => {
  sendAudio(int16Array);
};

const microphone = new Microphone(onAudioReceived);
const speaker = new Speaker();

interface AudioPlayerState {
  isPlaying: boolean;
  isReady: "idle" | "initializing" | "ready" | "error";
}

export const useAudioPlayerStore = create<AudioPlayerState>(() => ({
  isPlaying: false,
  isReady: "idle",
}));

export const initAudioPlayer = async () => {
  const state = getState();
  state.isReady = "initializing";
  setState(state);

  await microphone.start();
  await speaker.init();

  state.isReady = "ready";
  setState(state);
};

export const playAudio = async (base64Audio: string) => {
  const state = getState();
  speaker.play(base64Audio);
  state.isPlaying = true;

  setState(state);
};

export const stopAudio = async () => {
  const state = getState();
  speaker.stop();
  state.isPlaying = false;

  setState(state);

  return speaker.offsetTime;
};

export const disposeAudioPlayer = async () => {
  const state = getState();
  state.isReady = "initializing";
  useAudioPlayerStore.setState(() => ({ ...state }));

  await microphone.stop();
  speaker.dispose();

  state.isPlaying = false;
  state.isReady = "idle";
  setState(state);
};

const setState = (newState: Partial<AudioPlayerState>) => {
  useAudioPlayerStore.setState((state) => ({ ...state, ...newState }));
};

const getState = () => {
  return useAudioPlayerStore.getState();
};
