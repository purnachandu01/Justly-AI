'use client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
  setInputValue: (value: string) => void;
  inputValue: string;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export default function ChatInput({ onSendMessage, isSending, inputValue, setInputValue, selectedLanguage, setSelectedLanguage }: ChatInputProps) {
  const { toast } = useToast();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Silently fail if not supported. The button will show a toast.
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputValue(finalTranscript + interimTranscript);
    };

    recognition.onstart = () => {
      setIsRecognizing(true);
    };

    recognition.onend = () => {
      setIsRecognizing(false);
    };


    recognition.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({
            variant: "destructive",
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please ensure you've given microphone permissions.`,
          });
        }
        setIsRecognizing(false);
      };

    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
  }, [toast, setInputValue, selectedLanguage]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
        toast({
            title: "Feature Not Supported",
            description: "Your browser does not support speech recognition.",
        });
        return;
    }

    if (isRecognizing) {
      recognition.stop();
    } else {
      try {
        recognition.lang = selectedLanguage;
        recognition.start();
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          // This can happen if start() is called while it's already starting.
          // We can ignore this or handle it gracefully.
        } else {
          toast({
            variant: "destructive",
            title: "Could not start listening",
            description: e.message || "Please check microphone permissions.",
          });
        }
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    if (isRecognizing) {
        recognitionRef.current?.stop();
    }
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
        placeholder="Type your message or use the microphone..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[52px] resize-none pr-28"
        aria-label="Chat input"
        disabled={isSending}
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={handleMicClick} disabled={isSending} className={cn(isRecognizing && "text-red-500 hover:text-red-600")}>
          {isRecognizing ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecognizing ? "Stop listening" : "Use microphone"}</span>
        </Button>
        <Button type="submit" size="icon" disabled={!inputValue.trim() || isSending}>
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
