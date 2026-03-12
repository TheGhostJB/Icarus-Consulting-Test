import { useState, ChangeEvent } from "react";
import type { ChatMessage } from "../../types";

function FanChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { user: "TitanFan_2026", text: "Let's go Titans!" },
    { user: "Nashville_Mike", text: "Defense looking strong!" },
  ]);

  const [input, setInput] = useState("");

  function sendMessage(): void {
    if (!input.trim()) return;

    setMessages([...messages, { user: "You", text: input }]);
    setInput("");
  }

  return (
    <div className="fan-chat">
      <h3>Fan Chat</h3>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Say something..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default FanChat;
