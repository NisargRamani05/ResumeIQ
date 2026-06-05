import {
  collection, addDoc, updateDoc, getDocs, query,
  where, orderBy, doc, writeBatch, serverTimestamp, limit
} from "firebase/firestore";
import { db } from "./firebase";

const NOTIF_COL = "notifications";

/**
 * Send a notification to a specific user (or "admin" as recipientId).
 * type: "job_new" | "job_updated" | "application_received" | "status_changed"
 */
export const sendNotification = async ({ recipientId, type, title, body, link = "" }) => {
  await addDoc(collection(db, NOTIF_COL), {
    recipientId,      // uid or "admin"
    type,
    title,
    body,
    link,
    read: false,
    createdAt: serverTimestamp(),
  });
};

/**
 * Broadcast a notification to ALL regular users.
 * Reads every user from /users, filters out admins, and creates one doc per user.
 */
export const broadcastToAllUsers = async ({ type, title, body, link = "" }) => {
  try {
    const snap = await getDocs(collection(db, "users"));
    const batch = writeBatch(db);
    snap.docs.forEach((userDoc) => {
      const profile = userDoc.data();
      if (profile.role === "admin") return; // skip admins
      const ref = doc(collection(db, NOTIF_COL));
      batch.set(ref, {
        recipientId: userDoc.id,
        type,
        title,
        body,
        link,
        read: false,
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (err) {
    console.error("[broadcastToAllUsers] error:", err);
    // Non-fatal — don't block the main action
  }
};

/**
 * Fetch notifications for a recipient (uid or "admin"), newest first.
 */
export const getNotifications = async (recipientId, maxCount = 30) => {
  try {
    const q = query(
      collection(db, NOTIF_COL),
      where("recipientId", "==", recipientId),
      orderBy("createdAt", "desc"),
      limit(maxCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // orderBy may fail if Firestore index isn't created yet — fallback
    console.warn("[getNotifications] orderBy failed, using fallback:", err.message);
    const q2 = query(
      collection(db, NOTIF_COL),
      where("recipientId", "==", recipientId)
    );
    const snap2 = await getDocs(q2);
    const docs = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
    return docs
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
      .slice(0, maxCount);
  }
};

/** Mark a single notification as read */
export const markNotificationRead = async (notifId) => {
  await updateDoc(doc(db, NOTIF_COL, notifId), { read: true });
};

/** Mark ALL unread notifications for a recipient as read */
export const markAllRead = async (recipientId) => {
  try {
    const q = query(
      collection(db, NOTIF_COL),
      where("recipientId", "==", recipientId),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  } catch (err) {
    console.error("[markAllRead] error:", err);
  }
};
