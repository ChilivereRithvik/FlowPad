import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Layers,
  MousePointer2,
  Palette,
  Zap,
  Activity,
  Box,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/banner.png";

import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    signOut,
    session: { data: session },
  } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const features = [
    {
      title: "Hand-Drawn Style",
      description:
        "Beautiful, expressive canvas with Rough.js aesthetics for a natural feel.",
      icon: Pencil,
      color: "bg-amber-500",
    },
    {
      title: "Interactive Flows",
      description:
        "Build logic and processes with React Flow's powerful node system.",
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      title: "Real-time Drawing",
      description:
        "Create shapes, write notes, and draw freehand directly on your flow.",
      icon: Box,
      color: "bg-indigo-500",
    },
    {
      title: "Smart Themes",
      description:
        "Instant Dark/Light mode switching with automatic color intelligence.",
      icon: Palette,
      color: "bg-purple-500",
    },
    {
      title: "Precision Controls",
      description:
        "Fine-tune every shape with stroke, roughness, and color adjustments.",
      icon: MousePointer2,
      color: "bg-rose-500",
    },
    {
      title: "Infinite Canvas",
      description: "Pan, zoom, and organize your thoughts without boundaries.",
      icon: Zap,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
            <Layers className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            FlowPad
          </span>
        </div>
        <div className="flex gap-2">
          {session ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/flow")}
                className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full px-6"
              >
                Go to Flow
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-slate-600 dark:text-slate-400 font-bold"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/signup")}
                className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full px-6 font-bold"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Infinite Flow Mapping
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
            Visualize thoughts <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              without limits
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            The hand-drawn flow builder that merges structured diagrams with
            creative freedom. Sketch, connect, and build your vision on an
            infinite interactive canvas.
          </p>

          <div className="pt-8">
            {session ? (
              <Button
                size="lg"
                onClick={() => navigate("/flow")}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all text-lg px-8 py-7 rounded-2xl shadow-2xl hover:shadow-blue-500/25"
              >
                Go to Builder
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all text-lg px-8 py-7 rounded-2xl shadow-2xl hover:shadow-blue-500/25"
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Banner Mockup */}
        <div className="mt-20 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="max-w-5xl mx-auto glass-panel p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative group hover:scale-[1.01] transition-transform duration-500">
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 rounded-[2rem] blur-xl -z-10 animate-pulse" />
            <img
              src={bannerImg}
              alt="FlowPad Canvas"
              className="w-full h-auto rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-inner"
            />

            {/* Decorative indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-bold text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              Live Canvas Environment
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:translate-y-[-4px] group"
            >
              <div
                className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}
              >
                <feature.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 font-medium">
          Built for the creative thinkers.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <Layers className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              FlowPad
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">by</span>
            <a
              className="text-slate-500 font-medium cursor-pointer hover:underline "
              href="https://www.linkedin.com/in/ch-rithvik-b3338823a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Ch.Rithvik
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
