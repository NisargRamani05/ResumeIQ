import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiArrowRight, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/auth';
import toast from 'react-hot-toast';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all">
              R
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Resume<span className="text-blue-400">IQ</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>


          </div>

          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to={currentUser.email === 'admin@gmail.com' ? '/admin' : '/dashboard'} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  {currentUser.email === 'admin@gmail.com' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#111827] px-6 py-1 text-sm font-medium text-white border border-white/10 transition-all group-hover:bg-[#1F2937] gap-2">
                    <FiLogOut /> Sign Out
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#0B1120] px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-[#0B1120]/80 gap-2">
                    Get Started <FiArrowRight />
                  </span>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 text-lg font-medium text-slate-300">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">About</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Features</a>
              <a href="#dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Features Demo</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Testimonials</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Pricing</a>
              <hr className="border-white/10" />
              {currentUser ? (
                <>
                  <Link to={currentUser.email === 'admin@gmail.com' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
                    {currentUser.email === 'admin@gmail.com' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-blue-400">Get Started Free</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
