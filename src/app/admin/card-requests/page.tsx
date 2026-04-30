import { notFound, redirect } from 'next/navigation';
import PageShell from '@/components/PageShell';
import AdminCardRequestsClient from './AdminCardRequestsClient';
import {
  AppAuthError,
  AppAuthorizationError,
  requireAdminUser,
} from '@/lib/auth';

export default async function AdminCardRequestsPage() {
  try {
    const admin = await requireAdminUser();

    return (
      <PageShell
        eyebrow={`Admin review · ${admin.email}`}
        title="Card request"
        italic="queue."
        description="Review missing-card submissions, spot duplicates, and track what has been approved, rejected, or already added."
      >
        <AdminCardRequestsClient />
      </PageShell>
    );
  } catch (error) {
    if (error instanceof AppAuthError) {
      redirect('/signin');
    }

    if (error instanceof AppAuthorizationError) {
      notFound();
    }

    throw error;
  }
}
