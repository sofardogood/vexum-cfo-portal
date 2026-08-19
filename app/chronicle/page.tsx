'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import initialChronicleData from '../../data/chronicle.json';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Search } from 'lucide-react';

export default function ChroniclePage() {
  const [chronicle, setChronicle] = useState<any[]>(initialChronicleData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  useEffect(() => {
    fetch('/api/meetings')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setChronicle(res.data);
        }
      })
      .catch(err => console.log('Using local initial data', err));
  }, []);

  const filteredChronicle = useMemo(() => {
    return chronicle.filter(m => {
      const matchSearch = !searchQuery || 
        (m.theme && m.theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.summary && m.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.yusuke_decisions && m.yusuke_decisions.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (m.quotes && m.quotes.some((q: string) => q.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchTag = selectedTag === 'ALL' || (m.tags && m.tags.includes(selectedTag));
      return matchSearch && matchTag;
    });
  }, [chronicle, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      <Header totalMeetings={chronicle.length} />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">
        
        {/* Page Title & Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              3. VEXUM経営会議 完全クロニクル
            </h2>
            <p className="text-xs text-slate-500">
              全 {chronicle.length} 件の会議議事録・意思決定ログ（ドキュメント投入時に自動同期）
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="キーワード・発言検索..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none" 
            />
            <select 
              value={selectedTag} 
              onChange={e => setSelectedTag(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
            >
              <option value="ALL">全てのタグ</option>
              <option value="逆算設計">逆算設計</option>
              <option value="資金調達">資金調達</option>
              <option value="ユニットエコノミクス">ユニットエコノミクス</option>
              <option value="3000社目標">3000社目標</option>
            </select>
          </div>
        </div>

        {/* Meeting Cards List */}
        <div className="space-y-3">
          {filteredChronicle.map((m, idx) => (
            <div key={idx} className="border border-slate-200 bg-white rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                    第{idx + 1}回
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {m.display_date || m.date}
                  </span>
                </div>
                <div className="flex gap-1">
                  {(m.tags || []).map((t: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-50 border border-slate-100 text-slate-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{m.theme}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{m.summary}</p>
              
              {m.yusuke_decisions && m.yusuke_decisions.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">日置さんの重要意思決定・指摘：</div>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {m.yusuke_decisions.map((d: string, di: number) => (
                      <li key={di}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {m.quotes && m.quotes.length > 0 && (
                <div className="space-y-1 pt-1">
                  {m.quotes.map((q: string, qi: number) => (
                    <div key={qi} className="bg-slate-50 border-l-2 border-slate-900 p-2.5 rounded-r text-xs text-slate-800 font-medium italic">
                      💬 "{q}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Page Nav Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <Link 
            href="/kpi" 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>前へ: 2. 必見KPI & 逆算シミュレーター</span>
          </Link>
          <Link 
            href="/roadmap" 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>次へ: 4. 思考ドリル</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
