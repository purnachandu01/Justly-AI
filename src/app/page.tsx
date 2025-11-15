'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // If the user is logged in, redirect them to the main chat interface.
        router.push('/chat');
      } else {
        // If no user, redirect to login.
        router.push('/login');
      }
    }
  }, [isUserLoading, user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
