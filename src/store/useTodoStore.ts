import { create } from 'zustand';
import type { TodoFilters, PaginationParams } from '@/types';

interface TodoState {
  filters: TodoFilters;
  pagination: PaginationParams;
  setFilters: (filters: Partial<TodoFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  resetFilters: () => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  filters: {
    isDone: undefined,
  },
  pagination: {
    orderRule: 'asc',
    orderKey: 'createdAt',
    page: 1,
    limit: 5,
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),
  resetFilters: () =>
    set({
      filters: { isDone: undefined },
      pagination: { page: 1, limit: 10, orderRule: 'asc', orderKey: 'createdAt' },
    }),
}));