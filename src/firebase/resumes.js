import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, orderBy, serverTimestamp
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

/** Get all resumes for a specific user */
export const getUserResumes = async (userId) => {
  try {
    const q = query(
      collection(db, "resumes"),
      where("userId", "==", userId),
      orderBy("savedAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[getUserResumes] orderBy failed, fallback:", err?.message);
    // Fallback without ordering if index is missing
    const q = query(collection(db, "resumes"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
