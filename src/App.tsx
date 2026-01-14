import "@xyflow/react/dist/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signUp";
import Chat from "./pages/chat";
// import { CookieConsent } from "./components/CookieConsent";

export default function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      {/* <CookieConsent /> */}
      <div className="w-screen h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}
