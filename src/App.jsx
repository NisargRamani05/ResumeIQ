import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import UserDashboard from "./pages/user/UserDashboard";
import MyResumes from "./pages/user/MyResumes";
import ResumeBuilder from "./pages/user/ResumeBuilder";
import JobsListing from "./pages/user/JobsListing";
import JobDetail from "./pages/user/JobDetail";
import JobTracker from "./pages/user/JobTracker";
import ProfileSettings from "./pages/user/ProfileSettings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminAddJob from "./pages/admin/AdminAddJob";
import AdminApplications from "./pages/admin/AdminApplications";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background:"#1F2937", color:"#fff", border:"1px solid rgba(255,255,255,0.1)" } }}/>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<UserDashboard />} />
            <Route path="resumes" element={<MyResumes />} />
            <Route path="resumes/new" element={<ResumeBuilder />} />
            <Route path="resumes/:id/edit" element={<ResumeBuilder />} />
            <Route path="jobs" element={<JobsListing />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="applications" element={<JobTracker />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/new" element={<AdminAddJob />} />
            <Route path="jobs/:id/edit" element={<AdminAddJob />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="users" element={<div className="text-white">User Management (Coming Soon)</div>} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;