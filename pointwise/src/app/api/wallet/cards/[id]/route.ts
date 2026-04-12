import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError } from '@/lib/api';
import { removeWalletCard, WalletError } from '@/lib/wallet';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!id) {
    return jsonError(400, 'bad_request', 'Wallet card id is required.');
  }

  try {
    const user = await requireUser();
    await removeWalletCard(user.id, id);

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof WalletError) {
      return jsonError(404, 'not_found', error.message);
    }

    return jsonError(
      500,
      'internal_error',
      'Unable to remove card from wallet.',
    );
  }
}
