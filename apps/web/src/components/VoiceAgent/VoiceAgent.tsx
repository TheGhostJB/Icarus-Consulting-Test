import { useState, useCallback } from "react";
import { useConversation } from "@11labs/react";
import MicButton from "./MicButton";
import StatusIndicator from "./StatusIndicator";
import TranscriptDisplay from "./TranscriptDisplay";
import type { Message } from "./TranscriptDisplay";

type Status = "idle" | "listening" | "thinking" | "speaking";

function VoiceAgent() {
  const [, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<Message[]>([]);

  const conversation = useConversation({
    onMessage: (response: { source: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: response.source === "ai" ? "agent" : "user",
          text: response.message,
        },
      ]);
    },
    onError: (error: unknown) => {
      console.error("Conversation error:", error);
      setStatus("idle");
    },
  });

  const getStatus = useCallback((): Status => {
    if (conversation.status === "connected") {
      if (conversation.isSpeaking) return "speaking";
      return "listening";
    }
    return "idle";
  }, [conversation.status, conversation.isSpeaking]);

  const handleToggle = async () => {
    if (conversation.status === "connected") {
      await conversation.endSession();
      setStatus("idle");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
    } catch (error) {
      console.error("Failed to start session:", error);
      setStatus("idle");
    }
  };

  const currentStatus =
    conversation.status === "connected" ? getStatus() : "idle";

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen bg-white text-gray-900">
      <h1 className="text-3xl font-bold text-blue-900">TitanCrew</h1>
      <p className="text-gray-500 text-sm">Voice AI Agent — TitanBot</p>
      <StatusIndicator status={currentStatus} />
      <TranscriptDisplay messages={messages} />
      <MicButton
        isActive={conversation.status === "connected"}
        onClick={handleToggle}
      />
    </div>
  );
}

export default VoiceAgent;
