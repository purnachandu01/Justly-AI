'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Logo } from '../logo';
import { Plus, LogOut, Settings, MessageSquare, Trash2 } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState }from 'react';
import { type Chat } from '@/lib/mock-data';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function ChatSidebar() {
  const router = useRouter();
  const params = useParams();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const [chats, setChats] = useState<Chat[]>([]);
  const chatId = params.chatId as string;

  useEffect(() => {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/${newChatId}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleChatSelect = (selectedChatId: string) => {
    router.push(`/${selectedChatId}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  const handleDeleteChat = (e: React.MouseEvent, chatIdToDelete: string) => {
    e.stopPropagation();
    const updatedChats = chats.filter((chat) => chat.id !== chatIdToDelete);
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    if (chatId === chatIdToDelete) {
      router.push('/');
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className={cn("flex w-full items-center justify-between", state === 'collapsed' && "hidden")}>
            <Logo />
        </div>
        <Button onClick={handleNewChat} variant="secondary" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            <span className={cn(state === 'collapsed' && "hidden")}>New Chat</span>
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton 
                onClick={() => handleChatSelect(chat.id)} 
                isActive={chatId === chat.id}
                className="w-full justify-start"
                tooltip={chat.title}
              >
                <MessageSquare className="h-4 w-4" />
                <span className={cn("truncate", state === 'collapsed' && "hidden")}>{chat.title}</span>
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover onClick={(e) => handleDeleteChat(e, chat.id)} tooltip="Delete chat">
                <Trash2 />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarSeparator />

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("flex w-full items-center justify-start gap-2 p-2", "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center")}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className={cn("flex flex-col items-start text-sm", state === 'collapsed' && "hidden")}>
                <span>{isUserLoading ? 'Loading...' : (user?.displayName || 'User Name')}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="start" side="right">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
