import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/** Save a new resume to Firestore */
export const createResume = async (userId, { title, data }) => {
  const docRef = await addDoc(collection(db, "resumes"), {
    userId,
    title,
    data,
    createdAt: serverTimestamp(),
    savedAt: serverTimestamp(),
  });
  return docRef.id;
};

/** Update an existing resume in Firestore */
export const updateResume = async (id, { title, data }) => {
  await updateDoc(doc(db, "resumes", id), {
    title,
    data,
    savedAt: serverTimestamp(),
  });
};

/** Delete a resume from Firestore */
export const deleteResume = async (id) => {
  await deleteDoc(doc(db, "resumes", id));
};

/** Get all resumes for a specific user, sorted client-side by savedAt */
export const getUserResumes = async (userId) => {
  try {
    const q = query(
      collection(db, "resumes"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const resumes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort client-side descending by savedAt (no composite index required)
    return resumes.sort((a, b) => {
      const aTime = a.savedAt?.toMillis?.() ?? 0;
      const bTime = b.savedAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });
  } catch (err) {
    console.error("[getUserResumes] failed:", err?.message);
    return [];
  }
};

/** Get a single resume by ID */
export const getResumeById = async (id) => {
  const { getDoc } = await import("firebase/firestore");
  const docRef = doc(db, "resumes", id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};
