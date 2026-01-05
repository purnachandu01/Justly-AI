'use client';

import React, { useMemo, type ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { upsertUser } from '@/firebase/user-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/app/components/logo';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { toast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const firebaseServices = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (e: any) {
      console.error("Firebase Initialization Error:", e);
      setInitError("Could not connect to Firebase services. This is often caused by an incomplete project setup in the Google Cloud Console. Please check your OAuth consent screen configuration.");
      return { firebaseApp: null, auth: null, firestore: null };
    }
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!firebaseServices.auth || !firebaseServices.firestore) {
        setIsAuthLoading(false);
        if (!initError) { // Don't overwrite the more specific init error
          setInitError("Firebase Authentication service is not available. Please check your project configuration.");
        }
        return;
      }

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
        if (error.code === 'auth/internal-error' || error.code === 'auth/invalid-credential' || error.code === 'auth/oauth-credential-already-in-use') {
           setInitError("There seems to be an issue with the project's sign-in configuration. Please ensure the OAuth consent screen is published and configured correctly in your Google Cloud project.");
        } else {
          toast({
            variant: "destructive",
            title: "Sign-In Failed",
            description: error.message || "An unexpected error occurred during sign-in.",
          });
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    handleRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseServices, initError]);
  
  if (initError) {
     return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-xl text-center">
            <CardHeader>
                <div className="flex justify-center mb-4"><Logo/></div>
                <CardTitle className="text-destructive">Project Configuration Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{initError}</p>
                <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Go to Google Cloud Console
                </a>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Only render the provider if services are available
  if (!firebaseServices.firebaseApp || !firebaseServices.auth || !firebaseServices.firestore) {
    // This state should ideally be covered by the initError block, but it's a safe fallback.
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Firebase services could not be initialized.</p>
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
