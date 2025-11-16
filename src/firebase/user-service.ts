'use client';
import { doc, getDoc, setDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";

/**
 * Creates or updates a user document in Firestore.
 * This function is designed to be called after a user signs in or signs up.
 * It checks if a user document already exists and, if not, creates one.
 *
 * @param user The Firebase Auth User object.
 * @param firestore The Firestore instance.
 */
export async function upsertUser(user: User, firestore: Firestore) {
  if (!user || !firestore) return;

  const userRef = doc(firestore, `users/${user.uid}`);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // User does not exist in Firestore, so create the document.
    const userData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
      // Add any other default fields you want for new users
    };

    try {
      await setDoc(userRef, userData);
    } catch (error) {
      console.error("Error creating user document:", error);
      // Optionally, handle the error (e.g., show a toast to the user)
    }
  }
  // If the user already exists, we do nothing. You could add update logic here if needed.
}
