import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Mail, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../firebase/firestore';
import toast from 'react-hot-toast';

function ProfileSettings() {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch FRESH data directly from Firestore every time the page opens
  useEffect(() => {
    if (!currentUser) return;
    
    setFetching(true);
    getUserProfile(currentUser.uid)
      .then(profile => {
        if (profile) {
          setFormData({
            name: profile.name || '',
            title: profile.title || '',
            bio: profile.bio || ''
          });
        } else {
          // Fallback to Firebase Auth display name
          setFormData({
            name: currentUser.displayName || '',
            title: '',
            bio: ''
          });
        }
      })
      .catch(err => {
        console.warn("Could not fetch profile from Firestore:", err);
        // Still populate from auth as fallback
        setFormData({
          name: currentUser.displayName || '',
          title: '',
          bio: ''
        });
      })
      .finally(() => setFetching(false));
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update. Ensure Firestore Database is initialized.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = formData.name || currentUser?.email?.split('@')[0] || "User";

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-3xl font-bold border-2 border-blue-500/50">
                  {getInitials(displayName)}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-100">{displayName}</h3>
                  <p className="text-sm text-slate-400">{formData.title || "No title set"}</p>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-blue-500 bg-blue-500/10">
                <User className="mr-2 h-4 w-4" /> Personal Info
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" /> Security
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address (Read Only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input value={currentUser?.email || ""} className="pl-9 bg-slate-800 text-slate-400" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Professional Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tell us a little bit about yourself..."
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-100">Theme</h4>
                  <p className="text-xs text-slate-400">Choose your preferred viewing mode</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-slate-700 text-white"
                    onClick={() => toast.success("Dark Mode is currently active!")}
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400"
                    onClick={() => toast("Light Mode is coming in v2.0!", { icon: '☀️' })}
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
