import { prisma } from '@/lib/prisma';
import { listWalletCardsForRecommendations } from '@/lib/wallet';

type RecommendationErrorCode = 'empty_wallet' | 'unresolved_query';

export class RecommendationError extends Error {
  constructor(
    public readonly code: RecommendationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'RecommendationError';
  }
}

const CATEGORY_ALIASES = new Map([
  ['groceries', 'groceries'],
  ['grocery', 'groceries'],
  ['gas', 'gas'],
  ['fuel', 'gas'],
]);

type WalletCard = Awaited<
  ReturnType<typeof listWalletCardsForRecommendations>
>[number];

type MerchantMatch = {
  id: string;
  name: string;
  primaryCategory: string;
};

type QueryResolution = {
  merchant: MerchantMatch | null;
  category: string | null;
};

type ScoreSource = 'merchant_benefit' | 'category_rule' | 'base_rate';

type RecommendationCard = Omit<
  WalletCard['card'],
  'categoryRules' | 'merchantBenefits'
>;

export type RankedRecommendationCard = {
  walletCardId: string;
  card: RecommendationCard;
  score: number;
  matchedRule: ScoreSource;
};

export type RecommendationResult = {
  detectedMerchant: MerchantMatch | null;
  detectedCategory: string | null;
  bestCard: RankedRecommendationCard;
  rankedCards: RankedRecommendationCard[];
  explanation: string;
};

function normalizeQuery(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s&]/gu, ' ')
    .replace(/\s+/g, ' ');
}

function resolveCategory(normalizedQuery: string) {
  return CATEGORY_ALIASES.get(normalizedQuery) ?? null;
}

async function resolveMerchant(normalizedQuery: string) {
  const merchants = await prisma.merchant.findMany({
    select: {
      id: true,
      name: true,
      primaryCategory: true,
      aliases: {
        select: {
          alias: true,
        },
      },
    },
  });

  for (const merchant of merchants) {
    if (normalizeQuery(merchant.name) === normalizedQuery) {
      return {
        id: merchant.id,
        name: merchant.name,
        primaryCategory: merchant.primaryCategory,
      };
    }

    const aliasMatch = merchant.aliases.some(
      ({ alias }) => normalizeQuery(alias) === normalizedQuery,
    );

    if (aliasMatch) {
      return {
        id: merchant.id,
        name: merchant.name,
        primaryCategory: merchant.primaryCategory,
      };
    }
  }

  return null;
}

async function resolveRecommendationQuery(
  query: string,
): Promise<QueryResolution> {
  const normalizedQuery = normalizeQuery(query);
  const merchant = await resolveMerchant(normalizedQuery);

  if (merchant) {
    const normalizedCategory = normalizeQuery(merchant.primaryCategory);

    return {
      merchant,
      category: resolveCategory(normalizedCategory) ?? normalizedCategory,
    };
  }

  return {
    merchant: null,
    category: resolveCategory(normalizedQuery),
  };
}

function getSupportedMerchantBenefit(card: WalletCard, merchantId: string) {
  return card.card.merchantBenefits.find((benefit) => {
    const bonusType = benefit.bonusType.toLowerCase();
    return (
      benefit.merchantId === merchantId &&
      (bonusType === 'multiplier' || bonusType === 'cashback')
    );
  });
}

function serializeRecommendationCard(card: WalletCard['card']) {
  return {
    id: card.id,
    issuer: card.issuer,
    network: card.network,
    name: card.name,
    annualFee: card.annualFee,
    rewardProgram: card.rewardProgram,
    baseEarnRate: card.baseEarnRate,
  } satisfies RecommendationCard;
}

function scoreCard(
  walletCard: WalletCard,
  resolution: QueryResolution,
): RankedRecommendationCard {
  const card = serializeRecommendationCard(walletCard.card);

  if (resolution.merchant) {
    const merchantBenefit = getSupportedMerchantBenefit(
      walletCard,
      resolution.merchant.id,
    );

    if (merchantBenefit) {
      return {
        walletCardId: walletCard.id,
        card,
        score: merchantBenefit.bonusValue,
        matchedRule: 'merchant_benefit',
      };
    }
  }

  if (resolution.category) {
    const categoryRule = walletCard.card.categoryRules.find(
      (rule) => normalizeQuery(rule.category) === resolution.category,
    );

    if (categoryRule) {
      return {
        walletCardId: walletCard.id,
        card,
        score: categoryRule.multiplier,
        matchedRule: 'category_rule',
      };
    }
  }

  return {
    walletCardId: walletCard.id,
    card,
    score: walletCard.card.baseEarnRate,
    matchedRule: 'base_rate',
  };
}

function compareRankedCards(
  left: RankedRecommendationCard,
  right: RankedRecommendationCard,
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  const nameCompare = left.card.name.localeCompare(right.card.name);
  if (nameCompare !== 0) {
    return nameCompare;
  }

  return left.card.id.localeCompare(right.card.id);
}

function formatScore(score: number) {
  return Number.isInteger(score) ? `${score}x` : `${score}x`;
}

function buildExplanation(
  bestCard: RankedRecommendationCard,
  resolution: QueryResolution,
) {
  const target =
    resolution.merchant?.name ?? resolution.category ?? 'this purchase';

  if (bestCard.matchedRule === 'merchant_benefit') {
    return `Use ${bestCard.card.name} because it has the strongest saved-card merchant benefit for ${target}.`;
  }

  if (bestCard.matchedRule === 'category_rule' && resolution.category) {
    return `Use ${bestCard.card.name} because it earns ${formatScore(
      bestCard.score,
    )} on ${resolution.category}.`;
  }

  return `Use ${bestCard.card.name} because it has the strongest base earn rate in your saved wallet for ${target}.`;
}

export async function getRecommendationForQuery(
  userId: string,
  query: string,
): Promise<RecommendationResult> {
  const walletCards = await listWalletCardsForRecommendations(userId);

  if (walletCards.length === 0) {
    throw new RecommendationError(
      'empty_wallet',
      'Add a card to your wallet before requesting a recommendation.',
    );
  }

  const resolution = await resolveRecommendationQuery(query);

  if (!resolution.merchant && !resolution.category) {
    throw new RecommendationError(
      'unresolved_query',
      'Query could not be resolved to a supported merchant or category.',
    );
  }

  const rankedCards = walletCards.map((card) => scoreCard(card, resolution));
  rankedCards.sort(compareRankedCards);

  const bestCard = rankedCards[0];

  return {
    detectedMerchant: resolution.merchant,
    detectedCategory: resolution.category,
    bestCard,
    rankedCards,
    explanation: buildExplanation(bestCard, resolution),
  };
}
