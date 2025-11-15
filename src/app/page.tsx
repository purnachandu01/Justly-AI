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
        // Redirect to last chat, or to the new chat page if no last chat exists
        const lastChatId = localStorage.getItem('lastChatId');
        router.push(lastChatId ? `/${lastChatId}` : '/');
      } else {
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
