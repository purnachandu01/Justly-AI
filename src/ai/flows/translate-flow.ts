'use server';
/**
 * @fileOverview A flow for translating text.
 *
 * - translateText - A function that translates text to a target language.
 * - TranslateInput - The input type for the translateText function.
 * - TranslateOutput - The return type for the translateText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language to translate to.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

export type TranslateOutput = string;

export async function translateText(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: { schema: TranslateInputSchema },
  output: { format: 'text' },
  prompt: `Translate the following text to {{targetLanguage}}. Only return the translated text, with no extra formatting or explanations.\n\nText: {{{text}}}`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await translatePrompt(input);
    return output || '';
  }
);
