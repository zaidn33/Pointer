import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export class AppAuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AppAuthError';
  }
}

export class AppAuthorizationError extends Error {
  constructor(message = 'Admin access required') {
    super(message);
    this.name = 'AppAuthorizationError';
  }
}

export type SafeUser = Pick<User, 'id' | 'email'>;

export function serializeUser(user: SafeUser): SafeUser {
  return {
    id: user.id,
    email: user.email,
  };
}

export async function upsertLocalUser(user: SafeUser) {
  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
    },
    update: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub || !claims.email) {
    throw new AppAuthError();
  }

  const user = await upsertLocalUser({
    id: claims.sub,
    email: claims.email,
  });

  return serializeUser(user);
}

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdminUser() {
  const user = await requireUser();
  const adminEmails = getAdminEmails();

  if (!adminEmails.has(user.email.toLowerCase())) {
    throw new AppAuthorizationError();
  }

  return user;
}
