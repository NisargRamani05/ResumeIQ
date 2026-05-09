import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Mail, Bell, Shield, Moon, Sun } from 'lucide-react';

function ProfileSettings() {
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
                  JD
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-100">John Doe</h3>
                  <p className="text-sm text-slate-400">Software Engineer</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input defaultValue="john.doe@example.com" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Professional Title</label>
                <Input defaultValue="Software Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Bio</label>
                <textarea 
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
                  defaultValue="Passionate software engineer building modern web applications."
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button>Save Changes</Button>
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
                  <Button variant="ghost" size="sm" className="bg-slate-700 text-white">
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400">
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
