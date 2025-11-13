'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { chats } from '@/lib/mock-data';
import { Logo } from '../logo';
import { MessageSquare, Plus, LogOut, Settings } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function ChatSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const handleLogout = () => {
    // In a real app, you'd clear session, etc.
    router.push('/login');
  };

  const handleLinkClick = () => {
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
        <Button asChild variant="secondary" className="w-full">
            <Link href="/" onClick={handleLinkClick}>
                <Plus className="mr-2 h-4 w-4" />
                New Chat
            </Link>
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          <span className="px-2 pb-2 text-xs font-medium text-muted-foreground">Recent</span>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton asChild isActive={pathname === `/${chat.id}`} className="w-full justify-start truncate">
                <Link href={`/${chat.id}`} onClick={handleLinkClick}>
                  <MessageSquare />
                  <span>{chat.title}</span>
                </Link>
              </SidebarMenuButton>
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
                <AvatarImage src={userAvatar?.imageUrl} alt="Demo User" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>DU</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-medium">Demo User</span>
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
