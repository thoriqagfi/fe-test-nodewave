import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Todo List App'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}