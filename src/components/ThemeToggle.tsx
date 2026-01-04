import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    onToggle();
  };

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="border hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-yellow-400" />
          <span>Light Mode</span>
        </>
      )}
    </Button>
  );
}
