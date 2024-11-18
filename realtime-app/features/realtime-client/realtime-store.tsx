import { toast } from "sonner";
import { create } from "zustand";

type LoadingState =
  | "idle"
  | "connecting"
  | "disconnecting"
  | "reconnecting"
  | "connected"
  | "error";

interface RealtimeState {
  loading: LoadingState;
  displayResults: string | undefined;
}

export const useRealtimeStore = create<RealtimeState>()(() => ({
  loading: "idle",
  displayResults: undefined,
}));

export const setLoading = (loading: LoadingState) => {
  const state = useRealtimeStore.getState();
  state.loading = loading;
  useRealtimeStore.setState(() => ({ ...state }));
};

export const setDisplayResults = (displayResults: string) => {
  const state = useRealtimeStore.getState();
  state.displayResults = displayResults;
  useRealtimeStore.setState(() => ({ ...state }));
  toast("Function call result", {
    description: displayResults,
    action: {
      label: "Close",
      onClick: () => {},
    },
  });
};
