export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export function parseEmailPasswordCredentials(
  body: Record<string, unknown> | null,
): EmailPasswordCredentials | null {
  const email = body?.email;
  const password = body?.password;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return null;
  }

  return {
    email: trimmedEmail,
    password,
  };
}
