import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type WalletErrorCode = 'not_found' | 'conflict';

export class WalletError extends Error {
  constructor(
    public readonly code: WalletErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

const cardSelect = {
  id: true,
  issuer: true,
  network: true,
  name: true,
  annualFee: true,
  rewardProgram: true,
  baseEarnRate: true,
} satisfies Prisma.CardSelect;

export async function listWalletCards(userId: string) {
  return prisma.userCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      card: {
        select: cardSelect,
      },
    },
  });
}

export async function listWalletCardsForRecommendations(userId: string) {
  return prisma.userCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      card: {
        select: {
          ...cardSelect,
          categoryRules: {
            select: {
              category: true,
              multiplier: true,
            },
          },
          merchantBenefits: {
            select: {
              merchantId: true,
              bonusType: true,
              bonusValue: true,
            },
          },
        },
      },
    },
  });
}

export async function addCardToWallet(userId: string, cardId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true },
  });

  if (!card) {
    throw new WalletError('not_found', 'Card not found.');
  }

  try {
    return await prisma.userCard.create({
      data: {
        userId,
        cardId,
      },
      select: {
        id: true,
        createdAt: true,
        card: {
          select: cardSelect,
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new WalletError('conflict', 'Card is already in wallet.');
    }

    throw error;
  }
}

export async function removeWalletCard(userId: string, userCardId: string) {
  const result = await prisma.userCard.deleteMany({
    where: {
      id: userCardId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new WalletError('not_found', 'Wallet card not found.');
  }
}
