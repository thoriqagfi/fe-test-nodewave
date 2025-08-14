import axios from 'axios';
import type {
  Todo,
  AuthResponse,
  TodoFilters,
  PaginationParams,
  TodosResponse
} from '@/types';
import type { LoginInput, RegisterInput, TodoInput } from './schemas';

const api = axios.create({
  baseURL: 'https://fe-test-api.nwappservice.com',
});

// Attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to unwrap API response
type ApiResponse<T> = {
  content: T;
  message: string;
  errors: string[];
};

const unwrap = <T>(response: { data: ApiResponse<T> }): T => {
  if (response.data.errors?.length) {
    throw new Error(response.data.errors.join(', '));
  }
  return response.data.content;
};

// Auth API
export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/login', data);
    return unwrap(res);
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/register', data);
    return unwrap(res);
  },

  verifyToken: async (token: string): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/verify-token', { token });
    return unwrap(res);
  },
};

// Todo API
export const todoApi = {
  getAll: async (
    filters?: TodoFilters,
    pagination?: PaginationParams
  ): Promise<TodosResponse> => {
    const params = new URLSearchParams();

    // Remove empty / undefined fields from filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([, value]) => value !== undefined && value !== ''
      )
    );

    if (Object.keys(cleanedFilters).length > 0) {
      params.append("filters", JSON.stringify(cleanedFilters));
    }

    if(pagination?.orderRule) {
      params.append("orderRule", pagination.orderRule.toString())
    }

    if(pagination?.orderKey) {
      params.append("orderKey", pagination.orderKey.toString())
    }

    if (pagination?.page) {
      params.append("page", pagination.page.toString());
    }
    if (pagination?.limit) {
      params.append("rows", pagination.limit.toString());
    }

    const res = await api.get<ApiResponse<TodosResponse>>(
      `/todos?${params.toString()}`
    );
    return unwrap(res);
  },

  create: async (data: TodoInput): Promise<Todo> => {
    const res = await api.post<ApiResponse<Todo>>("/todos", data);
    return unwrap(res);
  },

  mark: async (id: string, action: "DONE" | "UNDONE"): Promise<Todo> => {
    const res = await api.put<ApiResponse<Todo>>(`/todos/${id}/mark`, { action });
    return unwrap(res);
  },

  delete: async (id: string): Promise<void> => {
    const res = await api.delete<ApiResponse<Record<string, never>>>(`/todos/${id}`);
    unwrap(res);
  },
};


// Admin API
export const adminApi = {
  getAllTodos: async (filters?: TodoFilters, pagination?: PaginationParams): Promise<TodosResponse> => {
    const params = new URLSearchParams();

    if (typeof filters?.isDone === 'boolean') {
      params.append('isDone', String(filters.isDone));
    }
    if (pagination?.page) {
      params.append('page', pagination.page.toString());
    }
    if (pagination?.limit) {
      params.append('rows', pagination.limit.toString());
    }

    const res = await api.get<ApiResponse<TodosResponse>>(`/todos?${params.toString()}`);
    return unwrap(res);
  },
};

export default api;