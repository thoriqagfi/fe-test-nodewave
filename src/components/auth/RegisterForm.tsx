'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { registerSchema, type RegisterInput } from '@/lib/schemas';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const {
    register,
    handleSubmit,
    setValue
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] relative">
      <div
        className="absolute bg-white h-1/2 w-screen top-0 z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 80%)',
        }}
      />

      <div className="relative z-10 space-y-10">
        <div className='flex flex-col gap-3.5'>
          <h2 className="text-center text-[56px] font-extrabold text-[#44444F]">
            Register
          </h2>
          <p className="text-base text-center text-[#92929D] leading-[26px]">
            Let&apos;s Sign up first for enter into Square Website. Uh She Up!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-[560px] w-full p-8 bg-white rounded-2xl shadow-md" onChange={() => setValue('fullName', `${firstName} ${lastName}`.trim())}>
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                className="rounded-r-none w-16"
              >
                +62
              </Button>
              <Input
                placeholder="Phone Number"
                className="rounded-l-none"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Your Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="us">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="flex">
            <Input
              type="text"
              placeholder="Mail Address"
              onChange={(e) => setValue('email', `${e.target.value}@squareteam.com`)}
              className="rounded-r-none"
            />
            <div className="bg-gray-100 px-3 flex items-center rounded-r-md text-sm text-gray-500">
              @squareteam.com
            </div>
          </div>
          <input type="hidden" {...register('email')} />

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Tell us about yourself
            </label>
            <Textarea placeholder="Hello my name..." />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button
              type="button"
              variant="secondary"
              className="col-span-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
            <Button
              type="submit"
              className="col-span-3 bg-[#0062FF] hover:bg-blue-800 text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating...' : 'Register'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
