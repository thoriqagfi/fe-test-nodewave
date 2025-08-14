'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { todoApi } from '@/lib/api';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import type { TodoFilters, PaginationParams } from '@/types';

export default function AdminTodoList() {
  const [filters, setFilters] = useState<TodoFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    orderRule: 'asc'
  });

  const {
    data: todosData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-todos', filters, pagination],
    queryFn: () => todoApi.getAll(filters, pagination),
    staleTime: 1000 * 60 * 5,
  });

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFiltersChange = (newFilters: Partial<TodoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const currentStatusValue =
  filters.isDone === undefined
    ? 'all'
    : filters.isDone
    ? 'completed'
    : 'pending';

  const handleStatusChange = (value: string) => {
  if (value === 'all') {
    handleFiltersChange({ isDone: undefined });
  } else if (value === 'completed') {
    handleFiltersChange({ isDone: true });
  } else if (value === 'pending') {
    handleFiltersChange({ isDone: false });
  }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load todos. Please try again.</p>
      </div>
    );
  }

  const todos = todosData?.entries || [];
  const totalPages = todosData?.totalPage || 1;
  const currentPage = pagination.page;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">All Todos (Admin)</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            value={String(pagination.limit)}
            onValueChange={(val) =>
              setPagination((prev) => ({
                ...prev,
                limit: Number(val),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={currentStatusValue}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Todos</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No todos found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {todo.user?.fullName || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({todo.user?.email || 'No email'})
                      </span>
                    </div>

                    <h3 className={`font-medium ${todo.isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {todo.item}
                    </h3>

                    {todo.description && (
                      <p className={`text-sm mt-1 ${todo.isDone ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {todo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Created: {formatDate(todo.createdAt)}</span>
                      <span>Updated: {formatRelativeTime(todo.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      todo.isDone
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {todo.isDone ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}