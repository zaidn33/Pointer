import { AppAuthError, requireUser } from '@/lib/auth';
import { jsonError, readJsonObject } from '@/lib/api';
import {
  getRecommendationForQuery,
  RecommendationError,
} from '@/lib/recommendations';

function recommendationErrorResponse(error: RecommendationError) {
  if (error.code === 'empty_wallet') {
    return jsonError(404, 'not_found', error.message);
  }

  return jsonError(400, 'bad_request', error.message);
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  const query = body?.query;

  if (typeof query !== 'string' || !query.trim()) {
    return jsonError(400, 'bad_request', 'query is required.');
  }

  try {
    const user = await requireUser();
    const recommendation = await getRecommendationForQuery(
      user.id,
      query.trim(),
    );

    return Response.json(recommendation);
  } catch (error) {
    if (error instanceof AppAuthError) {
      return jsonError(401, 'unauthorized', error.message);
    }

    if (error instanceof RecommendationError) {
      return recommendationErrorResponse(error);
    }

    return jsonError(
      500,
      'internal_error',
      'Unable to create recommendation.',
    );
  }
}
