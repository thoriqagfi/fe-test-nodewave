'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTodoStore } from '@/store/useTodoStore';
import { X } from 'lucide-react';

export default function TodoFilters() {
  const { filters, pagination, setFilters, setPagination, resetFilters } =
    useTodoStore();

  // Status change
  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ isDone: undefined });
    } else if (value === 'completed') {
      setFilters({ isDone: true });
    } else if (value === 'pending') {
      setFilters({ isDone: false });
    }
  };

  const currentStatusValue =
    filters.isDone === undefined
      ? 'all'
      : filters.isDone
      ? 'completed'
      : 'pending';

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      {/* Status Filter */}
      <Select value={currentStatusValue} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Todos</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* Limit */}
      <Select
        value={String(pagination.limit)}
        onValueChange={(val) => setPagination({ limit: Number(val) })}
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

      {/* Order Rule */}
      <Select
        value={pagination.orderRule}
        onValueChange={(val) =>
          setPagination({ orderRule: val as 'asc' | 'desc' })
        }
      >
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Oldest</SelectItem>
          <SelectItem value="desc">Newest</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full sm:w-auto"
      >
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}
