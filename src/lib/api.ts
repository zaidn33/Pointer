export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'not_found'
  | 'conflict'
  | 'internal_error';

export const REQUIRED_FLIGHT_SEARCH_PARAMS_MESSAGE =
  'Missing required parameters: origin, destination';

export function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
) {
  return Response.json({ error: { code, message } }, { status });
}

export async function readJsonObject(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}
