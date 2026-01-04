import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { FlowBuilder } from "./pages/flowpage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ReadmePage from "./pages/ReadmePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CookieConsent } from "./components/CookieConsent";

export default function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <CookieConsent />
      <div className="w-screen h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/flow"
            element={
              <ProtectedRoute>
                <div className="w-full h-full">
                  <ReactFlowProvider>
                    <FlowBuilder />
                  </ReactFlowProvider>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}
