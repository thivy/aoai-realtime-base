"use client";

import {
  disposeAudioPlayer,
  initAudioPlayer,
  playAudio,
  stopAudio,
} from "@/features/audio-player/audio-player";
import { resolveAfter } from "@/lib/utils";
import {
  FormattedItem,
  RealtimeClient,
  RealtimeCustomEvents,
  RealtimeServerEvents,
} from "openai-realtime-api";
import { setDisplayResults, setLoading } from "./realtime-store";
import { callWeather } from "./server-api";

let lastActiveAssistantItem: FormattedItem | null = null;

const realtimeClient = new RealtimeClient({
  url: `ws://localhost:4000/socket`,
  sessionConfig: {
    turn_detection: {
      type: "server_vad",
    },
  },
});

realtimeClient.on("realtime.event", (realtimeEvent) => {
  const { event } = realtimeEvent;

  switch (event.type) {
    case "session.created":
      greetUser();
      addInitialTools();
      break;
    case "response.audio.delta":
      playAudio(event.delta);
      break;
    case "conversation.item.created":
      handleFunctionCallOutput(event);
      break;
    case "error":
      handleErrors(event);
      break;
    default:
  }
});

realtimeClient.on("conversation.interrupted", async () => {
  await stopConversation();
});

realtimeClient.on("conversation.updated", async (audio) => {
  updateConversation(audio);
});

export const reTryConnection = async () => {
  setLoading("reconnecting");
  await disconnectRealtime();
  await resolveAfter(800);
  await connectRealtime();
};

export const connectRealtime = async () => {
  if (realtimeClient.isConnected) {
    return;
  }

  setLoading("connecting");

  try {
    await realtimeClient.connect();
    await initAudioPlayer();
    setLoading("connected");
    // Initiate the connection here, however, only greet the user if the connection is successful
  } catch (error) {
    setLoading("error");
    console.error("Connection error:", error);
  }
};

const handleFunctionCallOutput = (
  event: RealtimeServerEvents.ConversationItemCreatedEvent
) => {
  if (event.item.type === "function_call_output") {
    setDisplayResults(event.item.output);
  }
};

export const disconnectRealtime = async () => {
  setLoading("disconnecting");

  try {
    await realtimeClient.disconnect();
    setLoading("idle");
    disposeAudioPlayer();
  } catch (error) {
    setLoading("error");
    console.error("Disconnection error:", error);
  }
};

const stopConversation = async () => {
  if (lastActiveAssistantItem !== null) {
    await stopAudio();
    lastActiveAssistantItem = null;
  }
};

export const sendAudio = (int16Array: Int16Array) => {
  realtimeClient.appendInputAudio(int16Array);
};

const handleErrors = (error: RealtimeServerEvents.ErrorEvent) => {
  console.error(error.error.message);
  if (error.error.message.includes("429")) {
    reTryConnection();
  }
};

const addInitialTools = () => {
  realtimeClient.addTool(
    {
      name: "get_weather",
      description: "Retrieves the weather for a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Name of the location",
          },
        },
        required: ["location"],
      },
    },
    async ({ location }: { location: string }) => {
      console.log("Calling weather API");
      return await callWeather(location);
    }
  );
};

const greetUser = () => {
  setLoading("connected");

  realtimeClient.sendUserMessageContent([
    {
      type: "input_text",
      text: "Greet the user with a friendly message",
    },
  ]);
};

const updateConversation = async (
  audio: RealtimeCustomEvents.ConversationUpdatedEvent
) => {
  if (audio.delta) {
    if (audio.item.id && audio.item.role === "assistant") {
      lastActiveAssistantItem = audio.item;
    } else {
      lastActiveAssistantItem = null;
    }
  }
};
