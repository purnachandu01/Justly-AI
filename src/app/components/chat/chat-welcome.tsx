import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "../logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ChatWelcome({ onNewChat }: { onNewChat?: () => void }) {
  const examplePrompts = [
    "Explain the concept of 'due process'",
    "What are the differences between civil and criminal law?",
    "Summarize the key points of the Miranda warning",
  ];

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-3xl mx-auto">
      <Logo />
      {onNewChat && (
        <Button onClick={onNewChat}>
          Start New Chat <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {examplePrompts.map((prompt, i) => (
          <Card key={i} className="cursor-pointer p-4 text-left transition-colors hover:bg-secondary">
            <CardContent className="p-0">
              <p className="font-medium text-sm">{prompt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">JustlyAI can make mistakes. Consider checking important information.</p>
    </div>
  );
}
