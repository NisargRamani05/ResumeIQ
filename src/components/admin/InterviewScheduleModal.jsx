import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Loader } from "lucide-react";

export default function InterviewScheduleModal({ onClose, onSubmit }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    try {
      // Format the date/time string beautifully
      const d = new Date(`${date}T${time}`);
      const formattedDate = d.toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      await onSubmit(formattedDate);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="glass-card border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
            <div>
              <h3 className="text-[var(--text-primary)] font-display font-bold text-lg">Schedule Interview</h3>
              <p className="text-[var(--text-muted)] text-sm mt-0.5 font-medium">Pick a date and time</p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Date Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none transition-all [color-scheme:dark] shadow-sm"
                />
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none transition-all [color-scheme:dark] shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !date || !time}
              className="w-full mt-4 py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 disabled:opacity-60 disabled:hover:scale-100 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[var(--glow)] hover:scale-[1.02]"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm Schedule"
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
