import { OpenAIRecommendationLlmProvider } from '@/lib/llm/openai';
import type { RecommendationLlmProvider } from '@/lib/llm/types';

let provider: RecommendationLlmProvider | null = null;

export function getRecommendationLlmProvider() {
  provider ??= new OpenAIRecommendationLlmProvider();
  return provider;
}
