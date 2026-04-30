import { jsonError } from '@/lib/api';
import {
  isCardRequestStatus,
  listCardRequests,
} from '@/lib/card-requests';
import {
  AppAuthError,
  AppAuthorizationError,
  requireAdminUser,
} from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? 'pending';
    const search = searchParams.get('search') ?? '';

    if (status !== 'all' && !isCardRequestStatus(status)) {
      return jsonError(400, 'bad_request', 'Invalid card request status.');
    }

    const requests = await listCardRequests({ status, search });
    return Response.json({ requests });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof AppAuthorizationError) {
      return jsonError(403, 'forbidden', error.message);
    }

    return jsonError(500, 'internal_error', 'Unable to load card requests.');
  }
}
