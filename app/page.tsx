'use client';

import React, { useState, useEffect } from 'react';
import initialChronicleData from '../data/chronicle.json';
import { 
  UserCheck, Activity, CalendarDays, GraduationCap, RefreshCw, 
  SunMoon, Download, UploadCloud, PlusCircle, CheckCircle, XCircle, 
  Search, Calculator, Sparkles, Cpu, Zap, ShieldAlert, Coins, 
  Database, Briefcase, TrendingUp, LineChart, PieChart, UsersRound, 
  ShieldCheck, MessageSquareQuote, Filter, RefreshCw as RefreshIcon, Wallet, 
  CheckSquare, Terminal, Eye, FileJson, Check, ArrowRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'kpi' | 'chronicle' | 'roadmap' | 'manage'>('profile');
  const [isDark, setIsDark] = useState(true);
  const [chronicle, setChronicle] = useState<any[]>(initialChronicleData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  
  // Simulator State
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

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  // Calculations for Simulator
  const requiredDesign = Math.round(targetDeals / (rateDeal / 100));
  const requiredAppos = Math.round(requiredDesign / (rateDesign / 100));
  const dailyAppos = (requiredAppos / 20).toFixed(1);
  const pipeline3x = Math.round(targetDeals * 3);
  const requiredLeaders = Math.ceil(targetDeals / leaderCap);
  const monthlySalesMan = (targetDeals * 25).toLocaleString();
  const internBudgetMan = (targetDeals * 25 * 0.5).toLocaleString();

  // Filtered chronicle
  const filteredChronicle = chronicle.filter(m => {
    const matchSearch = !searchQuery || 
      (m.theme && m.theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.summary && m.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.yusuke_decisions && m.yusuke_decisions.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (m.quotes && m.quotes.some((q: string) => q.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchTag = selectedTag === 'ALL' || (m.tags && m.tags.includes(selectedTag));
    return matchSearch && matchTag;
  });

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
        ? `🎉 ${successCount} 件のファイルを解析し、GitHubリポジトリに自動コミットしました！` 
        : `✓ ${successCount} 件のファイルを解析してポータルに追加しました！`;
      setUploadMessage(msg);
      alert(msg);
      setActiveTab('chronicle');
    } else {
      alert('ファイルの解析に失敗しました。PDFまたはTXT形式のファイルを選択してください。');
    }
  };

  // Drills Data
  const drillsData = [
    {
      id: 1,
      category: "見込み管理・パイプライン",
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
      category: "財務データ・CRM整合性",
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
      category: "ユニットエコノミクス・投資判断",
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
      category: "会議運営・組織効率",
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
    <div className="min-h-screen bg-darkBg text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              H
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  VEXUM CFO Intelligence Portal
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Vercel & GitHub連動
                </span>
              </div>
              <p className="text-xs text-slate-400">
                日置佑輔の経営哲学・CFO思考OS・全議事録分析 ＆「第二の日置さん」育成ガイド
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-sm flex items-center space-x-1 border border-slate-700">
              <SunMoon className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">{isDark ? 'ライト' : 'ダーク'}</span>
            </button>
            <button onClick={exportJSON} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-sm flex items-center space-x-1 border border-slate-700">
              <Download className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">JSON保存</span>
            </button>
            <button onClick={() => setActiveTab('manage')} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs font-semibold flex items-center space-x-1 shadow-md shadow-indigo-600/30">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ドキュメント投入 / GitHub同期</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto flex space-x-2 border-t border-slate-800/60 pt-2 text-sm font-medium">
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg border transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            <UserCheck className="w-4 h-4" />
            <span>1. 人物像 & CFO機能の全貌</span>
          </button>
          <button onClick={() => setActiveTab('kpi')} className={`px-4 py-2 rounded-lg border transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'kpi' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            <Activity className="w-4 h-4" />
            <span>2. 必見KPI & 逆算シミュレーター</span>
          </button>
          <button onClick={() => setActiveTab('chronicle')} className={`px-4 py-2 rounded-lg border transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'chronicle' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            <CalendarDays className="w-4 h-4" />
            <span>3. 経営会議 完全クロニクル ({chronicle.length}件)</span>
          </button>
          <button onClick={() => setActiveTab('roadmap')} className={`px-4 py-2 rounded-lg border transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'roadmap' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            <GraduationCap className="w-4 h-4" />
            <span>4. 「第二の日置さん」育成ロードマップ</span>
          </button>
          <button onClick={() => setActiveTab('manage')} className={`px-4 py-2 rounded-lg border transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'manage' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 font-bold' : 'border-transparent text-emerald-400/80 hover:text-emerald-300'}`}>
            <UploadCloud className="w-4 h-4" />
            <span>5. ドキュメント投入 / GitHub自動同期</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* TAB 1: Profile */}
        {activeTab === 'profile' && (
          <section className="space-y-8 animate-fadeIn">
            {/* Hero Card */}
            <div className="glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden border border-indigo-500/20 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>株式会社VEXUM 代表取締役 兼 経営統括・CFO</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    日置 佑輔 <span className="text-xl font-normal text-slate-400">（Yusuke）</span>
                  </h2>
                  <p className="text-base lg:text-lg text-slate-300 leading-relaxed font-medium">
                    <span className="gradient-text font-bold">「数字を共通言語にして、逆算とスピードで“成長の再現性”を証明し続ける」</span>
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、シリーズA調達（5〜10億円規模）と「1年後に有料顧客3,000社」という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-xs text-slate-400 font-sans">全社目標 (1年後)</div>
                    <div className="text-xl font-bold text-amber-400">有料 3,000社</div>
                    <div className="text-[11px] text-slate-400 font-sans">ボーナス 1億円</div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-xs text-slate-400 font-sans">資金調達目標</div>
                    <div className="text-xl font-bold text-emerald-400">5億〜10億円</div>
                    <div className="text-[11px] text-slate-400 font-sans">シリーズA</div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-xs text-slate-400 font-sans">必要体制</div>
                    <div className="text-xl font-bold text-indigo-400">4,500人体制</div>
                    <div className="text-[11px] text-slate-400 font-sans">Tier1〜7</div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-xs text-slate-400 font-sans">意思決定ルール</div>
                    <div className="text-xl font-bold text-rose-400">10分会議</div>
                    <div className="text-[11px] text-slate-400 font-sans">LINE即決</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thinking OS 7 Principles */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-6 h-6 text-indigo-400" />
                <h3 className="text-2xl font-bold text-white tracking-tight">日置流『思考OS（Thinking OS）』7大原則</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 01</div>
                  <h4 className="text-base font-bold text-white mb-2">すべては「逆算」で組む</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ゴール（例：7月上駐100件）からリードタイム・転換率・行動量へ分解。「上駐100件 ÷ 6掛け ＝ アポ160件 ＝ 初回接触200件」を即座に組み立てる。
                  </p>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 02</div>
                  <h4 className="text-base font-bold text-white mb-2">定性論を数字に翻訳させる</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    「頑張ります」を許さず「成約数 ＝ 相談数 × 成功率」のように基本の数式に落とし、ボトルネックが分母か転換率かを特定。
                  </p>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 03</div>
                  <h4 className="text-base font-bold text-white mb-2">成長の再現性・スケールの証明</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    投資家が見ているのは「成長できることの証明」のみ。一発屋を排し、スキルTier1〜7ピラミッドなどの仕組み化に執着。
                  </p>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 04</div>
                  <h4 className="text-base font-bold text-white mb-2">スピード＝唯一の競争優位</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    予算承認に1週間かけるな。LINEグループで喋りながら即承認。会議は10分以内、秒単位でサイクルを回す。
                  </p>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 05</div>
                  <h4 className="text-base font-bold text-white mb-2">予実管理と「見込み3倍」ルール</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れる」。下振れを最重要リスクとして日次で監視。
                  </p>
                </div>
                <div className="glass-card p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 font-mono mb-1">原則 06</div>
                  <h4 className="text-base font-bold text-white mb-2">利益構造・ユニットエコノミクス</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    売上だけでなく限界利益率・原価率（約66%改善）・案件粗利・LTVを見る。解約率70%時には新規採用を停止し社内育成に全集中。
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: KPI & Simulator */}
        {activeTab === 'kpi' && (
          <section className="space-y-8 animate-fadeIn">
            {/* Interactive Simulator */}
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-slate-900/90 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Calculator className="w-4 h-4" />
                    <span>Interactive CFO Simulator</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">日置流『営業・供給 逆算シミュレーター』</h4>
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジックに基づいて必要なアクション量を即座に逆算します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">目標 上駐開始数 (成約件数 / 月)</label>
                    <input type="number" value={targetDeals} onChange={e => setTargetDeals(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-lg focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">初期設計 → 上駐 転換率 ({rateDeal}%)</label>
                    <input type="range" min="30" max="90" value={rateDeal} onChange={e => setRateDeal(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">アポ → 初期設計 転換率 ({rateDesign}%)</label>
                    <input type="range" min="40" max="95" value={rateDesign} onChange={e => setRateDesign(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">リーダー1人あたり案件キャパ ({leaderCap}社)</label>
                    <input type="number" value={leaderCap} onChange={e => setLeaderCap(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/40">
                    <div className="text-xs text-indigo-300 font-semibold">① 必要初期設計数 (先行指標)</div>
                    <div className="text-3xl font-extrabold text-indigo-400 font-mono my-2">{requiredDesign}</div>
                    <div className="text-[10px] text-slate-400">リードタイム: 約22日前</div>
                  </div>
                  <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/40">
                    <div className="text-xs text-indigo-300 font-semibold">② 必要アポイント数</div>
                    <div className="text-3xl font-extrabold text-indigo-400 font-mono my-2">{requiredAppos}</div>
                    <div className="text-[10px] text-slate-400 font-mono">日次: 約{dailyAppos}件</div>
                  </div>
                  <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/40">
                    <div className="text-xs text-amber-300 font-semibold">③ 必要見込み (3倍ルール)</div>
                    <div className="text-3xl font-extrabold text-amber-400 font-mono my-2">{pipeline3x}</div>
                    <div className="text-[10px] text-amber-400/80 font-semibold">下振れ防止バッファ</div>
                  </div>
                  <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-500/40">
                    <div className="text-xs text-purple-300 font-semibold">④ 必要リーダー数</div>
                    <div className="text-3xl font-extrabold text-purple-400 font-mono my-2">{requiredLeaders}</div>
                    <div className="text-[10px] text-slate-400">名 (案件管理体制)</div>
                  </div>
                  <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40">
                    <div className="text-xs text-emerald-300 font-semibold">⑤ 想定月次売上 (単価25万)</div>
                    <div className="text-3xl font-extrabold text-emerald-400 font-mono my-2">{monthlySalesMan}万</div>
                    <div className="text-[10px] text-slate-400">円 / 月</div>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
                    <div className="text-xs text-slate-300 font-semibold">⑥ インターン給与上限 (50%)</div>
                    <div className="text-3xl font-extrabold text-slate-200 font-mono my-2">{internBudgetMan}万</div>
                    <div className="text-[10px] text-slate-400">円 (財務規律上限)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: Chronicle */}
        {activeTab === 'chronicle' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">VEXUM経営会議 完全クロニクル</h3>
                <p className="text-xs text-slate-400">全 {chronicle.length} 件の会議議事録・意思決定ログ</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="キーワード・発言検索..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none">
                  <option value="ALL">全てのタグ</option>
                  <option value="逆算設計">逆算設計</option>
                  <option value="資金調達">資金調達</option>
                  <option value="ユニットエコノミクス">ユニットエコノミクス</option>
                  <option value="3000社目標">3000社目標</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredChronicle.map((m, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-indigo-400 font-mono">第{idx + 1}回 • {m.display_date || m.date}</span>
                    <div className="flex gap-1">
                      {(m.tags || []).map((t: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>
                      ))}
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white">{m.theme}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.summary}</p>
                  
                  {m.yusuke_decisions && m.yusuke_decisions.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-slate-800">
                      <div className="text-xs font-bold text-slate-200">日置さんの重要意思決定・指摘：</div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {m.yusuke_decisions.map((d: string, di: number) => (
                          <li key={di}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.quotes && m.quotes.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {m.quotes.map((q: string, qi: number) => (
                        <div key={qi} className="bg-indigo-950/20 border-l-2 border-indigo-500 p-2 rounded text-xs text-indigo-200 italic">
                          💬 "{q}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: Roadmap & Drills */}
        {activeTab === 'roadmap' && (
          <section className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">「第二の日置さん」育成ロードマップ</h3>
              <p className="text-sm text-slate-400">3階層スキル体系と実践思考ドリル</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/90 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-lg font-bold text-white">日置式 実践思考ドリル ({correctCount} / {drillsData.length} 正解)</h4>
              </div>

              <div className="space-y-6">
                {drillsData.map(d => (
                  <div key={d.id} className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Q{d.id}. {d.category}</span>
                      <span className="text-xs font-bold text-slate-400">
                        {drillAnswers[d.id] ? (drillResults[d.id] ? '正解 ✅' : '要復習 ❌') : '未回答'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{d.question}</p>
                    <div className="space-y-2 text-xs">
                      {d.options.map(opt => (
                        <button key={opt.key} onClick={() => handleAnswer(d.id, opt.key, d.correct)} className={`w-full text-left p-3 rounded-lg border transition ${drillAnswers[d.id] === opt.key ? (opt.key === d.correct ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-rose-950/40 border-rose-500 text-rose-300') : 'bg-slate-900 border-slate-700 hover:border-indigo-500 text-slate-300'}`}>
                          <strong className="text-indigo-400">{opt.key}.</strong> {opt.text}
                        </button>
                      ))}
                    </div>
                    {drillAnswers[d.id] && (
                      <div className={`p-3 rounded-lg text-xs leading-relaxed ${drillResults[d.id] ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'}`}>
                        {d.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: Manage & GitHub Auto-Sync */}
        {activeTab === 'manage' && (
          <section className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">ドキュメント投入 ＆ GitHub自動同期</h3>
              <p className="text-sm text-slate-400">
                ここにPDFやTXTをドロップすると、自動解析されてGitHubリポジトリに直接コミット・永続化されます。
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div className="glass-card p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-all text-center space-y-4 bg-slate-900/60 cursor-pointer" onClick={() => document.getElementById('drop-file-input')?.click()}>
              <input type="file" id="drop-file-input" accept=".pdf,.txt" multiple className="hidden" onChange={e => handleFileUpload(e.target.files)} />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">ここにPDF・TXTファイルをドラッグ＆ドロップ</h4>
                <p className="text-xs text-slate-400">またはクリックしてファイルを選択（Vercel上でGitHubに直接コミットされます）</p>
              </div>
              {isUploading && (
                <div className="text-xs font-bold text-indigo-400 animate-pulse">
                  ファイルを解析中... 日置さんの意思決定・KPIを抽出してGitHubに自動コミットしています
                </div>
              )}
            </div>

            {/* GitHub Setup Guide */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Vercel 環境変数設定（GitHub自動コミット用）</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vercelのプロジェクト設定（Settings &gt; Environment Variables）で以下を設定すると、Web画面からのアップロードがあなたのGitHubリポジトリに自動Pushされます：
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div><span className="text-indigo-400">GITHUB_TOKEN</span>=ghp_xxxxxxxxxxxx <span className="text-slate-500">(repo権限付きPAT)</span></div>
                <div><span className="text-indigo-400">GITHUB_OWNER</span>=your-username <span className="text-slate-500">(GitHubユーザー名)</span></div>
                <div><span className="text-indigo-400">GITHUB_REPO</span>=vexum-cfo-portal <span className="text-slate-500">(リポジトリ名)</span></div>
                <div><span className="text-indigo-400">GITHUB_BRANCH</span>=main</div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
