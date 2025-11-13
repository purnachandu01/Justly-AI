import ChatSidebar from '@/app/components/chat/chat-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <ChatSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="absolute left-2 top-2 p-2 md:hidden">
          <SidebarTrigger />
        </div>
        <div className="p-2 absolute top-0 left-0 hidden md:block">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
