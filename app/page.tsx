'use client';

import React, { useState, useEffect, useMemo } from 'react';
import initialChronicleData from '../data/chronicle.json';
import { 
  UserCheck, Activity, CalendarDays, GraduationCap, 
  Download, UploadCloud, Search, Calculator, Sparkles, 
  Cpu, Layers, CheckCircle, Terminal, FileText, ArrowRight
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

  // Base Drills Data
  const baseDrills = [
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
    <div className="min-h-screen bg-white text-[#0f1419]">
      
      {/* Top Pure White Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#cfd9de] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#0f1419] text-white flex items-center justify-center font-bold text-base">
              H
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-[#0f1419]">
                  VEXUM CFO Intelligence Portal
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#f7f9f9] text-[#0f1419] border border-[#cfd9de]">
                  全{dynamicStats.totalMeetings}会議 同期中
                </span>
              </div>
              <p className="text-xs text-[#536471]">
                日置佑輔の経営哲学・CFO思考OS・全議事録分析 ＆「第二の日置さん」育成ガイド
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={exportJSON} 
              className="px-3 py-1.5 rounded-lg bg-white border border-[#cfd9de] hover:bg-[#f7f9f9] text-[#0f1419] transition text-xs font-semibold flex items-center space-x-1.5"
              title="JSONデータ保存"
            >
              <Download className="w-4 h-4 text-[#0f1419]" />
              <span>JSON保存</span>
            </button>
            <button 
              onClick={() => setActiveTab('manage')} 
              className="px-3.5 py-1.5 rounded-lg bg-[#0f1419] hover:bg-[#272c30] text-white transition text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>ドキュメント投入 / 同期</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto flex space-x-1 border-t border-[#cfd9de] pt-2 text-xs font-bold">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'bg-[#0f1419] text-white' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. 人物像 & CFO機能の全貌</span>
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'kpi' 
                ? 'bg-[#0f1419] text-white' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2. 必見KPI & 逆算シミュレーター</span>
          </button>
          <button 
            onClick={() => setActiveTab('chronicle')} 
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'chronicle' 
                ? 'bg-[#0f1419] text-white' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>3. 経営会議 完全クロニクル ({chronicle.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')} 
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'roadmap' 
                ? 'bg-[#0f1419] text-white' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>4. 「第二の日置さん」育成ロードマップ</span>
          </button>
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'manage' 
                ? 'bg-[#0f1419] text-white' 
                : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>5. ドキュメント投入 / GitHub同期</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">

        {/* ======================================================== */}
        {/* TAB 1: Profile & CFO Architecture */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Top Summary Banner */}
            <div className="bg-white border border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#f7f9f9] text-[#0f1419] text-xs font-bold border border-[#cfd9de]">
                    <span>株式会社VEXUM 代表取締役 兼 経営統括・CFO</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#0f1419] tracking-tight">
                    日置 佑輔 <span className="text-lg font-normal text-[#536471]">（Yusuke）</span>
                  </h2>
                  <p className="text-base text-[#0f1419] font-bold leading-relaxed">
                    「数字を共通言語にして、逆算とスピードで“成長の再現性”を証明し続ける」
                  </p>
                  <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                    AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、シリーズA調達（5〜10億円規模）と「1年後に有料顧客3,000社」という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
                  </p>
                </div>

                {/* Dynamic Summary Cards */}
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono text-center">
                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-3.5 rounded-xl">
                    <div className="text-[11px] text-[#536471] font-sans font-bold">全社目標 (1年後)</div>
                    <div className="text-lg font-extrabold text-[#0f1419]">有料 3,000社</div>
                    <div className="text-[10px] text-[#536471] font-sans font-medium">1億円ボーナス</div>
                  </div>
                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-3.5 rounded-xl">
                    <div className="text-[11px] text-[#536471] font-sans font-bold">資金調達目標</div>
                    <div className="text-lg font-extrabold text-[#0f1419]">5億〜10億円</div>
                    <div className="text-[10px] text-[#536471] font-sans font-medium">シリーズA</div>
                  </div>
                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-3.5 rounded-xl">
                    <div className="text-[11px] text-[#536471] font-sans font-bold">蓄積会議データ</div>
                    <div className="text-lg font-extrabold text-[#0f1419]">{dynamicStats.totalMeetings} 回分</div>
                    <div className="text-[10px] text-[#536471] font-sans font-medium">最新: {dynamicStats.latestDate}</div>
                  </div>
                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-3.5 rounded-xl">
                    <div className="text-[11px] text-[#536471] font-sans font-bold">意思決定ルール</div>
                    <div className="text-lg font-extrabold text-[#0f1419]">10分会議</div>
                    <div className="text-[10px] text-[#536471] font-sans font-medium">LINE即時承認</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Latest Decision Banner */}
              <div className="bg-[#f7f9f9] border-l-4 border-[#0f1419] p-3.5 rounded-r-lg flex items-start space-x-3 border border-[#cfd9de]">
                <Sparkles className="w-4 h-4 text-[#0f1419] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#0f1419]">最新の経営状況・日置さんの重要方針（{dynamicStats.latestDate}）：</div>
                  <div className="text-[#0f1419] leading-relaxed font-normal">
                    {dynamicStats.latestMeeting.yusuke_decisions?.[0] || dynamicStats.latestMeeting.summary || '経営数値の進捗確認と重要意思決定を推進中。'}
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Core Principles */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[#0f1419]" />
                <h3 className="text-xl font-bold text-[#0f1419]">日置流『思考OS（Thinking OS）』7大原則</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 01</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">すべては「逆算」で組む</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      ゴール（例：7月上駐100件）からリードタイム・各ファネル転換率・必要行動量へ分解。「上駐100件 ÷ 6掛け ＝ アポ160件 ＝ 初回接触200件」を即座に組み立てる。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
                    💬「リーダー12人必要なら今候補は何人いるか逆算して」
                  </div>
                </div>

                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 02</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">定性論を数字に翻訳させる</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      「頑張ります」を許さず「成約数 ＝ 相談数 × 成功率」のように基本の数式に落とし、ボトルネックが分母か転換率かを即特定させる。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
                    💬「それを数字で言うと？」「相談数×成功率でどこが課題？」
                  </div>
                </div>

                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 03</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">成長の再現性・スケールの証明</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      投資家が見ているのは「成長できることの証明」のみ。一発屋を排し、スキルTier1〜7ピラミッドや教育フロー1枚スライドなど仕組み化に執着。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
                    💬「投資家が見てるのは成長の証明。成長できてることが全て」
                  </div>
                </div>

                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 04</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">スピード＝唯一の競争優位</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      予算承認に1週間かけるな。LINEで喋りながら即承認。会議は10分以内ルール、秒単位でサイクルを回す。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
                    💬「喋りながらLINEで連絡して今すぐ承認しろ」
                  </div>
                </div>

                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 05</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">予実管理と「見込み3倍」ルール</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れる」。下振れを最重要リスクとして日次で監視。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
                    💬「見込み放置は資金調達と成長に直結して悪影響」
                  </div>
                </div>

                <div className="bg-white border border-[#cfd9de] p-5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#536471] font-mono mb-1">原則 06</div>
                    <h4 className="text-base font-bold text-[#0f1419] mb-2">利益構造・ユニットエコノミクス</h4>
                    <p className="text-xs text-[#0f1419] leading-relaxed font-normal">
                      売上だけでなく限界利益率・原価率（約66%改善）・案件粗利・LTVを見る。解約率70%時には新規採用を停止し社内育成に全集中。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e1e8ed] text-[11px] text-[#536471] font-medium">
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
            {/* Dynamic Simulator */}
            <div className="bg-white border border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#e1e8ed] pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#536471]">
                    Interactive Reverse Engineering Tool
                  </div>
                  <h3 className="text-xl font-bold text-[#0f1419]">
                    日置流『営業・供給 逆算シミュレーター』
                  </h3>
                </div>
                <p className="text-xs text-[#536471] max-w-md">
                  目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジック（転換率・リードタイム・リーダーキャパ）に基づいて必要なアクション量を即座に逆算します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 bg-[#f7f9f9] p-4 rounded-xl border border-[#cfd9de]">
                  <div>
                    <label className="block text-xs font-bold text-[#0f1419] mb-1">
                      目標 上駐開始数 (成約件数 / 月)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={targetDeals} 
                        onChange={e => setTargetDeals(Number(e.target.value))} 
                        className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-[#0f1419] font-mono font-bold text-lg focus:border-[#0f1419] focus:outline-none" 
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[#536471] font-bold">社</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#0f1419] mb-1">
                      <span>初期設計 → 上駐 転換率</span>
                      <span className="font-mono">{rateDeal}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="90" 
                      value={rateDeal} 
                      onChange={e => setRateDeal(Number(e.target.value))} 
                      className="w-full accent-[#0f1419]" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#0f1419] mb-1">
                      <span>アポ → 初期設計 転換率</span>
                      <span className="font-mono">{rateDesign}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="95" 
                      value={rateDesign} 
                      onChange={e => setRateDesign(Number(e.target.value))} 
                      className="w-full accent-[#0f1419]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f1419] mb-1">
                      リーダー1人あたり案件キャパ
                    </label>
                    <input 
                      type="number" 
                      value={leaderCap} 
                      onChange={e => setLeaderCap(Number(e.target.value))} 
                      className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-1.5 text-[#0f1419] font-mono text-sm focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">① 必要初期設計数 (先行指標)</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{requiredDesign}</div>
                    <div className="text-[10px] text-[#536471] font-medium">リードタイム: 約22日前</div>
                  </div>

                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">② 必要アポイント数</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{requiredAppos}</div>
                    <div className="text-[10px] text-[#536471] font-mono font-medium">日次: 約{dailyAppos}件</div>
                  </div>

                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">③ 必要見込み (3倍ルール)</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{pipeline3x}</div>
                    <div className="text-[10px] text-[#536471] font-bold">下振れ防止バッファ</div>
                  </div>

                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">④ 必要リーダー数</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{requiredLeaders}</div>
                    <div className="text-[10px] text-[#536471] font-medium">名 (案件管理体制)</div>
                  </div>

                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">⑤ 想定月次売上 (単価25万)</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{monthlySalesMan}万</div>
                    <div className="text-[10px] text-[#536471] font-medium">円 / 月</div>
                  </div>

                  <div className="bg-[#f7f9f9] border border-[#cfd9de] p-4 rounded-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-[#0f1419]">⑥ インターン給与上限 (50%)</div>
                    <div className="text-3xl font-extrabold text-[#0f1419] font-mono my-2">{internBudgetMan}万</div>
                    <div className="text-[10px] text-[#536471] font-medium">円 (財務規律上限)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Quadrants Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#cfd9de] p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-2">
                  <span className="font-bold text-xs text-[#0f1419]">A. 営業パイプライン指標</span>
                  <span className="text-[10px] text-[#536471] font-mono">Sales Funnel</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">初回接触・リード数</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">月200件</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">初期設計数【先行指標】</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">転換率 約80%</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">上駐開始数【必達マスト】</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">月64〜100件</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">見込みパイプライン</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">目標の3倍 (150%以上)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#cfd9de] p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-2">
                  <span className="font-bold text-xs text-[#0f1419]">B. 収益・ユニットエコノミクス</span>
                  <span className="text-[10px] text-[#536471] font-mono">Unit Economics</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">解約率 (チャーン)</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">約70% (要改善)</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">全社原価率</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">約66% (圧縮目標)</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">インターン給与規律</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">売上の50%以内</div>
                  </div>
                  <div className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de]">
                    <div className="text-[#536471] font-medium">CRM・財務乖離</div>
                    <div className="font-bold font-mono text-[#0f1419] text-sm">乖離ゼロ (完全一致)</div>
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
                <h3 className="text-xl font-bold text-[#0f1419] tracking-tight">
                  VEXUM経営会議 完全クロニクル
                </h3>
                <p className="text-xs text-[#536471]">
                  全 {chronicle.length} 件の会議議事録・意思決定ログ（ドキュメント投入時に自動同期）
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="キーワード・発言検索..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="bg-white border border-[#cfd9de] rounded-lg px-3 py-1.5 text-xs text-[#0f1419] placeholder-[#536471] focus:border-[#0f1419] focus:outline-none" 
                />
                <select 
                  value={selectedTag} 
                  onChange={e => setSelectedTag(e.target.value)} 
                  className="bg-white border border-[#cfd9de] rounded-lg px-2.5 py-1.5 text-xs text-[#0f1419] focus:outline-none"
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
                <div key={idx} className="bg-white border border-[#cfd9de] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-[#f7f9f9] text-[#0f1419] text-xs font-bold font-mono border border-[#cfd9de]">
                        第{idx + 1}回
                      </span>
                      <span className="text-xs font-bold text-[#0f1419]">
                        {m.display_date || m.date}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {(m.tags || []).map((t: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#f7f9f9] border border-[#cfd9de] text-[#0f1419] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#0f1419]">{m.theme}</h4>
                  <p className="text-xs text-[#0f1419] leading-relaxed font-normal">{m.summary}</p>
                  
                  {m.yusuke_decisions && m.yusuke_decisions.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[#e1e8ed]">
                      <div className="text-[11px] font-bold text-[#0f1419]">日置さんの重要意思決定・指摘：</div>
                      <ul className="text-xs text-[#0f1419] space-y-1 list-disc list-inside font-normal">
                        {m.yusuke_decisions.map((d: string, di: number) => (
                          <li key={di}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.quotes && m.quotes.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {m.quotes.map((q: string, qi: number) => (
                        <div key={qi} className="bg-[#f7f9f9] border-l-2 border-[#0f1419] p-2.5 rounded text-xs text-[#0f1419] italic font-medium">
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
              <h3 className="text-xl font-bold text-[#0f1419] tracking-tight">
                「第二の日置さん」育成ロードマップ ＆ 実践ドリル
              </h3>
              <p className="text-xs text-[#536471]">
                ドキュメントが追加されるたびに、新しい意思決定や論点が学習データとして蓄積されます。
              </p>
            </div>

            {/* Dynamic Learning Insights */}
            <div className="bg-white border border-[#cfd9de] rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-[#0f1419] flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>全{dynamicStats.totalMeetings}回の会議から蓄積された日置流「意思決定・実践ログ」</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-h-60 overflow-y-auto pr-1">
                {dynamicStats.allDecisions.slice(0, 10).map((dec, i) => (
                  <div key={i} className="bg-[#f7f9f9] p-2.5 rounded border border-[#cfd9de] space-y-1">
                    <div className="text-[10px] font-bold text-[#536471]">{dec.meetingDate}</div>
                    <div className="text-[#0f1419] font-normal">{dec.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Drills */}
            <div className="bg-white border border-[#cfd9de] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e1e8ed] pb-3">
                <h4 className="text-base font-bold text-[#0f1419]">
                  日置式 実践思考ドリル ({correctCount} / {baseDrills.length} 正解)
                </h4>
              </div>

              <div className="space-y-6">
                {baseDrills.map(d => (
                  <div key={d.id} className="bg-[#f7f9f9] p-5 rounded-xl border border-[#cfd9de] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#0f1419] border border-[#cfd9de] font-mono">
                        Q{d.id}. {d.category}
                      </span>
                      <span className="text-xs font-bold text-[#536471]">
                        {drillAnswers[d.id] ? (drillResults[d.id] ? '正解 ✅' : '要復習 ❌') : '未回答'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#0f1419]">{d.question}</p>
                    <div className="space-y-2 text-xs">
                      {d.options.map(opt => (
                        <button 
                          key={opt.key} 
                          onClick={() => handleAnswer(d.id, opt.key, d.correct)} 
                          className={`w-full text-left p-3 rounded-lg border transition ${
                            drillAnswers[d.id] === opt.key 
                              ? (opt.key === d.correct ? 'bg-[#0f1419] text-white font-bold' : 'bg-rose-100 text-rose-900 border-rose-300 font-medium') 
                              : 'bg-white border-[#cfd9de] hover:bg-[#f7f9f9] text-[#0f1419] font-medium'
                          }`}
                        >
                          <strong className="mr-1">{opt.key}.</strong> {opt.text}
                        </button>
                      ))}
                    </div>
                    {drillAnswers[d.id] && (
                      <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                        drillResults[d.id] ? 'bg-white text-[#0f1419] border border-[#cfd9de] font-medium' : 'bg-rose-50 text-rose-900 border border-rose-200 font-medium'
                      }`}>
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
              <h3 className="text-xl font-bold text-[#0f1419] tracking-tight">
                ドキュメント投入 ＆ 全体自動同期
              </h3>
              <p className="text-xs text-[#536471]">
                PDFやTXTをドロップすると自動解析され、GitHubリポジトリに保存されるとともに、KPI・シミュレーター・クロニクルが全自動で更新されます。
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div 
              className="bg-white border-2 border-dashed border-[#cfd9de] hover:border-[#0f1419] p-8 rounded-2xl text-center space-y-4 transition-all cursor-pointer" 
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
              <div className="w-14 h-14 rounded-xl bg-[#f7f9f9] text-[#0f1419] flex items-center justify-center mx-auto border border-[#cfd9de]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0f1419]">
                  ここにPDF・TXTファイルをドラッグ＆ドロップ
                </h4>
                <p className="text-xs text-[#536471]">
                  またはクリックしてファイルを選択（Vercel上でGitHubに直接コミットされます）
                </p>
              </div>
              {isUploading && (
                <div className="text-xs font-bold text-[#0f1419] animate-pulse">
                  ファイルを解析中... 日置さんの意思決定・KPIを抽出して全体同期中...
                </div>
              )}
            </div>

            {/* Synchronized Elements Checklist */}
            <div className="bg-white border border-[#cfd9de] rounded-xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-[#0f1419] flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#0f1419]" />
                <span>ドキュメント投入時に自動同期・更新される全項目</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#0f1419]">
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>1. 人物像サマリー</strong>: 最新会議のテーマと重要方針がトップバナーに反映
                </div>
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>2. 必見KPI指標</strong>: 蓄積された最新数値（売上・社数・転換率）を集計
                </div>
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>3. 逆算シミュレーター</strong>: 最新の転換率・目標値が即座に連動して再計算
                </div>
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>4. 完全クロニクル</strong>: タイムラインの最上部に新規カードとして即座に追加
                </div>
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>5. 第二の日置さん学習ログ</strong>: 日置さんの意思決定・名言が学習リストに蓄積
                </div>
                <div className="p-2.5 bg-[#f7f9f9] rounded border border-[#cfd9de]">
                  ✓ <strong>6. GitHub永続化</strong>: 原本PDFと `chronicle.json` がリポジトリへ自動Push
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Clean Pure White Footer */}
      <footer className="border-t border-[#cfd9de] mt-16 py-8 px-4 text-center text-xs text-[#536471] bg-white">
        <p>株式会社VEXUM CFO Intelligence System | Clean Pure White UI (#ffffff / #0f1419)</p>
      </footer>
    </div>
  );
}
