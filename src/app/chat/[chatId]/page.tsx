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


  useEffect(() => {
    if (!chatId || !user) return; // Wait for chatId and user

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
        // This handles the very first chat in the application for this user.
        const newChat: Chat = { id: chatId, title: 'New Chat', messages: [] };
        localStorage.setItem('chats', JSON.stringify([newChat]));
        setMessages([]);
    }
  }, [chatId, user]); // Depend on user as well

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setIsSending(true);
    setInputValue(""); // Clear input after sending
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // This logic needs to be inside the async function to correctly update state and localStorage
    const storedChats = localStorage.getItem('chats');
    let chats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const chatIndex = chats.findIndex((chat) => chat.id === chatId);

    if (chatIndex > -1) {
      if (chats[chatIndex].title === 'New Chat' && chats[chatIndex].messages.length === 0) {
        chats[chatIndex].title = content.substring(0, 30);
      }
      chats[chatIndex].messages = updatedMessages;
    } else {
      // Create a new chat if it doesn't exist
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
      
      // Update UI and local storage with AI message
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, aiMessage];
        // Update localStorage inside the state setter to ensure it has the latest messages
        const currentChats = JSON.parse(localStorage.getItem('chats') || '[]');
        const currentChatIndex = currentChats.findIndex((c: Chat) => c.id === chatId);
        if (currentChatIndex > -1) {
          currentChats[currentChatIndex].messages = newMessages;
          localStorage.setItem('chats', JSON.stringify(currentChats));
        }
        return newMessages;
      });

    } catch (error: any) {
        console.error("Error in handleSendMessage:", error);
        const errorMessage: Message = {
            id: uuidv4(),
            role: 'ai',
            content: `Error: ${error.message}`,
        };
        // Update UI and localStorage with the error message
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, errorMessage];
            const currentChats = JSON.parse(localStorage.getItem('chats') || '[]');
            const currentChatIndex = currentChats.findIndex((c: Chat) => c.id === chatId);
            if (currentChatIndex > -1) {
                currentChats[currentChatIndex].messages = newMessages;
                localStorage.setItem('chats', JSON.stringify(currentChats));
            }
            return newMessages;
        });
    } finally {
        setIsSending(false);
    }
  };

  if (isUserLoading) {
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
