"use client";

export type ApiErrorPayload = {
  error?: { code?: string; message?: string };
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T & ApiErrorPayload) : ({} as T);

  if (!res.ok) {
    const message =
      (data as ApiErrorPayload)?.error?.message ??
      `Request failed with ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
