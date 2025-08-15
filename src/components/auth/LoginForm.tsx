'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema, type LoginInput } from '@/lib/schemas';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
      <div
        className='absolute bg-white h-1/2 w-screen top-0 z-0'
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 80%)',
        }}
      />
      <div className="relative z-10">
        <div className='flex flex-col gap-3.5'>
          <h2 className="text-center text-[56px] font-bold text-[#44444F]">
            Sign In
          </h2>
          <p className="text-base text-center text-[#92929D] leading-[26px] font-normal">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        <form className="mt-10 space-y-5 max-w-[560px] w-full bg-white p-7.5 rounded-[20px] shadow-md shadow-[#CDCDD41A]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 translate-x-3 translate-y-2 bg-white px-2 w-fit"
              >
                Your Email / Username
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : 'active:border-[#50B5FF]'}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 translate-x-3 translate-y-2 bg-white px-2 w-fit"
              >
                Enter Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-[#696974]">
              <input type="checkbox" className="accent-[#50B5FF] bg-white" />
              <span>Remember Me</span>
            </label>
            <Link
              href="/auth/forgot"
              className="text-sm text-[#50B5FF] hover:text-blue-500"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0062FF] hover:bg-blue-800 text-white text-xs font-semibold rounded-md mt-2.5"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <div className='text-center mt-[35px]'>
          <Link className="text-sm text-[#0062FF] hover:text-blue-500" href="/auth/register">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
