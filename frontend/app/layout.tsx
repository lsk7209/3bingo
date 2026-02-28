import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomTabBar from "./components/TOSS_UI/BottomTabBar";
import TopAppBar from "./components/TOSS_UI/TopAppBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "토스 미니앱 퍼즐",
  description: "토스 앱인토스 전용 퍼즐 미니앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 앱인토스 SDK — 토스 미니앱 실행 환경 필수 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://assets.toss.im/app-in-toss/sdk.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        {/* Fixed TopAppBar */}
        <TopAppBar showBack={false} />

        {/*
          main 영역:
          - pt-[56px]: TopAppBar(fixed 56px) 아래 콘텐츠 시작
          - pb-[calc(49px+env(safe-area-inset-bottom))]: BottomTabBar(49px) + safe-area 확보
          - min-h-screen: 전체 화면 채움
        */}
        <main
          className="min-h-screen overflow-y-auto"
          style={{
            paddingTop: '56px',
            paddingBottom: 'calc(49px + env(safe-area-inset-bottom))',
          }}
        >
          {children}
        </main>

        {/* Fixed BottomTabBar */}
        <BottomTabBar />
      </body>
    </html>
  );
}
