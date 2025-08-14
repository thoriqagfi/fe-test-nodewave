import RegisterForm from '@/components/auth/RegisterForm';
import { GuestRoute } from '@/components/guards/AuthGuard';

export default function RegisterPage() {
  return (
  <GuestRoute>
    <RegisterForm />
  </GuestRoute>
  );
}