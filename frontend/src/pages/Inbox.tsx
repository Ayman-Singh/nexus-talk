import React from "react";
import { Link } from "react-router-dom";

export default function Inbox() {
  // In real: fetch message threads
  const threads = [
    { id: "t1", title: "General" },
    { id: "t2", title: "Random" },
  ];
  return (
    <div>
      <h2>Inbox</h2>
      <ul>
        {threads.map(t => (
          <li key={t.id}><Link to={`/chat/${t.id}`}>{t.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
