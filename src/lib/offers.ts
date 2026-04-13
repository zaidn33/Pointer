import type { Offer } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { normalizeRewardCategory } from '@/lib/reward-categories';

type OfferMatchInput = {
  cardIds: string[];
  merchantId: string | null;
  category: string | null;
};

export type SerializedOffer = Pick<
  Offer,
  | 'id'
  | 'title'
  | 'description'
  | 'cardId'
  | 'merchantId'
  | 'category'
  | 'bonusType'
  | 'bonusValue'
  | 'validFrom'
  | 'validTo'
>;

const offerSelect = {
  id: true,
  title: true,
  description: true,
  cardId: true,
  merchantId: true,
  category: true,
  bonusType: true,
  bonusValue: true,
  validFrom: true,
  validTo: true,
} satisfies Record<keyof SerializedOffer, true>;

function activeOfferWhere(now: Date) {
  return {
    isActive: true,
    OR: [{ validFrom: null }, { validFrom: { lte: now } }],
    AND: [{ OR: [{ validTo: null }, { validTo: { gte: now } }] }],
  };
}

function serializeOffer(offer: SerializedOffer) {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    cardId: offer.cardId,
    merchantId: offer.merchantId,
    category: offer.category,
    bonusType: offer.bonusType,
    bonusValue: offer.bonusValue,
    validFrom: offer.validFrom,
    validTo: offer.validTo,
  };
}

async function listWalletCardIds(userId: string) {
  const walletCards = await prisma.userCard.findMany({
    where: { userId },
    select: {
      cardId: true,
    },
  });

  return walletCards.map(({ cardId }) => cardId);
}

export async function listWalletOffers(userId: string) {
  const cardIds = await listWalletCardIds(userId);

  if (cardIds.length === 0) {
    return [];
  }

  const offers = await prisma.offer.findMany({
    where: {
      ...activeOfferWhere(new Date()),
      cardId: {
        in: cardIds,
      },
    },
    orderBy: [{ validTo: 'asc' }, { title: 'asc' }],
    select: offerSelect,
  });

  return offers.map(serializeOffer);
}

export async function listMatchedRecommendationOffers(input: OfferMatchInput) {
  if (
    input.cardIds.length === 0 ||
    (!input.merchantId && !input.category)
  ) {
    return [];
  }

  const offers = await prisma.offer.findMany({
    where: {
      ...activeOfferWhere(new Date()),
      cardId: {
        in: input.cardIds,
      },
    },
    orderBy: [{ validTo: 'asc' }, { title: 'asc' }],
    select: offerSelect,
  });

  const normalizedCategory = normalizeRewardCategory(input.category);
  const matchedOffers = offers.filter((offer) => {
    const merchantMatches =
      Boolean(input.merchantId) && offer.merchantId === input.merchantId;
    const categoryMatches =
      Boolean(normalizedCategory) &&
      normalizeRewardCategory(offer.category) === normalizedCategory;

    return merchantMatches || categoryMatches;
  });

  return matchedOffers.map(serializeOffer);
}
