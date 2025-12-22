import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ subtitle = 'Curated practice, elevated UI', children, className = '', onLogoClick }) => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`sticky top-0 z-50 bg-white/92 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-white/10 shadow-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.button
          type="button"
          onClick={onLogoClick}
          disabled={!onLogoClick}
          className="flex items-center gap-3 text-left group"
          whileHover={{ scale: onLogoClick ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white leading-tight drop-shadow-sm">
                Interview Prep AI
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-700 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>
        </motion.button>
        <div className="flex items-center gap-4 text-black dark:text-white">{children}</div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
