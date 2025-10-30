export async function login(username: string, password: string) {
  const r = await fetch("http://localhost:8081/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password})
  });
  if (!r.ok) throw new Error('Login failed');
  return r.json();
}

export async function register(username: string, email: string, password: string) {
  const r = await fetch("http://localhost:8081/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, email, password})
  });
  if (!r.ok) throw new Error('Registration failed');
  return r.json();
}

export async function getMessages(threadId: string) {
  const r = await fetch(`http://localhost:8082/messages?thread_id=${threadId}`);
  if (!r.ok) throw new Error('Fetch messages failed');
  return r.json();
}

export async function sendMessage(threadId: string, text: string) {
  const r = await fetch(`http://localhost:8082/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread_id: threadId, content: text, sender_id: 'me' })
  });
  if (!r.ok) throw new Error('Send message failed');
  return r.json();
}
