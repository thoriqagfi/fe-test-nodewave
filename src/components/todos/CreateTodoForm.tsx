'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { todoApi } from '@/lib/api';
import { todoSchema, type TodoInput } from '@/lib/schemas';
import { Plus, X } from 'lucide-react';

export default function CreateTodoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
  });

  const createTodoMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created successfully!');
      reset();
      setIsOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create todo');
    },
  });

  const onSubmit = (data: TodoInput) => {
    createTodoMutation.mutate(data);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full mb-6 bg-[#0062FF] hover:bg-blue-800">
        <Plus className="h-4 w-4 mr-2" />
        Add New Todo
      </Button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create New Todo</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false);
            reset();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            placeholder="Todo title"
            {...register('item')}
            className={errors.item ? 'border-red-500' : ''}
          />
          {errors.item && (
            <p className="mt-1 text-sm text-red-600">{errors.item.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createTodoMutation.isPending}
            className="flex-1 bg-[#0062FF] hover:bg-blue-800"
          >
            {createTodoMutation.isPending ? 'Creating...' : 'Create Todo'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}