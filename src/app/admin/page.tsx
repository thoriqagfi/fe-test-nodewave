'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import AdminTodoList from '@/components/admin/AdminTodoList';
import { ArrowLeft, LogOut, User, Shield } from 'lucide-react';
import { AdminRoute } from '@/components/guards/AuthGuard';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>

                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.fullName}</span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Todo Management
              </h2>
              <p className="text-gray-600">
                View and manage all todos across all users.
              </p>
            </div>

            <AdminTodoList />
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}