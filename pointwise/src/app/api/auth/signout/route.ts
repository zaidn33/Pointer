import { jsonError } from '@/lib/api';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    return jsonError(400, 'bad_request', error.message);
  }

  return Response.json({ ok: true });
}
