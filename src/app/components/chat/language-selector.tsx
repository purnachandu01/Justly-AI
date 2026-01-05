'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Languages } from "lucide-react";

export type Language = {
  value: string;
  label: string;
};

const languages: Language[] = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Hindi", label: "Hindi" },
    { value: "Arabic", label: "Arabic" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, disabled }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange} disabled={disabled}>
      <SelectTrigger className="w-auto h-10 border-0 bg-transparent text-muted-foreground hover:text-foreground focus:ring-0">
        <div className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            <SelectValue placeholder="Select language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
