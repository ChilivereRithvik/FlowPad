import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    signUp,
    loading,
    session: { data: session },
  } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/flow");
    }
  }, [session, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await signUp({ name, email, password });
    if (data) {
      navigate("/flow");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950">
      {/* Left Side: Branding */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 p-3 border-r border-slate-100 dark:border-slate-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mb-32" />

        <div className="max-w-md text-center space-y-8 animate-in fade-in slide-in-from-left-6 duration-700 relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Layers className="text-white w-14 h-14" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                Join FlowPad today
              </p>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Start Building <br />{" "}
                <span className="text-blue-600">Your Vision</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-6 duration-700 bg-white dark:bg-slate-900/40 p-6 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white mb-2 leading-none">
              Sign Up
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Create your account to start building
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-md font-medium text-slate-900 dark:text-slate-200">
                Full Name
              </label>
              <Input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-md font-medium text-slate-900 dark:text-slate-200">
                Email Address
              </label>
              <Input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-md font-medium text-slate-900 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input
                type="checkbox"
                required
                id="terms"
                className="mt-1 w-4 h-4 rounded-[6px] border border-slate-200 dark:border-slate-700 checked:bg-slate-900 dark:checked:bg-white transition-all cursor-pointer accent-slate-900"
              />
              <label
                htmlFor="terms"
                className="text-[14px] font-medium text-slate-600 dark:text-slate-400 leading-tight"
              >
                I agree to the{" "}
                <Link
                  to="#"
                  className="text-slate-900 dark:text-white font-bold hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-slate-900 dark:text-white font-bold hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#18181B] dark:bg-white dark:text-slate-950 text-white font-bold text-[17px] hover:bg-slate-800 transition-all duration-200 mt-2 shadow-none border-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium text-[15px]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-slate-900 dark:text-white font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
