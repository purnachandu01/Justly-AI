'use client';
import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { type Message } from '@/lib/mock-data';
import { useState } from 'react';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Here you would typically also get a response from the AI
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-32">
        <ChatMessages messages={messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
