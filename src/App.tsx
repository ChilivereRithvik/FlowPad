import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowBuilder } from "./pages/flowpage";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <FlowBuilder />
      </ReactFlowProvider>
    </div>
  );
}
