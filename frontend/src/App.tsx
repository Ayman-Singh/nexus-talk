import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

function Nav() {
  const { pathname } = useLocation();
  if (["/login", "/register"].includes(pathname)) return null;
  return (
    <nav style={{marginBottom:12}}>
      <Link to="/inbox">Inbox</Link> | <Link to="/settings">Settings</Link>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/inbox" element={<Inbox/>}/>
      <Route path="/chat/:threadId" element={<Chat/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="*" element={<Login/>}/>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav/>
      <AppRoutes/>
    </BrowserRouter>
  );
}

export default App;
