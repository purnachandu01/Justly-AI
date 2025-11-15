'use client';
import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { type Message, type Chat } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!chatId) return;

    localStorage.setItem('lastChatId', chatId);

    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      const chats: Chat[] = JSON.parse(storedChats);
      const currentChat = chats.find((chat) => chat.id === chatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      } else {
        // This case handles when a new chat is created via URL and isn't in storage yet.
        const newChat: Chat = { id: chatId, title: 'New Chat', messages: [] };
        const updatedChats = [newChat, ...chats];
        localStorage.setItem('chats', JSON.stringify(updatedChats));
        setMessages([]);
      }
    } else {
        // This handles the very first chat in the application.
        const newChat: Chat = { id: chatId, title: 'New Chat', messages: [] };
        localStorage.setItem('chats', JSON.stringify([newChat]));
        setMessages([]);
    }
  }, [chatId]);

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update local storage immediately with the user's message
    const storedChats = localStorage.getItem('chats');
    let chats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const chatIndex = chats.findIndex((chat) => chat.id === chatId);

    if (chatIndex > -1) {
      // If it's the first message in a "New Chat", update the title
      if (chats[chatIndex].title === 'New Chat' && chats[chatIndex].messages.length === 0) {
        chats[chatIndex].title = content.substring(0, 30);
      }
      chats[chatIndex].messages = updatedMessages;
    } else {
      // This should ideally not happen if the useEffect hook runs correctly
      chats.unshift({ id: chatId, title: content.substring(0, 30), messages: updatedMessages });
    }
    localStorage.setItem('chats', JSON.stringify(chats));

    try {
      const response = await fetch("https://saitejarr.app.n8n.cloud/webhook/a54d3e1f-3850-4e08-a8e2-5b6b91b8e967/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: chatId,
          action: "sendMessage",
          chatInput: content,
          userLang: "English"
        }),
      });

      const data = await response.json();
      let aiContent = "Sorry, I couldn't get a response.";
      if (data && (data.output || data.textResponse || data.reply)) {
        aiContent = data.output || data.textResponse || data.reply;
      }
      
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'ai',
        content: aiContent,
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Update local storage with the AI's response
      const finalChatIndex = chats.findIndex((chat) => chat.id === chatId);
      if(finalChatIndex > -1) {
        chats[finalChatIndex].messages = finalMessages;
        localStorage.setItem('chats', JSON.stringify(chats));
      }

    } catch (error: any) {
        const errorMessage: Message = {
            id: uuidv4(),
            role: 'ai',
            content: `Error: ${error.message}`,
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
    } finally {
        setIsSending(false);
    }
  };

  if (isUserLoading || (!user && isUserLoading)) {
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-32">
        <ChatMessages messages={messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
          <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
        </div>
      </div>
    </div>
  );
}
