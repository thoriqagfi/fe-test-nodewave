'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/auth/login');
      return;
    }

    if (requireAdmin && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }

    // If user is authenticated but trying to access auth pages
    if (!requireAuth && isAuthenticated) {
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, requireAuth, requireAdmin, redirectTo]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && (!isAuthenticated || user?.role !== 'ADMIN')) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      {children}
    </AuthGuard>
  );
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
}