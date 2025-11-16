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
      if (!firebaseServices.auth) return;
      try {
        const result = await getRedirectResult(firebaseServices.auth);
        if (result && result.user) {
          await upsertUser(result.user, firebaseServices.firestore);
          toast({
            title: "Signed In",
            description: `Welcome, ${result.user.displayName}!`,
          });
        }
      } catch (error: any) {
        console.error("Error handling redirect result:", error);
        toast({
          variant: "destructive",
          title: "Sign-In Failed",
          description: error.message || "An unexpected error occurred during sign-in.",
        });
      } finally {
        setIsAuthLoading(false);
      }
    };

    handleRedirect();
  }, [firebaseServices.auth, firebaseServices.firestore, toast]);
  
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
