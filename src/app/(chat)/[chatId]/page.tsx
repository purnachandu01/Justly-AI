import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { chats } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const chat = chats.find((c) => c.id === params.chatId);

  if (!chat) {
    notFound();
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-32">
        <ChatMessages messages={chat.messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
