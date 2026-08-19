import json, os

def generate_html(chronicle_data, output_path):
    chronicle_json_str = json.dumps(chronicle_data, ensure_ascii=False)

    drills_data = [
        {
            "id": 1,
            "category": "見込み管理",
            "categoryColor": "bg-amber-100 text-amber-800 border-amber-300",
            "question": "事業部から「今月の目標100社に対して、確度の高い見込みがちょうど100社集まりました！必達を目指して頑張ります！」と報告がありました。日置さんならどう返しますか？",
            "options": [
                {"key": "A", "text": "「素晴らしい！メンバーのモチベーションを高めて、1社も落とさないよう気合いでクロージングしてください。」"},
                {"key": "B", "text": "「見込み100%だと必ず下振れる。見込みは目標の3倍（300社＝150%〜300%）持っておかないとダメ。リード獲得の分母をどう増やすかすぐ再設計して。」"},
                {"key": "C", "text": "「100社達成したら予算を増額するので、来月の目標を150社に引き上げておいてください。」"}
            ],
            "correct": "B",
            "point": "見込みは目標の3倍（300%）積むのがCFOの鉄則",
            "explanation": "【日置流の鉄則】「見込みは目標の3倍持て」。見込み100%は商談途中でのドロップや稟議遅延により確実に未達に終わります。定性的な気合いではなく、確率論として分母を3倍に積むのがCFOの規律です（2026/5/8会議など）。"
        },
        {
            "id": 2,
            "category": "財務・CRM整合性",
            "categoryColor": "bg-blue-100 text-blue-800 border-blue-300",
            "question": "財務担当から「CRM上の今月売上見込みは3,000万円ですが、実際の通帳入金実績は直近3ヶ月間2,000万円で横ばいです」と報告がありました。日置さんの第一声として最も適切なものは？",
            "options": [
                {"key": "A", "text": "「入金は売上計上から遅れて入ってくるものだから、来月まで様子を見ましょう。」"},
                {"key": "B", "text": "「売上の入金が3ヶ月横ばいなこととCRMの数字をどう合わせるか。あの数字はめっちゃ大事。CRMのステータス定義と入金のギャップを今すぐ突合して。」"},
                {"key": "C", "text": "「経理のシステムが古いのが原因なので、新しい会計クラウドを導入して自動化しましょう。」"}
            ],
            "correct": "B",
            "point": "CRMと財務実績の乖離ゼロを徹底追求",
            "explanation": "【日置流の鉄則】CRMと財務会計の数値乖離を極端に嫌います。入金が横ばいなのにCRMの数字だけが先行している状態は予実の崩壊を意味するため、「あの数字はめっちゃ大事」とステータス定義と入金の即時突合を要求します（2026/5/1会議）。"
        },
        {
            "id": 3,
            "category": "ユニットエコノミクス",
            "categoryColor": "bg-emerald-100 text-emerald-800 border-emerald-300",
            "question": "新規顧客は順調に増えているものの、解約率（チャーン）が約70%と高く、人材の定着に課題が出ています。人事部が「もっと採用広告費を増やして母集団を増やしたい」と提案してきました。日置さんならどう判断しますか？",
            "options": [
                {"key": "A", "text": "「穴の空いたバケツに水を注ぐな。新規採用を一時ストップし、予算を既存メンバーの社内育成と定着プログラムに全集中させる。」"},
                {"key": "B", "text": "「解約される以上のペースで採用すればスケールするので、広告予算を2倍に増やしましょう。」"},
                {"key": "C", "text": "「解約したクライアントに対して割引プランを提示して引き止めを行いましょう。」"}
            ],
            "correct": "A",
            "point": "解約率高騰時は採用停止・育成全集中で穴を塞ぐ",
            "explanation": "【日置流の鉄則】解約率70%の状態で採用を増やせば採用コストと原価率が悪化するだけです。日置さんは2026/7/17の経営会議で実際に「新規採用を一時停止し、予算を社内育成に全集中する」という外科手術的ピボットを決断しました。"
        },
        {
            "id": 4,
            "category": "意思決定スピード",
            "categoryColor": "bg-purple-100 text-purple-800 border-purple-300",
            "question": "マーケティング担当から「展示会出展やWeb広告の追加予算200万円の稟議書を作成したので、来週の経営会議でご審議いただけますか？」と言われました。日置さんの対応は？",
            "options": [
                {"key": "A", "text": "「来週の経営会議の第1アジェンダにして、役員全員で慎重に議論しましょう。」"},
                {"key": "B", "text": "「ベンチャーで予算承認に1週間かけるな。LINEグループで喋りながら数字を投げて、今その場で即判断して承認しろ。」"},
                {"key": "C", "text": "「一旦ROIのシミュレーションを3パターン作って来月末までに再提出してください。」"}
            ],
            "correct": "B",
            "point": "スピード＝唯一の競争優位。LINEで即決承認",
            "explanation": "【日置流の鉄則】「スピードは唯一の競争優位」。日置さんは2026/7/3の会議で、マーケティング予算をLINEグループを通じて即時承認するフローを制定し、「承認に時間をかける遅さそのものがリスク」と指導しました。"
        },
        {
            "id": 5,
            "category": "組織・会議規律",
            "categoryColor": "bg-rose-100 text-rose-800 border-rose-300",
            "question": "毎週の経営会議で各事業部の状況報告が長引き、毎回1時間を超えてしまっています。日置さんが導入したルールは？",
            "options": [
                {"key": "A", "text": "「会議時間を10分以内に制限する。状況報告は事前に数字で済ませ、本質的な意思決定のみを行う場にする。」"},
                {"key": "B", "text": "「時間を無制限にして、全員が納得するまで徹底的に議論を尽くす。」"},
                {"key": "C", "text": "「経営会議の開催頻度を月1回に減らし、各事業部に全権委任する。」"}
            ],
            "correct": "A",
            "point": "会議は10分以内。報告は数字で事前共有、場は意思決定のみ",
            "explanation": "【日置流の鉄則】「会議は10分以内ルール」（2026/6/12会議）。定性的な状況報告を長々と聞く時間は無駄であり、事前に数字を共有した上で、ボトルネックに対する意思決定だけを秒で下すカルチャーを徹底しました。"
        }
    ]
    drills_json_str = json.dumps(drills_data, ensure_ascii=False)

    html_content = f'''<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VEXUM CFO Intelligence Portal | 日置佑輔 CFO思考OS ＆ 全会議分析</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- PDF.js for in-browser PDF parsing -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    </script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        html, body {{
            background-color: #ffffff !important;
            color: #0f1419 !important;
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            margin: 0;
            padding: 0;
        }}
        .font-mono {{
            font-family: 'JetBrains Mono', monospace;
        }}
        ::-webkit-scrollbar {{
            width: 6px;
            height: 6px;
        }}
        ::-webkit-scrollbar-track {{
            background: #ffffff;
        }}
        ::-webkit-scrollbar-thumb {{
            background: #cfd9de;
            border-radius: 3px;
        }}
        .tab-btn.active {{
            background: #0f1419;
            color: #ffffff;
        }}
    </style>
</head>
<body class="bg-white text-[#0f1419] min-h-screen">

    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-[#cfd9de] px-4 lg:px-8 py-3.5 shadow-sm">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-xl bg-[#0f1419] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    H
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h1 class="text-lg font-black tracking-tight text-[#0f1419]">
                            VEXUM CFO Intelligence Portal
                        </h1>
                        <span id="header-badge" class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            同期中
                        </span>
                    </div>
                    <p class="text-xs text-[#536471] font-medium">
                        日置佑輔の経営哲学・CFO思考OS・全議事録分析 ＆「第二の日置さん」育成ガイド
                    </p>
                </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center space-x-2.5">
                <button onclick="exportDataJSON()" class="px-3.5 py-2 rounded-lg bg-white border border-[#cfd9de] hover:bg-[#f7f9f9] text-[#0f1419] transition text-xs font-bold flex items-center space-x-1.5 shadow-sm" title="データエクスポート">
                    <i data-lucide="download" class="w-4 h-4 text-[#536471]"></i>
                    <span>JSON保存</span>
                </button>
                <button onclick="switchTab('tab-manage')" class="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                    <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                    <span>ドキュメント投入 / 同期</span>
                </button>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="max-w-7xl mx-auto mt-3.5 overflow-x-auto flex space-x-1 border-t border-[#cfd9de] pt-2 text-xs font-bold">
            <button onclick="switchTab('tab-profile')" id="btn-tab-profile" class="tab-btn active px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]">
                <i data-lucide="user-check" class="w-4 h-4"></i>
                <span>1. 人物像 & CFO思考OS</span>
            </button>
            <button onclick="switchTab('tab-kpi')" id="btn-tab-kpi" class="tab-btn px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]">
                <i data-lucide="activity" class="w-4 h-4"></i>
                <span>2. 必見KPI & 逆算シミュレーター</span>
            </button>
            <button onclick="switchTab('tab-chronicle')" id="btn-tab-chronicle" class="tab-btn px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]">
                <i data-lucide="calendar-days" class="w-4 h-4"></i>
                <span>3. 全会議クロニクル</span>
            </button>
            <button onclick="switchTab('tab-roadmap')" id="btn-tab-roadmap" class="tab-btn px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm text-[#536471] hover:text-[#0f1419] hover:bg-[#f7f9f9]">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                <span>4. 「第二の日置さん」思考ドリル</span>
            </button>
            <button onclick="switchTab('tab-manage')" id="btn-tab-manage" class="tab-btn px-4 py-2.5 rounded-lg transition flex items-center space-x-2 whitespace-nowrap text-sm text-blue-600 hover:bg-blue-50">
                <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                <span>5. ドキュメント投入 / 同期</span>
            </button>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 bg-white">

        <!-- TAB 1: Profile -->
        <section id="tab-profile" class="tab-content block space-y-10">
            <div class="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div class="space-y-3.5 max-w-3xl">
                        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-[#0f1419] text-xs font-bold border border-[#cfd9de]">
                            <span>株式会社VEXUM 代表取締役 兼 経営統括・CFO</span>
                        </div>
                        <h2 class="text-3xl lg:text-4xl font-black text-[#0f1419] tracking-tight">
                            日置 佑輔 <span class="text-xl font-bold text-[#536471]">（Yusuke）</span>
                        </h2>
                        <p class="text-lg lg:text-xl font-bold leading-relaxed text-[#0f1419]">
                            「数字を共通言語にして、<span class="text-blue-600 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded">逆算</span> と <span class="text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded">スピード</span> で“成長の再現性”を証明し続ける」
                        </p>
                        <p class="text-sm text-[#334155] leading-relaxed">
                            AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、<strong class="text-emerald-700 font-bold">シリーズA調達（5〜10億円）</strong>と<strong class="text-blue-700 font-bold">「1年後に有料顧客3,000社」</strong>という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0 font-mono text-center">
                        <div class="bg-blue-50/70 border-2 border-blue-200 p-4 rounded-xl shadow-sm">
                            <div class="text-xs text-blue-800 font-sans font-bold flex items-center justify-center space-x-1">
                                <i data-lucide="target" class="w-3.5 h-3.5 text-blue-600"></i>
                                <span>全社ゴール (1年後)</span>
                            </div>
                            <div class="text-2xl font-black text-blue-700 mt-1">有料 3,000社</div>
                            <div class="text-xs text-blue-900 font-sans font-bold mt-0.5">達成ボーナス 1億円</div>
                        </div>

                        <div class="bg-emerald-50/70 border-2 border-emerald-200 p-4 rounded-xl shadow-sm">
                            <div class="text-xs text-emerald-800 font-sans font-bold flex items-center justify-center space-x-1">
                                <i data-lucide="coins" class="w-3.5 h-3.5 text-emerald-600"></i>
                                <span>資金調達目標</span>
                            </div>
                            <div class="text-2xl font-black text-emerald-700 mt-1">5億〜10億円</div>
                            <div class="text-xs text-emerald-900 font-sans font-bold mt-0.5">シリーズA 大型調達</div>
                        </div>

                        <div class="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl shadow-sm">
                            <div class="text-xs text-slate-600 font-sans font-bold flex items-center justify-center space-x-1">
                                <i data-lucide="layers" class="w-3.5 h-3.5 text-slate-600"></i>
                                <span>蓄積会議データ</span>
                            </div>
                            <div id="summary-meeting-count" class="text-2xl font-black text-slate-900 mt-1">-</div>
                            <div class="text-xs text-slate-500 font-sans font-medium mt-0.5">全件同期中</div>
                        </div>

                        <div class="bg-amber-50/70 border-2 border-amber-200 p-4 rounded-xl shadow-sm">
                            <div class="text-xs text-amber-800 font-sans font-bold flex items-center justify-center space-x-1">
                                <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-600"></i>
                                <span>意思決定ルール</span>
                            </div>
                            <div class="text-2xl font-black text-amber-700 mt-1">10分会議</div>
                            <div class="text-xs text-amber-900 font-sans font-bold mt-0.5">LINE即時承認</div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50/50 border-l-4 border-blue-600 p-4 rounded-r-xl flex items-start space-x-3 border-y border-r border-blue-200">
                    <i data-lucide="sparkles" class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"></i>
                    <div class="space-y-1">
                        <div class="text-xs font-black text-blue-800 uppercase tracking-wide">
                            最新の経営進捗・日置さんの重要方針（<span id="latest-meeting-date">-</span>）：
                        </div>
                        <div id="latest-decision-text" class="text-sm text-[#0f1419] font-bold leading-relaxed">-</div>
                    </div>
                </div>
            </div>

            <!-- Principles -->
            <div class="space-y-5">
                <div class="flex items-center justify-between border-b border-[#cfd9de] pb-3">
                    <div class="flex items-center space-x-2">
                        <i data-lucide="cpu" class="w-6 h-6 text-blue-600"></i>
                        <h3 class="text-2xl font-black text-[#0f1419] tracking-tight">日置流『思考OS（Thinking OS）』7大原則</h3>
                    </div>
                    <span class="text-xs text-[#536471] font-bold hidden sm:inline">
                        「第二の日置さん」を目指すための行動・判断基準
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div class="bg-white border-2 border-blue-200 hover:border-blue-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">原則 01</span>
                                <span class="text-[11px] font-bold text-blue-600">【戦略・目標設定】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2">すべては「<span class="text-blue-600">逆算</span>」で組む</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                ゴール（例：7月上駐100件）から逆算してリードタイム・転換率・行動量へ分解。<strong class="text-blue-700">「上駐100件 ÷ 6掛け ＝ アポ160件 ＝ 初回接触200件」</strong>を即座に組み立てる。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-blue-100 text-xs font-bold text-blue-800 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                            💬「リーダー12人必要なら今候補は何人いるか逆算して」
                        </div>
                    </div>

                    <div class="bg-white border-2 border-purple-200 hover:border-purple-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-mono">原則 02</span>
                                <span class="text-[11px] font-bold text-purple-600">【数値化・言語化】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2">定性論を<span class="text-purple-600">数字に翻訳</span>させる</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                「頑張ります」などの定性論を禁止。<strong class="text-purple-700">「成約数 ＝ 相談数 × 成功率」</strong>の基本数式に落とし込み、ボトルネックが分母か転換率かを即特定させる。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-purple-100 text-xs font-bold text-purple-800 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                            💬「それを数字で言うと？」「相談数×成功率でどこが課題？」
                        </div>
                    </div>

                    <div class="bg-white border-2 border-indigo-200 hover:border-indigo-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">原則 03</span>
                                <span class="text-[11px] font-bold text-indigo-600">【投資家目線・仕組み化】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2">成長の<span class="text-indigo-600">再現性・スケール</span>の証明</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                投資家が見ているのは<strong class="text-indigo-700">「成長できることの証明」</strong>のみ。一発屋を排し、スキルTier1〜7ピラミッドや教育フロー1枚スライドなど仕組み化に執着。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-indigo-100 text-xs font-bold text-indigo-800 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                            💬「投資家が見てるのは成長の証明。成長できてることが全て」
                        </div>
                    </div>

                    <div class="bg-white border-2 border-amber-200 hover:border-amber-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">原則 04</span>
                                <span class="text-[11px] font-bold text-amber-600">【実行速度・組織】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2"><span class="text-amber-600">スピード</span>＝唯一の競争優位</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                予算承認に1週間かけるな。<strong class="text-amber-700">LINEで喋りながら即承認</strong>。会議は10分以内ルール、秒単位で意思決定サイクルを回す。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-amber-100 text-xs font-bold text-amber-800 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                            💬「喋りながらLINEで連絡して今すぐ承認しろ」
                        </div>
                    </div>

                    <div class="bg-white border-2 border-orange-200 hover:border-orange-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-mono">原則 05</span>
                                <span class="text-[11px] font-bold text-orange-600">【予実管理・リスク予防】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2">予実管理と「<span class="text-orange-600">見込み3倍</span>」ルール</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                <strong class="text-orange-700">「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れる」</strong>。下振れを資金調達と成長への最重要リスクとして日次で監視。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-orange-100 text-xs font-bold text-orange-800 bg-orange-50/60 p-2.5 rounded-lg border border-orange-100">
                            💬「見込み放置は資金調達と成長に直結して悪影響」
                        </div>
                    </div>

                    <div class="bg-white border-2 border-emerald-200 hover:border-emerald-500 transition p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">原則 06</span>
                                <span class="text-[11px] font-bold text-emerald-600">【利益率・財務規律】</span>
                            </div>
                            <h4 class="text-lg font-black text-[#0f1419] mb-2"><span class="text-emerald-700">利益構造</span>・ユニットエコノミクス</h4>
                            <p class="text-sm text-[#334155] leading-relaxed">
                                売上だけでなく限界利益率・原価率・案件粗利を見る。<strong class="text-emerald-700">インターン給与上限50%や全社原価率66%圧縮</strong>を徹底し、粗利を残す体制を確立。
                            </p>
                        </div>
                        <div class="pt-3 border-t border-emerald-100 text-xs font-bold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                            💬「初月売上ではなく原価を引いた後の案件利益率で判断しろ」
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 2: Dynamic KPI & Simulator -->
        <section id="tab-kpi" class="tab-content hidden space-y-10">
            <div class="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#e1e8ed] pb-4">
                    <div>
                        <div class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center space-x-1">
                            <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
                            <span>Interactive Reverse Engineering Tool</span>
                        </div>
                        <h3 class="text-2xl font-black text-[#0f1419]">
                            日置流『営業・供給 逆算シミュレーター』
                        </h3>
                    </div>
                    <p class="text-xs text-[#536471] font-medium max-w-md">
                        目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジック（転換率・リードタイム・リーダーキャパ）に基づいて必要なアクション量を即座に逆算します。
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-4 bg-blue-50/30 p-5 rounded-2xl border-2 border-blue-200">
                        <div>
                            <label class="block text-xs font-black text-blue-900 mb-1.5">
                                目標 上駐開始数 (成約件数 / 月)
                            </label>
                            <div class="relative">
                                <input type="number" id="sim-target-deals" value="100" class="w-full bg-white border-2 border-blue-500 rounded-xl px-3.5 py-2.5 text-blue-700 font-mono font-black text-2xl focus:outline-none shadow-sm" oninput="calculateReverseModel()">
                                <span class="absolute right-3.5 top-3 text-sm text-blue-900 font-bold">社</span>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold text-slate-800 mb-1">
                                <span>初期設計 → 上駐 転換率</span>
                                <span id="sim-rate-deal-val" class="font-mono text-blue-600 font-bold">63%</span>
                            </div>
                            <input type="range" id="sim-rate-deal" min="30" max="90" value="63" class="w-full accent-blue-600" oninput="calculateReverseModel()">
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold text-slate-800 mb-1">
                                <span>アポ → 初期設計 転換率</span>
                                <span id="sim-rate-design-val" class="font-mono text-blue-600 font-bold">80%</span>
                            </div>
                            <input type="range" id="sim-rate-design" min="40" max="95" value="80" class="w-full accent-blue-600" oninput="calculateReverseModel()">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">
                                リーダー1人あたり案件キャパ
                            </label>
                            <input type="number" id="sim-leader-cap" value="8" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm font-bold focus:outline-none" oninput="calculateReverseModel()">
                        </div>
                    </div>

                    <div class="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                        <div class="bg-blue-50/70 border-2 border-blue-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-bold text-blue-800">① 必要初期設計数 (先行指標)</div>
                            <div id="res-design-count" class="text-3xl lg:text-4xl font-black text-blue-700 font-mono my-2">160</div>
                            <div class="text-[11px] text-blue-900 font-medium">リードタイム: 約22日前</div>
                        </div>

                        <div class="bg-purple-50/70 border-2 border-purple-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-bold text-purple-800">② 必要アポイント数</div>
                            <div id="res-appo-count" class="text-3xl lg:text-4xl font-black text-purple-700 font-mono my-2">200</div>
                            <div id="res-appo-daily" class="text-[11px] text-purple-900 font-mono font-bold">日次: 約8.0件</div>
                        </div>

                        <div class="bg-amber-50/70 border-2 border-amber-300 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-black text-amber-800">③ 必要見込み (3倍ルール)</div>
                            <div id="res-pipeline-3x" class="text-3xl lg:text-4xl font-black text-amber-700 font-mono my-2">300</div>
                            <div class="text-[11px] text-amber-900 font-black">下振れ防止バッファ</div>
                        </div>

                        <div class="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-bold text-slate-700">④ 必要リーダー数</div>
                            <div id="res-leader-count" class="text-3xl lg:text-4xl font-black text-slate-900 font-mono my-2">13</div>
                            <div class="text-[11px] text-slate-600 font-medium">名 (案件管理体制)</div>
                        </div>

                        <div class="bg-emerald-50/70 border-2 border-emerald-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-bold text-emerald-800">⑤ 想定月次売上 (単価25万)</div>
                            <div id="res-monthly-sales" class="text-3xl lg:text-4xl font-black text-emerald-700 font-mono my-2">2,500万</div>
                            <div class="text-[11px] text-emerald-900 font-medium">円 / 月</div>
                        </div>

                        <div class="bg-red-50/70 border-2 border-red-200 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div class="text-xs font-bold text-red-800">⑥ インターン給与上限 (50%)</div>
                            <div id="res-intern-budget" class="text-3xl lg:text-4xl font-black text-red-600 font-mono my-2">1,250万</div>
                            <div class="text-[11px] text-red-900 font-bold">円 (財務規律上限)</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TAB 3: Chronicle -->
        <section id="tab-chronicle" class="tab-content hidden space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 class="text-2xl font-black text-[#0f1419] tracking-tight">
                        VEXUM経営会議 完全クロニクル
                    </h3>
                    <p class="text-xs text-[#536471] font-medium">
                        蓄積されたすべての会議議事録・意思決定ログ（全 <span id="chronicle-total-count" class="font-bold text-blue-600">0</span> 件）
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <input type="text" id="chronicle-search" placeholder="キーワード・発言検索..." class="bg-white border-2 border-[#cfd9de] rounded-xl px-3.5 py-2 text-xs font-bold text-[#0f1419] placeholder-[#536471] focus:border-blue-500 focus:outline-none shadow-sm" oninput="filterChronicle()">
                    <select id="chronicle-tag-filter" class="bg-white border-2 border-[#cfd9de] rounded-xl px-3 py-2 text-xs font-bold text-[#0f1419] focus:outline-none shadow-sm" onchange="filterChronicle()">
                        <option value="ALL">全てのタグ</option>
                        <option value="逆算設計">逆算設計</option>
                        <option value="資金調達">資金調達</option>
                        <option value="ユニットエコノミクス">ユニットエコノミクス</option>
                        <option value="3000社目標">3000社目標</option>
                    </select>
                </div>
            </div>

            <div id="chronicle-container" class="space-y-4"></div>
        </section>

        <!-- TAB 4: Roadmap & Drills -->
        <section id="tab-roadmap" class="tab-content hidden space-y-10">
            <div class="space-y-1">
                <h3 class="text-2xl font-black text-[#0f1419] tracking-tight">
                    「第二の日置さん」育成ロードマップ ＆ 実践ドリル
                </h3>
                <p class="text-xs text-[#536471] font-medium">
                    ドキュメントが追加されるたびに、新しい意思決定や論点が学習データとして蓄積されます。
                </p>
            </div>

            <div class="bg-white border-2 border-blue-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h4 class="text-base font-black text-blue-900 flex items-center space-x-2">
                    <i data-lucide="layers" class="w-5 h-5 text-blue-600"></i>
                    <span>全会議から蓄積された日置流「意思決定・実践ログ」</span>
                </h4>
                <div id="dynamic-decisions-container" class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-h-72 overflow-y-auto pr-1"></div>
            </div>

            <div class="bg-white border-2 border-[#cfd9de] rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                <div class="flex items-center justify-between border-b border-[#e1e8ed] pb-4">
                    <h4 class="text-lg font-black text-[#0f1419]">
                        日置式 実践思考ドリル (<span id="drill-score" class="font-black text-emerald-600">0</span> / 5 正解)
                    </h4>
                </div>
                <div id="quiz-container" class="space-y-6"></div>
            </div>
        </section>

        <!-- TAB 5: Manage & Sync -->
        <section id="tab-manage" class="tab-content hidden space-y-8">
            <div class="space-y-1">
                <h3 class="text-2xl font-black text-[#0f1419] tracking-tight">
                    ドキュメント投入 ＆ 全体自動同期
                </h3>
                <p class="text-xs text-[#536471] font-medium">
                    PDFやTXTをドロップすると自動解析され、KPI・シミュレーター・クロニクルが全自動で更新されます。
                </p>
            </div>

            <div id="drop-zone" class="bg-white border-2 border-dashed border-blue-300 hover:border-blue-600 p-10 rounded-2xl text-center space-y-4 transition-all cursor-pointer shadow-sm" onclick="document.getElementById('file-drop-input').click()">
                <input type="file" id="file-drop-input" accept=".pdf,.txt" multiple class="hidden" onchange="handleFileDropSelect(event)">
                <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                    <i data-lucide="upload-cloud" class="w-8 h-8"></i>
                </div>
                <div class="space-y-1">
                    <h4 class="text-lg font-black text-[#0f1419]">
                        ここにPDF・TXTファイルをドラッグ＆ドロップ
                    </h4>
                    <p class="text-xs text-blue-600 font-bold">
                        クリックしてファイルを選択（即座に全画面のデータが自動更新されます）
                    </p>
                </div>
                <div id="drop-loading-status" class="hidden text-sm font-black text-blue-600 animate-pulse">
                    ファイルを解析中... 日置さんの意思決定・KPIを抽出して全体同期中...
                </div>
            </div>
        </section>

    </main>

    <!-- Clean Pure White Footer -->
    <footer class="border-t border-[#cfd9de] mt-16 py-8 px-4 text-center text-xs text-[#536471] bg-white font-medium">
        <p>株式会社VEXUM CFO Intelligence System | Balanced Semantic Multi-Color UI (#ffffff / #0f1419)</p>
    </footer>

    <!-- Core Interactive JavaScript -->
    <script>
        let chronicleData = {chronicle_json_str};
        const drillsData = {drills_json_str};
        let drillResults = {{}};

        // LocalStorage sync
        const storedData = localStorage.getItem('vexum_chronicle_data');
        if (storedData) {{
            try {{
                chronicleData = JSON.parse(storedData);
            }} catch(e) {{
                console.error("Storage parse error", e);
            }}
        }}

        function switchTab(tabId) {{
            document.querySelectorAll('.tab-content').forEach(el => {{
                el.classList.add('hidden');
                el.classList.remove('block');
            }});
            document.querySelectorAll('.tab-btn').forEach(btn => {{
                btn.classList.remove('active');
            }});

            const targetSection = document.getElementById(tabId);
            if (targetSection) {{
                targetSection.classList.remove('hidden');
                targetSection.classList.add('block');
            }}

            const targetBtn = document.getElementById('btn-' + tabId);
            if (targetBtn) {{
                targetBtn.classList.add('active');
            }}

            lucide.createIcons();
            window.scrollTo({{ top: 0, behavior: 'smooth' }});
        }}

        function calculateReverseModel() {{
            const targetDeals = parseInt(document.getElementById('sim-target-deals').value) || 0;
            const rateDealPct = parseInt(document.getElementById('sim-rate-deal').value) || 63;
            const rateDesignPct = parseInt(document.getElementById('sim-rate-design').value) || 80;
            const leaderCap = parseInt(document.getElementById('sim-leader-cap').value) || 8;

            document.getElementById('sim-rate-deal-val').textContent = rateDealPct + '%';
            document.getElementById('sim-rate-design-val').textContent = rateDesignPct + '%';

            const requiredDesign = Math.round(targetDeals / (rateDealPct / 100));
            const requiredAppos = Math.round(requiredDesign / (rateDesignPct / 100));
            const dailyAppos = (requiredAppos / 20).toFixed(1);
            const pipeline3x = Math.round(targetDeals * 3);
            const requiredLeaders = Math.ceil(targetDeals / leaderCap);
            const monthlySalesMan = (targetDeals * 25).toLocaleString();
            const internBudgetMan = (targetDeals * 25 * 0.5).toLocaleString();

            document.getElementById('res-design-count').textContent = requiredDesign.toLocaleString();
            document.getElementById('res-appo-count').textContent = requiredAppos.toLocaleString();
            document.getElementById('res-appo-daily').textContent = `日次: 約${{dailyAppos}}件`;
            document.getElementById('res-pipeline-3x').textContent = pipeline3x.toLocaleString();
            document.getElementById('res-leader-count').textContent = requiredLeaders.toLocaleString();
            document.getElementById('res-monthly-sales').textContent = monthlySalesMan + '万';
            document.getElementById('res-intern-budget').textContent = internBudgetMan + '万';
        }}

        function renderDynamicStats() {{
            const latest = chronicleData[0] || {{}};
            const totalEl = document.getElementById('summary-meeting-count');
            const latestDateEl = document.getElementById('latest-meeting-date');
            const latestDecEl = document.getElementById('latest-decision-text');
            const badgeEl = document.getElementById('header-badge');

            if (totalEl) totalEl.textContent = chronicleData.length + ' 回分';
            if (badgeEl) badgeEl.textContent = `全 ${{chronicleData.length}} 会議 同期中`;
            if (latestDateEl) latestDateEl.textContent = latest.display_date || latest.date || '最新';
            if (latestDecEl) latestDecEl.textContent = (latest.yusuke_decisions && latest.yusuke_decisions[0]) || latest.summary || '経営数値の進捗確認と重要意思決定を推進中。';

            const decContainer = document.getElementById('dynamic-decisions-container');
            if (decContainer) {{
                decContainer.innerHTML = '';
                let count = 0;
                chronicleData.forEach(m => {{
                    (m.yusuke_decisions || []).forEach(d => {{
                        if (count < 12) {{
                            const item = document.createElement('div');
                            item.className = 'bg-[#f7f9f9] p-3 rounded-xl border border-[#cfd9de] space-y-1';
                            item.innerHTML = `<div class="text-[11px] font-black text-blue-600">${{m.display_date || m.date}}</div><div class="text-[#0f1419] font-bold">${{d}}</div>`;
                            decContainer.appendChild(item);
                            count++;
                        }}
                    }});
                }});
            }}
        }}

        function renderChronicleCards(dataToRender) {{
            const container = document.getElementById('chronicle-container');
            const totalCountEl = document.getElementById('chronicle-total-count');
            if (totalCountEl) totalCountEl.textContent = dataToRender.length;
            container.innerHTML = '';

            dataToRender.forEach((m, idx) => {{
                const card = document.createElement('div');
                card.className = "bg-white border-2 border-[#cfd9de] rounded-2xl p-6 space-y-4 shadow-sm hover:border-blue-300 transition";
                
                const tagsHtml = (m.tags || []).map(t => {{
                    let tagStyle = "bg-slate-100 text-slate-700 border-slate-200";
                    if (t.includes('逆算')) tagStyle = "bg-blue-50 text-blue-700 border-blue-200";
                    if (t.includes('調達') || t.includes('シリーズ')) tagStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    if (t.includes('3000社')) tagStyle = "bg-purple-50 text-purple-700 border-purple-200";
                    if (t.includes('原価') || t.includes('解約')) tagStyle = "bg-amber-50 text-amber-700 border-amber-200";
                    return `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold border ${{tagStyle}}">${{t}}</span>`;
                }}).join(' ');

                const decisionsHtml = (m.yusuke_decisions || []).map(d => `<li>${{d}}</li>`).join('');
                const quotesHtml = (m.quotes || []).map(q => `
                    <div class="bg-amber-50/60 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-[#0f1419] font-bold italic">
                        💬 "${{q}}"
                    </div>
                `).join('');

                card.innerHTML = `
                    <div class="flex items-center justify-between border-b border-[#e1e8ed] pb-3">
                        <div class="flex items-center space-x-2.5">
                            <span class="px-2.5 py-1 rounded-md bg-[#0f1419] text-white text-xs font-black font-mono">
                                第${{idx + 1}}回
                            </span>
                            <span class="text-sm font-black text-[#0f1419]">
                                ${{m.display_date || m.date}}
                            </span>
                        </div>
                        <div class="flex gap-1.5 flex-wrap">
                            ${{tagsHtml}}
                        </div>
                    </div>
                    <h4 class="text-base font-black text-[#0f1419]">${{m.theme}}</h4>
                    <p class="text-xs text-[#334155] leading-relaxed font-normal">${{m.summary}}</p>
                    ${{decisionsHtml ? `
                    <div class="space-y-1.5 pt-3 border-t border-[#e1e8ed]">
                        <div class="text-xs font-black text-blue-800 flex items-center space-x-1.5">
                            <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600"></i>
                            <span>日置さんの重要意思決定・指摘：</span>
                        </div>
                        <ul class="text-xs text-[#0f1419] space-y-1.5 list-disc list-inside font-bold">
                            ${{decisionsHtml}}
                        </ul>
                    </div>` : ''}}
                    ${{quotesHtml ? `<div class="space-y-2 pt-1">${{quotesHtml}}</div>` : ''}}
                `;
                container.appendChild(card);
            }});
            lucide.createIcons();
        }}

        function filterChronicle() {{
            const searchVal = document.getElementById('chronicle-search').value.toLowerCase();
            const tagVal = document.getElementById('chronicle-tag-filter').value;

            const filtered = chronicleData.filter(m => {{
                const matchSearch = !searchVal || 
                    m.theme.toLowerCase().includes(searchVal) || 
                    m.summary.toLowerCase().includes(searchVal) || 
                    (m.yusuke_decisions || []).some(d => d.toLowerCase().includes(searchVal)) ||
                    (m.quotes || []).some(q => q.toLowerCase().includes(searchVal));

                const matchTag = tagVal === 'ALL' || (m.tags || []).some(t => t.includes(tagVal));
                return matchSearch && matchTag;
            }});

            renderChronicleCards(filtered);
        }}

        function renderDrills() {{
            const container = document.getElementById('quiz-container');
            container.innerHTML = '';

            drillsData.forEach(d => {{
                const card = document.createElement('div');
                card.className = "bg-[#f7f9f9] p-6 rounded-2xl border-2 border-[#cfd9de] space-y-4 shadow-sm";
                card.id = `drill-${{d.id}}`;

                const optionsHtml = d.options.map(opt => `
                    <button onclick="handleAnswerDrill(${{d.id}}, '${{opt.key}}')" class="w-full text-left p-3.5 rounded-xl bg-white border-2 border-[#cfd9de] hover:border-blue-400 text-[#0f1419] text-xs font-bold transition">
                        <strong class="text-blue-600 mr-1.5 text-sm">${{opt.key}}.</strong> ${{opt.text}}
                    </button>
                `).join('');

                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black px-2.5 py-1 rounded border font-mono ${{d.categoryColor}}">
                            Q${{d.id}}. ${{d.category}}
                        </span>
                        <span class="text-xs font-black text-[#536471]" id="drill-${{d.id}}-status">未回答</span>
                    </div>
                    <div>
                        <p class="text-base font-black text-[#0f1419] leading-relaxed">${{d.question}}</p>
                        <div class="text-xs text-[#536471] font-bold mt-1">💡 思考ポイント：${{d.point}}</div>
                    </div>
                    <div class="space-y-2.5 text-xs">${{optionsHtml}}</div>
                    <div id="drill-${{d.id}}-ans" class="hidden p-4 rounded-xl text-xs leading-relaxed font-bold"></div>
                `;
                container.appendChild(card);
            }});
            lucide.createIcons();
        }}

        function handleAnswerDrill(qId, choice) {{
            const drill = drillsData.find(d => d.id === qId);
            if (!drill) return;

            const resultEl = document.getElementById(`drill-${{qId}}-ans`);
            const statusEl = document.getElementById(`drill-${{qId}}-status`);

            resultEl.classList.remove('hidden');

            if (choice === drill.correct) {{
                resultEl.className = 'p-4 rounded-xl text-xs leading-relaxed bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold';
                resultEl.innerHTML = `<div class="text-sm font-black text-emerald-700 mb-1">🎉 正解！ 正しい日置さんの思考です。</div>${{drill.explanation}}`;
                statusEl.textContent = '正解 ✅';
                drillResults[qId] = true;
            }} else {{
                resultEl.className = 'p-4 rounded-xl text-xs leading-relaxed bg-red-50 border-2 border-red-400 text-red-950 font-bold';
                resultEl.innerHTML = `<div class="text-sm font-black text-red-700 mb-1">❌ 不正解（正解: ${{drill.correct}}）</div>${{drill.explanation}}`;
                statusEl.textContent = '要復習 ❌';
                drillResults[qId] = false;
            }}

            const correctCount = Object.values(drillResults).filter(v => v === true).length;
            document.getElementById('drill-score').textContent = correctCount;
        }}

        // In-Browser Drag & Drop PDF / TXT Parsing with full tab refresh
        async function handleFiles(files) {{
            if (!files || files.length === 0) return;
            const statusEl = document.getElementById('drop-loading-status');
            if (statusEl) statusEl.classList.remove('hidden');

            let addedCount = 0;

            for (let i = 0; i < files.length; i++) {{
                const file = files[i];
                let text = '';
                if (file.name.endsWith('.pdf')) {{
                    text = await extractPdfText(file);
                }} else if (file.name.endsWith('.txt')) {{
                    text = await file.text();
                }}

                if (text) {{
                    const mDate = file.name.match(/2026[_\-](\\d{{2}})[_\-](\\d{{2}})/);
                    const dateStr = mDate ? `2026-${{mDate[1]}}-${{mDate[2]}}` : new Date().toISOString().slice(0, 10);
                    const displayDate = mDate ? `2026年${{parseInt(mDate[1])}}月${{parseInt(mDate[2])}}日` : `${{dateStr}} (追加)`;

                    let summary = "";
                    const ovMatch = text.match(/概要\\s*([\\s\\S]*?)(?=次のステップ|文字起こし|添付ファイル|$)/);
                    if (ovMatch) summary = ovMatch[1].replace(/\\s+/g, ' ').trim().slice(0, 300);

                    const bullets = text.split('\\n').filter(l => l.trim().startsWith('●') || l.trim().startsWith('*') || l.trim().startsWith('・'));
                    const yusukeDecisions = bullets.map(b => b.replace(/^[●*・\\-]\\s*/, '').trim()).filter(b => b.includes('Yusuke') || b.includes('日置') || b.includes('目標') || b.includes('逆算') || b.includes('利益') || b.includes('原価')).slice(0, 5);

                    const newMeeting = {{
                        date: dateStr,
                        display_date: displayDate,
                        theme: `${{displayDate}} 経営進捗・意思決定`,
                        summary: summary || "経営会議ログ",
                        yusuke_decisions: yusukeDecisions.length > 0 ? yusukeDecisions : ["経営数値の進捗確認と重要意思決定を実行。"],
                        quotes: [],
                        kpis: [],
                        actions: [],
                        tags: ["ドキュメント追加", "自動同期"]
                    }};

                    chronicleData.unshift(newMeeting);
                    addedCount++;
                }}
            }}

            if (statusEl) statusEl.classList.add('hidden');

            if (addedCount > 0) {{
                localStorage.setItem('vexum_chronicle_data', JSON.stringify(chronicleData));
                renderDynamicStats();
                renderChronicleCards(chronicleData);
                calculateReverseModel();
                alert(`${{addedCount}} 件のドキュメントを解析し、全タブのKPI・クロニクル・学習データを自動更新しました！`);
                switchTab('tab-chronicle');
            }}
        }}

        async function extractPdfText(file) {{
            try {{
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({{ data: arrayBuffer }}).promise;
                let fullText = '';
                for (let p = 1; p <= pdf.numPages; p++) {{
                    const page = await pdf.getPage(p);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(' ') + '\\n';
                }}
                return fullText;
            }} catch(err) {{
                console.error("PDF extract error:", err);
                return "";
            }}
        }}

        function handleFileDropSelect(e) {{
            handleFiles(e.target.files);
        }}

        function exportDataJSON() {{
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chronicleData, null, 2));
            const a = document.createElement('a');
            a.href = dataStr;
            a.download = `vexum_cfo_intelligence_${{new Date().toISOString().slice(0,10)}}.json`;
            a.click();
        }}

        document.addEventListener('DOMContentLoaded', () => {{
            lucide.createIcons();
            renderDynamicStats();
            calculateReverseModel();
            renderChronicleCards(chronicleData);
            renderDrills();
        }});
    </script>
</body>
</html>
'''
    with open(output_path, 'w', encoding='utf-8') as fp:
        fp.write(html_content)
    print(f"Generated clean HTML successfully at: {output_path}")
