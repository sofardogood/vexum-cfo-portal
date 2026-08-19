'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';

export default function KpiPage() {
  // Simulator State
  const [targetDeals, setTargetDeals] = useState(100);
  const [rateDeal, setRateDeal] = useState(63);
  const [rateDesign, setRateDesign] = useState(80);
  const [leaderCap, setLeaderCap] = useState(8);

  // Simulator Calculations
  const requiredDesign = Math.round(targetDeals / (rateDeal / 100));
  const requiredAppos = Math.round(requiredDesign / (rateDesign / 100));
  const dailyAppos = (requiredAppos / 20).toFixed(1);
  const pipeline3x = Math.round(targetDeals * 3);
  const requiredLeaders = Math.ceil(targetDeals / leaderCap);
  const monthlySalesMan = (targetDeals * 25).toLocaleString();
  const internBudgetMan = (targetDeals * 25 * 0.5).toLocaleString();

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">
        
        {/* Page Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            2. 必見KPI ＆ 営業・供給 逆算シミュレーター
          </h2>
          <p className="text-xs text-slate-500">
            日置流の逆算ロジック（成約目標から必要アポ数・リーダー数を自動算出）と重要経営指標
          </p>
        </div>

        {/* Dynamic Simulator */}
        <div className="border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Interactive Reverse Engineering Tool
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                日置流『営業・供給 逆算シミュレーター』
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジックに基づいて必要なアクション量を即座に逆算します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  目標 上駐開始数 (成約件数 / 月)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={targetDeals} 
                    onChange={e => setTargetDeals(Number(e.target.value))} 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold text-xl focus:border-slate-900 focus:outline-none" 
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">社</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>初期設計 → 上駐 転換率</span>
                  <span className="font-mono font-bold">{rateDeal}%</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="90" 
                  value={rateDeal} 
                  onChange={e => setRateDeal(Number(e.target.value))} 
                  className="w-full accent-slate-900" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>アポ → 初期設計 転換率</span>
                  <span className="font-mono font-bold">{rateDesign}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="95" 
                  value={rateDesign} 
                  onChange={e => setRateDesign(Number(e.target.value))} 
                  className="w-full accent-slate-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  リーダー1人あたり案件キャパ
                </label>
                <input 
                  type="number" 
                  value={leaderCap} 
                  onChange={e => setLeaderCap(Number(e.target.value))} 
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-sm font-bold focus:outline-none" 
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-white">
                <div className="text-xs text-slate-500 font-medium">① 必要初期設計数 (先行指標)</div>
                <div className="text-3xl font-bold text-slate-900 font-mono my-2">{requiredDesign}</div>
                <div className="text-[10px] text-slate-400">リードタイム: 約22日前</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-white">
                <div className="text-xs text-slate-500 font-medium">② 必要アポイント数</div>
                <div className="text-3xl font-bold text-slate-900 font-mono my-2">{requiredAppos}</div>
                <div className="text-[10px] text-slate-400 font-mono">日次: 約{dailyAppos}件</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-slate-50">
                <div className="text-xs text-slate-700 font-bold">③ 必要見込み (3倍ルール)</div>
                <div className="text-3xl font-bold text-blue-600 font-mono my-2">{pipeline3x}</div>
                <div className="text-[10px] text-blue-600 font-medium">下振れ防止バッファ</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-white">
                <div className="text-xs text-slate-500 font-medium">④ 必要リーダー数</div>
                <div className="text-3xl font-bold text-slate-900 font-mono my-2">{requiredLeaders}</div>
                <div className="text-[10px] text-slate-400">名 (案件管理体制)</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-white">
                <div className="text-xs text-slate-500 font-medium">⑤ 想定月次売上 (単価25万)</div>
                <div className="text-3xl font-bold text-slate-900 font-mono my-2">{monthlySalesMan}万</div>
                <div className="text-[10px] text-slate-400">円 / 月</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-white">
                <div className="text-xs text-slate-500 font-medium">⑥ インターン給与上限 (50%)</div>
                <div className="text-3xl font-bold text-slate-900 font-mono my-2">{internBudgetMan}万</div>
                <div className="text-[10px] text-slate-400">円 (財務規律上限)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quadrants Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-5 rounded-xl space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-900">A. 営業パイプライン指標</span>
              <span className="text-[10px] text-slate-400 font-mono">Sales Funnel</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">初回接触・リード数</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">月200件</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">初期設計数【先行指標】</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">転換率 約80%</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">上駐開始数【必達マスト】</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">月64〜100件</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">見込みパイプライン</div>
                <div className="font-bold font-mono text-blue-600 text-sm mt-0.5">目標の3倍 (150%以上)</div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 p-5 rounded-xl space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-900">B. 収益・ユニットエコノミクス</span>
              <span className="text-[10px] text-slate-400 font-mono">Unit Economics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">解約率 (チャーン)</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">約70% (改善中)</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">全社原価率</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">約66% (圧縮目標)</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">インターン給与規律</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">売上の50%以内</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <div className="text-slate-500 font-medium">CRM・財務乖離</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">乖離ゼロ (完全一致)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Nav Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <Link 
            href="/" 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>前へ: 1. 人物像 & CFO思考OS</span>
          </Link>
          <Link 
            href="/chronicle" 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>次へ: 3. 全会議クロニクル</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
