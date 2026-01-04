import { useNavigate } from "react-router-dom";
import { MoveLeft, HelpCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-30">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-[2rem] shadow-2xl transform -rotate-6 animate-float-slow">
          <Layers className="text-white w-12 h-12" />
        </div>

        <div className="space-y-4">
          <h1 className="">404</h1>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Lost in the flow?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium text-lg leading-relaxed">
            The page you're looking for seems to have drifted off the canvas.
            Let's get you back to where the magic happens.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all rounded-xl px-8"
          >
            <MoveLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/flow")}
            className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl px-8"
          >
            Open Builder
          </Button>
        </div>

        <div className="pt-12 text-slate-400 dark:text-slate-600 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Need help? Reach out to support
          </span>
        </div>
      </div>
    </div>
  );
}
