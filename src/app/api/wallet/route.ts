import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError } from '@/lib/api';
import { listWalletCards } from '@/lib/wallet';

export async function GET() {
  try {
    const user = await requireUser();
    const cards = await listWalletCards(user.id);

    return Response.json({ cards });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    return jsonError(500, 'internal_error', 'Unable to load wallet.');
  }
}
