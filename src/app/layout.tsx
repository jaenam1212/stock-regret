import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "아! 살껄 계산기",
  description: "후회 없는 투자를 위한 주식 수익률 계산기. 미국주식, 한국주식, 암호화폐의 과거 투자 수익률을 계산하고 비교해보세요.",
  keywords: ["주식", "투자", "수익률", "계산기", "아살껄", "후회", "미국주식", "한국주식", "암호화폐"],
  authors: [{ name: "Stock Regret Calculator" }],
  openGraph: {
    title: "아! 살껄 계산기",
    description: "후회 없는 투자를 위한 주식 수익률 계산기",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "아! 살껄 계산기 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "아! 살껄 계산기",
    description: "후회 없는 투자를 위한 주식 수익률 계산기",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
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
      </body>
    </html>
  );
}
