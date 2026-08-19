'use client';

import React, { useState, useEffect, useMemo } from 'react';
import initialChronicleData from '../data/chronicle.json';
import { 
  UserCheck, Activity, CalendarDays, GraduationCap, 
  Download, UploadCloud, Search, Calculator, Sparkles, 
  Cpu, Layers, CheckCircle2, AlertCircle, ArrowRight, Zap, Target, TrendingUp,
  ShieldCheck, Clock, Coins, Briefcase, HelpCircle, Check, X
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

  // Base Drills Data with Semantic Tags
  const baseDrills = [
    {
      id: 1,
      category: "見込み管理",
      categoryColor: "bg-amber-100 text-amber-800 border-amber-300",
      question: "事業部から「今月の目標100社に対して、確度の高い見込みがちょうど100社集まりました！必達を目指して頑張ります！」と報告がありました。日置さんならどう返しますか？",
      options: [
        { key: "A", text: "「素晴らしい！メンバーのモチベーションを高めて、1社も落とさないよう気合いでクロージングしてください。」" },
        { key: "B", text: "「見込み100%だと必ず下振れる。見込みは目標の3倍（300社＝150%〜300%）持っておかないとダメ。リード獲得の分母をどう増やすかすぐ再設計して。」" },
        { key: "C", text: "「100社達成したら予算を増額するので、来月の目標を150社に引き上げておいてください。」" }
      ],
      correct: "B",
      point: "見込みは目標の3倍（300%）積むのがCFOの鉄則",
      explanation: "【日置流の鉄則】「見込みは目標の3倍持て」。見込み100%は商談途中でのドロップや稟議遅延により確実に未達に終わります。定性的な気合いではなく、確率論として分母を3倍に積むのがCFOの規律です（2026/5/8会議など）。"
    },
    {
      id: 2,
      category: "財務・CRM整合性",
      categoryColor: "bg-blue-100 text-blue-800 border-blue-300",
      question: "財務担当から「CRM上の今月売上見込みは3,000万円ですが、実際の通帳入金実績は直近3ヶ月間2,000万円で横ばいです」と報告がありました。日置さんの第一声として最も適切なものは？",
      options: [
        { key: "A", text: "「入金は売上計上から遅れて入ってくるものだから、来月まで様子を見ましょう。」" },
        { key: "B", text: "「売上の入金が3ヶ月横ばいなこととCRMの数字をどう合わせるか。あの数字はめっちゃ大事。CRMのステータス定義と入金のギャップを今すぐ突合して。」" },
        { key: "C", text: "「経理のシステムが古いのが原因なので、新しい会計クラウドを導入して自動化しましょう。」" }
      ],
      correct: "B",
      point: "CRMと財務実績の乖離ゼロを徹底追求",
      explanation: "【日置流の鉄則】CRMと財務会計の数値乖離を極端に嫌います。入金が横ばいなのにCRMの数字だけが先行している状態は予実の崩壊を意味するため、「あの数字はめっちゃ大事」とステータス定義と入金の即時突合を要求します（2026/5/1会議）。"
    },
    {
      id: 3,
      category: "ユニットエコノミクス",
      categoryColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      question: "新規顧客は順調に増えているものの、解約率（チャーン）が約70%と高く、人材の定着に課題が出ています。人事部が「もっと採用広告費を増やして母集団を増やしたい」と提案してきました。日置さんならどう判断しますか？",
      options: [
        { key: "A", text: "「穴の空いたバケツに水を注ぐな。新規採用を一時ストップし、予算を既存メンバーの社内育成と定着プログラムに全集中させる。」" },
        { key: "B", text: "「解約される以上のペースで採用すればスケールするので、広告予算を2倍に増やしましょう。」" },
        { key: "C", text: "「解約したクライアントに対して割引プランを提示して引き止めを行いましょう。」" }
      ],
      correct: "A",
      point: "解約率高騰時は採用停止・育成全集中で穴を塞ぐ",
      explanation: "【日置流の鉄則】解約率70%の状態で採用を増やせば採用コストと原価率が悪化するだけです。日置さんは2026/7/17の経営会議で実際に「新規採用を一時停止し、予算を社内育成に全集中する」という外科手術的ピボットを決断しました。"
    },
    {
      id: 4,
      category: "意思決定スピード",
      categoryColor: "bg-purple-100 text-purple-800 border-purple-300",
      question: "マーケティング担当から「展示会出展やWeb広告の追加予算200万円の稟議書を作成したので、来週の経営会議でご審議いただけますか？」と言われました。日置さんの対応は？",
      options: [
        { key: "A", text: "「来週の経営会議の第1アジェンダにして、役員全員で慎重に議論しましょう。」" },
        { key: "B", text: "「ベンチャーで予算承認に1週間かけるな。LINEグループで喋りながら数字を投げて、今その場で即判断して承認しろ。」" },
        { key: "C", text: "「一旦ROIのシミュレーションを3パターン作って来月末までに再提出してください。」" }
      ],
      correct: "B",
      point: "スピード＝唯一の競争優位。LINEで即決承認",
      explanation: "【日置流の鉄則】「スピードは唯一の競争優位」。日置さんは2026/7/3の会議で、マーケティング予算をLINEグループを通じて即時承認するフローを制定し、「承認に時間をかける遅さそのものがリスク」と指導しました。"
    },
    {
      id: 5,
      category: "組織・会議規律",
      categoryColor: "bg-rose-100 text-rose-800 border-rose-300",
      question: "毎週の経営会議で各事業部の状況報告が長引き、毎回1時間を超えてしまっています。日置さんが導入したルールは？",
      options: [
        { key: "A", text: "「会議時間を10分以内に制限する。状況報告は事前に数字で済ませ、本質的な意思決定のみを行う場にする。」" },
        { key: "B", text: "「時間を無制限にして、全員が納得するまで徹底的に議論を尽くす。」" },
        { key: "C", text: "「経営会議の開催頻度を月1回に減らし、各事業部に全権委任する。」" }
      ],
      correct: "A",
      point: "会議は10分以内。報告は数字で事前共有、場は意思決定のみ",
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
      
      {/* Top Pure White Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#cfd9de] px-4 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0f1419] text-white flex items-center justify-center font-black text-lg shadow-sm">
              H
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-[#0f1419]">
                  VEXUM CFO Intelligence Portal
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  全 {dynamicStats.totalMeetings} 会議 同期中
                </span>
              </div>
              <p className="text-xs text-[#536471] font-medium">
                日置佑輔の経営哲学・CFO思考OS・全議事録分析 ＆「第二の日置さん」育成ガイド
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button 
              onClick={exportJSON} 
              className="px-3.5 py-2 rounded-lg bg-white border border-[#cfd9de] hover:bg-[#f7f9f9] text-[#0f1419] transition text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              title="JSONデータ保存"
            >
              <Download className="w-4 h-4 text-[#536471]" />
              <span>JSON保存</span>
            </button>
            <button 
              onClick={() => setActiveTab('manage')} 
              className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>ドキュメント投入 / 同期</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3.5 overflow-x-auto flex space-x-1 border-t border-[#cfd9de] pt-2 text-xs font-bold">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm ${
              activeTab === 'profile' 
                ? 'bg-[#0f1419] text-white font-black' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. 人物像 & CFO思考OS</span>
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm ${
              activeTab === 'kpi' 
                ? 'bg-[#0f1419] text-white font-black' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. 必見KPI & 逆算シミュレーター</span>
          </button>
          <button 
            onClick={() => setActiveTab('chronicle')} 
            className={`px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm ${
              activeTab === 'chronicle' 
                ? 'bg-[#0f1419] text-white font-black' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>3. 全会議クロニクル ({chronicle.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')} 
            className={`px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm ${
              activeTab === 'roadmap' 
                ? 'bg-[#0f1419] text-white font-black' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>4. 「第二の日置さん」思考ドリル</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm ${
              activeTab === 'manage' 
                ? 'bg-[#2563eb] text-white font-black' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>5. ドキュメント投入 / 同期</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 bg-white">

        {/* ======================================================== */}
        {/* TAB 1: Profile & CFO Architecture */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-10">
            {/* Top Summary Banner */}
            <div className="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-[#0f1419] text-xs font-bold border border-[#cfd9de]">
                    <span>株式会社VEXUM 代表取締役 兼 経営統括・CFO</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-[#0f1419] tracking-tight">
                    日置 佑輔 <span className="text-xl font-bold text-[#536471]">（Yusuke）</span>
                  </h2>
                  <p className="text-lg lg:text-xl font-bold leading-relaxed text-[#0f1419]">
                    「数字を共通言語にして、<span className="text-blue-600 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded">逆算</span> と <span className="text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded">スピード</span> で“成長の再現性”を証明し続ける」
                  </p>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、<strong className="text-emerald-700 font-bold">シリーズA調達（5〜10億円）</strong>と<strong className="text-blue-700 font-bold">「1年後に有料顧客3,000社」</strong>という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
                  </p>
                </div>

                {/* 4 Core Goal Cards with Distinct Semantic Colors */}
                <div className="grid grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0 font-mono text-center">
                  <div className="bg-blue-50/70 border-2 border-blue-200 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-blue-800 font-sans font-bold flex items-center justify-center space-x-1">
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      <span>全社ゴール (1年後)</span>
                    </div>
                    <div className="text-2xl font-black text-blue-700 mt-1">有料 3,000社</div>
                    <div className="text-xs text-blue-900 font-sans font-bold mt-0.5">達成ボーナス 1億円</div>
                  </div>

                  <div className="bg-emerald-50/70 border-2 border-emerald-200 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-emerald-800 font-sans font-bold flex items-center justify-center space-x-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>資金調達目標</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">5億〜10億円</div>
                    <div className="text-xs text-emerald-900 font-sans font-bold mt-0.5">シリーズA 大型調達</div>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-slate-600 font-sans font-bold flex items-center justify-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-slate-600" />
                      <span>蓄積会議データ</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{dynamicStats.totalMeetings} 回分</div>
                    <div className="text-xs text-slate-500 font-sans font-medium mt-0.5">最新: {dynamicStats.latestDate}</div>
                  </div>

                  <div className="bg-amber-50/70 border-2 border-amber-200 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-amber-800 font-sans font-bold flex items-center justify-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>意思決定ルール</span>
                    </div>
                    <div className="text-2xl font-black text-amber-700 mt-1">10分会議</div>
                    <div className="text-xs text-amber-900 font-sans font-bold mt-0.5">LINE即時承認</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Latest Decision Banner */}
              <div className="bg-blue-50/50 border-l-4 border-blue-600 p-4 rounded-r-xl flex items-start space-x-3 border-y border-r border-blue-200">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-black text-blue-800 uppercase tracking-wide">
                    最新の経営状況 ＆ 日置さんの重要意思決定（{dynamicStats.latestDate}）：
                  </div>
                  <div className="text-sm text-[#0f1419] font-bold leading-relaxed">
                    {dynamicStats.latestMeeting.yusuke_decisions?.[0] || dynamicStats.latestMeeting.summary || '経営数値の進捗確認と重要意思決定を推進中。'}
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Core Principles - Semantic Color Categorized */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#cfd9de] pb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-black text-[#0f1419] tracking-tight">
                    日置流『思考OS（Thinking OS）』7大原則
                  </h3>
                </div>
                <span className="text-xs text-[#536471] font-bold hidden sm:inline">
                  「第二の日置さん」を目指すための行動・判断基準
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Principle 1: Blue (Strategy & Reverse) */}
                <div className="bg-white border-2 border-blue-200 hover:border-blue-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">原則 01</span>
                      <span className="text-[11px] font-bold text-blue-600">【戦略・目標設定】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2">すべては「<span className="text-blue-600">逆算</span>」で組む</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      ゴール（例：7月上駐100件）から逆算してリードタイム・転換率・行動量へ分解。<strong className="text-blue-700">「上駐100件 ÷ 6掛け ＝ アポ160件 ＝ 初回接触200件」</strong>を即座に組み立てる。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-blue-100 text-xs font-bold text-blue-800 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                    💬「リーダー12人必要なら今候補は何人いるか逆算して」
                  </div>
                </div>

                {/* Principle 2: Purple (Data & Formula) */}
                <div className="bg-white border-2 border-purple-200 hover:border-purple-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-mono">原則 02</span>
                      <span className="text-[11px] font-bold text-purple-600">【数値化・言語化】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2">定性論を<span className="text-purple-600">数字に翻訳</span>させる</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      「頑張ります」などの定性論を禁止。<strong className="text-purple-700">「成約数 ＝ 相談数 × 成功率」</strong>の基本数式に落とし込み、ボトルネックが分母か転換率かを即特定させる。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-purple-100 text-xs font-bold text-purple-800 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                    💬「それを数字で言うと？」「相談数×成功率でどこが課題？」
                  </div>
                </div>

                {/* Principle 3: Cyan/Indigo (Investor & Scaling) */}
                <div className="bg-white border-2 border-indigo-200 hover:border-indigo-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">原則 03</span>
                      <span className="text-[11px] font-bold text-indigo-600">【投資家目線・仕組み化】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2">成長の<span className="text-indigo-600">再現性・スケール</span>の証明</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      投資家が見ているのは<strong className="text-indigo-700">「成長できることの証明」</strong>のみ。一発屋を排し、スキルTier1〜7ピラミッドや教育フロー1枚スライドなど仕組み化に執着。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-indigo-100 text-xs font-bold text-indigo-800 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                    💬「投資家が見てるのは成長の証明。成長できてることが全て」
                  </div>
                </div>

                {/* Principle 4: Amber (Speed & Execution) */}
                <div className="bg-white border-2 border-amber-200 hover:border-amber-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">原則 04</span>
                      <span className="text-[11px] font-bold text-amber-600">【実行速度・組織】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2"><span className="text-amber-600">スピード</span>＝唯一の競争優位</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      予算承認に1週間かけるな。<strong className="text-amber-700">LINEで喋りながら即承認</strong>。会議は10分以内ルール、秒単位で意思決定サイクルを回す。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-amber-100 text-xs font-bold text-amber-800 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                    💬「喋りながらLINEで連絡して今すぐ承認しろ」
                  </div>
                </div>

                {/* Principle 5: Yellow/Orange (Forecast & Buffer) */}
                <div className="bg-white border-2 border-orange-200 hover:border-orange-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-mono">原則 05</span>
                      <span className="text-[11px] font-bold text-orange-600">【予実管理・リスク予防】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2">予実管理と「<span className="text-orange-600">見込み3倍</span>」ルール</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      <strong className="text-orange-700">「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れる」</strong>。下振れを資金調達と成長への最重要リスクとして日次で監視。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-orange-100 text-xs font-bold text-orange-800 bg-orange-50/60 p-2.5 rounded-lg border border-orange-100">
                    💬「見込み放置は資金調達と成長に直結して悪影響」
                  </div>
                </div>

                {/* Principle 6: Emerald (Unit Economics) */}
                <div className="bg-white border-2 border-emerald-200 hover:border-emerald-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">原則 06</span>
                      <span className="text-[11px] font-bold text-emerald-600">【利益率・財務規律】</span>
                    </div>
                    <h4 className="text-lg font-black text-[#0f1419] mb-2"><span className="text-emerald-700">利益構造</span>・ユニットエコノミクス</h4>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      売上だけでなく限界利益率・原価率・案件粗利を見る。<strong className="text-emerald-700">インターン給与上限50%や全社原価率66%圧縮</strong>を徹底し、粗利を残す体制を確立。
                    </p>
                  </div>
                  <div className="pt-3 border-t border-emerald-100 text-xs font-bold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
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
          <div className="space-y-10">
            {/* Dynamic Simulator */}
            <div className="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#e1e8ed] pb-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center space-x-1">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Interactive Reverse Engineering Tool</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0f1419]">
                    日置流『営業・供給 逆算シミュレーター』
                  </h3>
                </div>
                <p className="text-xs text-[#536471] font-medium max-w-md">
                  目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジック（転換率・リードタイム・リーダーキャパ）に基づいて必要なアクション量を即座に逆算します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 bg-blue-50/30 p-5 rounded-2xl border-2 border-blue-200">
                  <div>
                    <label className="block text-xs font-black text-blue-900 mb-1.5">
                      目標 上駐開始数 (成約件数 / 月)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={targetDeals} 
                        onChange={e => setTargetDeals(Number(e.target.value))} 
                        className="w-full bg-white border-2 border-blue-500 rounded-xl px-3.5 py-2.5 text-blue-700 font-mono font-black text-2xl focus:outline-none shadow-sm" 
                      />
                      <span className="absolute right-3.5 top-3 text-sm text-blue-900 font-bold">社</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>初期設計 → 上駐 転換率</span>
                      <span className="font-mono text-blue-600 font-bold">{rateDeal}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="90" 
                      value={rateDeal} 
                      onChange={e => setRateDeal(Number(e.target.value))} 
                      className="w-full accent-blue-600" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>アポ → 初期設計 転換率</span>
                      <span className="font-mono text-blue-600 font-bold">{rateDesign}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="95" 
                      value={rateDesign} 
                      onChange={e => setRateDesign(Number(e.target.value))} 
                      className="w-full accent-blue-600" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      リーダー1人あたり案件キャパ
                    </label>
                    <input 
                      type="number" 
                      value={leaderCap} 
                      onChange={e => setLeaderCap(Number(e.target.value))} 
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm font-bold focus:outline-none" 
                    />
                  </div>
                </div>

                {/* 6 Output Metrics with Clear Semantic Colors */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-blue-50/70 border-2 border-blue-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-bold text-blue-800">① 必要初期設計数 (先行指標)</div>
                    <div className="text-3xl lg:text-4xl font-black text-blue-700 font-mono my-2">{requiredDesign}</div>
                    <div className="text-[11px] text-blue-900 font-medium">リードタイム: 約22日前</div>
                  </div>

                  <div className="bg-purple-50/70 border-2 border-purple-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-bold text-purple-800">② 必要アポイント数</div>
                    <div className="text-3xl lg:text-4xl font-black text-purple-700 font-mono my-2">{requiredAppos}</div>
                    <div className="text-[11px] text-purple-900 font-mono font-bold">日次: 約{dailyAppos}件</div>
                  </div>

                  <div className="bg-amber-50/70 border-2 border-amber-300 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-black text-amber-800">③ 必要見込み (3倍ルール)</div>
                    <div className="text-3xl lg:text-4xl font-black text-amber-700 font-mono my-2">{pipeline3x}</div>
                    <div className="text-[11px] text-amber-900 font-black">下振れ防止バッファ</div>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-bold text-slate-700">④ 必要リーダー数</div>
                    <div className="text-3xl lg:text-4xl font-black text-slate-900 font-mono my-2">{requiredLeaders}</div>
                    <div className="text-[11px] text-slate-600 font-medium">名 (案件管理体制)</div>
                  </div>

                  <div className="bg-emerald-50/70 border-2 border-emerald-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-bold text-emerald-800">⑤ 想定月次売上 (単価25万)</div>
                    <div className="text-3xl lg:text-4xl font-black text-emerald-700 font-mono my-2">{monthlySalesMan}万</div>
                    <div className="text-[11px] text-emerald-900 font-medium">円 / 月</div>
                  </div>

                  <div className="bg-red-50/70 border-2 border-red-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="text-xs font-bold text-red-800">⑥ インターン給与上限 (50%)</div>
                    <div className="text-3xl lg:text-4xl font-black text-red-600 font-mono my-2">{internBudgetMan}万</div>
                    <div className="text-[11px] text-red-900 font-bold">円 (財務規律上限)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Quadrants Matrix with Multi-color Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                  <span className="font-black text-sm text-blue-900">A. 営業パイプライン指標</span>
                  <span className="text-xs text-blue-600 font-bold font-mono">Sales Funnel</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-[#536471] font-bold">初回接触・リード数</div>
                    <div className="font-black font-mono text-[#0f1419] text-base mt-0.5">月200件</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-blue-800 font-bold">初期設計数【先行指標】</div>
                    <div className="font-black font-mono text-blue-700 text-base mt-0.5">転換率 約80%</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-blue-800 font-bold">上駐開始数【必達マスト】</div>
                    <div className="font-black font-mono text-blue-700 text-base mt-0.5">月64〜100件</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <div className="text-amber-800 font-bold">見込みパイプライン</div>
                    <div className="font-black font-mono text-amber-700 text-base mt-0.5">目標の3倍 (150%以上)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-emerald-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <span className="font-black text-sm text-emerald-900">B. 収益・ユニットエコノミクス</span>
                  <span className="text-xs text-emerald-600 font-bold font-mono">Unit Economics</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                    <div className="text-red-800 font-bold">解約率 (チャーン)</div>
                    <div className="font-black font-mono text-red-600 text-base mt-0.5">約70% (外科手術対象)</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="text-emerald-800 font-bold">全社原価率</div>
                    <div className="font-black font-mono text-emerald-700 text-base mt-0.5">約66% (圧縮目標)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-slate-700 font-bold">インターン給与規律</div>
                    <div className="font-black font-mono text-slate-900 text-base mt-0.5">売上の50%以内</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="text-emerald-800 font-bold">CRM・財務乖離</div>
                    <div className="font-black font-mono text-emerald-700 text-base mt-0.5">乖離ゼロ (完全一致)</div>
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
                <h3 className="text-2xl font-black text-[#0f1419] tracking-tight">
                  VEXUM経営会議 完全クロニクル
                </h3>
                <p className="text-xs text-[#536471] font-medium">
                  全 {chronicle.length} 件の会議議事録・意思決定ログ（ドキュメント投入時に自動同期）
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="キーワード・発言検索..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="bg-white border-2 border-[#cfd9de] rounded-xl px-3.5 py-2 text-xs font-bold text-[#0f1419] placeholder-[#536471] focus:border-blue-500 focus:outline-none shadow-sm" 
                />
                <select 
                  value={selectedTag} 
                  onChange={e => setSelectedTag(e.target.value)} 
                  className="bg-white border-2 border-[#cfd9de] rounded-xl px-3 py-2 text-xs font-bold text-[#0f1419] focus:outline-none shadow-sm"
                >
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
                <div key={idx} className="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 space-y-4 shadow-sm hover:border-blue-300 transition">
                  <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#0f1419] text-white text-xs font-black font-mono">
                        第{idx + 1}回
                      </span>
                      <span className="text-sm font-black text-[#0f1419]">
                        {m.display_date || m.date}
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {(m.tags || []).map((t: string, i: number) => {
                        let tagStyle = "bg-slate-100 text-slate-700 border-slate-200";
                        if (t.includes('逆算')) tagStyle = "bg-blue-50 text-blue-700 border-blue-200";
                        if (t.includes('調達') || t.includes('シリーズ')) tagStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        if (t.includes('3000社')) tagStyle = "bg-purple-50 text-purple-700 border-purple-200";
                        if (t.includes('原価') || t.includes('解約')) tagStyle = "bg-amber-50 text-amber-700 border-amber-200";
                        return (
                          <span key={i} className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tagStyle}`}>
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="text-base font-black text-[#0f1419]">{m.theme}</h4>
                  <p className="text-xs text-[#334155] leading-relaxed font-normal">{m.summary}</p>
                  
                  {m.yusuke_decisions && m.yusuke_decisions.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-[#e1e8ed]">
                      <div className="text-xs font-black text-blue-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>日置さんの重要意思決定・指摘：</span>
                      </div>
                      <ul className="text-xs text-[#0f1419] space-y-1.5 list-disc list-inside font-bold">
                        {m.yusuke_decisions.map((d: string, di: number) => (
                          <li key={di}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.quotes && m.quotes.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {m.quotes.map((q: string, qi: number) => (
                        <div key={qi} className="bg-amber-50/60 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-[#0f1419] font-bold italic">
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
          <div className="space-y-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#0f1419] tracking-tight">
                「第二の日置さん」育成ロードマップ ＆ 実践ドリル
              </h3>
              <p className="text-xs text-[#536471] font-medium">
                ドキュメントが追加されるたびに、新しい意思決定や論点が学習データとして蓄積されます。
              </p>
            </div>

            {/* Dynamic Learning Insights */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h4 className="text-base font-black text-blue-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>全 {dynamicStats.totalMeetings} 回の会議から蓄積された日置流「意思決定・実践ログ」</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-h-72 overflow-y-auto pr-1">
                {dynamicStats.allDecisions.slice(0, 12).map((dec, i) => (
                  <div key={i} className="bg-[#f7f9f9] p-3 rounded-xl border border-[#cfd9de] space-y-1">
                    <div className="text-[11px] font-black text-blue-600">{dec.meetingDate}</div>
                    <div className="text-[#0f1419] font-bold">{dec.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Drills */}
            <div className="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-4">
                <h4 className="text-lg font-black text-[#0f1419]">
                  日置式 実践思考ドリル (<span className="text-emerald-600 font-black">{correctCount}</span> / {baseDrills.length} 正解)
                </h4>
              </div>

              <div className="space-y-6">
                {baseDrills.map(d => (
                  <div key={d.id} className="bg-[#f7f9f9] p-6 rounded-2xl border-2 border-[#cfd9de] space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-2.5 py-1 rounded border font-mono ${d.categoryColor}`}>
                        Q{d.id}. {d.category}
                      </span>
                      <span className="text-xs font-black text-[#536471]">
                        {drillAnswers[d.id] ? (drillResults[d.id] ? '正解 ✅' : '要復習 ❌') : '未回答'}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-black text-[#0f1419] leading-relaxed">{d.question}</p>
                      <div className="text-xs text-[#536471] font-bold mt-1">💡 思考ポイント：{d.point}</div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {d.options.map(opt => (
                        <button 
                          key={opt.key} 
                          onClick={() => handleAnswer(d.id, opt.key, d.correct)} 
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition ${
                            drillAnswers[d.id] === opt.key 
                              ? (opt.key === d.correct ? 'bg-emerald-600 border-emerald-600 text-white font-black' : 'bg-red-50 border-red-500 text-red-900 font-bold') 
                              : 'bg-white border-[#cfd9de] hover:border-blue-400 text-[#0f1419] font-bold'
                          }`}
                        >
                          <strong className="text-blue-600 mr-1.5 text-sm">{opt.key}.</strong> {opt.text}
                        </button>
                      ))}
                    </div>
                    {drillAnswers[d.id] && (
                      <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                        drillResults[d.id] ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold' : 'bg-red-50 border-2 border-red-400 text-red-950 font-bold'
                      }`}>
                        <div className="text-sm font-black mb-1">
                          {drillResults[d.id] ? '🎉 正解！ 正しい日置さんの思考です。' : `❌ 不正解（正解: ${d.correct}）`}
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
              <h3 className="text-2xl font-black text-[#0f1419] tracking-tight">
                ドキュメント投入 ＆ 全体自動同期
              </h3>
              <p className="text-xs text-[#536471] font-medium">
                PDFやTXTをドロップすると自動解析され、GitHubリポジトリに保存されるとともに、KPI・シミュレーター・クロニクルが全自動で更新されます。
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div 
              className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-600 p-10 rounded-2xl text-center space-y-4 transition-all cursor-pointer shadow-sm" 
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
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#0f1419]">
                  ここにPDF・TXTファイルをドラッグ＆ドロップ
                </h4>
                <p className="text-xs text-blue-600 font-bold">
                  クリックしてファイルを選択（Vercel上でGitHubに直接コミットされます）
                </p>
              </div>
              {isUploading && (
                <div className="text-sm font-black text-blue-600 animate-pulse">
                  ファイルを解析中... 日置さんの意思決定・KPIを抽出して全体同期中...
                </div>
              )}
            </div>

            {/* Synchronized Elements Checklist */}
            <div className="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 space-y-3.5 shadow-sm">
              <h4 className="text-sm font-black text-[#0f1419] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ドキュメント投入時に自動同期・更新される全項目</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#0f1419]">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 font-bold">
                  ✓ <span className="text-blue-700">1. 人物像サマリー</span>: 最新会議のテーマと重要方針がトップバナーに反映
                </div>
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 font-bold">
                  ✓ <span className="text-purple-700">2. 必見KPI指標</span>: 蓄積された最新数値（売上・社数・転換率）を集計
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 font-bold">
                  ✓ <span className="text-blue-700">3. 逆算シミュレーター</span>: 最新の転換率・目標値が即座に連動して再計算
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold">
                  ✓ <span className="text-slate-800">4. 完全クロニクル</span>: タイムラインの最上部に新規カードとして即座に追加
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 font-bold">
                  ✓ <span className="text-amber-700">5. 第二の日置さん学習ログ</span>: 日置さんの意思決定・名言が学習リストに蓄積
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 font-bold">
                  ✓ <span className="text-emerald-700">6. GitHub永続化</span>: 原本PDFと `chronicle.json` がリポジトリへ自動Push
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Clean Pure White Footer */}
      <footer className="border-t border-[#cfd9de] mt-16 py-8 px-4 text-center text-xs text-[#536471] bg-white font-medium">
        <p>株式会社VEXUM CFO Intelligence System | Balanced Semantic Multi-Color UI (#ffffff / #0f1419)</p>
      </footer>
    </div>
  );
}
