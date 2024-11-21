"use client";

import { useChat } from "ai/react";
import { ChatInput } from "./chat-input";
import { Messages } from "./messages";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  return (
    <>
      <Messages messages={messages} />

      <ChatInput
        value={input}
        handleInput={handleInputChange}
        submitForm={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
