import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
// @ts-ignore
import mammoth from 'mammoth';

export const dynamic = 'force-dynamic';

function parseMeetingText(fileName: string, text: string) {
  const mDate = fileName.match(/2026[_\-](\d{2})[_\-](\d{2})/);
  const dateStr = mDate ? `2026-${mDate[1]}-${mDate[2]}` : new Date().toISOString().slice(0, 10);
  const displayDate = mDate ? `2026年${parseInt(mDate[1])}月${parseInt(mDate[2])}日` : `${dateStr} (アップロード)`;

  // Summary
  let summary = "";
  const ovMatch = text.match(/概要\s*([\s\S]*?)(?=次のステップ|文字起こし|添付ファイル|📖|$)/);
  if (ovMatch) {
    summary = ovMatch[1].replace(/\s+/g, ' ').trim().slice(0, 350);
  } else {
    summary = text.slice(0, 300).replace(/\s+/g, ' ').trim();
  }

  // Theme
  let theme = `${displayDate} 経営進捗・意思決定`;
  const headerMatch = text.match(/\n([^\n：:]{3,25})\n(?=[●*・]|営業|採用|財務|目標)/);
  if (headerMatch) {
    theme = headerMatch[1].trim();
  }

  // Yusuke decisions
  const bullets = text.split('\n').filter(l => l.trim().startsWith('●') || l.trim().startsWith('*') || l.trim().startsWith('・') || l.trim().startsWith('-'));
  let yusukeDecisions = bullets
    .map(b => b.replace(/^[●*・\-]\s*/, '').trim())
    .filter(b => b.includes('Yusuke') || b.includes('日置') || b.includes('目標') || b.includes('逆算') || b.includes('利益') || b.includes('原価') || b.includes('スピード') || b.includes('CRM') || b.includes('見込み'))
    .slice(0, 6);

  if (yusukeDecisions.length === 0) {
    yusukeDecisions = ["経営数値の進捗確認と重要意思決定を実行。"];
  }

  // Quotes
  const quotes: string[] = [];
  const yusukeDialogues = text.match(/Yusuke[：:]\s*([^\n]+)/g);
  if (yusukeDialogues) {
    yusukeDialogues.forEach(d => {
      const clean = d.replace(/Yusuke[：:]\s*/, '').trim();
      if (clean.length > 20 && clean.length < 120 && (clean.includes('数字') || clean.includes('逆算') || clean.includes('利益') || clean.includes('スピード'))) {
        quotes.push(clean);
      }
    });
  }

  // KPIs
  const kpis = [
    { label: "登録ファイル", value: fileName }
  ];
  const dealMatch = text.match(/(\d+[\d,]*\s*社|\d+[\d,]*\s*件)/);
  if (dealMatch) kpis.push({ label: "注目指標", value: dealMatch[1] });
  const moneyMatch = text.match(/(\d+[\d,]*\s*万円|\d+[\d,]*\s*億円)/);
  if (moneyMatch) kpis.push({ label: "金額指標", value: moneyMatch[1] });

  // Tags
  const tags = ["新規追加", "自動解析"];
  if (fileName.endsWith('.docx')) tags.push("DOCX");
  if (text.includes("逆算")) tags.push("逆算設計");
  if (text.includes("調達") || text.includes("シリーズA")) tags.push("資金調達");
  if (text.includes("黒字") || text.includes("利益")) tags.push("ユニットエコノミクス");

  return {
    date: dateStr,
    display_date: displayDate,
    theme: theme,
    summary: summary || "経営会議ログ",
    yusuke_decisions: yusukeDecisions,
    quotes: quotes.slice(0, 3),
    kpis: kpis,
    actions: [],
    tags: tags
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith('.pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (lowerName.endsWith('.docx')) {
      const docxResult = await mammoth.extractRawText({ buffer: buffer });
      extractedText = docxResult.value;
    } else {
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ success: false, error: 'Failed to extract text from file' }, { status: 400 });
    }

    // Parse meeting record
    const newMeeting = parseMeetingText(fileName, extractedText);

    // GitHub Commit credentials
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    let githubCommitSuccess = false;

    if (token && owner && repo) {
      try {
        // 1. Fetch current chronicle.json SHA and content from GitHub
        const jsonFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data/chronicle.json?ref=${branch}`;
        const getRes = await fetch(jsonFileUrl, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vexum-CFO-Portal'
          },
          cache: 'no-store'
        });

        let currentData = [];
        let fileSha = '';

        if (getRes.ok) {
          const fileInfo = await getRes.json();
          fileSha = fileInfo.sha;
          const oldContent = Buffer.from(fileInfo.content, 'base64').toString('utf-8');
          currentData = JSON.parse(oldContent);
        }

        // Add new meeting to start
        currentData.unshift(newMeeting);
        const updatedJsonBase64 = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');

        // 2. Commit updated chronicle.json to GitHub
        const putJsonRes = await fetch(jsonFileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vexum-CFO-Portal',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `feat(meetings): Add ${newMeeting.display_date} meeting via portal upload`,
            content: updatedJsonBase64,
            sha: fileSha || undefined,
            branch: branch
          })
        });

        // 3. Also commit the raw uploaded file into `meetings/` folder on GitHub
        const rawFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/meetings/${encodeURIComponent(fileName)}?ref=${branch}`;
        await fetch(rawFileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vexum-CFO-Portal',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `docs(meetings): Upload raw file ${fileName}`,
            content: buffer.toString('base64'),
            branch: branch
          })
        });

        if (putJsonRes.ok) {
          githubCommitSuccess = true;
        }
      } catch (ghErr: any) {
        console.error('GitHub API error:', ghErr);
      }
    }

    // Also update local file if running locally
    try {
      const localJsonPath = path.join(process.cwd(), 'data', 'chronicle.json');
      if (fs.existsSync(localJsonPath)) {
        const localContent = fs.readFileSync(localJsonPath, 'utf-8');
        const localData = JSON.parse(localContent);
        localData.unshift(newMeeting);
        fs.writeFileSync(localJsonPath, JSON.stringify(localData, null, 2), 'utf-8');
      }
    } catch (localErr) {
      console.error('Local file write error:', localErr);
    }

    return NextResponse.json({
      success: true,
      githubCommitted: githubCommitSuccess,
      meeting: newMeeting
    });

  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
