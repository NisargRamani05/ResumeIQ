import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  // Only create if it doesn't already exist
  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, data);
    } catch (error) {
      console.error("Error creating user profile: ", error);
      throw error;
    }
  }
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile: ", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  try {
    // We use Promise.race to prevent infinite hanging if Firestore is not initialized
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Firestore timeout: Please ensure your database is initialized in the Firebase Console.")), 5000)
    );
    
    await Promise.race([
      setDoc(userRef, data, { merge: true }),
      timeoutPromise
    ]);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};
