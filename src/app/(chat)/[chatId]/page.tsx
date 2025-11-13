'use client';
import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { type Message } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the chat history for the given chatId
    // For this demo, we'll just start with an empty chat or load from local storage if available
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      const chats = JSON.parse(storedChats);
      const currentChat = chats.find((chat: any) => chat.id === params.chatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      } else {
        setMessages([]);
      }
    }
  }, [params.chatId]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Persist to local storage
    const storedChats = localStorage.getItem('chats');
    let chats = storedChats ? JSON.parse(storedChats) : [];
    const chatIndex = chats.findIndex((chat: any) => chat.id === params.chatId);

    if (chatIndex > -1) {
      chats[chatIndex].messages = updatedMessages;
    } else {
      chats.push({ id: params.chatId, title: content.substring(0, 30), messages: updatedMessages });
    }
    localStorage.setItem('chats', JSON.stringify(chats));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'ai',
        content: `This is a simulated AI response to: "${content}"`,
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const updatedChatIndex = chats.findIndex((chat: any) => chat.id === params.chatId);
      if(updatedChatIndex > -1) {
        chats[updatedChatIndex].messages = finalMessages;
        localStorage.setItem('chats', JSON.stringify(chats));
      }
    }, 1000);
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
