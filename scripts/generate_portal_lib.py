import json, os

def generate_html(chronicle_data, output_path):
    chronicle_json_str = json.dumps(chronicle_data, ensure_ascii=False)

    drills_data = [
        {
            "id": 1,
            "category": "見込み管理・パイプライン",
            "question": "事業部から「今月の目標100社に対して、確度の高い見込みがちょうど100社集まりました！必達を目指して頑張ります！」と報告がありました。日置さんならどう返しますか？",
            "options": [
                {"key": "A", "text": "「素晴らしい！メンバーのモチベーションを高めて、1社も落とさないよう気合いでクロージングしてください。」"},
                {"key": "B", "text": "「見込み100%だと必ず下振れる。見込みは目標の3倍（300社＝150%〜300%）持っておかないとダメ。リード獲得の分母をどう増やすかすぐ再設計して。」"},
                {"key": "C", "text": "「100社達成したら予算を増額するので、来月の目標を150社に引き上げておいてください。」"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】「見込みは目標の3倍持て」。見込み100%は商談途中でのドロップや稟議遅延により確実に未達に終わります。定性的な気合いではなく、確率論として分母を3倍に積むのがCFOの規律です（2026/5/8会議など）。"
        },
        {
            "id": 2,
            "category": "財務データ・CRM整合性",
            "question": "財務担当から「CRM上の今月売上見込みは3,000万円ですが、実際の通帳入金実績は直近3ヶ月間2,000万円で横ばいです」と報告がありました。日置さんの第一声として最も適切なものは？",
            "options": [
                {"key": "A", "text": "「入金は売上計上から遅れて入ってくるものだから、来月まで様子を見ましょう。」"},
                {"key": "B", "text": "「売上の入金が3ヶ月横ばいなこととCRMの数字をどう合わせるか。あの数字はめっちゃ大事。CRMのステータス定義と入金のギャップを今すぐ突合して。」"},
                {"key": "C", "text": "「経理のシステムが古いのが原因なので、新しい会計クラウドを導入して自動化しましょう。」"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】CRMと財務会計の数値乖離を極端に嫌います。入金が横ばいなのにCRMの数字だけが先行している状態は予実の崩壊を意味するため、「あの数字はめっちゃ大事」とステータス定義と入金の即時突合を要求します（2026/5/1会議）。"
        },
        {
            "id": 3,
            "category": "ユニットエコノミクス・投資判断",
            "question": "新規顧客は順調に増えているものの、解約率（チャーン）が約70%と高く、人材の定着に課題が出ています。人事部が「もっと採用広告費を増やして母集団を増やしたい」と提案してきました。日置さんならどう判断しますか？",
            "options": [
                {"key": "A", "text": "「穴の空いたバケツに水を注ぐな。新規採用を一時ストップし、予算を既存メンバーの社内育成と定着プログラムに全集中させる。」"},
                {"key": "B", "text": "「解約される以上のペースで採用すればスケールするので、広告予算を2倍に増やしましょう。」"},
                {"key": "C", "text": "「解約したクライアントに対して割引プランを提示して引き止めを行いましょう。」"}
            ],
            "correct": "A",
            "explanation": "【日置流の鉄則】解約率70%の状態で採用を増やせば採用コストと原価率が悪化するだけです。日置さんは2026/7/17の経営会議で実際に「新規採用を一時停止し、予算を社内育成に全集中する」という外科手術的ピボットを決断しました。"
        },
        {
            "id": 4,
            "category": "意思決定スピード",
            "question": "マーケティング担当から「展示会出展やWeb広告の追加予算200万円の稟議書を作成したので、来週の経営会議でご審議いただけますか？」と言われました。日置さんの対応は？",
            "options": [
                {"key": "A", "text": "「来週の経営会議の第1アジェンダにして、役員全員で慎重に議論しましょう。」"},
                {"key": "B", "text": "「ベンチャーで予算承認に1週間かけるな。LINEグループで喋りながら数字を投げて、今その場で即判断して承認しろ。」"},
                {"key": "C", "text": "「一旦ROIのシミュレーションを3パターン作って来月末までに再提出してください。」"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】「スピードは唯一の競争優位」。日置さんは2026/7/3の会議で、マーケティング予算をLINEグループを通じて即時承認するフローを制定し、「承認に時間をかける遅さそのものがリスク」と指導しました。"
        },
        {
            "id": 5,
            "category": "会議運営・組織効率",
            "question": "毎週の経営会議で各事業部の状況報告が長引き、毎回1時間を超えてしまっています。日置さんが導入したルールは？",
            "options": [
                {"key": "A", "text": "「会議時間を10分以内に制限する。状況報告は事前に数字で済ませ、本質的な意思決定のみを行う場にする。」"},
                {"key": "B", "text": "「時間を無制限にして、全員が納得するまで徹底的に議論を尽くす。」"},
                {"key": "C", "text": "「経営会議の開催頻度を月1回に減らし、各事業部に全権委任する。」"}
            ],
            "correct": "A",
            "explanation": "【日置流の鉄則】「会議は10分以内ルール」（2026/6/12会議）。定性的な状況報告を長々と聞く時間は無駄であり、事前に数字を共有した上で、ボトルネックに対する意思決定だけを秒で下すカルチャーを徹底しました。"
        },
        {
            "id": 6,
            "category": "固定費・財務規律",
            "question": "事業拡大に伴いインターン生の採用を増やし、オフィス移転も検討しています。日置さんが設定している固定費・人件費の明確な規律基準は？",
            "options": [
                {"key": "A", "text": "「インターン給与は売上の50%以内、オフィス賃料は売上の10%以下に抑える。」"},
                {"key": "B", "text": "「調達した資金の範囲内であれば、売上比率に関わらず自由に投資してよい。」"},
                {"key": "C", "text": "「人件費は売上の80%まで許容し、オフィスは会社の信用のため最高級ビルを借りる。」"}
            ],
            "correct": "A",
            "explanation": "【日置流の鉄則】2026/6/26の会議で明言された財務規律。「インターン給与は売上の50%以内、賃料は売上の10%以下」。トップラインが伸びても固定費が暴走すれば単月黒字・キャッシュランウェイが崩壊するため、明確な比率規律を引いています。"
        },
        {
            "id": 7,
            "category": "定性論の数値翻訳",
            "question": "営業メンバーが「最近テレアポの反応が鈍く、クライアントの警戒感が高まっている気がします」と相談してきました。日置さんならどう切り返しますか？",
            "options": [
                {"key": "A", "text": "「景気が悪いのかもしれないね。トークスクリプトを明るい感じに変えてみよう。」"},
                {"key": "B", "text": "「それを数字で言うと？ アポ率・初期設計転換率は何%落ちてる？ 成約＝相談数×成功率でどこがボトルネック？」"},
                {"key": "C", "text": "「営業活動を一時中断して、営業セミナーを全員で受講しましょう。」"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】「定性論を数字に翻訳させる」。感覚的な「反応が鈍い」を受け取らず、「相談数（分母）が落ちているのか、成功率（転換率）が落ちているのか」を数式で特定させます（2026/7/10会議）。"
        },
        {
            "id": 8,
            "category": "逆算と供給体制",
            "question": "7月の営業目標を「上駐100件」と設定した場合、人事・採用チームに対して日置さんはどのように指示を出しますか？",
            "options": [
                {"key": "A", "text": "「営業が100件取れたら、その時点で慌てて採用を開始してください。」"},
                {"key": "B", "text": "「とにかく採用できるだけたくさん採用して、待機人材をプールしておいてください。」"},
                {"key": "C", "text": "「リーダー1人あたりの案件キャパから逆算して、100件支えるには12人のリーダーが必要。今リーダー候補が何人いて何人不足するか逆算して採用・育成を先行させて。」"}
            ],
            "correct": "C",
            "explanation": "【日置流の鉄則】事業部の営業目標から供給能力（リーダー数・採用数・育成リードタイム）を逆算して同期させるのが日置流の組織マネジメントです（2026/5/1会議）。"
        },
        {
            "id": 9,
            "category": "投資家目線・IR",
            "question": "シリーズA（5〜10億円調達）のVC面談に向けて、事業の強みを説明する資料を作成しています。日置さんが最も強くこだわる資料は？",
            "options": [
                {"key": "A", "text": "これまでの累積売上グラフと創業ストーリーの美談"},
                {"key": "B", "text": "人材のスキルTier1〜7ピラミッドや採用〜育成フローの1枚スライドなど、「成長の再現性と仕組みが確立している証拠」"},
                {"key": "C", "text": "競合他社の悪口と自社がいかに安いかをアピールする比較表"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】「投資家が見ているのは『本当に成長できるのか』という再現性の証明だけ」。単発の売上ではなく、スキルTierピラミッドや育成フローの1枚スライドなど、仕組み化されている証拠を提示することを最重視します（2026/5/1、6/5会議）。"
        },
        {
            "id": 10,
            "category": "未達時のマネジメント",
            "question": "月次目標が大きく未達となり、リーダー陣が暗い雰囲気で会議に臨んでいます。日置さんのマネジメントスタンスとして正しいものは？",
            "options": [
                {"key": "A", "text": "怒鳴り散らして精神論で反省文を書かせる。"},
                {"key": "B", "text": "穏やかに「なぜその数字になったのか、どう変えるか」を一緒に再計算し、「今は仕込み・練習台と考えていい」と再定義して前を向かせる。"},
                {"key": "C", "text": "未達には触れず、雑談をして場を和ませる。"}
            ],
            "correct": "B",
            "explanation": "【日置流の鉄則】日置さんは感情的に怒ることは一切なく、穏やかなトーンで論理の穴を突き、一緒に計算式を解き直します。そして「今のことは練習台・仕込みだと考えていい」と再定義して次のアクションに集中させます（人物像分析・システムプロンプト）。"
        }
    ]
    drills_json_str = json.dumps(drills_data, ensure_ascii=False)

    html_content = f'''<!DOCTYPE html>
<html lang="ja" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>日置佑輔 CFOインテリジェンス・ポータル | VEXUM 経営思考・全会議分析 &「第二の日置さん」育成ガイド</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            darkMode: 'class',
            theme: {{
                extend: {{
                    colors: {{
                        brand: {{
                            50: '#eef2ff',
                            100: '#e0e7ff',
                            400: '#818cf8',
                            500: '#6366f1',
                            600: '#4f46e5',
                            700: '#4338ca',
                            900: '#312e81',
                        }},
                        emerald: {{
                            400: '#34d399',
                            500: '#10b981',
                            600: '#059669',
                        }},
                        darkBg: '#0b0f19',
                        darkCard: '#111827',
                        darkBorder: '#1f2937',
                        darkInput: '#1e293b'
                    }}
                }}
            }}
        }}
    </script>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
        }}
        .font-mono {{
            font-family: 'JetBrains Mono', monospace;
        }}
        ::-webkit-scrollbar {{
            width: 8px;
            height: 8px;
        }}
        ::-webkit-scrollbar-track {{
            background: rgba(15, 23, 42, 0.6);
        }}
        ::-webkit-scrollbar-thumb {{
            background: rgba(99, 102, 241, 0.4);
            border-radius: 4px;
        }}
        ::-webkit-scrollbar-thumb:hover {{
            background: rgba(99, 102, 241, 0.7);
        }}
        .glass-card {{
            background: rgba(17, 24, 39, 0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }}
        .light .glass-card {{
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 0, 0, 0.08);
        }}
        .gradient-text {{
            background: linear-gradient(135deg, #6366f1 0%, #38bdf8 50%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .tab-btn.active {{
            border-color: #6366f1;
            color: #818cf8;
            background: rgba(99, 102, 241, 0.12);
        }}
        .light .tab-btn.active {{
            border-color: #4f46e5;
            color: #4f46e5;
            background: rgba(79, 70, 229, 0.08);
        }}
        .dropzone-active {{
            border-color: #6366f1 !important;
            background: rgba(99, 102, 241, 0.15) !important;
        }}
        .animate-fadeIn {{
            animation: fadeIn 0.25s ease-in-out;
        }}
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(4px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
    </style>
</head>
<body class="bg-darkBg text-slate-100 min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">

    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
                    H
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h1 class="text-lg font-bold tracking-tight text-white">
                            VEXUM CFO Intelligence Portal
                        </h1>
                        <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Ver 3.0 (常時更新対応)
                        </span>
                    </div>
                    <p class="text-xs text-slate-400">
                        日置佑輔の経営哲学・CFO思考OS・全議事録分析 ＆「第二の日置さん」育成ガイド
                    </p>
                </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center space-x-2">
                <button onclick="toggleTheme()" class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-sm flex items-center space-x-1 border border-slate-700" title="テーマ切り替え">
                    <i data-lucide="sun-moon" class="w-4 h-4"></i>
                    <span class="text-xs hidden sm:inline" id="theme-btn-text">ライト</span>
                </button>
                <button onclick="exportDataJSON()" class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-sm flex items-center space-x-1 border border-slate-700" title="データエクスポート">
                    <i data-lucide="download" class="w-4 h-4"></i>
                    <span class="text-xs hidden sm:inline">JSON保存</span>
                </button>
                <button onclick="switchTab('tab-manage')" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs font-semibold flex items-center space-x-1 shadow-md shadow-indigo-600/30">
                    <i data-lucide="file-plus" class="w-3.5 h-3.5"></i>
                    <span>ドキュメント投入 / 自動更新</span>
                </button>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="max-w-7xl mx-auto mt-3 overflow-x-auto flex space-x-2 border-t border-slate-800/60 pt-2 text-sm font-medium">
            <button onclick="switchTab('tab-profile')" id="btn-tab-profile" class="tab-btn active px-4 py-2 rounded-lg border border-transparent transition flex items-center space-x-2 whitespace-nowrap">
                <i data-lucide="user-check" class="w-4 h-4"></i>
                <span>1. 人物像 & CFO機能の全貌</span>
            </button>
            <button onclick="switchTab('tab-kpi')" id="btn-tab-kpi" class="tab-btn px-4 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center space-x-2 whitespace-nowrap">
                <i data-lucide="activity" class="w-4 h-4"></i>
                <span>2. 必見KPI & 逆算シミュレーター</span>
            </button>
            <button onclick="switchTab('tab-chronicle')" id="btn-tab-chronicle" class="tab-btn px-4 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center space-x-2 whitespace-nowrap">
                <i data-lucide="calendar-days" class="w-4 h-4"></i>
                <span>3. 経営会議 完全クロニクル</span>
            </button>
            <button onclick="switchTab('tab-roadmap')" id="btn-tab-roadmap" class="tab-btn px-4 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center space-x-2 whitespace-nowrap">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                <span>4. 「第二の日置さん」育成ロードマップ</span>
            </button>
            <button onclick="switchTab('tab-manage')" id="btn-tab-manage" class="tab-btn px-4 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center space-x-2 whitespace-nowrap">
                <i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-400"></i>
                <span class="text-emerald-400 font-bold">5. ドキュメント投入 / 自動更新</span>
            </button>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        <!-- ========================================== -->
        <!-- TAB 1: 日置さんの人物像 & CFO機能の全貌 -->
        <!-- ========================================== -->
        <section id="tab-profile" class="tab-content block space-y-8 animate-fadeIn">
            <!-- Hero Card -->
            <div class="glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden border border-indigo-500/20 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
                <div class="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-3 max-w-3xl">
                        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                            <span>株式会社VEXUM 代表取締役 兼 経営統括・CFO</span>
                        </div>
                        <h2 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                            日置 佑輔 <span class="text-xl font-normal text-slate-400">（Yusuke）</span>
                        </h2>
                        <p class="text-base lg:text-lg text-slate-300 leading-relaxed font-medium">
                            <span class="gradient-text font-bold">「数字を共通言語にして、逆算とスピードで“成長の再現性”を証明し続ける」</span>
                        </p>
                        <p class="text-sm text-slate-400 leading-relaxed">
                            AI活用の人材派遣・常駐受託（「上駐」）支援事業を率い、シリーズA調達（5〜10億円規模）と「1年後に有料顧客3,000社」という全社ゴールを牽引。毎週金曜の経営会議を主宰し、営業・採用・財務・資金調達・ガバナンスのすべてを数字で統括する戦略的CFO/CEO。
                        </p>
                    </div>

                    <!-- Quick Summary Metrics -->
                    <div class="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono">
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                            <div class="text-xs text-slate-400 font-sans">全社目標 (1年後)</div>
                            <div class="text-xl font-bold text-amber-400">有料 3,000社</div>
                            <div class="text-[11px] text-slate-400 font-sans">ボーナス総額 1億円</div>
                        </div>
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                            <div class="text-xs text-slate-400 font-sans">資金調達目標</div>
                            <div class="text-xl font-bold text-emerald-400">5億〜10億円</div>
                            <div class="text-[11px] text-slate-400 font-sans">シリーズA ラウンド</div>
                        </div>
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                            <div class="text-xs text-slate-400 font-sans">必要供給体制</div>
                            <div class="text-xl font-bold text-indigo-400">4,500人体制</div>
                            <div class="text-[11px] text-slate-400 font-sans">Tier1〜7 ピラミッド</div>
                        </div>
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                            <div class="text-xs text-slate-400 font-sans">意思決定ルール</div>
                            <div class="text-xl font-bold text-rose-400">10分会議</div>
                            <div class="text-[11px] text-slate-400 font-sans">LINE即時予算承認</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 日置流 思考OS (Thinking OS) 7大原則 -->
            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <i data-lucide="cpu" class="w-6 h-6 text-indigo-400"></i>
                    <h3 class="text-2xl font-bold text-white tracking-tight">日置流『思考OS（Thinking OS）』7大原則</h3>
                </div>
                <p class="text-sm text-slate-400">
                    日置さんのすべての発言・指示・問いかけの根底にある思考のOSです。定性論を排し、常に以下の7つの順序・フレームワークで思考を展開します。
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    <!-- Principle 1 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 01</span>
                                <i data-lucide="git-branch" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">すべては「逆算」で組む</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                ゴール（例：7月上駐100件）から、<strong class="text-indigo-300">リードタイム・各ファネル転換率・必要行動量</strong>へ分解。「上駐100件 ÷ 転換率6掛け ＝ アポ160件 ＝ 初回接触200件」を即座に組み立てる。人事・採用も案件キャパから必要リーダー数を逆算。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「リーダー12人必要なら、今リーダー候補は何人いるんだっけと逆算して動いて」
                        </div>
                    </div>

                    <!-- Principle 2 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 02</span>
                                <i data-lucide="calculator" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">定性論を数字に翻訳させる</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                「頑張ります」「感触は良い」などの定性報告を一切許さない。<strong class="text-indigo-300">「成約数 ＝ 相談数 × 成功率」</strong>のように基本の数式に落とし、ボトルネックが分母（相談数）か分子（転換率）かを特定させる。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「それを数字で言うと？」「相談数×成功率で、課題はどっちにあるんすか？」
                        </div>
                    </div>

                    <!-- Principle 3 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 03</span>
                                <i data-lucide="repeat" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">成長の再現性・スケールの証明</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                「投資家が見ているのは“本当に成長できるのか”だけ」。単発の売上ではなく、<strong class="text-indigo-300">同じ勝ち筋を仕組みとして繰り返せるか</strong>を最重要視。スキルTier1〜7ピラミッドや教育フロー1枚スライドなど、仕組みの証明資料に執着。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「投資家が見てるのは成長できることの証明。成長できていることが全て」
                        </div>
                    </div>

                    <!-- Principle 4 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 04</span>
                                <i data-lucide="zap" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">スピード＝唯一の競争優位</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                「ベンチャーでスピードは唯一の競争優位。予算承認に1週間かけるな」。会議時間を10分以内に短縮し、LINEグループで即座に予算を承認。「週単位ではなく秒単位でサイクルを回せ」「プロアスリートの水準で自己研鑽を」と要求。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「喋りながらLINEで連絡してその場で承認しろ。遅さそのものがリスク」
                        </div>
                    </div>

                    <!-- Principle 5 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 05</span>
                                <i data-lucide="shield-alert" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">予実管理と「見込み3倍」ルール</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                計画に対する進捗差（下振れ）を最重要リスクとしてリアルタイム監視。<strong class="text-indigo-300">「見込みは目標の3倍（150%以上）持て。100%だと必ず下振れする」</strong>。放置を許さず、日次・週次で改善サイクルを回す。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「見込みが目標を下回ってるのを放置すると、資金調達と成長に直結して悪影響」
                        </div>
                    </div>

                    <!-- Principle 6 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 06</span>
                                <i data-lucide="coins" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">利益構造・ユニットエコノミクス</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                売上（トップライン）だけでなく、<strong class="text-indigo-300">限界利益率・原価率（約66%の改善）・案件あたり利益・LTV・解約率（チャーン70%）</strong>を見る。解約が多い時期には「採用を一時停止し、社内育成に全投資する」英断を下す。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「初月売上ではなく原価を引いた後の案件利益率が適切か。ボーダーを決めろ」
                        </div>
                    </div>

                    <!-- Principle 7 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between lg:col-span-3">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">原則 07</span>
                                <i data-lucide="database" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <h4 class="text-lg font-bold text-white">記録・ログ・CRMと財務のデータ整合性への執着</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">
                                「取れないなら手動でもいい。とにかく直近の数字を把握し、相関を理解する姿勢を持て」。CRMの受注ステータスと財務会計の売上入金がズレていることを厳格に追究し、「あの数字はめっちゃ大事」と一致を要求。将来の振り返りのために仮置き数値を必ずログ化。
                            </p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                            💬「売上の入金が3ヶ月横ばいなこととCRMの見込みをどう合わせるか。ギャップを合わせるのがめっちゃ大事」
                        </div>
                    </div>
                </div>
            </div>

            <!-- CFOとしての6大実務領域と職務全うの型 -->
            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <i data-lucide="briefcase" class="w-6 h-6 text-emerald-400"></i>
                    <h3 class="text-2xl font-bold text-white tracking-tight">日置さんがCFOとして職務を全うする6大領域</h3>
                </div>
                <p class="text-sm text-slate-400">
                    日置さんは単なる「経理・財務のまとめ役」ではありません。事業部（営業・開発・採用）の活動を全て数式に落とし、投資家のストーリーと完全に接続させる<strong class="text-emerald-400">「事業推進型CFO（Operating / Strategic CFO）」</strong>として機能しています。
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <!-- Function 1 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <i data-lucide="trending-up" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">① ファイナンス・資本政策・IR</h4>
                                <span class="text-xs text-slate-400">シリーズA 5〜10億円調達に向けたバリュエーション最大化</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>バリュエーション最大化</strong>：6月・7月の数値を跳ねさせ、投資家に「成長の再現性」を証明。</li>
                            <li><strong>資本政策・SO設計</strong>：増資前にストックオプション（SO）を付与するスケジュールを策定。</li>
                            <li><strong>決算・税務最適化</strong>：6月決算に向けた免税事業者の選択、決算見込み1億円の達成管理。</li>
                        </ul>
                    </div>

                    <!-- Function 2 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                <i data-lucide="line-chart" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">② 戦略的予実管理（Operating CFO）</h4>
                                <span class="text-xs text-slate-400">営業パイプラインと財務会計の完全同期</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>CRMと財務の乖離是正</strong>：CRMの見込み売上と実際の銀行口座入金のズレを毎週突合。</li>
                            <li><strong>先行指標（Leading Indicator）管理</strong>：「初期設計数」を上駐成約の最重要先行指標と定義。</li>
                            <li><strong>見込みの厚み管理</strong>：目標の150%〜300%のパイプライン確保を事業部に義務付け。</li>
                        </ul>
                    </div>

                    <!-- Function 3 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                <i data-lucide="pie-chart" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">③ ユニットエコノミクス & コスト規律</h4>
                                <span class="text-xs text-slate-400">限界利益の死守と固定費コントロール</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>原価率（66%）の改善</strong>：案件あたりの利益率を算出し、投資判断のボーダーラインを設定。</li>
                            <li><strong>固定費のルール化</strong>：インターン給与は「売上の50%以内」、オフィス賃料は「売上の10%以内」。</li>
                            <li><strong>コストの外科手術</strong>：成果の出ていない顧問契約を整理し、顧問料を月50万円に即座に削減。</li>
                        </ul>
                    </div>

                    <!-- Function 4 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                <i data-lucide="users-round" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">④ 供給能力・組織設計の逆算</h4>
                                <span class="text-xs text-slate-400">営業目標と採用・育成能力の同期</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>必要リーダー数の逆算</strong>：営業目標案件数 ÷ 1人あたり案件キャパ ＝ 必要リーダー数（12名等）。</li>
                            <li><strong>スキルTier 1〜7 ピラミッド</strong>：全人材のスキルレベルを格付けし、育成体制を可視化。</li>
                            <li><strong>採用停止と育成集中</strong>：解約率70%の課題に対し、採用を止めて社内育成に全投資する英断。</li>
                        </ul>
                    </div>

                    <!-- Function 5 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                <i data-lucide="shield-check" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">⑤ ガバナンス・法務・子会社管理</h4>
                                <span class="text-xs text-slate-400">宮本弁護士と連携した先回りのリスクヘッジ</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>労働者派遣法の適格性</strong>：常駐支援における指揮命令記録や契約条項を先回りで適正化。</li>
                            <li><strong>グループ・子会社管理</strong>：子会社設立、登記、法人口座開設をスムーズに推進。</li>
                            <li><strong>知的財産・成果物開示</strong>：契約書における成果物・著作権条項のチェックを徹底。</li>
                        </ul>
                    </div>

                    <!-- Function 6 -->
                    <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                                <i data-lucide="message-square-quote" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-white">⑥ マネジメント & コミュニケーション</h4>
                                <span class="text-xs text-slate-400">穏やかな確認口調と論理的追及・再定義フォロー</span>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            <li><strong>穏やかな口調</strong>：「〜じゃないですか」「〜なんですよ」「〜って感じですかね」。</li>
                            <li><strong>一緒に再計算</strong>：「160から100だから6掛け。22日のリードタイムで出してる感じ？」。</li>
                            <li><strong>再定義のフォロー</strong>：未達で落ち込むチームに「今は仕込み・練習台と考えていい」と前を向かせる。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>


        <!-- ========================================== -->
        <!-- TAB 2: 必見KPIダッシュボード & 逆算シミュレーター -->
        <!-- ========================================== -->
        <section id="tab-kpi" class="tab-content hidden space-y-8 animate-fadeIn">
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <i data-lucide="activity" class="w-6 h-6 text-indigo-400"></i>
                    <h3 class="text-2xl font-bold text-white tracking-tight">日置流 必見KPIダッシュボード体系</h3>
                </div>
                <p class="text-sm text-slate-400">
                    日置さんに報告する前に必ず頭に入れ、数式で連動させておくべき重要KPIの4象限マトリクスです。
                </p>
            </div>

            <!-- 4 Quadrants Matrix -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Quad 1: Sales -->
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div class="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                            <i data-lucide="filter" class="w-4 h-4"></i>
                            <span>A. 営業パイプライン（逆算の起点）</span>
                        </div>
                        <span class="text-xs text-slate-400 font-mono">Sales Funnel</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">初回接触・リード数</div>
                            <div class="font-bold text-white font-mono text-sm">月200件</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">アポ獲得数</div>
                            <div class="font-bold text-white font-mono text-sm">月160件 (1日1件)</div>
                        </div>
                        <div class="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/30">
                            <div class="text-indigo-300 font-semibold">初期設計数【最重要先行指標】</div>
                            <div class="font-bold text-indigo-400 font-mono text-sm">転換率 約80%</div>
                        </div>
                        <div class="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
                            <div class="text-emerald-300 font-semibold">上駐開始数【必達マスト】</div>
                            <div class="font-bold text-emerald-400 font-mono text-sm">月64〜100件</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">リードタイム</div>
                            <div class="font-bold text-white font-mono text-sm">接触→上駐 57日 / 設計→上駐 22日</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">見込みパイプライン厚み</div>
                            <div class="font-bold text-amber-400 font-mono text-sm">目標の3倍 (150%以上)</div>
                        </div>
                    </div>
                </div>

                <!-- Quad 2: Unit Economics & Retention -->
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div class="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                            <span>B. 収益・ユニットエコノミクス</span>
                        </div>
                        <span class="text-xs text-slate-400 font-mono">Unit Economics</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
                            <div class="text-rose-300 font-semibold">解約率 (チャーン)</div>
                            <div class="font-bold text-rose-400 font-mono text-sm">約70% (要改善)</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">LTV & 平均契約期間</div>
                            <div class="font-bold text-white font-mono text-sm">顧客生涯価値の最大化</div>
                        </div>
                        <div class="bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30">
                            <div class="text-amber-300 font-semibold">全社原価率</div>
                            <div class="font-bold text-amber-400 font-mono text-sm">約66% (圧縮目標)</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">平均常駐日数 (アーリス)</div>
                            <div class="font-bold text-white font-mono text-sm">5.7日 → 2〜2.5日/人</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">案件あたり利益率</div>
                            <div class="font-bold text-white font-mono text-sm">原価控除後の粗利率</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">アップセル率</div>
                            <div class="font-bold text-white font-mono text-sm">スタンダードをデフォルト提示</div>
                        </div>
                    </div>
                </div>

                <!-- Quad 3: Finance -->
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div class="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                            <i data-lucide="wallet" class="w-4 h-4"></i>
                            <span>C. 財務・資金調達</span>
                        </div>
                        <span class="text-xs text-slate-400 font-mono">Finance & Runway</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">月次売上実績</div>
                            <div class="font-bold text-white font-mono text-sm">5月1,425万 → 7月2,200万</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">キャッシュランウェイ</div>
                            <div class="font-bold text-white font-mono text-sm">最低3ヶ月分を死守</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">シリーズA 調達目標</div>
                            <div class="font-bold text-emerald-400 font-mono text-sm">5億〜10億円</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">インターン給与規律</div>
                            <div class="font-bold text-white font-mono text-sm">売上の50%以内</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">オフィス賃料規律</div>
                            <div class="font-bold text-white font-mono text-sm">売上の10%以下</div>
                        </div>
                        <div class="bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
                            <div class="text-rose-300 font-semibold">CRM・財務データ乖離</div>
                            <div class="font-bold text-rose-400 font-mono text-sm">乖離ゼロ (完全一致要求)</div>
                        </div>
                    </div>
                </div>

                <!-- Quad 4: HR & Supply -->
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div class="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                            <i data-lucide="users" class="w-4 h-4"></i>
                            <span>D. 人事・採用・供給逆算</span>
                        </div>
                        <span class="text-xs text-slate-400 font-mono">HR Supply Chain</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">承諾率 基準</div>
                            <div class="font-bold text-white font-mono text-sm">80%超を維持</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">応募→上駐リードタイム</div>
                            <div class="font-bold text-white font-mono text-sm">3週間〜1ヶ月</div>
                        </div>
                        <div class="bg-purple-950/40 p-2.5 rounded-lg border border-purple-500/30">
                            <div class="text-purple-300 font-semibold">人材格付けピラミッド</div>
                            <div class="font-bold text-purple-400 font-mono text-sm">Tier 1 〜 Tier 7</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">必要リーダー数</div>
                            <div class="font-bold text-white font-mono text-sm">営業目標から逆算 (12名等)</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">稼働メッシュ</div>
                            <div class="font-bold text-white font-mono text-sm">常駐 85名 / 待機 22名</div>
                        </div>
                        <div class="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div class="text-slate-400">媒体別CPA × Aランク比率</div>
                            <div class="font-bold text-white font-mono text-sm">単価とスキルの相関分析</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 動的ツール: 逆算シミュレーター (Reverse Engineering Calculator) -->
            <div class="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-slate-900/90 shadow-xl space-y-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <div class="inline-flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            <i data-lucide="calculator" class="w-4 h-4"></i>
                            <span>Interactive CFO Simulator</span>
                        </div>
                        <h4 class="text-xl font-bold text-white">日置流『営業・供給 逆算シミュレーター』</h4>
                    </div>
                    <p class="text-xs text-slate-400 max-w-md">
                        目標とする「上駐開始件数（成約）」を入力すると、日置さんのロジック（転換率・リードタイム・リーダーキャパ）に基づいて必要なアクション量を即座に逆算します。
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Controls -->
                    <div class="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">
                                目標 上駐開始数 (成約件数 / 月)
                            </label>
                            <div class="relative">
                                <input type="number" id="sim-target-deals" value="100" min="1" max="1000" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-lg focus:border-indigo-500 focus:outline-none" oninput="calculateReverseModel()">
                                <span class="absolute right-3 top-2.5 text-xs text-slate-400">社</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">
                                初期設計 → 上駐 転換率 (デフォルト: 62.5%)
                            </label>
                            <input type="range" id="sim-rate-deal" min="30" max="90" value="63" class="w-full accent-indigo-500" oninput="calculateReverseModel()">
                            <div class="flex justify-between text-[11px] text-slate-400 font-mono">
                                <span>30%</span>
                                <span id="sim-rate-deal-val" class="text-indigo-400 font-bold">63%</span>
                                <span>90%</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">
                                アポ → 初期設計 転換率 (デフォルト: 80%)
                            </label>
                            <input type="range" id="sim-rate-design" min="40" max="95" value="80" class="w-full accent-indigo-500" oninput="calculateReverseModel()">
                            <div class="flex justify-between text-[11px] text-slate-400 font-mono">
                                <span>40%</span>
                                <span id="sim-rate-design-val" class="text-indigo-400 font-bold">80%</span>
                                <span>95%</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">
                                リーダー1人あたり案件キャパ (デフォルト: 8社)
                            </label>
                            <input type="number" id="sim-leader-cap" value="8" min="1" max="20" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none" oninput="calculateReverseModel()">
                        </div>
                    </div>

                    <!-- Calculated Results -->
                    <div class="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div class="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/40 flex flex-col justify-between">
                            <div class="text-xs text-indigo-300 font-semibold">① 必要初期設計数 (先行指標)</div>
                            <div class="my-2">
                                <div id="res-design-count" class="text-2xl lg:text-3xl font-extrabold text-indigo-400 font-mono">160</div>
                                <div class="text-[10px] text-slate-400">リードタイム: 約22日前</div>
                            </div>
                            <div class="text-[10px] text-slate-400">成約 ÷ 転換率</div>
                        </div>

                        <div class="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/40 flex flex-col justify-between">
                            <div class="text-xs text-indigo-300 font-semibold">② 必要アポイント数</div>
                            <div class="my-2">
                                <div id="res-appo-count" class="text-2xl lg:text-3xl font-extrabold text-indigo-400 font-mono">200</div>
                                <div class="text-[10px] text-slate-400 font-mono" id="res-appo-daily">日次: 約8.0件</div>
                            </div>
                            <div class="text-[10px] text-slate-400">初期設計 ÷ 設計率</div>
                        </div>

                        <div class="bg-amber-950/30 p-4 rounded-xl border border-amber-500/40 flex flex-col justify-between">
                            <div class="text-xs text-amber-300 font-semibold">③ 必要見込みパイプライン (3倍)</div>
                            <div class="my-2">
                                <div id="res-pipeline-3x" class="text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono">300</div>
                                <div class="text-[10px] text-amber-400/80 font-semibold">下振れ防止バッファ</div>
                            </div>
                            <div class="text-[10px] text-slate-400">日置式 3倍ルール</div>
                        </div>

                        <div class="bg-purple-950/30 p-4 rounded-xl border border-purple-500/40 flex flex-col justify-between">
                            <div class="text-xs text-purple-300 font-semibold">④ 必要リーダー数</div>
                            <div class="my-2">
                                <div id="res-leader-count" class="text-2xl lg:text-3xl font-extrabold text-purple-400 font-mono">13</div>
                                <div class="text-[10px] text-slate-400">名 (案件管理体制)</div>
                            </div>
                            <div class="text-[10px] text-slate-400">目標社数 ÷ キャパ</div>
                        </div>

                        <div class="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40 flex flex-col justify-between">
                            <div class="text-xs text-emerald-300 font-semibold">⑤ 想定月次売上 (単価25万)</div>
                            <div class="my-2">
                                <div id="res-monthly-sales" class="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono">2,500万</div>
                                <div class="text-[10px] text-slate-400 font-mono">円 / 月</div>
                            </div>
                            <div class="text-[10px] text-slate-400">上駐数 × 単価</div>
                        </div>

                        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
                            <div class="text-xs text-slate-300 font-semibold">⑥ インターン給与上限 (50%)</div>
                            <div class="my-2">
                                <div id="res-intern-budget" class="text-2xl lg:text-3xl font-extrabold text-slate-200 font-mono">1,250万</div>
                                <div class="text-[10px] text-slate-400">円 (財務規律上限)</div>
                            </div>
                            <div class="text-[10px] text-slate-400">売上 × 50%以内</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- ========================================== -->
        <!-- TAB 3: 経営会議 完全クロニクル -->
        <!-- ========================================== -->
        <section id="tab-chronicle" class="tab-content hidden space-y-8 animate-fadeIn">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                        <i data-lucide="calendar-days" class="w-6 h-6 text-indigo-400"></i>
                        <h3 class="text-2xl font-bold text-white tracking-tight">VEXUM経営会議 完全クロニクル</h3>
                    </div>
                    <p class="text-sm text-slate-400">
                        蓄積されたすべての経営会議議事録・Geminiメモ・発言・意思決定の全記録（全 <span id="chronicle-total-count" class="text-indigo-400 font-bold">0</span> 件）
                    </p>
                </div>

                <!-- Search & Filters -->
                <div class="flex flex-wrap items-center gap-2">
                    <div class="relative">
                        <input type="text" id="chronicle-search" placeholder="キーワード・数字・発言検索..." class="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-48 sm:w-64" oninput="filterChronicle()">
                        <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5"></i>
                    </div>
                    <select id="chronicle-tag-filter" class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none" onchange="filterChronicle()">
                        <option value="ALL">全てのタグ (全件)</option>
                        <option value="逆算設計">逆算設計</option>
                        <option value="資金調達">資金調達・シリーズA</option>
                        <option value="単月黒字">単月黒字化・財務</option>
                        <option value="ユニットエコノミクス">ユニットエコノミクス・原価</option>
                        <option value="3000社目標">3000社目標</option>
                        <option value="危機管理">危機管理・下振れ対策</option>
                        <option value="構造改革">構造改革・分業制</option>
                    </select>
                </div>
            </div>

            <!-- Chronicle Cards Container -->
            <div id="chronicle-container" class="space-y-6">
                <!-- Dynamically populated by JS -->
            </div>
        </section>


        <!-- ========================================== -->
        <!-- TAB 4: 「第二の日置さん」育成ロードマップ -->
        <!-- ========================================== -->
        <section id="tab-roadmap" class="tab-content hidden space-y-8 animate-fadeIn">
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <i data-lucide="graduation-cap" class="w-6 h-6 text-indigo-400"></i>
                    <h3 class="text-2xl font-bold text-white tracking-tight">「第二の日置さん」になるための学習・思考ロードマップ</h3>
                </div>
                <p class="text-sm text-slate-400">
                    あなたが日置さんと同じ解像度で事業を牽引し、CFO・経営統括として機能するために身につけるべき3階層のスキル体系と日常の思考訓練です。
                </p>
            </div>

            <!-- 3 Layers of Skills -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Layer 1 -->
                <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                    <div class="flex items-center space-x-2 text-amber-400 text-xs font-bold font-mono">
                        <span>LAYER 01</span>
                        <span>•</span>
                        <span>基礎体力</span>
                    </div>
                    <h4 class="text-xl font-bold text-white">財務・ファイナンス・管理会計の武器</h4>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        日置さんは会社のキャッシュ、限界利益、資本政策を常に頭の中で回しています。簿記だけでなく「スタートアップ特有のファイナンス」を修得します。
                    </p>

                    <div class="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                        <div class="font-semibold text-amber-300">重点修得テーマ：</div>
                        <ul class="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
                            <li><strong>管理会計・限界利益</strong>：固定費・変動費の分解と損益分岐点売上高の計算。</li>
                            <li><strong>資金繰り表（キャッシュフロー）</strong>：最低3ヶ月分のランウェイ予測と入金サイト管理。</li>
                            <li><strong>スタートアップ資本政策</strong>：シリーズA（5〜10億）調達、バリュエーション算定、SOプール（10〜15%）設計。</li>
                            <li><strong>税務と会社形態</strong>：免税事業者の選択、決算対策、子会社設立とガバナンス。</li>
                        </ul>
                    </div>
                </div>

                <!-- Layer 2 -->
                <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    <div class="flex items-center space-x-2 text-indigo-400 text-xs font-bold font-mono">
                        <span>LAYER 02</span>
                        <span>•</span>
                        <span>事業推進</span>
                    </div>
                    <h4 class="text-xl font-bold text-white">事業オペレーション＆数値モデリング</h4>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        定性的な事業活動を「数式」に落とし込み、先行指標とボトルネックを秒で特定するOperating CFOのコアスキルです。
                    </p>

                    <div class="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                        <div class="font-semibold text-indigo-300">重点修得テーマ：</div>
                        <ul class="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
                            <li><strong>逆算ファネル設計</strong>：ゴールから逆算してリードタイム・転換率・日次必要量を算出。</li>
                            <li><strong>先行指標（Leading Indicators）の特定</strong>：成約の前に必ず動く数字（初期設計数など）を特定し監視。</li>
                            <li><strong>ユニットエコノミクス・LTV/CAC</strong>：案件あたり原価、チャーン率、平均稼働日数（アーリス）の最大化。</li>
                            <li><strong>SFA/CRMデータ整合性</strong>：CRM上の見込みステータスと財務会計の売上を完全一致させる運用。</li>
                        </ul>
                    </div>
                </div>

                <!-- Layer 3 -->
                <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div class="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                        <span>LAYER 03</span>
                        <span>•</span>
                        <span>経営・リーダーシップ</span>
                    </div>
                    <h4 class="text-xl font-bold text-white">経営対話・投資家目線・マネジメント</h4>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        投資家を納得させる成長ストーリーの構築と、感情的にならずロジックでチームを鼓舞するマネジメント術です。
                    </p>

                    <div class="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                        <div class="font-semibold text-emerald-300">重点修得テーマ：</div>
                        <ul class="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
                            <li><strong>投資家目線のストーリーテリング</strong>：「成長の再現性」をスライド1枚・数字で証明する技術。</li>
                            <li><strong>穏やかなロジカル・マネジメント</strong>：感情で怒らず「なぜその数字なのか」「どう変えるか」を一緒に再計算。</li>
                            <li><strong>危機感の共有と再定義フォロー</strong>：下振れの危機感を共有しつつ、「今は練習台」と前を向かせる心理設計。</li>
                            <li><strong>スピード至上主義カルチャー</strong>：会議10分ルール、LINE即決など、遅さを排除する仕組み作り。</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 日置流 思考チェックリスト20選 -->
            <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div class="flex items-center space-x-2">
                    <i data-lucide="check-square" class="w-5 h-5 text-indigo-400"></i>
                    <h4 class="text-lg font-bold text-white">意思決定・報告前に日置さんなら必ず投げる「思考チェックリスト20」</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">01.</span>
                        <span>その数字は目標からの「逆算」で組まれているか？（分母・転換率・行動量）</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">02.</span>
                        <span>定性的な感想や努力目標ではなく、「数字」に翻訳して説明できるか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">03.</span>
                        <span>それは「一発屋」ではなく、同じ勝ち筋を繰り返せる「再現性」があるか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">04.</span>
                        <span>見込みパイプラインは目標の「3倍（150%以上）」確保されているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">05.</span>
                        <span>「初期設計数」などの最重要先行指標の進捗は日次で追えているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">06.</span>
                        <span>トップライン（売上）だけでなく、「原価控除後の案件利益率」は適正か？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">07.</span>
                        <span>全社の原価率（約66%）や解約率（チャーン）は改善傾向にあるか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">08.</span>
                        <span>CRM上の受注ステータスと財務の入金実績は「1円の狂いもなく一致」しているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">09.</span>
                        <span>インターン給与は「売上の50%以内」、賃料は「10%以内」に収まっているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">10.</span>
                        <span>費用対効果の薄い顧問料や固定費は即座に削られているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">11.</span>
                        <span>営業目標の案件数から「必要リーダー数」や「必要採用数」を逆算しているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">12.</span>
                        <span>採用は単なる人数ではなく「媒体別CPA × Aランク比率」で評価しているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">13.</span>
                        <span>解約率が高い時は「採用を止めて社内育成に投資する」等の外科手術ができているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">14.</span>
                        <span>意思決定や予算承認に何日もかけていないか？（秒で判断・LINE承認）</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">15.</span>
                        <span>会議は10分以内で終わっているか？（ダラダラ報告ではなく意思決定の場か）</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">16.</span>
                        <span>「1年後 有料3,000社・1億円ボーナス」という北極星目標と接続しているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">17.</span>
                        <span>シリーズA（5〜10億円調達）の投資家に対して説得力のある成長証拠になっているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">18.</span>
                        <span>労働者派遣法の指揮命令記録や契約条項など法務コンプライアンスは万全か？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">19.</span>
                        <span>システムが未完成でも「手動でログを取り相関を掴む」姿勢を徹底しているか？</span>
                    </div>
                    <div class="flex items-start space-x-2 p-2 rounded bg-slate-800/40 border border-slate-700/40">
                        <span class="text-indigo-400 font-bold font-mono">20.</span>
                        <span>未達時に感情で詰めるのではなく「なぜ・どう変える」の改善サイクルへ導けているか？</span>
                    </div>
                </div>
            </div>

            <!-- インタラクティブ思考ドリル (ケーススタディ10問) -->
            <div class="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/90 space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <div class="text-indigo-400 text-xs font-bold uppercase font-mono">Interactive CFO Case-Study Drills</div>
                        <h4 class="text-xl font-bold text-white">日置式 CFO実践思考ドリル（全10問・即時判定）</h4>
                    </div>
                    <div class="text-xs text-slate-400">
                        スコア: <span id="drill-score" class="font-bold text-indigo-400 font-mono text-sm">0</span> / 10 問正解
                    </div>
                </div>

                <div id="quiz-container" class="space-y-6">
                    <!-- Dynamically populated 10 drills -->
                </div>
            </div>
        </section>


        <!-- ========================================== -->
        <!-- TAB 5: ドキュメント投入 / 自動更新 (UPGRADED) -->
        <!-- ========================================== -->
        <section id="tab-manage" class="tab-content hidden space-y-8 animate-fadeIn">
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <i data-lucide="refresh-cw" class="w-6 h-6 text-emerald-400"></i>
                    <h3 class="text-2xl font-bold text-white tracking-tight">ドキュメント投入 ＆ ポータル自動更新システム</h3>
                </div>
                <p class="text-sm text-slate-400">
                    PDFやテキストファイルをここにドラッグ＆ドロップするか、フォルダにファイルを入れてスクリプトを実行することで、ポータルが常に最新状態に自動同期されます。
                </p>
            </div>

            <!-- Drag & Drop Instant Parser Area -->
            <div id="drop-zone" class="glass-card p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-all text-center space-y-4 bg-slate-900/60 cursor-pointer" onclick="document.getElementById('file-drop-input').click()">
                <input type="file" id="file-drop-input" accept=".pdf,.txt" multiple class="hidden" onchange="handleFileDropSelect(event)">
                <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                    <i data-lucide="upload-cloud" class="w-8 h-8"></i>
                </div>
                <div class="space-y-1">
                    <h4 class="text-base font-bold text-white">ここにPDF・TXTファイルをドラッグ＆ドロップ</h4>
                    <p class="text-xs text-slate-400">
                        またはクリックしてファイルを選択（複数ファイル同時対応）
                    </p>
                </div>
                <div class="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                    <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">.pdf (Geminiメモ・議事録)</span>
                    <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">.txt (文字起こし)</span>
                </div>
                <div id="drop-loading-status" class="hidden text-xs font-bold text-indigo-400 animate-pulse">
                    ファイルを解析中... 日置さんの発言・意思決定・KPIを自動抽出しています
                </div>
            </div>

            <!-- Dual Auto-Sync Methods Guide -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                        <i data-lucide="terminal" class="w-4 h-4"></i>
                        <span>方法 1: Pythonスクリプトで一括自動同期</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        フォルダ内に新しいPDFやTXTを入れた後、ターミナルで以下のコマンドを実行するだけで全ファイルを再スキャンしてHTMLを完全同期します：
                    </p>
                    <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <code>python3 update_portal.py</code>
                        <button onclick="navigator.clipboard.writeText('python3 update_portal.py'); alert('コマンドをコピーしました！')" class="text-slate-500 hover:text-slate-300 text-[10px] uppercase font-sans">コピー</button>
                    </div>
                </div>

                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                        <span>方法 2: フォルダ常時監視（Watcher）</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        常駐スクリプトを立ち上げておけば、フォルダにファイルが保存された瞬間に自動で解析・HTMLが更新されます：
                    </p>
                    <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-400 flex items-center justify-between">
                        <code>python3 watch_meetings.py</code>
                        <button onclick="navigator.clipboard.writeText('python3 watch_meetings.py'); alert('コマンドをコピーしました！')" class="text-slate-500 hover:text-slate-300 text-[10px] uppercase font-sans">コピー</button>
                    </div>
                </div>
            </div>

            <!-- Manual Add Form -->
            <div class="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h4 class="text-base font-bold text-white flex items-center space-x-2">
                    <i data-lucide="edit-3" class="w-4 h-4 text-indigo-400"></i>
                    <span>手動での会議・分析メモの直接入力</span>
                </h4>

                <form id="add-meeting-form" onsubmit="handleAddNewMeeting(event)" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">開催日 (YYYY-MM-DD)</label>
                            <input type="date" id="new-date" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">主要テーマ・アジェンダ</label>
                            <input type="text" id="new-theme" placeholder="例: 9月目標設定・新規チャネル開拓・シリーズA調達進捗" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">概要サマリー (何が議論・決定されたか)</label>
                        <textarea id="new-summary" rows="3" placeholder="会議全体の要約を入力..." required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">日置さんの重要意思決定・指摘 (改行区切り)</label>
                        <textarea id="new-decisions" rows="3" placeholder="・見込み3倍ルールの再徹底&#10;・顧問料の削減を指示&#10;・成約＝相談数×成功率での日次追跡を要求" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold text-slate-300 mb-1">日置さんの実際の発言・名言 (改行区切り)</label>
                        <textarea id="new-quotes" rows="2" placeholder="「数字で語れないなら経営じゃない」「スピードは唯一の競争優位」" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">タグ (カンマ区切り)</label>
                            <input type="text" id="new-tags" placeholder="逆算設計, 資金調達, ユニットエコノミクス" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                        </div>
                        <div class="flex items-end">
                            <button type="submit" class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30">
                                <i data-lucide="check" class="w-4 h-4"></i>
                                <span>データを追加してポータルを更新</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Export / Import & Storage Tools -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <h5 class="text-sm font-bold text-white flex items-center space-x-2">
                        <i data-lucide="download" class="w-4 h-4 text-emerald-400"></i>
                        <span>JSONデータのエクスポート</span>
                    </h5>
                    <p class="text-xs text-slate-400">
                        現在蓄積されている全経営会議データをJSONファイルとしてダウンロードします。
                    </p>
                    <button onclick="exportDataJSON()" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center space-x-2">
                        <i data-lucide="file-json" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>全データをダウンロード (JSON)</span>
                    </button>
                </div>

                <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                    <h5 class="text-sm font-bold text-white flex items-center space-x-2">
                        <i data-lucide="upload" class="w-4 h-4 text-indigo-400"></i>
                        <span>JSONデータのインポート</span>
                    </h5>
                    <p class="text-xs text-slate-400">
                        保存したJSONファイルを読み込んでポータルのデータを同期します。
                    </p>
                    <input type="file" id="import-json-file" accept=".json" class="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500" onchange="importDataJSON(event)">
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800/80 mt-16 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>株式会社VEXUM CFO Intelligence & Knowledge Architecture System | Ver 3.0</p>
        <p>Continuous Integration & Intelligent Auto-Sync Enabled | Prepared for High-Performance Team</p>
    </footer>

    <!-- Core Interactive JavaScript -->
    <script>
        let chronicleData = {chronicle_json_str};
        const drillsData = {drills_json_str};

        // Check local storage
        const storedData = localStorage.getItem('vexum_chronicle_data');
        if (storedData) {{
            try {{
                chronicleData = JSON.parse(storedData);
            }} catch(e) {{
                console.error("Failed to parse localStorage data", e);
            }}
        }}

        let drillResults = {{}};

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

        function toggleTheme() {{
            const html = document.documentElement;
            const btnText = document.getElementById('theme-btn-text');
            if (html.classList.contains('dark')) {{
                html.classList.remove('dark');
                html.classList.add('light');
                btnText.textContent = 'ダーク';
                document.body.classList.remove('bg-darkBg', 'text-slate-100');
                document.body.classList.add('bg-slate-50', 'text-slate-900');
            }} else {{
                html.classList.remove('light');
                html.classList.add('dark');
                btnText.textContent = 'ライト';
                document.body.classList.remove('bg-slate-50', 'text-slate-900');
                document.body.classList.add('bg-darkBg', 'text-slate-100');
            }}
            lucide.createIcons();
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
            document.getElementById('res-appo-daily').textContent = `日次: 約${{dailyAppos}}件 (20営業日換算)`;
            document.getElementById('res-pipeline-3x').textContent = pipeline3x.toLocaleString();
            document.getElementById('res-leader-count').textContent = requiredLeaders.toLocaleString();
            document.getElementById('res-monthly-sales').textContent = monthlySalesMan + '万';
            document.getElementById('res-intern-budget').textContent = internBudgetMan + '万';
        }}

        function renderChronicleCards(dataToRender) {{
            const container = document.getElementById('chronicle-container');
            const totalCountEl = document.getElementById('chronicle-total-count');
            if (totalCountEl) totalCountEl.textContent = dataToRender.length;
            container.innerHTML = '';

            if (dataToRender.length === 0) {{
                container.innerHTML = `
                    <div class="text-center py-12 glass-card rounded-2xl text-slate-400">
                        <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
                        <p class="text-sm">該当する経営会議データが見つかりませんでした。</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }}

            dataToRender.forEach((m, idx) => {{
                const card = document.createElement('div');
                card.className = "glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition duration-200 space-y-4";
                
                const tagsHtml = (m.tags || []).map(t => `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">${{t}}</span>`).join(' ');

                const decisionsHtml = (m.yusuke_decisions || []).map(d => `<li class="leading-relaxed"><strong class="text-white">${{d.split('：')[0] || ''}}</strong>${{d.includes('：') ? '：' + d.split('：').slice(1).join('：') : d}}</li>`).join('');

                const quotesHtml = (m.quotes || []).map(q => `
                    <div class="bg-indigo-950/20 border-l-2 border-indigo-500 p-2.5 rounded-r-lg text-xs text-indigo-200 italic">
                        💬 "${{q}}"
                    </div>
                `).join('');

                const kpisHtml = (m.kpis || []).map(k => `
                    <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
                        <div class="text-[10px] text-slate-400">${{k.label}}</div>
                        <div class="text-xs font-bold text-white font-mono mt-0.5">${{k.value}}</div>
                    </div>
                `).join('');

                const actionsHtml = (m.actions || []).map(a => `
                    <div class="text-[11px] flex items-start space-x-2 text-slate-300">
                        <span class="px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-mono font-bold shrink-0">${{a.assignee}}</span>
                        <span><strong>${{a.task}}</strong>: ${{a.detail}}</span>
                    </div>
                `).join('');

                card.innerHTML = `
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div class="flex items-center space-x-3">
                            <span class="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold text-xs border border-indigo-500/30">
                                第${{idx + 1}}回
                            </span>
                            <h4 class="text-base font-bold text-white">${{m.display_date || m.date}}</h4>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            ${{tagsHtml}}
                        </div>
                    </div>

                    <div>
                        <h5 class="text-sm font-bold text-indigo-300 mb-1.5">${{m.theme}}</h5>
                        <p class="text-xs text-slate-300 leading-relaxed">${{m.summary}}</p>
                    </div>

                    ${{kpisHtml ? `
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        ${{kpisHtml}}
                    </div>` : ''}}

                    <div class="space-y-2 pt-2 border-t border-slate-800">
                        <div class="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i>
                            <span>日置さんの重要意思決定・指摘事項</span>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            ${{decisionsHtml}}
                        </ul>
                    </div>

                    ${{quotesHtml ? `
                    <div class="space-y-1.5 pt-1">
                        ${{quotesHtml}}
                    </div>` : ''}}

                    ${{actionsHtml ? `
                    <div class="pt-2 border-t border-slate-800 space-y-1.5">
                        <div class="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                            <i data-lucide="list-todo" class="w-3 h-3 text-slate-400"></i>
                            <span>決定アクションアイテム</span>
                        </div>
                        <div class="space-y-1">
                            ${{actionsHtml}}
                        </div>
                    </div>` : ''}}
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
                card.className = "bg-slate-800/40 p-5 rounded-xl border border-slate-700/60 space-y-3";
                card.id = `drill-${{d.id}}`;

                const optionsHtml = d.options.map(opt => `
                    <button onclick="handleAnswerDrill(${{d.id}}, '${{opt.key}}')" class="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 transition text-slate-300 text-xs">
                        <strong class="text-indigo-400">${{opt.key}}.</strong> ${{opt.text}}
                    </button>
                `).join('');

                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Q${{d.id}}</span>
                            <span class="text-xs text-slate-400">${{d.category}}</span>
                        </div>
                        <span class="text-xs text-slate-400 font-semibold" id="drill-${{d.id}}-status">未回答</span>
                    </div>
                    <p class="text-sm font-semibold text-white">
                        ${{d.question}}
                    </p>
                    <div class="space-y-2 text-xs">
                        ${{optionsHtml}}
                    </div>
                    <div id="drill-${{d.id}}-ans" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
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

            resultEl.classList.remove('hidden', 'bg-emerald-950/40', 'border-emerald-500/40', 'text-emerald-300', 'bg-rose-950/40', 'border-rose-500/40', 'text-rose-300');

            if (choice === drill.correct) {{
                resultEl.classList.add('bg-emerald-950/40', 'border', 'border-emerald-500/40', 'text-emerald-200');
                resultEl.innerHTML = `<div class="font-bold text-emerald-400 mb-1 flex items-center space-x-1"><i data-lucide="check-circle" class="w-4 h-4"></i><span>正解！ 正しい日置さんの思考です。</span></div>${{drill.explanation}}`;
                statusEl.textContent = '正解 ✅';
                statusEl.className = 'text-xs font-bold text-emerald-400';
                drillResults[qId] = true;
            }} else {{
                resultEl.classList.add('bg-rose-950/40', 'border', 'border-rose-500/40', 'text-rose-200');
                resultEl.innerHTML = `<div class="font-bold text-rose-400 mb-1 flex items-center space-x-1"><i data-lucide="x-circle" class="w-4 h-4"></i><span>不正解（正解: ${{drill.correct}}）</span></div>${{drill.explanation}}`;
                statusEl.textContent = '要復習 ❌';
                statusEl.className = 'text-xs font-bold text-rose-400';
                drillResults[qId] = false;
            }}

            const correctCount = Object.values(drillResults).filter(v => v === true).length;
            document.getElementById('drill-score').textContent = correctCount;
            lucide.createIcons();
        }}

        // In-Browser Drag & Drop PDF / TXT Parsing
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {{
            ['dragenter', 'dragover'].forEach(eventName => {{
                dropZone.addEventListener(eventName, (e) => {{
                    e.preventDefault();
                    dropZone.classList.add('dropzone-active');
                }}, false);
            }});
            ['dragleave', 'drop'].forEach(eventName => {{
                dropZone.addEventListener(eventName, (e) => {{
                    e.preventDefault();
                    dropZone.classList.remove('dropzone-active');
                }}, false);
            }});
            dropZone.addEventListener('drop', (e) => {{
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            }}, false);
        }}

        function handleFileDropSelect(e) {{
            handleFiles(e.target.files);
        }}

        async function handleFiles(files) {{
            if (!files || files.length === 0) return;
            const statusEl = document.getElementById('drop-loading-status');
            statusEl.classList.remove('hidden');

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
                    const parsedMeeting = parseDocumentInBrowser(file.name, text);
                    if (parsedMeeting) {{
                        chronicleData.unshift(parsedMeeting);
                        addedCount++;
                    }}
                }}
            }}

            statusEl.classList.add('hidden');

            if (addedCount > 0) {{
                localStorage.setItem('vexum_chronicle_data', JSON.stringify(chronicleData));
                renderChronicleCards(chronicleData);
                alert(`${{addedCount}} 件のドキュメントを解析してポータルを自動更新しました！`);
                switchTab('tab-chronicle');
            }} else {{
                alert('ファイルの解析に失敗しました。有効なPDFまたはTXTファイルを選択してください。');
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
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\\n';
                }}
                return fullText;
            }} catch(err) {{
                console.error("PDF extract error:", err);
                return "";
            }}
        }}

        function parseDocumentInBrowser(fileName, text) {{
            const mDate = fileName.match(/2026[_\-](\\d{{2}})[_\-](\\d{{2}})/);
            const dateStr = mDate ? `2026-${{mDate[1]}}-${{mDate[2]}}` : new Date().toISOString().slice(0, 10);
            const displayDate = mDate ? `2026年${{parseInt(mDate[1])}}月${{parseInt(mDate[2])}}日` : `${{dateStr}} (ドロップ追加)`;

            // Extract summary
            let summary = "";
            const ovMatch = text.match(/概要\\s*([\\s\\S]*?)(?=次のステップ|文字起こし|添付ファイル|$)/);
            if (ovMatch) {{
                summary = ovMatch[1].replace(/\\s+/g, ' ').trim().slice(0, 300);
            }} else {{
                summary = text.slice(0, 250).replace(/\\s+/g, ' ').trim();
            }}

            // Extract Yusuke points
            const bullets = text.split('\\n').filter(l => l.trim().startsWith('●') || l.trim().startsWith('*') || l.trim().startsWith('・'));
            const yusukeDecisions = bullets.map(b => b.replace(/^[●*・\\-]\\s*/, '').trim()).filter(b => b.includes('Yusuke') || b.includes('日置') || b.includes('目標') || b.includes('逆算') || b.includes('利益') || b.includes('原価')).slice(0, 5);

            if (yusukeDecisions.length === 0) {{
                yusukeDecisions.push("経営数値の進捗確認と重要意思決定を実行。");
            }}

            return {{
                date: dateStr,
                display_date: displayDate,
                theme: `${{displayDate}} 経営進捗・意思決定`,
                summary: summary || "経営会議ログ",
                yusuke_decisions: yusukeDecisions,
                quotes: [],
                kpis: [
                    {{ label: "登録ファイル", value: fileName }}
                ],
                actions: [],
                tags: ["ドキュメント追加", "自動解析"]
            }};
        }}

        function handleAddNewMeeting(e) {{
            e.preventDefault();
            const date = document.getElementById('new-date').value;
            const theme = document.getElementById('new-theme').value;
            const summary = document.getElementById('new-summary').value;
            const decisionsRaw = document.getElementById('new-decisions').value;
            const quotesRaw = document.getElementById('new-quotes').value;
            const tagsRaw = document.getElementById('new-tags').value;

            const decisions = decisionsRaw.split('\\n').map(s => s.trim().replace(/^[●*・\\-]/, '')).filter(s => s.length > 0);
            const quotes = quotesRaw.split('\\n').map(s => s.trim().replace(/^["「]/, '').replace(/["」]$/, '')).filter(s => s.length > 0);
            const tags = tagsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

            const newRecord = {{
                date: date,
                display_date: `${{date}} (追加ミーティング)`,
                theme: theme,
                summary: summary,
                yusuke_decisions: decisions,
                quotes: quotes,
                tags: tags.length > 0 ? tags : ['追加議事録'],
                kpis: [],
                actions: []
            }};

            chronicleData.unshift(newRecord);
            localStorage.setItem('vexum_chronicle_data', JSON.stringify(chronicleData));

            alert('新しい経営会議データを正常に追加・保存しました！');
            document.getElementById('add-meeting-form').reset();
            renderChronicleCards(chronicleData);
            switchTab('tab-chronicle');
        }}

        function exportDataJSON() {{
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chronicleData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `vexum_cfo_intelligence_${{new Date().toISOString().slice(0,10)}}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }}

        function importDataJSON(event) {{
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {{
                try {{
                    const imported = JSON.parse(e.target.result);
                    if (Array.isArray(imported)) {{
                        chronicleData = imported;
                        localStorage.setItem('vexum_chronicle_data', JSON.stringify(chronicleData));
                        renderChronicleCards(chronicleData);
                        alert('JSONデータを正常にインポートしました！');
                        switchTab('tab-chronicle');
                    }} else {{
                        alert('JSONデータのフォーマットが正しくありません。');
                    }}
                }} catch(err) {{
                    alert('JSONの読み込みに失敗しました: ' + err.message);
                }}
            }};
            reader.readAsText(file);
        }}

        document.addEventListener('DOMContentLoaded', () => {{
            lucide.createIcons();
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
    print(f"Generated HTML successfully at: {output_path}")
