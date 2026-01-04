import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { FlowBuilder } from "./pages/flowpage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ReadmePage from "./pages/ReadmePage";

export default function App() {
  return (
    <Router>
      <div className="w-screen h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/flow"
            element={
              <div className="w-full h-full">
                <ReactFlowProvider>
                  <FlowBuilder />
                </ReactFlowProvider>
              </div>
            }
          />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}
