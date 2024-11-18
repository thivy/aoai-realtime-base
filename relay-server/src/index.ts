import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import "dotenv/config";
import { Hono } from "hono";
import { RealtimeSession } from "./realtime-api/realtime-session.js";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get("/", async (c) => {
  return c.text("Hello, this is the relay server 📡");
});

app.get(
  "/socket",
  upgradeWebSocket((c) => {
    const session = new RealtimeSession();

    return {
      onOpen: async (_, ws) => {
        try {
          await session.connect(ws);
          session.playQueuedMessages();
        } catch (e) {
          console.log("Error connecting to OpenAI", e);
        }
      },
      onMessage(event, _) {
        session.send(event.data.toString());
      },
      onClose: () => {
        session.disconnect();
        console.log("Connection closed by client");
      },
      onError: (e) => {
        session.disconnect();
        console.log("WebSocket error:", e);
      },
    };
  })
);

const port = 4000;

console.log(`📡 Relay server listening on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
