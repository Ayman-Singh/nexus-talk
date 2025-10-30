import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { threadId } = useParams();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { sender: "user1", text: "Hey!" },
    { sender: "user2", text: "Hello!" },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setMsgs(msgs.concat([{ sender: "me", text: input }]));
    setInput("");
  };

  return (
    <div>
      <h2>Chat: {threadId}</h2>
      <div style={{ minHeight: 80, border: "1px solid #ccc", padding: 6 }}>
        {msgs.map((m, idx) => (
          <div key={idx}><b>{m.sender}:</b> {m.text}</div>
        ))}
      </div>
      <form onSubmit={send}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type..." />
        <button>Send</button>
      </form>
    </div>
  );
}
