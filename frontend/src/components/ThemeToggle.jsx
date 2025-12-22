import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-2 px-2 py-1.5 rounded-full theme-chip focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label="Toggle theme"
    >
      <motion.div
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-md border border-white/60 dark:border-white/10"
        animate={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#93c5fd' : '#f97316',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-300" />
        ) : (
          <Sun className="w-4 h-4 text-orange-500" />
        )}
      </motion.div>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
        {isDark ? 'Night' : 'Day'}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
