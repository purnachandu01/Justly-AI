import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Message } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Scale } from "lucide-react";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-3",
            message.role === 'user' && "justify-end"
          )}
        >
          {message.role === 'ai' && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary">
                <Scale className="h-5 w-5" />
              </div>
            </Avatar>
          )}

          <div
            className={cn(
              "max-w-md rounded-lg p-3 text-sm md:max-w-xl",
              message.role === 'user'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {message.role === 'user' && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
