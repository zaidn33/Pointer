import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError, readJsonObject } from '@/lib/api';
import { addCardToWallet, WalletError } from '@/lib/wallet';

function walletErrorResponse(error: WalletError) {
  if (error.code === 'conflict') {
    return jsonError(409, 'conflict', error.message);
  }

  return jsonError(404, 'not_found', error.message);
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  const cardId = body?.cardId;

  if (typeof cardId !== 'string' || !cardId.trim()) {
    return jsonError(400, 'bad_request', 'cardId is required.');
  }

  try {
    const user = await requireUser();
    const walletCard = await addCardToWallet(user.id, cardId.trim());

    return Response.json({ card: walletCard }, { status: 201 });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof WalletError) {
      return walletErrorResponse(error);
    }

    return jsonError(500, 'internal_error', 'Unable to add card to wallet.');
  }
}
