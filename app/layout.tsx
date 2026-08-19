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
    <html lang="ja" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-150 selection:bg-slate-900 selection:text-white dark:selection:bg-slate-100 dark:selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
