import { prisma } from '@/lib/prisma';
import { jsonError, readJsonObject } from '@/lib/api';
import { requireUser, AppAuthError } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  const rawName = body?.cardName;

  if (typeof rawName !== 'string' || !rawName.trim()) {
    return jsonError(400, 'bad_request', 'cardName is required.');
  }

  const cardName = rawName.trim();
  const issuer =
    typeof body?.issuer === 'string' && body.issuer.trim()
      ? body.issuer.trim()
      : null;
  const notes =
    typeof body?.notes === 'string' && body.notes.trim()
      ? body.notes.trim()
      : null;

  // Optional auth — store userId when available
  let userId: string | null = null;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch (error) {
    if (!(error instanceof AppAuthError)) {
      return jsonError(500, 'internal_error', 'Unable to submit card request.');
    }
  }

  // Skip if an identical pending request already exists
  const existing = await prisma.cardRequest.findFirst({
    where: {
      cardName,
      issuer,
      status: 'pending',
    },
  });

  if (existing) {
    return Response.json({ cardRequest: existing }, { status: 200 });
  }

  const cardRequest = await prisma.cardRequest.create({
    data: {
      cardName,
      issuer,
      notes,
      userId,
      source: 'wallet_request',
    },
  });

  return Response.json({ cardRequest }, { status: 201 });
}
