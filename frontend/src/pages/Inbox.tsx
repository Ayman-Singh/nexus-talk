import { Link, Outlet, useLocation, useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { fetchOrCreateDirectThread } from "../api"

export default function Inbox() {
  const { threadId } = useParams()
  const loc = useLocation()
  const nav = useNavigate()
  const userRaw = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem("nt_user")) || localStorage.getItem("nt_user")
  const self = userRaw ? JSON.parse(userRaw) as {id:string, username:string} : null

  const newDM = async () => {
    const other = prompt("Enter other user's username")
    if (!other) return
    try {
      const r = await fetch(`http://localhost:8081/profile/by-username?u=${encodeURIComponent(other)}`)
      if (!r.ok) { alert("User not found"); return }
      const ou = await r.json() as {id:string, username:string}
      const tid = await fetchOrCreateDirectThread(self!.id, ou.id)
      // Store peer hint so Chat header can show a name without extra API
      try {
        sessionStorage.setItem(`nt_thread_peer_${tid}`, JSON.stringify(ou))
      } catch {}
      try {
        // Also store in localStorage as a fallback across reloads
        localStorage.setItem(`nt_thread_peer_${tid}`, JSON.stringify(ou))
      } catch {}
      nav(`/chat/${tid}`)
    } catch(e) {
      alert("Failed to start DM: "+(e as any).message)
    }
  }
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      {/* Chat List Panel */}
      <section className="flex flex-col w-72 min-w-[230px] max-w-xs h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <header className="flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Chats</span>
          <button onClick={newDM} className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-white text-sm rounded px-3 py-1">New message</button>
        </header>
        <div className="flex space-x-2 px-4 py-2">
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white">All</button>
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">DMs</button>
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">For Sale</button>
        </div>
        <div className="p-4 text-xs text-gray-500 dark:text-gray-400">Use "New message" to start a DM by username. Recent threads list will be added next.</div>
      </section>
      {/* Main chat window will be in Chat.tsx routed as /chat/:id */}
      <section className="flex-1 h-full overflow-auto">
        {loc.pathname.startsWith("/chat/")
          ? <Outlet/>
          : <div className="h-full flex items-center justify-center text-lg text-gray-400">Select a chat to start messaging</div>}
      </section>
    </div>
  )
}
