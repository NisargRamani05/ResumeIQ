import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, CheckCheck, Briefcase, UserCheck, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "../../firebase/notifications";

const POLL_INTERVAL = 30_000; // refresh every 30s

const typeIcon = (type) => {
  switch (type) {
    case "job_new":
      return <Briefcase className="w-4 h-4 text-[var(--accent-primary)]" />;
    case "job_updated":
      return <Briefcase className="w-4 h-4 text-[#eab308]" />;
    case "application_received":
      return <UserCheck className="w-4 h-4 text-[#10b981]" />;
    case "status_changed":
      return <CheckCheck className="w-4 h-4 text-[var(--accent-secondary)]" />;
    default:
      return <Info className="w-4 h-4 text-[var(--text-muted)]" />;
  }
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationBell() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  const recipientId =
    userProfile?.role === "admin" ? "admin" : currentUser?.uid;

  const fetchNotifs = useCallback(async () => {
    if (!recipientId) return;
    try {
      const data = await getNotifications(recipientId);
      setNotifications(data);
    } catch (err) {
      console.error("[NotificationBell] fetch error:", err);
    }
  }, [recipientId]);

  // Initial load + polling
  useEffect(() => {
    if (!recipientId) return;
    setLoading(true);
    fetchNotifs().finally(() => setLoading(false));
    const interval = setInterval(fetchNotifs, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifs, recipientId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const handleOpen = async () => {
    setOpen((v) => !v);
  };

  const handleClick = async (notif) => {
    // Mark as read
    if (!notif.read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    await markAllRead(recipientId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropRef}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        onClick={handleOpen}
        className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-secondary)]"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                  Notifications
                </span>
                {unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500 text-[10px] font-bold">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent-primary)] hover:underline px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> All read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-[var(--border)]">
              {loading ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[var(--bg-secondary)] rounded w-3/4" />
                        <div className="h-2 bg-[var(--bg-secondary)] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-[var(--text-muted)] opacity-40" />
                  </div>
                  <p className="text-[var(--text-primary)] font-semibold text-sm">
                    All caught up!
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)] ${
                      !notif.read ? "bg-[var(--accent-primary)]/5" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        !notif.read
                          ? "bg-[var(--accent-primary)]/15"
                          : "bg-[var(--bg-secondary)]"
                      }`}
                    >
                      {typeIcon(notif.type)}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          !notif.read
                            ? "font-bold text-[var(--text-primary)]"
                            : "font-medium text-[var(--text-primary)]"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-semibold">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {/* Unread dot */}
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 mt-2" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
                <p className="text-center text-[10px] text-[var(--text-muted)] font-semibold">
                  Showing last {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
