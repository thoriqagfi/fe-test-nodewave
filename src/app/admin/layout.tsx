'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { AdminRoute } from '@/components/guards/AuthGuard';
import {
  ArrowLeft,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Home,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    icon: Home,
    label: 'Dashboard',
    href: '/admin',
    description: 'Overview and statistics'
  },
  {
    icon: CheckSquare,
    label: 'Todo Management',
    href: '/admin/todos',
    description: 'Manage all user todos'
  },
  {
    icon: Users,
    label: 'User Management',
    href: '/admin/users',
    description: 'Manage user accounts'
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/admin/analytics',
    description: 'View system analytics'
  },
  {
    icon: FileText,
    label: 'Reports',
    href: '/admin/reports',
    description: 'Generate and view reports'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings',
    description: 'System configuration'
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <AdminRoute>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:flex lg:flex-shrink-0
        `}>
          <div className="flex flex-col h-full w-64">
            {/* Sidebar Header - Fixed */}
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Admin Panel</h2>
                  <p className="text-xs text-gray-500">Management Console</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActive
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer - Fixed */}
            <div className="p-4 border-t bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-red-500 hover:text-red-600 bg-red-50"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Header - Fixed */}
          <header className="bg-white shadow-sm border-b flex-shrink-0">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {sidebarItems.find(item => item.href === pathname)?.label || 'Admin Panel'}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {sidebarItems.find(item => item.href === pathname)?.description || 'Management console'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}