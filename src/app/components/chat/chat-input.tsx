'use client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ChatInput({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const handleMicClick = () => {
    // In a real app, you'd implement the Web Speech API here.
    toast({
        title: "Feature Not Implemented",
        description: "Speech-to-text is a demo feature.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        placeholder="Type your message here..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[52px] resize-none pr-28"
        aria-label="Chat input"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={handleMicClick}>
          <Mic className="h-5 w-5" />
          <span className="sr-only">Use microphone</span>
        </Button>
        <Button type="submit" size="icon" disabled={!inputValue.trim()}>
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
