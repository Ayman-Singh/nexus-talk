import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
function Nav() {
  const { pathname } = useLocation();
  if (["/login", "/register", "/"].includes(pathname)) return null;
  return (
    <nav className="flex gap-3 mb-6">
      <Link to="/inbox" className="underline">
        Inbox
      </Link>
      <Link to="/settings" className="underline">
        Settings
      </Link>
    </nav>
  );
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/chat/:threadId" element={<Chat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
