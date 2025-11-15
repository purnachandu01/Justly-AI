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
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/${newChatId}`);
  };
  
  if (isUserLoading || !user) {
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <ChatWelcome onNewChat={handleNewChat} />
    </div>
  );
}
