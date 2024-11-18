import WebSocketComponent from "@/features/realtime-client/web-client";

export default function Home() {
  return (
    <div className="min-h-screen min-w-full overflow-hidden flex items-center justify-center">
      <div className="container max-w-2xl mx-auto">
        <WebSocketComponent />
      </div>
    </div>
  );
}
