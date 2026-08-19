'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, UploadCloud } from 'lucide-react';

interface HeaderProps {
  totalMeetings?: number;
}

export default function Header({ totalMeetings = 15 }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '1. 人物像 & CFO思考OS' },
    { href: '/kpi', label: '2. 必見KPI & 逆算シミュレーター' },
    { href: '/chronicle', label: `3. 全会議クロニクル (${totalMeetings})` },
    { href: '/roadmap', label: '4. 思考ドリル' },
    { href: '/upload', label: '5. ドキュメント投入 / 同期' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base hover:bg-slate-800 transition">
            H
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-base font-bold tracking-tight text-slate-900 hover:text-blue-600 transition">
                VEXUM CFO Intelligence Portal
              </Link>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 border border-slate-200">
                全{totalMeetings}会議
              </span>
            </div>
            <p className="text-xs text-slate-500">
              日置佑輔 CFO思考OS ＆ 全会議分析ポータル
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            href="/upload" 
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition text-xs font-semibold flex items-center space-x-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>ドキュメント投入</span>
          </Link>
        </div>
      </div>

      {/* Multi-page Navigation */}
      <div className="max-w-6xl mx-auto mt-3 overflow-x-auto flex space-x-1 border-t border-slate-100 pt-2 text-xs font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
