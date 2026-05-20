import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { loginUser, loginWithGoogle } from '../../firebase/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setLoading(true);
    try {
      const user = await loginUser(formData.email, formData.password);
      toast.success("Welcome back to ResumeIQ!");
      if (user.email === 'admin@gmail.com') navigate('/admin');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success("Signed in with Google!");
      if (user.email === 'admin@gmail.com') navigate('/admin');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] overflow-hidden">
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative z-10">
        
        <Link to="/" className="absolute top-8 left-8 sm:left-16 lg:left-24 font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight hover:opacity-80 transition-opacity">
          Resume<span className="gradient-text">IQ</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[var(--text-muted)]">
              Enter your details to access your dashboard.
            </p>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full relative flex items-center justify-center gap-3 px-6 py-3.5 mb-8 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card)] hover:border-[var(--text-muted)] transition-all"
          >
            {googleLoading ? <Loader className="w-5 h-5 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign in with Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <hr className="flex-1 border-[var(--border)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Or login with email</span>
            <hr className="flex-1 border-[var(--border)]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--text-primary)]">Password</label>
                <a href="#" className="text-xs font-medium text-[var(--accent-primary)] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl pl-11 pr-12 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || googleLoading || !formData.email || !formData.password}
              className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 mt-2 text-sm font-bold text-white bg-[var(--accent-primary)] rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[var(--glow)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[var(--accent-primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Column: Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[var(--bg-secondary)] relative items-center justify-center border-l border-[var(--border)] overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg"
        >
          {/* Glass Card Mockup */}
          <div className="glass-card rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl bg-[var(--bg-card)]/80">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center border border-[var(--accent-primary)]/30">
                <span className="font-display font-bold text-[var(--accent-primary)] text-xl">84</span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">ATS Score Analysis</h3>
                <p className="text-xs text-[var(--text-muted)]">Looking good! Ready for application.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-16 w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-1/2 bg-[var(--bg-primary)] rounded animate-pulse" />
                    <div className="h-2 w-3/4 bg-[var(--bg-primary)] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Element */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-12 -top-12 glass-card p-4 rounded-xl shadow-xl bg-[var(--bg-card)] border border-[var(--accent-primary)]/30 backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Profile Optimized</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
