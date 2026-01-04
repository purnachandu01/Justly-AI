'use client';
import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { type Message, type Chat } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';
import { useUser } from '@/firebase';

export default function ChatPage() {
  const params = useParams();
  const { user, isUserLoading } = useUser();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false); // New state to track client-side load


  useEffect(() => {
    // This effect now handles all localStorage interactions and only runs on the client
    if (!chatId || !user) return; // Wait for chatId and user

    // Mark as loaded to prevent server-side execution of localStorage
    setHasLoaded(true); 

    localStorage.setItem('lastChatId', chatId);

    const storedChats = localStorage.getItem('chats');
    let chats: Chat[] = storedChats ? JSON.parse(storedChats) : [];

    const currentChat = chats.find((chat) => chat.id === chatId);
    if (currentChat) {
      setMessages(currentChat.messages);
    } else {
      // Chat doesn't exist, create it.
      const newChat: Chat = { id: chatId, title: 'New Chat', messages: [] };
      chats.unshift(newChat); // Add to the beginning of the array
      localStorage.setItem('chats', JSON.stringify(chats));
      setMessages([]);
    }
  }, [chatId, user]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !hasLoaded) return; // Also check if client has loaded
    setIsSending(true);
    setInputValue("");

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    // Optimistically update UI
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Persist to localStorage
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
      // This case should be rare now, but as a fallback
      const newChat: Chat = { id: chatId, title: content.substring(0, 30), messages: updatedMessages };
      chats.unshift(newChat);
    }
    localStorage.setItem('chats', JSON.stringify(chats));
    

    try {
      // Fetch AI response
      const response = await fetch("https://bhargavi01.app.n8n.cloud/webhook/13b7d625-8215-4644-98db-d22d00966cd6/chat", {
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

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.output || data.textResponse || data.reply || "Sorry, I couldn't get a response.";
      
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'ai',
        content: aiContent,
      };
      
      // Final update to UI and localStorage with AI message
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const finalChats = JSON.parse(localStorage.getItem('chats') || '[]');
      const finalChatIndex = finalChats.findIndex((c: Chat) => c.id === chatId);
      if (finalChatIndex > -1) {
          finalChats[finalChatIndex].messages = finalMessages;
          localStorage.setItem('chats', JSON.stringify(finalChats));
      }

    } catch (error: any) {
        console.error("Error in handleSendMessage:", error);
        const errorMessage: Message = {
            id: uuidv4(),
            role: 'ai',
            content: `Error: ${error.message}`,
        };
        // Final update to UI and localStorage with error message
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);

        const finalChats = JSON.parse(localStorage.getItem('chats') || '[]');
        const finalChatIndex = finalChats.findIndex((c: Chat) => c.id === chatId);
        if (finalChatIndex > -1) {
            finalChats[finalChatIndex].messages = finalMessages;
            localStorage.setItem('chats', JSON.stringify(finalChats));
        }
    } finally {
        setIsSending(false);
    }
  };

  if (isUserLoading || !hasLoaded) { // Show loading until client has loaded localStorage
    return <div className="flex h-full items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-32">
        <ChatMessages messages={messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isSending={isSending}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </div>
      </div>
    </div>
  );
}
