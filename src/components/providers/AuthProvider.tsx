'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth, logout } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Just verify if token is valid
        await authApi.verifyToken(token);

        // If verification succeeds, check if we already have user data in store
        const currentState = useAuthStore.getState();
        if (currentState.user && currentState.token === token) {
          // We have user data and token matches, maintain auth state
          setAuth(currentState.user, token);
        } else {
          // Token is valid but no user data, clear auth and let user login again
          logout();
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Token verification failed, clear auth state
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [setAuth, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}