import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError } from '@/lib/api';

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json({ user });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    return jsonError(500, 'internal_error', 'Unable to load current user.');
  }
}
