import type {
  RankedRecommendationCard,
  RecommendationResult,
} from '@/lib/recommendations';

export type ParsedRecommendationIntent = {
  merchant: string | null;
  category: string | null;
};

export type RecommendationExplanationInput = Pick<
  RecommendationResult,
  'detectedMerchant' | 'detectedCategory' | 'bestCard'
> & {
  rankedCards: RankedRecommendationCard[];
};

export type RecommendationLlmProvider = {
  isEnabled(): boolean;
  parseRecommendationIntent(
    query: string,
    context: {
      merchants: string[];
      categories: string[];
    },
  ): Promise<ParsedRecommendationIntent | null>;
  generateRecommendationExplanation(
    input: RecommendationExplanationInput,
  ): Promise<string | null>;
};
