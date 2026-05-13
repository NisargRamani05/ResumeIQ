import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Upload from "./pages/public/Upload";
import Results from "./pages/public/Results";

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

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/upload" element={<PageWrapper><Upload /></PageWrapper>} />
          <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<PageWrapper><UserDashboard /></PageWrapper>} />
          <Route path="resumes" element={<PageWrapper><MyResumes /></PageWrapper>} />
          <Route path="resumes/new" element={<PageWrapper><ResumeBuilder /></PageWrapper>} />
          <Route path="resumes/:id/edit" element={<PageWrapper><ResumeBuilder /></PageWrapper>} />
          <Route path="jobs" element={<PageWrapper><JobsListing /></PageWrapper>} />
          <Route path="jobs/:id" element={<PageWrapper><JobDetail /></PageWrapper>} />
          <Route path="applications" element={<PageWrapper><JobTracker /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><ProfileSettings /></PageWrapper>} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="jobs" element={<PageWrapper><AdminJobs /></PageWrapper>} />
          <Route path="jobs/new" element={<PageWrapper><AdminAddJob /></PageWrapper>} />
          <Route path="jobs/:id/edit" element={<PageWrapper><AdminAddJob /></PageWrapper>} />
          <Route path="applications" element={<PageWrapper><AdminApplications /></PageWrapper>} />
          <Route path="users" element={<PageWrapper><div className="text-white">User Management (Coming Soon)</div></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><ProfileSettings /></PageWrapper>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            style: { 
              background: "var(--bg-card)", 
              color: "var(--text-primary)", 
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
            } 
          }}
        />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;