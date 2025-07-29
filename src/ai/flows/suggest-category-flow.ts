
'use server';
/**
 * @fileOverview An AI flow to suggest an expense category based on a description.
 *
 * - suggestCategory - A function that suggests a category for an expense.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 * - SuggestCategoryOutput - The return type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestCategoryInputSchema = z.string();
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const SuggestCategoryOutputSchema = z.object({
  category: z.string().describe('A concise, single-word category for the expense. For example: Food, Transport, Utilities, Rent, Health, Entertainment, Shopping, Education, Groceries, Other.'),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(description: SuggestCategoryInput): Promise<SuggestCategoryOutput> {
  return suggestCategoryFlow(description);
}

const prompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: {schema: SuggestCategoryInputSchema},
  output: {schema: SuggestCategoryOutputSchema},
  prompt: `You are an expert financial assistant. Your task is to accurately categorize an expense based on its description.

Analyze the following expense description and determine the most appropriate category for it.
Description: {{{prompt}}}

Your response should be a single, relevant category. If applicable, choose from the following list, otherwise provide a suitable one-word category:
Food, Transport, Utilities, Rent, Health, Entertainment, Shopping, Education, Groceries, Other.`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async (description) => {
    const {output} = await prompt(description);
    return output!;
  }
);
