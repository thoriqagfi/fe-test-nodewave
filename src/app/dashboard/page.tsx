'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import TodoList from '@/components/todos/TodoList';
import { LogOut, User, Crown } from 'lucide-react';
import { ProtectedRoute } from '@/components/guards/AuthGuard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">TodoApp</h1>
                {user?.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Crown className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.fullName}</span>
                </div>

                {user?.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin')}
                  >
                    Admin Panel
                  </Button>
                )}

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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName}!
              </h2>
              <p className="text-gray-600">
                Manage your todos and stay productive.
              </p>
            </div>

            <TodoList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}