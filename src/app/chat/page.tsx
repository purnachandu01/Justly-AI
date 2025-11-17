'use client';
import ChatWelcome from '@/app/components/chat/chat-welcome';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ChatHomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // We only want to run this check once the user is known to be logged in.
    if (!isUserLoading && user) {
      const lastChatId = localStorage.getItem('lastChatId');
      if (lastChatId) {
        router.replace(`/chat/${lastChatId}`);
      }
    } else if (!isUserLoading && !user) {
      // If not loading and no user, redirect to login.
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/chat/${newChatId}`);
  };
  
  // While we check for auth state and last chat, show a loading screen.
  // We also check for 'user' here to avoid a flash of the welcome screen on first load for returning users.
  if (isUserLoading || !user) {
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }
  
  // If we've checked and are ready, show the welcome screen.
  return (
    <div className="flex h-full items-center justify-center p-4">
      <ChatWelcome onNewChat={handleNewChat} />
    </div>
  );
}
