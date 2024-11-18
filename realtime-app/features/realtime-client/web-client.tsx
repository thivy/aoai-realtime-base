"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { connectRealtime, disconnectRealtime } from "./realtime-client";
import { useRealtimeStore } from "./realtime-store";

const WebSocketComponent = () => {
  const loading = useRealtimeStore((state) => state.loading);
  let buttonNode: ReactNode = null;

  if (loading === "connected") {
    buttonNode = (
      <Button variant={"destructive"} onClick={disconnectRealtime}>
        Disconnect
      </Button>
    );
  } else if (loading === "connecting") {
    buttonNode = <p>Connecting...</p>;
  } else {
    buttonNode = <Button onClick={() => connectRealtime()}>Connect</Button>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime API</CardTitle>
        <CardDescription>
          Status:
          <Badge variant="outline">{loading}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>{buttonNode}</CardContent>
    </Card>
  );
};

export default WebSocketComponent;
