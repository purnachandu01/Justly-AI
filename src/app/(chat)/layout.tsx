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
        <div className="fixed top-2 left-2 z-20 md:hidden">
          <SidebarTrigger />
        </div>
        <div className="hidden md:block absolute top-2 left-2 z-20">
            <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
