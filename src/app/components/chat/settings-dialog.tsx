'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };
  
  const handleClearChats = () => {
    localStorage.removeItem('chats');
    localStorage.removeItem('lastChatId');
    toast({
      title: "Chats Cleared",
      description: "All your conversations have been deleted.",
    });
    // Manually trigger storage event to update sidebar
    window.dispatchEvent(new Event('storage'));
    router.push('/chat');
    onOpenChange(false);
  }

  if (!isMounted) {
    return null; // Don't render until client-side hydration is complete
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-switcher" className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <span>Light</span>
            </Label>
            <Switch
              id="theme-switcher"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
            />
            <Label htmlFor="theme-switcher" className="flex items-center gap-2">
               <Moon className="h-5 w-5" />
              <span>Dark</span>
            </Label>
          </div>
           <div className="flex items-center justify-between pt-4">
             <Label>
                Manage Chats
             </Label>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Clear All Chats</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your chat conversations.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChats}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
