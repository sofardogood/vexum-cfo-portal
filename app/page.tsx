'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import initialChronicleData from '../data/chronicle.json';
import Link from 'next/link';
import { ArrowRight, Cpu, Target, Layers, Clock, Coins } from 'lucide-react';

export default function ProfilePage() {
  const [chronicle, setChronicle] = useState<any[]>(initialChronicleData);

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

  const latestMeeting = chronicle[0] || {};
  const totalMeetings = chronicle.length;
  const latestDate = latestMeeting.display_date || latestMeeting.date || '2026年8月最新';

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      <Header totalMeetings={totalMeetings} />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">
        
        {/* Top Summary Banner */}
        <div className="border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-block text-xs font-semibold text-slate-500 tracking-wide uppercase">
                株式会社VEXUM 代表取締役 兼 経営統括・CFO
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                日置 佑輔 <span className="text-lg font-normal text-slate-400">（Yusuke）</span>
              </h2>
              <p className="text-base font-bold text-slate-900 leading-relaxed">
                「数字を共通言語にして、<span className="text-blue-600">逆算</span>と<span className="text-blue-600">スピード</span>で“成長の再現性”を証明し続ける」
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、シリーズA調達（5〜10億円）と「1年後に有料顧客3,000社」という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
              </p>
            </div>

            {/* 4 Summary Numbers */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 text-center font-mono">
              <div className="border border-slate-200 p-3.5 rounded-lg bg-white">
                <div className="text-[11px] text-slate-500 font-sans font-medium">全社ゴール (1年後)</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">有料 3,000社</div>
                <div className="text-[10px] text-blue-600 font-sans font-medium mt-0.5">ボーナス 1億円</div>
              </div>

              <div className="border border-slate-200 p-3.5 rounded-lg bg-white">
                <div className="text-[11px] text-slate-500 font-sans font-medium">資金調達目標</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">5億〜10億円</div>
                <div className="text-[10px] text-slate-500 font-sans font-medium mt-0.5">シリーズA</div>
              </div>

              <div className="border border-slate-200 p-3.5 rounded-lg bg-white">
                <div className="text-[11px] text-slate-500 font-sans font-medium">蓄積会議数</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{totalMeetings} 回分</div>
                <div className="text-[10px] text-slate-500 font-sans font-medium mt-0.5">全件解析済み</div>
              </div>

              <div className="border border-slate-200 p-3.5 rounded-lg bg-white">
                <div className="text-[11px] text-slate-500 font-sans font-medium">意思決定ルール</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">10分会議</div>
                <div className="text-[10px] text-slate-500 font-sans font-medium mt-0.5">LINE即時承認</div>
              </div>
            </div>
          </div>

          {/* Latest Decision Banner */}
          <div className="border-t border-slate-100 pt-4 flex items-start space-x-2 text-xs">
            <span className="font-bold text-slate-900 shrink-0">最新の重要方針（{latestDate}）：</span>
            <span className="text-slate-700 leading-relaxed">
              {latestMeeting.yusuke_decisions?.[0] || latestMeeting.summary || '経営数値の進捗確認と重要意思決定を推進中。'}
            </span>
          </div>
        </div>

        {/* 7 Core Principles - Clean Unified Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-lg font-bold text-slate-900">
              日置流『思考OS（Thinking OS）』7大原則
            </h3>
            <Link href="/kpi" className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center space-x-1">
              <span>2. 逆算シミュレーターへ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Principle 01 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 01</span>
                  <span className="text-[11px] text-slate-400">戦略・目標設定</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">すべては「逆算」で組む</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ゴールから逆算してリードタイム・転換率・行動量へ分解。<strong>「上駐100件 ÷ 6掛け ＝ アポ160件 ＝ 初回接触200件」</strong>を即座に組み立てる。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「リーダー12人必要なら今候補は何人いるか逆算して」
              </div>
            </div>

            {/* Principle 02 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 02</span>
                  <span className="text-[11px] text-slate-400">数値化・言語化</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">定性論を数字に翻訳させる</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  「頑張ります」などの定性論を禁止。<strong>「成約数 ＝ 相談数 × 成功率」</strong>の基本数式に落とし、ボトルネックが分母か転換率かを即特定させる。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「それを数字で言うと？」「相談数×成功率でどこが課題？」
              </div>
            </div>

            {/* Principle 03 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 03</span>
                  <span className="text-[11px] text-slate-400">投資家目線・仕組み化</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">成長の再現性・スケールの証明</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  投資家が見ているのは<strong>「成長できることの証明」</strong>のみ。一発屋を排し、スキルTier1〜7ピラミッドや教育フロー1枚スライドなど仕組み化に執着。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「投資家が見てるのは成長の証明。成長できてることが全て」
              </div>
            </div>

            {/* Principle 04 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 04</span>
                  <span className="text-[11px] text-slate-400">実行速度・組織</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">スピード＝唯一の競争優位</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  予算承認に1週間かけるな。<strong>LINEで喋りながら即承認</strong>。会議は10分以内ルール、秒単位で意思決定サイクルを回す。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「喋りながらLINEで連絡して今すぐ承認しろ」
              </div>
            </div>

            {/* Principle 05 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 05</span>
                  <span className="text-[11px] text-slate-400">予実管理・リスク予防</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">予実管理と「見込み3倍」ルール</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れる」</strong>。下振れを最重要リスクとして日次で監視。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「見込み放置は資金調達と成長に直結して悪影響」
              </div>
            </div>

            {/* Principle 06 */}
            <div className="border border-slate-200 bg-white p-5 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400 font-mono">原則 06</span>
                  <span className="text-[11px] text-slate-400">利益率・財務規律</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">利益構造・ユニットエコノミクス</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  売上だけでなく限界利益率・原価率・案件粗利を見る。<strong>インターン給与上限50%や全社原価率66%圧縮</strong>を徹底し粗利を確保。
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                💬「初月売上ではなく原価を引いた後の案件利益率で判断しろ」
              </div>
            </div>

          </div>
        </div>

        {/* Page Nav Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            ページ 1 / 5
          </div>
          <Link 
            href="/kpi" 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>次へ: 2. 必見KPI & 逆算シミュレーター</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
