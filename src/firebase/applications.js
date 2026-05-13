import {
  collection, addDoc, updateDoc, getDocs,
  doc, query, where, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/** Submit a job application using an internal resume */
export const applyToJob = async ({ userId, jobId, resumeId, resumeTitle, message, userName, userEmail, jobTitle, companyName }) => {
  const docRef = await addDoc(collection(db, "applications"), {
    userId,
    jobId,
    resumeId,
    resumeTitle,
    message: message || "",
    userName: userName || "",
    userEmail: userEmail || "",
    jobTitle: jobTitle || "",
    companyName: companyName || "",
    status: "Applied",
    appliedAt: serverTimestamp(),
  });
  return docRef.id;
};

/** Get all applications for a specific user */
export const getUserApplications = async (userId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return docs.sort((a, b) => (b.appliedAt?.toMillis() || 0) - (a.appliedAt?.toMillis() || 0));
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
};

/** Get all applications for a specific job (admin) */
export const getJobApplications = async (jobId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return docs.sort((a, b) => (b.appliedAt?.toMillis() || 0) - (a.appliedAt?.toMillis() || 0));
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
};

/** Get ALL applications (admin overview) */
export const getAllApplications = async () => {
  try {
    const q = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[getAllApplications] orderBy failed, trying fallback:", err?.message);
    const snap = await getDocs(collection(db, "applications"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};

/** Update application status (admin) */
export const updateApplicationStatus = async (appId, status, interviewDate = null) => {
  const updateData = { status };
  if (interviewDate) {
    updateData.interviewDate = interviewDate;
  }
  await updateDoc(doc(db, "applications", appId), updateData);
};

/** Check if user has already applied to a job */
export const hasUserApplied = async (userId, jobId) => {
  const q = query(
    collection(db, "applications"),
    where("userId", "==", userId),
    where("jobId", "==", jobId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
};
