import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { AuthSession } from '@/features/auth/AuthSession';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Persona Chat',
  description: '원작 자료 기반 AI 캐릭터 챗봇',
  applicationName: 'Persona Chat',
  appleWebApp: {
    capable: true,
    title: 'Persona',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#131b2e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} overflow-hidden antialiased`}>
        <div className="mx-auto h-dvh w-full min-w-0 overflow-hidden bg-frame text-on-surface min-[768px]:w-[420px]">
          <AuthSession />
          {children}
        </div>
      </body>
    </html>
  );
}
