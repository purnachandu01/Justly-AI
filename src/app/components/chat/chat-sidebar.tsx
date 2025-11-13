'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/sidebar';
import { Logo } from '../logo';
import { Plus, LogOut, Settings } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function ChatSidebar() {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const handleLogout = () => {
    // In a real app, you'd clear session, etc.
    router.push('/login');
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/${newChatId}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex w-full items-center justify-between">
            <Logo />
        </div>
        <Button onClick={handleNewChat} variant="secondary" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        {/* Recent chats would be listed here */}
      </SidebarContent>
      
      <SidebarSeparator />

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("flex w-full items-center justify-start gap-2 p-2", "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar?.imageUrl} alt="User" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm group-data-[collapsible=icon]:hidden">
                {/* User name would go here */}
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
