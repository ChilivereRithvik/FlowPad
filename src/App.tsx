import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { FlowBuilder } from "./pages/flowpage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <div className="w-screen h-screen">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/"
            element={
              <div className="w-full h-full">
                <ReactFlowProvider>
                  <FlowBuilder />
                </ReactFlowProvider>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
