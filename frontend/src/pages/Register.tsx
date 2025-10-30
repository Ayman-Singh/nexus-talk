import React, { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [err, setErr] = useState("");
  
  const handleReg = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const resp = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!resp.ok) throw new Error("Reg failed");
      setRegistered(true);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (registered)
    return <div>Success! Return to login.</div>;

  return (
    <form onSubmit={handleReg}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Register</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}
