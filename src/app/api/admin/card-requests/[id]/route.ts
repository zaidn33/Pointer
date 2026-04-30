import { jsonError, readJsonObject } from '@/lib/api';
import {
  isCardRequestStatus,
  updateCardRequestReview,
} from '@/lib/card-requests';
import {
  AppAuthError,
  AppAuthorizationError,
  requireAdminUser,
} from '@/lib/auth';

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/admin/card-requests/[id]'>,
) {
  try {
    const admin = await requireAdminUser();
    const body = await readJsonObject(request);
    const { id } = await context.params;
    const status = body?.status;

    if (!isCardRequestStatus(status)) {
      return jsonError(400, 'bad_request', 'status must be pending, approved, rejected, created_pending_review, or fulfilled.');
    }

    const updated = await updateCardRequestReview({
      requestId: id,
      reviewerEmail: admin.email,
      status,
      resolutionNotes:
        body && Object.prototype.hasOwnProperty.call(body, 'resolutionNotes')
          ? typeof body.resolutionNotes === 'string'
            ? body.resolutionNotes
            : body.resolutionNotes === null
              ? null
              : ''
          : undefined,
      resolvedCardId:
        body && Object.prototype.hasOwnProperty.call(body, 'resolvedCardId')
          ? typeof body.resolvedCardId === 'string'
            ? body.resolvedCardId
            : body.resolvedCardId === null
              ? null
              : ''
          : undefined,
    });

    return Response.json({ cardRequest: updated });
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof AppAuthorizationError) {
      return jsonError(403, 'forbidden', error.message);
    }

    if (error instanceof Error && error.message === 'not_found') {
      return jsonError(404, 'not_found', 'Card request not found.');
    }

    if (error instanceof Error && error.message === 'invalid_resolved_card') {
      return jsonError(400, 'bad_request', 'resolvedCardId does not match an existing card.');
    }

    if (error instanceof Error && error.message === 'inactive_resolved_card') {
      return jsonError(400, 'bad_request', 'resolvedCardId must refer to an active catalog card.');
    }

    if (error instanceof Error && error.message === 'resolved_card_required') {
      return jsonError(400, 'bad_request', 'fulfilled requests must include a resolvedCardId.');
    }

    if (error instanceof Error && error.message === 'resolved_card_not_visible') {
      return jsonError(400, 'bad_request', 'Only verified cards visible in the wallet catalog can be marked fulfilled.');
    }

    return jsonError(500, 'internal_error', 'Unable to update card request.');
  }
}
