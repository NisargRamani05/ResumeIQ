import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./firestore";

const googleProvider = new GoogleAuthProvider();

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create the user profile in Firestore (run asynchronously so it doesn't block UI if Firestore is uninitialized)
    createUserProfile(user.uid, {
      name,
      email,
      role: 'User', // Default role
      createdAt: new Date()
    }).catch((err) => console.warn("Firestore profile creation skipped or failed:", err));

    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // We can attempt to create a profile, it will only succeed if they don't already have one
    // We'll pass the display name from Google
    try {
      await createUserProfile(user.uid, {
        name: user.displayName || 'Google User',
        email: user.email,
        role: 'User',
        createdAt: new Date()
      });
    } catch (e) {
      // Profile likely already exists, ignore
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
