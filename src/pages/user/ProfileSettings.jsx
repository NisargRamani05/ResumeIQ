import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Shield, Moon, Sun, Camera, Save, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserProfile, updateUserProfile } from '../../firebase/firestore';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({ name: '', title: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (!currentUser) return;
    setFetching(true);
    getUserProfile(currentUser.uid)
      .then(profile => {
        if (profile) {
          setFormData({ name: profile.name || '', title: profile.title || '', bio: profile.bio || '' });
        } else {
          setFormData({ name: currentUser.displayName || '', title: '', bio: '' });
        }
      })
      .catch(err => {
        console.warn("Could not fetch profile", err);
        setFormData({ name: currentUser.displayName || '', title: '', bio: '' });
      })
      .finally(() => setFetching(false));
  }, [currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const displayName = formData.name || currentUser?.email?.split('@')[0] || "User";

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent-primary)]/10 blur-[150px] rounded-full pointer-events-none" />

      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-tight">Account Settings</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl overflow-hidden flex flex-col items-center p-8 relative"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20" />
            
            <div className="relative w-28 h-28 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--bg-card)] shadow-xl flex items-center justify-center mt-6 mb-4 group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <span className="font-display text-4xl font-bold text-[var(--text-primary)]">{getInitials(displayName)}</span>
            </div>
            
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">{displayName}</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">{formData.title || "Add your job title"}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 flex flex-col gap-2"
          >
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-8 min-h-[500px]"
          >
            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Personal Information</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Update your personal details here.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-[var(--accent-primary)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input 
                        type="email" 
                        value={currentUser?.email || ""}
                        disabled
                        className="w-full bg-[var(--bg-secondary)] opacity-50 border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Professional Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-[var(--accent-primary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your professional journey..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-[var(--accent-primary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors min-h-[120px] resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-[var(--accent-primary)] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-[var(--glow)] disabled:opacity-50"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Preferences</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Customize your platform experience.</p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">App Theme</h4>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Switch between Light and Dark mode.</p>
                  </div>
                  <div className="flex bg-[var(--bg-card)] p-1.5 rounded-xl border border-[var(--border)]">
                    <button 
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'light' ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button 
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Notification Settings</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Manage what alerts you receive.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Application Updates", desc: "Get notified when your job application status changes." },
                    { title: "Resume Analytics", desc: "Weekly digest of your resume performance." },
                    { title: "Marketing Emails", desc: "Receive news, special offers, and product updates." }
                  ].map((item, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)]">{item.title}</h4>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                        <div className="w-11 h-6 bg-[var(--bg-card)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Security</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Protect your account data.</p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">Password</h4>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Change your current password.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                    Update
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-red-500">Danger Zone</h4>
                    <p className="text-sm text-red-400/80 mt-1">Permanently delete your account and all data.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors shrink-0">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
