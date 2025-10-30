import React, { useState } from "react";
import { useParams } from "react-router-dom";

const mockMsgs = [
  {
    sender: "other",
    name: "Alex Smith",
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
    time: "5:40 pm",
    text: "Hi jenny, sorry if this too sudden! how are you? I'm new here and seems you also from menlo park!",
    reactions: ["👍", "1"],
    edited: true,
    reply: "1 reply",
  },
];

export default function Chat() {
  const { threadId } = useParams();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(mockMsgs);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs([
      ...msgs,
      {
        sender: "me",
        name: "You",
        avatar: "",
        time: "now",
        text: input,
        reactions: [],
        edited: false,
        reply: "",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center border-b bg-white dark:bg-gray-900 px-7 py-3">
        <img
          src="https://randomuser.me/api/portraits/women/89.jpg"
          alt="avatar"
          className="w-9 h-9 rounded-full mr-4"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Jenny May
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Downtown Menlo Park
          </div>
        </div>
        <span className="text-xs text-gray-400">…</span>
      </header>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-7">
        <div className="text-xs text-gray-400 mb-8">7/31/25</div>
        {msgs.map((m, idx) => (
          <div
            key={idx}
            className={`flex mb-6 ${
              m.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender !== "me" && m.avatar ? (
              <img
                src={m.avatar}
                className="w-8 h-8 mr-3 rounded-full self-end"
                alt="avatar"
              />
            ) : null}
            <div
              className={`rounded-2xl px-4 py-2 shadow text-base max-w-xl ${
                m.sender === "me"
                  ? "bg-blue-600 text-white ml-20"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-900 mr-20"
              }`}
            >
              <div className="flex items-center">
                <span>{m.text}</span>
                {m.edited && (
                  <span className="ml-2 text-xs text-gray-300 italic">
                    (edited)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-2">
                {m.reactions ? (
                  <span className="flex items-center gap-1 text-sm bg-white dark:bg-gray-700 rounded px-2 py-1 border dark:border-gray-600">
                    {m.reactions[0]} <span>{m.reactions[1]}</span>
                  </span>
                ) : null}
                {m.reply && (
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                    {m.reply}
                  </span>
                )}
              </div>
            </div>
            {m.sender === "me" && (
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                className="w-8 h-8 ml-3 rounded-full self-end"
                alt="my avatar"
              />
            )}
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
