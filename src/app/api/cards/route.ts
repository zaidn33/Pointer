import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const issuer = url.searchParams.get("issuer")?.trim() ?? "";
  const network = url.searchParams.get("network")?.trim() ?? "";
  const cardType = url.searchParams.get("type")?.trim() ?? "";

  const where: Prisma.CardWhereInput = { isActive: true, isVerified: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { issuer: { contains: search, mode: "insensitive" } },
      { rewardProgram: { contains: search, mode: "insensitive" } },
    ];
  }
  if (issuer) {
    where.issuer = issuer;
  }
  if (network) {
    where.network = network;
  }
  if (cardType) {
    where.cardType = cardType;
  }

  const [cards, issuers, networks, types] = await Promise.all([
    prisma.card.findMany({
      where,
      orderBy: [{ issuer: "asc" }, { name: "asc" }],
      select: {
        id: true,
        issuer: true,
        network: true,
        name: true,
        cardType: true,
        annualFee: true,
        rewardProgram: true,
        baseEarnRate: true,
        isVerified: true,
        extractionNotes: true,
        categoryRules: {
          select: { category: true, multiplier: true },
        },
      },
    }),
    prisma.card.groupBy({ by: ["issuer"], where: { isActive: true, isVerified: true }, orderBy: { issuer: "asc" } }),
    prisma.card.groupBy({ by: ["network"], where: { isActive: true, isVerified: true }, orderBy: { network: "asc" } }),
    prisma.card.groupBy({ by: ["cardType"], where: { isActive: true, isVerified: true }, orderBy: { cardType: "asc" } }),
  ]);

  return Response.json({
    cards,
    filters: {
      issuers: issuers.map((r) => r.issuer),
      networks: networks.map((r) => r.network),
      types: types.map((r) => r.cardType),
    },
  });
}
