import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

function DarkModeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <button onClick={toggleTheme} aria-label="Toggle dark mode" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
    </button>
  );
}

export default DarkModeToggle;
