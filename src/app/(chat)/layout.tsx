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
        <div className="p-2 absolute top-0 left-0">
            <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
