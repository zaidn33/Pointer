import { jsonError, readJsonObject } from '@/lib/api';
import { parseEmailPasswordCredentials } from '@/lib/credentials';
import { serializeUser, upsertLocalUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const credentials = parseEmailPasswordCredentials(
    await readJsonObject(request),
  );

  if (!credentials) {
    return jsonError(400, 'bad_request', 'Email and password are required.');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return jsonError(401, 'unauthorized', error.message);
  }

  if (!data.user?.id || !data.user.email) {
    return jsonError(401, 'unauthorized', 'Unable to sign in.');
  }

  const user = await upsertLocalUser({
    id: data.user.id,
    email: data.user.email,
  });

  return Response.json({ user: serializeUser(user) });
}
