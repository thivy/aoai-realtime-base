import { WSContext } from "hono/ws";
import { RealtimeServerEvents } from "openai-realtime-api";
import WebSocket from "ws";

export type OpenAIConfig = {
  endpoint: string;
  path?: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
};

export class RealtimeSession {
  private _realtimeWebSocket?: WebSocket;

  private _serverSocket: WSContext<unknown> | null = null;

  private _messageQueue: WebSocket.Data[] = [];

  constructor() {}

  public get socket(): WebSocket {
    return this._realtimeWebSocket!;
  }

  public get isConnected(): boolean {
    return this._realtimeWebSocket?.readyState === WebSocket.OPEN;
  }

  public async connect(ws: WSContext<unknown>): Promise<boolean> {
    const { url, openAIConfig } = this.openAIConfig();
    this._serverSocket = ws;

    try {
      this._realtimeWebSocket = new WebSocket(url.toString(), {
        headers: { "api-key": openAIConfig.apiKey },
      });

      await new Promise((resolve, reject) => {
        this._realtimeWebSocket!.on("open", resolve);
        this._realtimeWebSocket!.on("error", reject);
      });

      this._realtimeWebSocket.on("message", (data) =>
        this.handleServerEvent(data)
      );
      return true;
    } catch (err) {
      this.sendError(`${err}`);
    }

    return false;
  }

  private sendError(message: string) {
    const errorEvent: RealtimeServerEvents.ErrorEvent = {
      type: "error",
      event_id: "error",
      error: {
        type: "error",
        message: message,
      },
    };
    this._serverSocket?.send(JSON.stringify(errorEvent));
    console.error(message);
  }

  private openAIConfig() {
    const openAIConfig: OpenAIConfig = {
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    };

    const url = new URL(openAIConfig.endpoint);
    url.pathname = openAIConfig.path ?? "openai/realtime";
    url.searchParams.append("api-version", openAIConfig.apiVersion);
    url.searchParams.append("deployment", openAIConfig.deployment);

    return { url, openAIConfig };
  }

  private async handleServerEvent(data: WebSocket.Data) {
    this._serverSocket?.send(data.toString());
  }

  public send(data: WebSocket.Data) {
    try {
      if (this.isConnected) {
        this.socket.send(data.toString());
      } else {
        this._messageQueue.push(data);
      }
    } catch (e) {
      console.log("Error sending message", e);
    }
  }

  public disconnect() {
    if (
      this._realtimeWebSocket &&
      this._realtimeWebSocket.readyState === WebSocket.OPEN
    ) {
      this._realtimeWebSocket.close();
    }
  }

  public playQueuedMessages() {
    if (this.isConnected && this._messageQueue.length > 0) {
      while (this._messageQueue.length) {
        const event = this._messageQueue.shift();
        if (event !== undefined) {
          this._serverSocket?.send(JSON.stringify(event));
        }
      }
    }
  }
}
