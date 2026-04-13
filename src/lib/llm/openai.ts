import type {
  ParsedRecommendationIntent,
  RecommendationExplanationInput,
  RecommendationLlmProvider,
} from '@/lib/llm/types';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_OPENAI_MODEL = 'gpt-5.4-mini';
const DEFAULT_TIMEOUT_MS = 3500;
const MAX_EXPLANATION_LENGTH = 240;

type JsonSchemaFormat = {
  type: 'json_schema';
  name: string;
  strict: true;
  schema: Record<string, unknown>;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

  return {
    apiKey,
    model: process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_TIMEOUT_MS,
  };
}

function extractResponseText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  for (const output of response.output ?? []) {
    for (const content of output.content ?? []) {
      if (typeof content.text === 'string') {
        return content.text;
      }
    }
  }

  return null;
}

function parseJsonObject(text: string) {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function cleanOptionalString(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function validateIntent(value: Record<string, unknown>) {
  return {
    merchant: cleanOptionalString(value.merchant),
    category: cleanOptionalString(value.category),
  } satisfies ParsedRecommendationIntent;
}

function validateExplanation(value: Record<string, unknown>) {
  const explanation = cleanOptionalString(value.explanation);

  if (!explanation || explanation.length > MAX_EXPLANATION_LENGTH) {
    return null;
  }

  return explanation;
}

async function createJsonResponse(
  input: Array<{ role: 'system' | 'user'; content: string }>,
  format: JsonSchemaFormat,
) {
  const config = getOpenAIConfig();

  if (!config) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        input,
        text: {
          format,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenAIResponse;
    const text = extractResponseText(data);

    if (!text) {
      return null;
    }

    return parseJsonObject(text);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const intentFormat = {
  type: 'json_schema',
  name: 'recommendation_intent',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      merchant: {
        type: ['string', 'null'],
        description: 'Merchant name mentioned by the user, or null.',
      },
      category: {
        type: ['string', 'null'],
        description: 'Purchase category mentioned by the user, or null.',
      },
    },
    required: ['merchant', 'category'],
  },
} satisfies JsonSchemaFormat;

const explanationFormat = {
  type: 'json_schema',
  name: 'recommendation_explanation',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      explanation: {
        type: 'string',
        description:
          'A short explanation grounded only in the supplied recommendation result.',
      },
    },
    required: ['explanation'],
  },
} satisfies JsonSchemaFormat;

export class OpenAIRecommendationLlmProvider
  implements RecommendationLlmProvider
{
  isEnabled() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async parseRecommendationIntent(
    query: string,
    context: {
      merchants: string[];
      categories: string[];
    },
  ) {
    const result = await createJsonResponse(
      [
        {
          role: 'system',
          content:
            'Extract only the merchant and purchase category for a credit card recommendation query. Do not choose cards, scores, rankings, or reward rules. Use null when the user does not mention a merchant or category.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            query,
            knownMerchants: context.merchants,
            knownCategories: context.categories,
          }),
        },
      ],
      intentFormat,
    );

    if (!result) {
      return null;
    }

    const intent = validateIntent(result);
    return intent.merchant || intent.category ? intent : null;
  }

  async generateRecommendationExplanation(
    input: RecommendationExplanationInput,
  ) {
    const result = await createJsonResponse(
      [
        {
          role: 'system',
          content:
            'Write one short user-facing sentence explaining the supplied credit card recommendation. Use only the supplied result. Do not invent cards, scores, rankings, offers, flights, or merchant facts.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            detectedMerchant: input.detectedMerchant,
            detectedCategory: input.detectedCategory,
            bestCard: input.bestCard,
            rankedCards: input.rankedCards.slice(0, 3),
          }),
        },
      ],
      explanationFormat,
    );

    if (!result) {
      return null;
    }

    return validateExplanation(result);
  }
}
