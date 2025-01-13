import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Login function
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Generate ID token
  const token = await user.getIdToken();

  return { user, token };
};

// Logout function
export const logout = () => {
  return signOut(auth);
};

// Register function
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => userCredential.user);
};
