'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud, CheckCircle, FileText } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

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
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      const msg = githubCommitted 
        ? `🎉 ${successCount} 件のファイルを解析し、GitHubリポジトリに自動コミット＆全ページのデータを更新しました！` 
        : `✓ ${successCount} 件のファイルを解析し、全ページのデータを更新しました！`;
      setUploadMessage(msg);
      alert(msg);
      router.push('/chronicle');
    } else {
      alert('ファイルの解析に失敗しました。PDF, Word(DOCX), またはTXT形式のファイルを選択してください。');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f1419]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-white">
        
        {/* Page Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            5. ドキュメント投入 ＆ GitHub自動同期
          </h2>
          <p className="text-xs text-slate-500">
            PDF、Word（DOCX）、TXT形式の会議メモや議事録をドロップすると、全自動で解析されGitHubに保存・全ページが最新化されます。
          </p>
        </div>

        {/* Drag & Drop Area */}
        <div 
          className="border-2 border-dashed border-slate-300 hover:border-slate-900 p-10 rounded-xl text-center space-y-4 transition cursor-pointer bg-white" 
          onClick={() => document.getElementById('drop-file-input')?.click()}
        >
          <input 
            type="file" 
            id="drop-file-input" 
            accept=".pdf,.txt,.docx,.doc" 
            multiple 
            className="hidden" 
            onChange={e => handleFileUpload(e.target.files)} 
          />
          <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              ここにPDF・Word (DOCX)・TXTファイルをドラッグ＆ドロップ
            </h4>
            <p className="text-xs text-slate-500">
              またはクリックしてファイルを選択（Vercel上でGitHubに直接コミットされます）
            </p>
          </div>
          {isUploading && (
            <div className="text-xs font-bold text-slate-900 animate-pulse">
              ファイルを解析中... 日置さんの意思決定・KPIを抽出して全体同期中...
            </div>
          )}
        </div>

        {/* Sync checklist */}
        <div className="border border-slate-200 rounded-xl p-6 space-y-4 bg-white">
          <h4 className="text-sm font-bold text-slate-900">
            ドキュメント投入時に自動同期される全項目
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>1. 人物像サマリー</strong>: 最新会議のテーマと重要方針がトップに反映
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>2. 必見KPI指標</strong>: 蓄積された最新数値（売上・社数・転換率）を集計
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>3. 逆算シミュレーター</strong>: 最新の転換率・目標値が即座に連動
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>4. 完全クロニクル</strong>: タイムラインの最上部に新規カードとして追加
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>5. 思考ドリル</strong>: 日置さんの意思決定・名言が学習データに蓄積
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              ✓ <strong>6. GitHub永続化</strong>: 原本ファイルと `chronicle.json` がリポジトリへ自動Push
            </div>
          </div>
        </div>

        {/* Page Nav Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <Link 
            href="/roadmap" 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>前へ: 4. 思考ドリル</span>
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <span>トップ: 1. 人物像 & CFO思考OS</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
