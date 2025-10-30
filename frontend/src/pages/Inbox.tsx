import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const threads = [
  { id: "1", title: "Jenny May", preview: "This message was removed by ...", date: "16h", avatar: "J" },
  { id: "2", title: "Tom L. - High Chair", preview: "Tom sold this listing", date: "20h", avatar: "T", image: "https://randomuser.me/api/portraits/men/80.jpg" }
]

export default function Inbox() {
  const { threadId } = useParams()
  const loc = useLocation()
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      {/* Chat List Panel */}
      <section className="flex flex-col w-72 min-w-[230px] max-w-xs h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <header className="flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Chats</span>
          <button className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-white text-sm rounded px-3 py-1">New message</button>
        </header>
        <div className="flex space-x-2 px-4 py-2">
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white">All</button>
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">DMs</button>
          <button className="text-xs px-3 py-1 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">For Sale</button>
        </div>
        <ul className="overflow-y-auto flex-1 divide-y divide-gray-200 dark:divide-gray-800">
          {threads.map(t => (
            <li key={t.id}>
              <Link to={`/chat/${t.id}`} className={`flex gap-3 items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-800 transition ${loc.pathname.endsWith(`/chat/${t.id}`) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                {t.image ? <img src={t.image} alt={t.title} className="w-9 h-9 rounded-full border shadow"/> : <span className="rounded-full w-9 h-9 bg-blue-200 dark:bg-blue-800 flex items-center justify-center font-bold text-lg">{t.avatar}</span>}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{t.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 truncate max-w-[120px]">{t.preview}</div>
                </div>
                <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-400 whitespace-nowrap">{t.date}</span>
              </Link>
            </li>
          ))}
        </ul>
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
