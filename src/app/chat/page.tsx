'use client';
import ChatWelcome from '@/app/components/chat/chat-welcome';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ChatHomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        const lastChatId = localStorage.getItem('lastChatId');
        if (lastChatId) {
          router.replace(`/chat/${lastChatId}`);
        } else {
          setHasChecked(true); // No last chat, ready to show welcome
        }
      } else {
        router.push('/login');
      }
    }
  }, [isUserLoading, user, router]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/chat/${newChatId}`);
  };
  
  // Show loading screen while we check for user and last chat ID
  if (isUserLoading || !hasChecked) {
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }
  
  // If we've checked and are ready, show the welcome screen
  return (
    <div className="flex h-full items-center justify-center p-4">
      <ChatWelcome onNewChat={handleNewChat} />
    </div>
  );
}
