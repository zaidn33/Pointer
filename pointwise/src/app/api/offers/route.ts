import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError } from '@/lib/api';
import { listWalletOffers } from '@/lib/offers';

export async function GET() {
  try {
    const user = await requireUser();
    const offers = await listWalletOffers(user.id);

    return Response.json({ offers });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    return jsonError(500, 'internal_error', 'Unable to load offers.');
  }
}
