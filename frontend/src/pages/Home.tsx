import { Link } from "react-router-dom"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 dark:via-neutral-900 px-4">
      <div className="w-full max-w-lg text-center bg-white/80 dark:bg-gray-800/80 shadow-2xl rounded-2xl px-8 py-12">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 tracking-tight">NexusTalk</h1>
        <p className="text-md text-gray-600 dark:text-gray-200 mb-8">Simple. Secure. Modern messaging. Connect with anyone, anywhere.</p>
        <div className="flex flex-col gap-4 mt-8">
          <Link to="/login" className="block w-full px-0"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-lg transition">Login</button></Link>
          <Link to="/register" className="block w-full px-0"><button className="w-full bg-gray-100 hover:bg-blue-50 text-blue-800 font-bold py-2 rounded-xl text-lg transition">Register</button></Link>
        </div>
      </div>
    </main>
  )
}
