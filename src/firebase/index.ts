'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp;
  try {
    if (!getApps().length) {
      // Important! initializeApp() can be called without arguments in a Firebase-hosted environment
      // to automatically use the environment variables.
      firebaseApp = initializeApp();
    } else {
      firebaseApp = getApp();
    }
  } catch (e) {
    // If automatic initialization fails, fall back to the config object.
    // This is common in local development.
    if (getApps().length) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }
  }
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  try {
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
    };
  } catch (e) {
    console.error('Failed to get Firebase SDKs:', e);
    // Return nulls or throw a custom error to be handled by the provider
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './user-service';