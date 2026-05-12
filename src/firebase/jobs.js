import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/** Convert company logo to Base64 string for Firestore storage */
export const uploadCompanyLogo = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/** Create a new job post */
export const createJob = async (data) => {
  const docRef = await addDoc(collection(db, "jobs"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/** Update an existing job */
export const updateJob = async (id, data) => {
  await updateDoc(doc(db, "jobs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/** Delete a job */
export const deleteJob = async (id) => {
  await deleteDoc(doc(db, "jobs", id));
};

/** Get all jobs ordered by createdAt desc */
export const getJobs = async () => {
  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[getJobs] orderBy query failed, trying fallback:", err?.message);
    // Fallback: fetch without ordering (works even if index is missing)
    const snap = await getDocs(collection(db, "jobs"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};

/** Get a single job by ID */
export const getJob = async (id) => {
  const snap = await getDoc(doc(db, "jobs", id));
  if (!snap.exists()) throw new Error("Job not found");
  return { id: snap.id, ...snap.data() };
};
