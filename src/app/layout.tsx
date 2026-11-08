import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const hand = Caveat({ subsets: ['latin'], variable: '--font-hand', weight: ['500', '700'] });

export const metadata: Metadata = {
  title: 'Teacher Vittor | Aprenda Português Brasileiro Real',
  description: 'Aulas particulares de português do Brasil para estrangeiros. Metodologia prática, conversação ativa e horários adaptados ao seu fuso horário.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${jakarta.variable} ${hand.variable}`}>
      <body className="antialiased selection:bg-blue-200 selection:text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
