'use client';

import { useQuery } from '@tanstack/react-query';
import { todoApi } from '@/lib/api';
import { useTodoStore } from '@/store/useTodoStore';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import CreateTodoForm from './CreateTodoForm';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TodoList() {
  const { filters, pagination, setPagination } = useTodoStore();

  const {
    data: todosData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todos', filters, pagination],
    queryFn: () => todoApi.getAll(filters, pagination),
    staleTime: 1000 * 60 * 5,
  });

  const handlePageChange = (newPage: number) => {
    setPagination({ page: newPage });
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
  const currentPage = pagination.page || 1;

  return (
    <div className="space-y-6">
      <CreateTodoForm />
      <TodoFilters />

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No todos found. Create your first todo!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
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
        </>
      )}
    </div>
  );
}
