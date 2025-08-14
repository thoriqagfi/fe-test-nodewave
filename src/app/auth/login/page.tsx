import LoginForm from '@/components/auth/LoginForm';
import { GuestRoute } from '@/components/guards/AuthGuard';

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}