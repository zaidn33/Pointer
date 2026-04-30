import { jsonError, readJsonObject } from '@/lib/api';
import {
  createCatalogCardFromRequestAndFulfill,
  fulfillCardRequestByLink,
} from '@/lib/card-requests';
import {
  AppAuthError,
  AppAuthorizationError,
  requireAdminUser,
} from '@/lib/auth';

function readOptionalString(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null) {
    return null;
  }

  return undefined;
}

export async function POST(
  request: Request,
  context: RouteContext<'/api/admin/card-requests/[id]/fulfill'>,
) {
  try {
    const admin = await requireAdminUser();
    const body = await readJsonObject(request);
    const { id } = await context.params;
    const action = body?.action;

    if (action === 'link') {
      const resolvedCardId = readOptionalString(body?.resolvedCardId);
      if (typeof resolvedCardId !== 'string' || !resolvedCardId.trim()) {
        return jsonError(400, 'bad_request', 'resolvedCardId is required for link actions.');
      }

      const cardRequest = await fulfillCardRequestByLink({
        requestId: id,
        reviewerEmail: admin.email,
        resolvedCardId,
        resolutionNotes: readOptionalString(body?.resolutionNotes),
      });

      return Response.json({ cardRequest });
    }

    if (action === 'create') {
      const annualFee =
        typeof body?.annualFee === 'number'
          ? body.annualFee
          : typeof body?.annualFee === 'string' && body.annualFee.trim()
            ? Number(body.annualFee)
            : null;
      const baseEarnRate =
        typeof body?.baseEarnRate === 'number'
          ? body.baseEarnRate
          : typeof body?.baseEarnRate === 'string' && body.baseEarnRate.trim()
            ? Number(body.baseEarnRate)
            : null;

      const cardRequest = await createCatalogCardFromRequestAndFulfill({
        requestId: id,
        reviewerEmail: admin.email,
        resolutionNotes: readOptionalString(body?.resolutionNotes),
        card: {
          name: typeof body?.name === 'string' ? body.name : '',
          issuer: typeof body?.issuer === 'string' ? body.issuer : '',
          network: typeof body?.network === 'string' ? body.network : '',
          cardType: typeof body?.cardType === 'string' ? body.cardType : 'Personal',
          annualFee,
          rewardProgram: readOptionalString(body?.rewardProgram),
          baseEarnRate,
        },
      });

      return Response.json({ cardRequest }, { status: 201 });
    }

    return jsonError(400, 'bad_request', 'action must be create or link.');
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
      return jsonError(400, 'bad_request', 'resolvedCardId does not match an existing catalog card.');
    }

    if (error instanceof Error && error.message === 'inactive_resolved_card') {
      return jsonError(400, 'bad_request', 'Only active catalog cards can fulfill requests.');
    }

    if (error instanceof Error && error.message === 'resolved_card_required') {
      return jsonError(400, 'bad_request', 'resolvedCardId is required to fulfill by linking.');
    }

    if (error instanceof Error && error.message === 'matching_card_exists') {
      return jsonError(409, 'conflict', 'A normalized name + issuer match already exists. Link that card instead.');
    }

    if (error instanceof Error && error.message === 'invalid_card_payload') {
      return jsonError(400, 'bad_request', 'Create-card payload is invalid. Provide at least name, issuer, and network, and only include reward fields when they are trusted.');
    }

    return jsonError(500, 'internal_error', 'Unable to fulfill card request.');
  }
}
