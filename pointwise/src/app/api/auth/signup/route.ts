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
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    return jsonError(400, 'bad_request', error.message);
  }

  if (!data.user?.id || !data.user.email) {
    return Response.json(
      {
        user: null,
        session: false,
        message: 'Check your email to finish signing up.',
      },
      { status: 201 },
    );
  }

  const user = await upsertLocalUser({
    id: data.user.id,
    email: data.user.email,
  });

  return Response.json(
    {
      user: serializeUser(user),
      session: Boolean(data.session),
    },
    { status: 201 },
  );
}
