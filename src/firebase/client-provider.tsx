'use client';

import React, { useMemo, type ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { upsertUser } from '@/firebase/user-service';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { toast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!firebaseServices.auth || !firebaseServices.firestore) {
        setIsAuthLoading(false);
        return;
      };

      try {
        const result = await getRedirectResult(firebaseServices.auth);
        if (result && result.user) {
          // This is a successful sign-in.
          await upsertUser(result.user, firebaseServices.firestore);
          toast({
            title: "Signed In",
            description: `Welcome, ${result.user.displayName}!`,
          });
        }
      } catch (error: any) {
        // This block will catch errors from the redirect result,
        // including OAuth configuration errors that cause the 403.
        console.error("Error handling redirect result:", error);

        // Check for specific OAuth credential errors
        if (error.code === 'auth/internal-error' || error.code === 'auth/invalid-credential') {
           toast({
            variant: "destructive",
            title: "Sign-In Configuration Error",
            description: "There seems to be an issue with the project's sign-in configuration. Please check the OAuth settings in your Google Cloud project.",
            duration: 10000, // Show for 10 seconds
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sign-In Failed",
            description: error.message || "An unexpected error occurred during sign-in.",
          });
        }
      } finally {
        // We're done with the auth redirect check, so we can stop loading.
        setIsAuthLoading(false);
      }
    };

    handleRedirect();
    // The dependency array is intentionally sparse. We only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
