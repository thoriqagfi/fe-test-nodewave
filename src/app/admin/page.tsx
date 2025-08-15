'use client';

import AdminTodoList from '@/components/admin/AdminTodoList';

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Get an overview of system activity and quick access to key metrics.
        </p>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Todo Management</h3>
        <AdminTodoList />
      </div>
    </div>
  );
}