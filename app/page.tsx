'use client';

import React, { useState, useEffect, useMemo } from 'react';
import initialChronicleData from '../data/chronicle.json';
import { 
  UserCheck, Activity, CalendarDays, GraduationCap, 
  Download, UploadCloud, Search, Calculator, Sparkles, 
  Cpu, Layers, CheckCircle, ArrowRight, Target, Coins,
  Clock, Check, ChevronRight, FileText
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'kpi' | 'chronicle' | 'roadmap' | 'manage'>('profile');
  const [chronicle, setChronicle] = useState<any[]>(initialChronicleData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  
  // Simulator Dynamic State
  const [targetDeals, setTargetDeals] = useState(100);
  const [rateDeal, setRateDeal] = useState(63);
  const [rateDesign, setRateDesign] = useState(80);
  const [leaderCap, setLeaderCap] = useState(8);

  // Drill State
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});
  const [drillResults, setDrillResults] = useState<Record<number, boolean>>({});

  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Fetch latest meetings from API on mount
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

  // Dynamic calculations derived from the latest chronicle data
  const dynamicStats = useMemo(() => {
    const latest = chronicle[0] || {};
    const totalCount = chronicle.length;
    
    const allDecisions: { meetingDate: string; text: string }[] = [];
    const allQuotes: { meetingDate: string; text: string }[] = [];
    
    chronicle.forEach(m => {
      (m.yusuke_decisions || []).forEach((d: string) => {
        allDecisions.push({ meetingDate: m.display_date || m.date, text: d });
      });
      (m.quotes || []).forEach((q: string) => {
        allQuotes.push({ meetingDate: m.display_date || m.date, text: q });
      });
    });

    return {
      latestMeeting: latest,
      totalMeetings: totalCount,
      allDecisions,
      allQuotes,
      latestDate: latest.display_date || latest.date || '2026年8月最新',
      latestTheme: latest.theme || '経営数値の進捗確認と重要意思決定',
    };
  }, [chronicle]);

  // Simulator Calculations
  const requiredDesign = Math.round(targetDeals / (rateDeal / 100));
  const requiredAppos = Math.round(requiredDesign / (rateDesign / 100));
  const dailyAppos = (requiredAppos / 20).toFixed(1);
  const pipeline3x = Math.round(targetDeals * 3);
  const requiredLeaders = Math.ceil(targetDeals / leaderCap);
  const monthlySalesMan = (targetDeals * 25).toLocaleString();
  const internBudgetMan = (targetDeals * 25 * 0.5).toLocaleString();

  // Filtered chronicle
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

  // Handle Drag & Drop Upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadMessage(null);

    let successCount = 0;
    let githubCommitted = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
          if (data.githubCommitted) githubCommitted = true;
          setChronicle(prev => [data.meeting, ...prev]);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      const msg = githubCommitted 
        ? `🎉 ${successCount} 件のファイルを解析し、GitHubリポジトリに自動コミット＆全画面のデータを更新しました！` 
        : `✓ ${successCount} 件のファイルを解析し、全画面のデータを更新しました！`;
      setUploadMessage(msg);
      alert(msg);
      setActiveTab('chronicle');
    } else {
      alert('ファイルの解析に失敗しました。PDFまたはTXT形式のファイルを選択してください。');
    }
  };

  // Drills Data - Clean, Focused
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

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chronicle, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `vexum_cfo_intelligence_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      
      {/* Top Clean Pure White Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base">
              H
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  VEXUM CFO Intelligence Portal
                </h1>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 border border-slate-200">
                  全{dynamicStats.totalMeetings}会議
                </span>
              </div>
              <p className="text-xs text-slate-500">
                日置佑輔 CFO思考OS ＆ 全会議分析ポータル
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={exportJSON} 
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition text-xs font-medium flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON保存</span>
            </button>
            <button 
              onClick={() => setActiveTab('manage')} 
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition text-xs font-semibold flex items-center space-x-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>ドキュメント投入</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation - Clean Minimalist */}
        <div className="max-w-6xl mx-auto mt-3 overflow-x-auto flex space-x-1 border-t border-slate-100 pt-2 text-xs font-medium">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            1. 人物像 & CFO思考OS
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
              activeTab === 'kpi' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            2. 必見KPI & 逆算シミュレーター
          </button>
          <button 
            onClick={() => setActiveTab('chronicle')} 
            className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
              activeTab === 'chronicle' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            3. 全会議クロニクル ({chronicle.length})
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')} 
            className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
              activeTab === 'roadmap' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            4. 思考ドリル
          </button>
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`px-3.5 py-1.5 rounded-md transition whitespace-nowrap ${
              activeTab === 'manage' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            5. ドキュメント投入 / 同期
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">

        {/* ======================================================== */}
        {/* TAB 1: Profile & CFO Architecture */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            
            {/* Top Summary - High Contrast Clean */}
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

                {/* 4 Summary Numbers - Monochrome with Accent only on critical targets */}
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
                    <div className="text-xl font-bold text-slate-900 mt-0.5">{dynamicStats.totalMeetings} 回分</div>
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
                <span className="font-bold text-slate-900 shrink-0">最新の重要方針（{dynamicStats.latestDate}）：</span>
                <span className="text-slate-700 leading-relaxed">
                  {dynamicStats.latestMeeting.yusuke_decisions?.[0] || dynamicStats.latestMeeting.summary || '経営数値の進捗確認と重要意思決定を推進中。'}
                </span>
              </div>
            </div>

            {/* 7 Core Principles - Clean Unified Cards */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-900">
                  日置流『思考OS（Thinking OS）』7大原則
                </h3>
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: Dynamic KPI & Simulator */}
        {/* ======================================================== */}
        {activeTab === 'kpi' && (
          <div className="space-y-8">
            <div className="border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Interactive Reverse Engineering Tool
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
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

            {/* 4 Quadrants Matrix - Clean */}
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: Meeting Chronicle */}
        {/* ======================================================== */}
        {activeTab === 'chronicle' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  VEXUM経営会議 完全クロニクル
                </h3>
                <p className="text-xs text-slate-500">
                  全 {chronicle.length} 件の会議議事録・意思決定ログ
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: Roadmap & Drills */}
        {/* ======================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                「第二の日置さん」思考ドリル
              </h3>
              <p className="text-xs text-slate-500">
                経営会議から抽出された重要論点に基づく実践思考トレーニング
              </p>
            </div>

            {/* Interactive Drills - Clean */}
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: Manage & Multi-Tab Dynamic Sync */}
        {/* ======================================================== */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                ドキュメント投入 ＆ 全体自動同期
              </h3>
              <p className="text-xs text-slate-500">
                PDFやTXTをドロップすると自動解析され、GitHubリポジトリに保存されるとともに、KPI・シミュレーター・クロニクルが全自動で更新されます。
              </p>
            </div>

            {/* Drag & Drop Area - Clean Minimal */}
            <div 
              className="border-2 border-dashed border-slate-300 hover:border-slate-900 p-8 rounded-xl text-center space-y-4 transition cursor-pointer bg-white" 
              onClick={() => document.getElementById('drop-file-input')?.click()}
            >
              <input 
                type="file" 
                id="drop-file-input" 
                accept=".pdf,.txt" 
                multiple 
                className="hidden" 
                onChange={e => handleFileUpload(e.target.files)} 
              />
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  ここにPDF・TXTファイルをドラッグ＆ドロップ
                </h4>
                <p className="text-xs text-slate-500">
                  クリックしてファイルを選択（Vercel上でGitHubに直接コミットされます）
                </p>
              </div>
              {isUploading && (
                <div className="text-xs font-bold text-slate-900 animate-pulse">
                  ファイルを解析中... 日置さんの意思決定・KPIを抽出して全体同期中...
                </div>
              )}
            </div>

            {/* Sync checklist */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-white">
              <h4 className="text-xs font-bold text-slate-900">
                ドキュメント投入時に自動同期される項目
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  ✓ <strong>人物像サマリー</strong>: 最新方針が反映
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  ✓ <strong>必見KPI指標</strong>: 最新数値を自動集計
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  ✓ <strong>逆算シミュレーター</strong>: 転換率・目標値が連動
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  ✓ <strong>完全クロニクル</strong>: 新規カードとして最上部に追加
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 mt-16 py-6 px-4 text-center text-xs text-slate-400 bg-white">
        <p>株式会社VEXUM CFO Intelligence System | Minimalist Pure White UI</p>
      </footer>
    </div>
  );
}
