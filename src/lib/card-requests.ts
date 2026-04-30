import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  ADMIN_CARD_SELECT,
  cardsShareNormalizedIdentity,
  getNormalizedCardIdentity,
} from '@/lib/card-catalog';

const CARD_REQUEST_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'created_pending_review',
  'fulfilled',
] as const;

export type CardRequestStatus = (typeof CARD_REQUEST_STATUSES)[number];

export type AdminCardRequestRecord = {
  id: string;
  cardName: string;
  issuer: string | null;
  notes: string | null;
  status: CardRequestStatus;
  source: string;
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  resolutionNotes: string | null;
  resolvedCardId: string | null;
  pendingDuplicateCount: number;
  resolvedCard: {
    id: string;
    name: string;
    issuer: string;
    network: string;
    isActive: boolean;
  } | null;
  matchingCatalogCard: {
    id: string;
    name: string;
    issuer: string;
    network: string;
    isActive: boolean;
  } | null;
};

type ListCardRequestsOptions = {
  status?: CardRequestStatus | 'all';
  search?: string;
};

type UpdateCardRequestInput = {
  requestId: string;
  reviewerEmail: string;
  status: CardRequestStatus;
  resolutionNotes?: string | null;
  resolvedCardId?: string | null;
};

type CreateCatalogCardFromRequestInput = {
  requestId: string;
  reviewerEmail: string;
  resolutionNotes?: string | null;
  card: {
    name: string;
    issuer: string;
    network: string;
    cardType: string;
    annualFee?: number | null;
    rewardProgram?: string | null;
    baseEarnRate?: number | null;
  };
};

type LinkExistingCardRequestInput = {
  requestId: string;
  reviewerEmail: string;
  resolvedCardId: string;
  resolutionNotes?: string | null;
};

const statusOrder: Record<CardRequestStatus, number> = {
  pending: 0,
  approved: 1,
  created_pending_review: 2,
  rejected: 3,
  fulfilled: 4,
};

export function isCardRequestStatus(value: unknown): value is CardRequestStatus {
  return (
    typeof value === 'string' &&
    CARD_REQUEST_STATUSES.includes(value as CardRequestStatus)
  );
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeRequiredText(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function duplicateKey(cardName: string, issuer: string | null) {
  return getNormalizedCardIdentity(cardName, issuer);
}

async function getAdminCardRequestRecordById(requestId: string) {
  const request = await prisma.cardRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error('not_found');
  }

  const [requests] = await Promise.all([
    listCardRequests({ status: 'all', search: request.cardName }),
  ]);
  const exactMatch = requests.find((item) => item.id === requestId);

  if (!exactMatch) {
    throw new Error('not_found');
  }

  return exactMatch;
}

async function getCardByNormalizedIdentity(
  tx: Prisma.TransactionClient,
  cardName: string,
  issuer: string | null,
) {
  const cards = await tx.card.findMany({
    select: ADMIN_CARD_SELECT,
  });

  return (
    (cards as Array<{
      id: string;
      name: string;
      issuer: string;
      network: string;
      isActive: boolean;
      cardType: string;
      annualFee: number | null;
      rewardProgram: string | null;
      baseEarnRate: number | null;
      isVerified: boolean;
      extractionNotes: string | null;
    }>).find((card) =>
      cardsShareNormalizedIdentity(
        { name: card.name, issuer: card.issuer },
        { name: cardName, issuer },
      ),
    ) ?? null
  );
}

function getRequestStatusForResolvedCard(card: {
  isActive: boolean;
  isVerified: boolean;
}) {
  return card.isActive && card.isVerified
    ? 'fulfilled'
    : 'created_pending_review';
}

export async function listCardRequests(
  options: ListCardRequestsOptions = {},
): Promise<AdminCardRequestRecord[]> {
  const search = options.search?.trim();
  const requests = await prisma.cardRequest.findMany({
    where: {
      ...(options.status && options.status !== 'all'
        ? { status: options.status }
        : null),
      ...(search
        ? {
            OR: [
              { cardName: { contains: search, mode: 'insensitive' } },
              { issuer: { contains: search, mode: 'insensitive' } },
            ],
          }
        : null),
    },
    orderBy: [{ createdAt: 'desc' }],
  });

  const userIds = [
    ...new Set(
      requests
        .map((request) => request.userId)
        .filter((userId): userId is string => Boolean(userId)),
    ),
  ];
  const users =
    userIds.length === 0
      ? []
      : await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true },
        });

  const userEmailById = new Map(users.map((user) => [user.id, user.email]));
  const duplicateGroups = await prisma.cardRequest.groupBy({
    by: ['cardName', 'issuer'],
    where: { status: 'pending' },
    _count: { _all: true },
  });
  const duplicateCountByKey = new Map(
    duplicateGroups.map((group) => [
      duplicateKey(group.cardName, group.issuer),
      group._count._all,
    ]),
  );
  const catalogCards = (await prisma.card.findMany({
    select: ADMIN_CARD_SELECT,
  })) as Array<{
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
  }>;
  const activeCardByIdentity = new Map(
    catalogCards
      .filter((card) => card.isActive)
      .map((card) => [
        getNormalizedCardIdentity(card.name, card.issuer),
        {
          id: card.id,
          name: card.name,
          issuer: card.issuer,
          network: card.network,
          isActive: card.isActive,
        },
      ]),
  );
  const cardById = new Map(
    catalogCards.map((card) => [
      card.id,
      {
        id: card.id,
        name: card.name,
        issuer: card.issuer,
        network: card.network,
        isActive: card.isActive,
      },
    ]),
  );

  return requests
    .map((request) => ({
      id: request.id,
      cardName: request.cardName,
      issuer: request.issuer,
      notes: request.notes,
      status: request.status as CardRequestStatus,
      source: request.source,
      userId: request.userId,
      userEmail: request.userId ? (userEmailById.get(request.userId) ?? null) : null,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      reviewedAt: request.reviewedAt?.toISOString() ?? null,
      reviewedBy: request.reviewedBy,
      resolutionNotes: request.resolutionNotes,
      resolvedCardId: request.resolvedCardId,
      pendingDuplicateCount:
        duplicateCountByKey.get(duplicateKey(request.cardName, request.issuer)) ?? 0,
      resolvedCard: request.resolvedCardId
        ? (cardById.get(request.resolvedCardId) ?? null)
        : null,
      matchingCatalogCard:
        activeCardByIdentity.get(duplicateKey(request.cardName, request.issuer)) ?? null,
    }))
    .sort(
      (left, right) =>
        statusOrder[left.status] - statusOrder[right.status] ||
        right.createdAt.localeCompare(left.createdAt),
    );
}

export async function updateCardRequestReview(
  input: UpdateCardRequestInput,
): Promise<AdminCardRequestRecord> {
  const existing = await prisma.cardRequest.findUnique({
    where: { id: input.requestId },
  });

  if (!existing) {
    throw new Error('not_found');
  }

  const resolvedCardId =
    input.resolvedCardId === undefined
      ? existing.resolvedCardId
      : normalizeOptionalText(input.resolvedCardId);

  if (resolvedCardId) {
    const matchingCard = await prisma.card.findUnique({
      where: { id: resolvedCardId },
      select: { id: true, isActive: true, isVerified: true },
    });

    if (!matchingCard) {
      throw new Error('invalid_resolved_card');
    }

    if (!matchingCard.isActive) {
      throw new Error('inactive_resolved_card');
    }
  }

  if (input.status === 'fulfilled' && !resolvedCardId) {
    throw new Error('resolved_card_required');
  }

  if (input.status === 'fulfilled' && resolvedCardId) {
    const matchingCard = await prisma.card.findUnique({
      where: { id: resolvedCardId },
      select: { isActive: true, isVerified: true },
    });

    if (!matchingCard) {
      throw new Error('invalid_resolved_card');
    }

    if (!matchingCard.isActive || !matchingCard.isVerified) {
      throw new Error('resolved_card_not_visible');
    }
  }

  await prisma.cardRequest.update({
    where: { id: input.requestId },
    data: {
      status: input.status,
      reviewedAt: new Date(),
      reviewedBy: input.reviewerEmail,
      resolutionNotes:
        input.resolutionNotes === undefined
          ? existing.resolutionNotes
          : normalizeOptionalText(input.resolutionNotes),
      resolvedCardId,
    },
  });

  return getAdminCardRequestRecordById(input.requestId);
}

export async function fulfillCardRequestByLink(
  input: LinkExistingCardRequestInput,
): Promise<AdminCardRequestRecord> {
  const resolvedCardId = normalizeRequiredText(input.resolvedCardId);
  if (!resolvedCardId) {
    throw new Error('resolved_card_required');
  }

  await prisma.$transaction(async (tx) => {
    const [existing, card] = await Promise.all([
      tx.cardRequest.findUnique({
        where: { id: input.requestId },
      }),
      tx.card.findUnique({
        where: { id: resolvedCardId },
        select: { id: true, isActive: true, isVerified: true },
      }),
    ]);

    if (!existing) {
      throw new Error('not_found');
    }

    if (!card) {
      throw new Error('invalid_resolved_card');
    }

    if (!card.isActive) {
      throw new Error('inactive_resolved_card');
    }

    await tx.cardRequest.update({
      where: { id: input.requestId },
      data: {
        status: getRequestStatusForResolvedCard(card),
        resolvedCardId: card.id,
        reviewedAt: new Date(),
        reviewedBy: input.reviewerEmail,
        resolutionNotes: normalizeOptionalText(input.resolutionNotes),
      },
    });
  });

  return getAdminCardRequestRecordById(input.requestId);
}

export async function createCatalogCardFromRequestAndFulfill(
  input: CreateCatalogCardFromRequestInput,
): Promise<AdminCardRequestRecord> {
  const name = normalizeRequiredText(input.card.name);
  const issuer = normalizeRequiredText(input.card.issuer);
  const network = normalizeRequiredText(input.card.network);
  const cardType = normalizeRequiredText(input.card.cardType) || 'Personal';

  if (!name || !issuer || !network) {
    throw new Error('invalid_card_payload');
  }

  if (
    input.card.annualFee != null &&
    (!Number.isFinite(input.card.annualFee) || input.card.annualFee < 0)
  ) {
    throw new Error('invalid_card_payload');
  }

  if (
    input.card.baseEarnRate != null &&
    (!Number.isFinite(input.card.baseEarnRate) || input.card.baseEarnRate <= 0)
  ) {
    throw new Error('invalid_card_payload');
  }

  await prisma.$transaction(async (tx) => {
    const existingRequest = await tx.cardRequest.findUnique({
      where: { id: input.requestId },
    });

    if (!existingRequest) {
      throw new Error('not_found');
    }

    const matchingCard = await getCardByNormalizedIdentity(tx, name, issuer);
    if (matchingCard) {
      throw new Error('matching_card_exists');
    }

    const createdCard = await tx.card.create({
      data: {
        name,
        issuer,
        network,
        cardType,
        annualFee: input.card.annualFee ?? null,
        rewardProgram: normalizeOptionalText(input.card.rewardProgram),
        baseEarnRate: input.card.baseEarnRate ?? null,
        isActive: true,
        isVerified: false,
        extractionNotes:
          input.card.annualFee == null || input.card.baseEarnRate == null
            ? 'Added from card request with incomplete reward data. Needs reward review.'
            : 'Added from card request. Reward/category rules still need verification.',
      },
      select: { id: true },
    });

    await tx.cardRequest.update({
      where: { id: input.requestId },
      data: {
        status: 'created_pending_review',
        resolvedCardId: createdCard.id,
        reviewedAt: new Date(),
        reviewedBy: input.reviewerEmail,
        resolutionNotes: normalizeOptionalText(input.resolutionNotes),
      },
    });
  });

  return getAdminCardRequestRecordById(input.requestId);
}
