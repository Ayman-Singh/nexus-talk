import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const mockMsgs = [
  { sender: "me", text: "Hey!" },
  { sender: "Alice", text: "Hello!" },
  { sender: "me", text: "How are you?" },
  { sender: "Alice", text: "Great." },
]

export default function Chat() {
  const { threadId } = useParams()
  const [input, setInput] = useState("")
  const [msgs, setMsgs] = useState(mockMsgs)

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setMsgs(msgs.concat([{ sender: "me", text: input }]))
    setInput("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="bg-blue-700 dark:bg-blue-900 text-white py-4 px-6 shadow flex items-center">
        <span className="text-lg font-bold">Chat {threadId}</span>
      </header>
      <div className="flex-1 p-4 overflow-auto flex flex-col gap-3 max-w-xl mx-auto w-full">
        {msgs.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === "me" ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-4 py-2 shadow text-base max-w-xs ${m.sender === "me" ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-900'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="w-full max-w-xl mx-auto px-2 flex gap-2 pb-6">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message…" className="flex-1 px-3 py-2 rounded-full bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-800 focus:outline-none" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full transition">Send</button>
      </form>
    </div>
  )
}
