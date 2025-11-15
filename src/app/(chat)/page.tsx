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
    if (!isUserLoading) {
      if (user) {
        const lastChatId = localStorage.getItem('lastChatId');
        if (lastChatId) {
          router.replace(`/${lastChatId}`);
        }
      } else {
        router.push('/login');
      }
    }
  }, [isUserLoading, user, router]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/${newChatId}`);
  };
  
  if (isUserLoading || (!isUserLoading && user && localStorage.getItem('lastChatId'))) {
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }

  // No need to check for user here again, layout will handle it.

  return (
    <div className="flex h-full items-center justify-center p-4">
      <ChatWelcome onNewChat={handleNewChat} />
    </div>
  );
}
