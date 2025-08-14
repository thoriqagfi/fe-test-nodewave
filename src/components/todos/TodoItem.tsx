'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { todoApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';
import { Check, Trash2, RotateCcw } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => todoApi.mark(todo.id, "DONE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(
        todo.isDone ? 'Todo marked as pending' : 'Todo marked as completed'
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => todoApi.delete(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
    },
  });

  return (
    <div
      className={cn(
        'bg-white p-4 rounded-lg shadow-sm border transition-all duration-200',
        todo.isDone && 'opacity-75 bg-gray-50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={cn(
              'font-medium text-gray-900',
              todo.isDone && 'line-through text-gray-500'
            )}
          >
            {todo.item}
          </h3>
          {todo.description && (
            <p
              className={cn(
                'text-sm text-gray-600 mt-1',
                todo.isDone && 'line-through text-gray-400'
              )}
            >
              {todo.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Created {formatRelativeTime(todo.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant={todo.isDone ? 'outline' : 'default'}
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
          >
            {todo.isDone ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}