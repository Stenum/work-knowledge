import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Work Assistant',
  description: 'Personal assistant with Zep memory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <Providers>
          <main className="mx-auto max-w-5xl space-y-6 p-6">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Work assistant</h1>
                <p className="text-sm text-slate-600">Memory backed by Zep, powered by Microsoft identity.</p>
              </div>
            </header>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
