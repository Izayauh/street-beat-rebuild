
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/firebaseConfig'; // Import Firebase auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"; // Import Firebase auth methods

export const useCustomAuth = () => {
  const authContext = useAuth(); // Rename to avoid conflict with firebase auth object

  const signUpWithVerification = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    ...authContext,
    signUpWithVerification,
    signIn,
    signOutUser,
    resetPassword,
  };
};
