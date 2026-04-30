import { jsonError } from '@/lib/api';
import { listAdminCardCatalog } from '@/lib/card-catalog';
import {
  AppAuthError,
  AppAuthorizationError,
  requireAdminUser,
} from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const cards = await listAdminCardCatalog(search);

    return Response.json({ cards });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof AppAuthorizationError) {
      return jsonError(403, 'forbidden', error.message);
    }

    return jsonError(500, 'internal_error', 'Unable to load admin card catalog.');
  }
}
