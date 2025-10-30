import { Link } from "react-router-dom"

const threads = [
  { id: "1", title: "👤 Alice", preview: "hey!" },
  { id: "2", title: "👥 Group Study", preview: "Final done" },
  { id: "3", title: "📢 Announcements", preview: "Test tomorrow!" },
]

export default function Inbox() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-950 dark:to-gray-900 px-4 py-20">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-blue-800 dark:text-blue-200 mb-6">Chats</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {threads.map(t => (
            <li key={t.id}>
              <Link to={`/chat/${t.id}`}
                className="block py-4 px-3 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition flex flex-row gap-3 items-center">
                <span className="rounded-full w-9 h-9 bg-blue-100 dark:bg-blue-800 text-xl flex items-center justify-center">{t.title[0]}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{t.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-1">{t.preview}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
