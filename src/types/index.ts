export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: 'USER' | 'ADMIN';
}

export interface Todo {
  id: string;
  item: string;
  description?: string;
  isDone: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TodoFilters {
  isDone?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  orderKey?: 'createdAt';
  orderRule: 'desc' | 'asc';
}

export interface TodosResponse {
  entries: Todo[];
  totalData: number;
  totalPage: number;
}