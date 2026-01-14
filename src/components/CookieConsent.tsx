import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-in slide-in-from-bottom-6 duration-500">
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">Cookie Preferences</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use cookies to enhance your experience and keep you signed in.
              By continuing to use FlowPad, you agree to our use of cookies.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={accept}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
              >
                Accept All
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShow(false)}
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
