import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '아살껄 계산기 - 주식 투자 수익률 계산기',
  description:
    '그때 샀다면 얼마였을까? 아살껄 계산기로 주식 투자 수익률을 확인하세요. 후회 없는 투자를 위한 주식 수익률 계산기. 미국주식, 한국주식, 암호화폐의 과거 투자 수익률을 계산하고 비교해보세요.',
  keywords: [
    '아살껄',
    '아 살껄',
    '아살껄계산기',
    '그때샀다면',
    '그때삿다면',
    '사라했제',
    '팔라했제',
    '수익률',
    '사라햇제',
    '팔라햇제',
    '주식계산기',
    '투자후회',
    '수익률시뮬레이션',
    '껄',
    '껄무새',
  ],
  authors: [{ name: 'Stock Regret Calculator' }],
  openGraph: {
    title: '아살껄 계산기 - 주식 투자 수익률 계산기',
    description:
      '그때 샀다면 얼마였을까? 아살껄 계산기로 주식 투자 수익률을 확인하세요. 후회 없는 투자를 위한 주식 수익률 계산기',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '아! 살껄 계산기 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '아살껄 계산기 - 주식 투자 수익률 계산기',
    description:
      '그때 샀다면 얼마였을까? 아살껄 계산기로 주식 투자 수익률을 확인하세요. 후회 없는 투자를 위한 주식 수익률 계산기',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
