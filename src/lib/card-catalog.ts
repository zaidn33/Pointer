import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const ADMIN_CARD_SELECT = {
  id: true,
  name: true,
  issuer: true,
  network: true,
  cardType: true,
  annualFee: true,
  rewardProgram: true,
  baseEarnRate: true,
  isActive: true,
  isVerified: true,
  extractionNotes: true,
} satisfies Prisma.CardSelect;

export type AdminCatalogCard = {
  id: string;
  name: string;
  issuer: string;
  network: string;
  cardType: string;
  annualFee: number | null;
  rewardProgram: string | null;
  baseEarnRate: number | null;
  isActive: boolean;
  isVerified: boolean;
  extractionNotes: string | null;
};

type CardReader = {
  name: string;
  issuer: string | null;
};

function normalizeCardIdentityPart(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[-‐‑‒–—―/\\()_,.:;]+/g, ' ')
    .replace(/[^a-z0-9+\s]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function getNormalizedCardIdentity(cardName: string, issuer: string | null | undefined) {
  return `${normalizeCardIdentityPart(cardName)}::${normalizeCardIdentityPart(issuer)}`;
}

export function cardsShareNormalizedIdentity(left: CardReader, right: CardReader) {
  return (
    getNormalizedCardIdentity(left.name, left.issuer) ===
    getNormalizedCardIdentity(right.name, right.issuer)
  );
}

export async function listAdminCardCatalog(search?: string) {
  const query = search?.trim();

  const cards = await prisma.card.findMany({
    where: {
      isActive: true,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { issuer: { contains: query, mode: 'insensitive' } },
            ],
          }
        : null),
    },
    orderBy: [{ issuer: 'asc' }, { name: 'asc' }],
    select: ADMIN_CARD_SELECT,
    take: query ? 12 : 50,
  });

  return cards as AdminCatalogCard[];
}
