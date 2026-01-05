'use client';
import ChatInput from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/chat-messages';
import { type Message } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { LanguageSelector } from '@/app/components/chat/language-selector';
import { translateText } from '@/ai/flows/translate-flow';

export default function ChatPage() {
  const params = useParams();
  const { user, isUserLoading } = useUser();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && chatId && user) {
      setHasLoaded(true);
      localStorage.setItem('lastChatId', chatId);
      const storedChats = localStorage.getItem('chats');
      const chats = storedChats ? JSON.parse(storedChats) : [];
      const currentChat = chats.find((chat: any) => chat.id === chatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      } else {
        const newChat = { id: chatId, title: 'New Chat', messages: [] };
        chats.unshift(newChat);
        localStorage.setItem('chats', JSON.stringify(chats));
        setMessages([]);
      }
    }
  }, [chatId, user]);
  
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    setIsTranslating(true);
    try {
      const translatedMessages = await Promise.all(
        messages.map(async (message) => {
          const translatedContent = await translateText({
            text: message.content,
            targetLanguage: newLanguage,
          });
          return { ...message, content: translatedContent };
        })
      );
      setMessages(translatedMessages);
    } catch (error) {
      console.error("Error translating messages:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !hasLoaded) return;
    setIsSending(true);
    setInputValue("");

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
        const storedChats = localStorage.getItem('chats');
        let chats = storedChats ? JSON.parse(storedChats) : [];
        const chatIndex = chats.findIndex((chat: any) => chat.id === chatId);

        if (chatIndex > -1) {
            if (chats[chatIndex].title === 'New Chat' && chats[chatIndex].messages.length === 0) {
                chats[chatIndex].title = content.substring(0, 30);
            }
            chats[chatIndex].messages = updatedMessages;
        } else {
            const newChat = { id: chatId, title: content.substring(0, 30), messages: updatedMessages };
            chats.unshift(newChat);
        }
        localStorage.setItem('chats', JSON.stringify(chats));
    } catch (error) {
        console.error("Error saving user message to localStorage:", error);
    }
    

    try {
      const response = await fetch("https://bhargavi01.app.n8n.cloud/webhook/13b7d625-8215-4644-98db-d22d00966cd6/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: chatId,
          action: "sendMessage",
          chatInput: content,
          userLang: language
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      let aiContent = data.output || data.textResponse || data.reply || "Sorry, I couldn't get a response.";
      
      if (typeof aiContent === 'object') {
        aiContent = "```json\n" + JSON.stringify(aiContent, null, 2) + "\n```";
      }

      const aiMessage: Message = {
        id: uuidv4(),
        role: 'ai',
        content: aiContent,
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const finalChats = JSON.parse(localStorage.getItem('chats') || '[]');
      const finalChatIndex = finalChats.findIndex((c: any) => c.id === chatId);
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
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);

        try {
            const finalChats = JSON.parse(localStorage.getItem('chats') || '[]');
            const finalChatIndex = finalChats.findIndex((c: any) => c.id === chatId);
            if (finalChatIndex > -1) {
                finalChats[finalChatIndex].messages = finalMessages;
                localStorage.setItem('chats', JSON.stringify(finalChats));
            }
        } catch (localError) {
             console.error("Error saving error message to localStorage:", localError);
        }
    } finally {
        setIsSending(false);
    }
  };

  if (isUserLoading || !hasLoaded || isTranslating) {
    return <div className="flex h-full items-center justify-center"><p>{isTranslating ? 'Translating...' : 'Loading...'}</p></div>;
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-32">
        <ChatMessages messages={messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
            <div className="pb-2">
                <LanguageSelector 
                    selectedLanguage={language}
                    onLanguageChange={handleLanguageChange}
                    disabled={isSending || isTranslating}
                />
            </div>
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
