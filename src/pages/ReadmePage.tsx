import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Terminal,
  MousePointer2,
  Info,
} from "lucide-react";

export default function ReadmePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/flow")}
            className="flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Canvas
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <Layers className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              FlowPad
            </span>
          </div>
        </div>

        <header className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Read <span className="text-blue-600 dark:text-white">me</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            FlowPad is a next-generation flow building and drawing tool designed
            for researchers, developers, and creative thinkers.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">About FlowPad</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              FlowPad seamlessly integrates the structured environment of
              flowcharts with the creative freedom of digital sketching. It's
              built to bridge the gap between technical logic and visual
              expression.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Node Architecture</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Leveraging the power of <strong>@xyflow/react</strong>, our system
              provides high-performance, interactive node graphs. Each node is a
              specialized component (Start, Process, Decision, End) that
              maintains its state and connections.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-  white">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">
              The Aesthetic Layer: Rough.js
            </h2>
          </div>
          <div className="p-8 rounded-3xl bg-indigo-600 text-white space-y-4 shadow-xl shadow-indigo-500/20">
            <p className="text-lg opacity-90 leading-relaxed">
              At the heart of FlowPad's visual identity is{" "}
              <strong>Rough.js</strong>. Unlike traditional vector tools that
              produce sterile lines, Rough.js creates a "sketchy", hand-drawn
              feel. This allows for a more approachable and creative atmosphere
              when brainstorming.
            </p>
            <ul className="grid md:grid-cols-3 gap-4 font-medium">
              <li className="flex items-center gap-2 bg-indigo-500/30 p-3 rounded-xl border border-white/10">
                ✨ Dynamic Roughness
              </li>
              <li className="flex items-center gap-2 bg-indigo-500/30 p-3 rounded-xl border border-white/10">
                🎨 Custom Stroke Palettes
              </li>
              <li className="flex items-center gap-2 bg-indigo-500/30 p-3 rounded-xl border border-white/10">
                📐 Physics-based Jitter
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MousePointer2 className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">How it Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-dotted border-slate-300 dark:border-slate-700">
              <h3 className="text-xl font-semibold mb-2">Flowcharting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Use the bottom dock to add different types of nodes. Click and
                drag from a node's handle to another to create a connection.
                Double-click a node to edit its properties.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-dotted border-slate-300 dark:border-slate-700">
              <h3 className="text-xl font-semibold mb-2">Drawing & Shapes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Select a tool from the bottom dock or use shortcuts. Click and
                drag on the canvas to draw. Once drawn, you can select shapes to
                move or resize them using handles.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Keyboard Shortcuts</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ShortcutCard keyName="V" description="Select Tool" />
            <ShortcutCard keyName="H" description="Hand Tool (Pan)" />
            <ShortcutCard keyName="R" description="Rectangle Tool" />
            <ShortcutCard keyName="T" description="Triangle Tool" />
            <ShortcutCard keyName="C" description="Circle Tool" />
            <ShortcutCard keyName="A" description="Arrow Tool" />
            <ShortcutCard keyName="L" description="Line Tool" />
            <ShortcutCard keyName="P" description="Pencil Tool" />
            <ShortcutCard keyName="Ctrl + Z" description="Undo Action" />
            <ShortcutCard keyName="Del" description="Delete Selection" />
          </div>
        </section>
      </div>
    </div>
  );
}

function ShortcutCard({
  keyName,
  description,
}: {
  keyName: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between group hover:border-indigo-500 transition-colors">
      <span className="text-slate-500 dark:text-slate-400 font-medium">
        {description}
      </span>
      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-sm text-slate-900 dark:text-slate-100 shadow-sm flex items-center gap-1">
        {keyName === "V" && <MousePointer2 className="w-3 h-3" />}
        {keyName}
      </kbd>
    </div>
  );
}
