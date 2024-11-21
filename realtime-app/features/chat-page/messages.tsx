"use client";
import { Message } from "ai/react";
import { Bot, User } from "lucide-react";
import { ScrollIntoView } from "./scroll-into-view";

interface ChatInputProps {
  messages: Message[];
}

export const Messages = (props: ChatInputProps) => {
  const { messages } = props;
  return (
    <div className="h-full overflow-hidden overflow-y-auto">
      <div className="flex flex-col gap-8 container max-w-2xl mx-auto py-28 pb-52">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap flex gap-3">
            <div className="text-muted-foreground">
              {m.role === "user" ? <User /> : <Bot />}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
        <ScrollIntoView />
      </div>
    </div>
  );
};
