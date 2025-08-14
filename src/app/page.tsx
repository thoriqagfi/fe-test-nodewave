'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to TodoApp
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay organized and boost your productivity with our simple yet powerful todo management application.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 text-lg bg-[#0062FF] hover:bg-blue-800"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/register')}
              className="px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Easy Organization</h3>
              <p className="text-gray-600">
                Create, manage, and organize your todos with our intuitive interface.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Smart Filtering</h3>
              <p className="text-gray-600">
                Filter and search through your todos to find exactly what you need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Mark todos as complete and track your productivity over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}