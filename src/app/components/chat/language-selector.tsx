'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const popularLanguages = [
  { value: "en-US", label: "English" },
  { value: "es-ES", label: "Spanish" },
  { value: "zh-CN", label: "Mandarin" },
  { value: "hi-IN", label: "Hindi" },
  { value: "fr-FR", label: "French" },
  { value: "ar-SA", label: "Arabic" },
  { value: "bn-BD", label: "Bengali" },
  { value: "ru-RU", label: "Russian" },
  { value: "pt-BR", label: "Portuguese" },
  { value: "de-DE", label: "German" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ko-KR", label: "Korean" },
];


export function LanguageSelector({ selectedLanguage, setSelectedLanguage }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SelectTrigger className="w-auto h-10 px-2 border-0 bg-transparent text-muted-foreground hover:text-foreground">
                        <Languages className="h-5 w-5" />
                    </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Select Language</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      <SelectContent align="end">
        {popularLanguages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
            </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
