import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { logoutUser } from '../../firebase/auth';
import toast from 'react-hot-toast';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 50 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Successfully logged out");
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Analyze", href: "/upload" }
  ];

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav py-4 border-b border-[var(--border)]' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Resume<span className="text-[var(--accent-primary)]">IQ</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href.startsWith("#") ? link.href : undefined}
                onClick={(e) => {
                  if (!link.href.startsWith("#")) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                }}
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors relative group font-bold"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <>
                <Link 
                  to={currentUser.email === 'admin@gmail.com' ? '/admin' : '/dashboard'} 
                  className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] shadow-sm"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[var(--glow)]"
                >
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4 z-50 relative">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)] pt-32 px-8 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  href={link.href.startsWith("#") ? link.href : undefined}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (!link.href.startsWith("#")) {
                      e.preventDefault();
                      navigate(link.href);
                    }
                  }}
                  className="font-display text-4xl font-bold text-[var(--text-primary)] flex items-center justify-between group"
                >
                  {link.label}
                  <ChevronRight className="w-8 h-8 opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent-primary)] transition-all -translate-x-4 group-hover:translate-x-0" />
                </motion.a>
              ))}
              
              <motion.hr 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4 }}
                className="border-[var(--border)] my-4" 
              />
              
              {currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-6"
                >
                  <Link 
                    to={currentUser.email === 'admin@gmail.com' ? '/admin' : '/dashboard'} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="font-display text-2xl font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="font-display text-2xl font-bold text-red-500 text-left hover:text-red-400">
                    Sign Out
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-6"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl font-bold text-[var(--accent-primary)]">
                    Get Started Free
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
