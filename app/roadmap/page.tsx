'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';

export default function RoadmapPage() {
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});
  const [drillResults, setDrillResults] = useState<Record<number, boolean>>({});

  const baseDrills = [
    {
      id: 1,
      category: "見込み管理",
      question: "事業部から「今月の目標100社に対して、確度の高い見込みがちょうど100社集まりました！必達を目指して頑張ります！」と報告がありました。日置さんならどう返しますか？",
      options: [
        { key: "A", text: "「素晴らしい！メンバーのモチベーションを高めて、1社も落とさないよう気合いでクロージングしてください。」" },
        { key: "B", text: "「見込み100%だと必ず下振れる。見込みは目標の3倍（300社＝150%〜300%）持っておかないとダメ。リード獲得の分母をどう増やすかすぐ再設計して。」" },
        { key: "C", text: "「100社達成したら予算を増額するので、来月の目標を150社に引き上げておいてください。」" }
      ],
      correct: "B",
      explanation: "【日置流の鉄則】「見込みは目標の3倍持て」。見込み100%は商談途中でのドロップや稟議遅延により確実に未達に終わります。定性的な気合いではなく、確率論として分母を3倍に積むのがCFOの規律です（2026/5/8会議など）。"
    },
    {
      id: 2,
      category: "財務・CRM整合性",
      question: "財務担当から「CRM上の今月売上見込みは3,000万円ですが、実際の通帳入金実績は直近3ヶ月間2,000万円で横ばいです」と報告がありました。日置さんの第一声として最も適切なものは？",
      options: [
        { key: "A", text: "「入金は売上計上から遅れて入ってくるものだから、来月まで様子を見ましょう。」" },
        { key: "B", text: "「売上の入金が3ヶ月横ばいなこととCRMの数字をどう合わせるか。あの数字はめっちゃ大事。CRMのステータス定義と入金のギャップを今すぐ突合して。」" },
        { key: "C", text: "「経理のシステムが古いのが原因なので、新しい会計クラウドを導入して自動化しましょう。」" }
      ],
      correct: "B",
      explanation: "【日置流の鉄則】CRMと財務会計の数値乖離を極端に嫌います。入金が横ばいなのにCRMの数字だけが先行している状態は予実の崩壊を意味するため、「あの数字はめっちゃ大事」とステータス定義と入金の即時突合を要求します（2026/5/1会議）。"
    },
    {
      id: 3,
      category: "ユニットエコノミクス",
      question: "新規顧客は順調に増えているものの、解約率（チャーン）が約70%と高く、人材の定着に課題が出ています。人事部が「もっと採用広告費を増やして母集団を増やしたい」と提案してきました。日置さんならどう判断しますか？",
      options: [
        { key: "A", text: "「穴の空いたバケツに水を注ぐな。新規採用を一時ストップし、予算を既存メンバーの社内育成と定着プログラムに全集中させる。」" },
        { key: "B", text: "「解約される以上のペースで採用すればスケールするので、広告予算を2倍に増やしましょう。」" },
        { key: "C", text: "「解約したクライアントに対して割引プランを提示して引き止めを行いましょう。」" }
      ],
      correct: "A",
      explanation: "【日置流の鉄則】解約率70%の状態で採用を増やせば採用コストと原価率が悪化するだけです。日置さんは2026/7/17の経営会議で実際に「新規採用を一時停止し、予算を社内育成に全集中する」という外科手術的ピボットを決断しました。"
    },
    {
      id: 4,
      category: "意思決定スピード",
      question: "マーケティング担当から「展示会出展やWeb広告の追加予算200万円の稟議書を作成したので、来週の経営会議でご審議いただけますか？」と言われました。日置さんの対応は？",
      options: [
        { key: "A", text: "「来週の経営会議の第1アジェンダにして、役員全員で慎重に議論しましょう。」" },
        { key: "B", text: "「ベンチャーで予算承認に1週間かけるな。LINEグループで喋りながら数字を投げて、今その場で即判断して承認しろ。」" },
        { key: "C", text: "「一旦ROIのシミュレーションを3パターン作って来月末までに再提出してください。」" }
      ],
      correct: "B",
      explanation: "【日置流の鉄則】「スピードは唯一の競争優位」。日置さんは2026/7/3の会議で、マーケティング予算をLINEグループを通じて即時承認するフローを制定し、「承認に時間をかける遅さそのものがリスク」と指導しました。"
    },
    {
      id: 5,
      category: "組織・会議運営",
      question: "毎週の経営会議で各事業部の状況報告が長引き、毎回1時間を超えてしまっています。日置さんが導入したルールは？",
      options: [
        { key: "A", text: "「会議時間を10分以内に制限する。状況報告は事前に数字で済ませ、本質的な意思決定のみを行う場にする。」" },
        { key: "B", text: "「時間を無制限にして、全員が納得するまで徹底的に議論を尽くす。」" },
        { key: "C", text: "「経営会議の開催頻度を月1回に減らし、各事業部に全権委任する。」" }
      ],
      correct: "A",
      explanation: "【日置流の鉄則】「会議は10分以内ルール」（2026/6/12会議）。定性的な状況報告を長々と聞く時間は無駄であり、事前に数字を共有した上で、ボトルネックに対する意思決定だけを秒で下すカルチャーを徹底しました。"
    }
  ];

  const handleAnswer = (qId: number, key: string, correct: string) => {
    setDrillAnswers(prev => ({ ...prev, [qId]: key }));
    setDrillResults(prev => ({ ...prev, [qId]: key === correct }));
  };

  const correctCount = Object.values(drillResults).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">
        
        {/* Page Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            4. 「第二の日置さん」思考ドリル
          </h2>
          <p className="text-xs text-slate-500">
            経営会議の実際の意思決定から抽出された論点に基づく、CFO思考OSの実践トレーニング
          </p>
        </div>

        {/* Interactive Drills */}
        <div className="border border-slate-200 rounded-xl p-6 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900">
              日置式 実践思考ドリル ({correctCount} / {baseDrills.length} 正解)
            </h4>
          </div>

          <div className="space-y-6">
            {baseDrills.map(d => (
              <div key={d.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                    Q{d.id}. {d.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {drillAnswers[d.id] ? (drillResults[d.id] ? '正解 ✅' : '要復習 ❌') : '未回答'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{d.question}</p>

                <div className="space-y-2 text-xs">
                  {d.options.map(opt => (
                    <button 
                      key={opt.key} 
                      onClick={() => handleAnswer(d.id, opt.key, d.correct)} 
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        drillAnswers[d.id] === opt.key 
                          ? (opt.key === d.correct ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-rose-50 border-rose-300 text-rose-900 font-medium') 
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 font-medium'
                      }`}
                    >
                      <strong className="mr-1">{opt.key}.</strong> {opt.text}
                    </button>
                  ))}
                </div>
                {drillAnswers[d.id] && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                    drillResults[d.id] ? 'bg-white border border-slate-200 text-slate-800 font-medium' : 'bg-rose-50 border border-rose-200 text-rose-900 font-medium'
                  }`}>
                    <div className="font-bold mb-1">
                      {drillResults[d.id] ? '🎉 正解！' : `❌ 不正解（正解: ${d.correct}）`}
                    </div>
                    {d.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Page Nav Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <Link 
            href="/chronicle" 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>前へ: 3. 全会議クロニクル</span>
          </Link>
          <Link 
            href="/upload" 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>次へ: 5. ドキュメント投入 / 同期</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
