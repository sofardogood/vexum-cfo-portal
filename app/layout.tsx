import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '日置佑輔 CFOインテリジェンス・ポータル | VEXUM 経営思考・全会議分析 &「第二の日置さん」育成ガイド',
  description: '株式会社VEXUMの日置佑輔CFOの経営哲学・思考OS・全15回経営会議分析と「第二の日置さん」を目指す学習ポータル',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-darkBg text-slate-100 min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
