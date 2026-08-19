import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VEXUM CFO Intelligence Portal | 日置佑輔 CFO思考OS ＆ 全会議分析',
  description: '株式会社VEXUMの日置佑輔CFOの経営哲学・思考OS・全経営会議分析と「第二の日置さん」を目指す学習ポータル',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white text-[#0f1419]">
        {children}
      </body>
    </html>
  );
}
