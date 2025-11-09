import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread, sendMessage, Message } from "../api";

interface UIMessage {
  id: string;
  sender: string; // "me" or "other"
  text: string;
  sentAt: string;
}

export default function Chat() {
  const { threadId } = useParams();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const userRaw = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem("nt_user")) || localStorage.getItem("nt_user");
  const self = userRaw ? JSON.parse(userRaw) as {id:string, username:string} : null;
  // Attempt to derive peer user for header (prefer sessionStorage, fallback to localStorage)
  const peerRaw = threadId
    ? ((typeof sessionStorage !== 'undefined' && sessionStorage.getItem(`nt_thread_peer_${threadId}`))
        || localStorage.getItem(`nt_thread_peer_${threadId}`))
    : null;
  const peerUser = peerRaw ? JSON.parse(peerRaw) as {id:string, username:string} : null;

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!threadId) return;
      setLoading(true);
      try {
        const data: Message[] = await fetchThread(threadId);
        if (ignore) return;
        const mapped: UIMessage[] = data.filter(m => m.content !== "__handshake__").map(m => ({
          id: m.id,
          sender: self && m.sender_id === self.id ? "me" : "other",
          text: m.content,
          sentAt: m.sent_at,
        }));
        setMsgs(mapped);
      } catch(e) {
        console.error("fetchThread failed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const int = setInterval(load, 3000); // simple polling; replace with WS later
    return () => { ignore = true; clearInterval(int); };
  }, [threadId, self?.id]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !self) return;
    try {
      // For direct thread we don't know other participant id here; assume thread already exists.
      // To support reply we need recipient id — prototype omits advanced logic.
      const temp: UIMessage = { id: "tmp"+Date.now(), sender: "me", text: input, sentAt: new Date().toISOString() };
      setMsgs([...msgs, temp]);
      setInput("");
      // Backend expects sender + to_id OR thread_id; we have threadId
      await fetch("http://localhost:8082/v1/messages", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ sender_id: self.id, thread_id: threadId, content: temp.text })
      });
    } catch(err) {
      console.error("send failed", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center border-b bg-white dark:bg-gray-900 px-7 py-3">
        <div className="w-9 h-9 rounded-full mr-4 flex items-center justify-center bg-blue-600 text-white font-semibold">
          {peerUser ? peerUser.username.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {peerUser ? peerUser.username : 'Direct Message'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {peerUser ? '1:1 chat' : 'Waiting for peer'}
          </div>
        </div>
        <span className="text-xs text-gray-400">{msgs.length} msg(s)</span>
      </header>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-7">
        <div className="text-xs text-gray-400 mb-8">7/31/25</div>
        {loading && <div className="text-xs text-gray-400 mb-4">Loading…</div>}
        {msgs.map((m, idx) => (
          <div
            key={idx}
            className={`flex mb-6 ${
              m.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender !== "me" ? (
              <span className="w-8 h-8 mr-3 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-200">{m.sender === "other" ? "•" : "?"}</span>
            ) : null}
            <div
              className={`rounded-2xl px-4 py-2 shadow text-base max-w-xl ${
                m.sender === "me"
                  ? "bg-blue-600 text-white ml-20"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-900 mr-20"
              }`}
            >
              <div className="flex items-center"><span>{m.text}</span></div>
              <div className="mt-2 text-[10px] opacity-60">{new Date(m.sentAt).toLocaleTimeString()}</div>
            </div>
            {m.sender === "me" && <span className="w-8 h-8 ml-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">Me</span>}
          </div>
        ))}
      </div>
      <form
        onSubmit={send}
        className="sticky bottom-0 bg-white dark:bg-gray-900 border-t flex items-center px-6 py-4 gap-3"
      >
        <button
          type="button"
          className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <rect
              x="3"
              y="7"
              width="18"
              height="13"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M8 3v4m8-4v4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message"
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none"
        />
        <button
          type="submit"
          className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full p-2"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M3 12l18-7-7 18-2.35-6.35L3 12z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
