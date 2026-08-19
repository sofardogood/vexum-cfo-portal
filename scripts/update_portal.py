#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VEXUM CFO Intelligence Portal - 自動同期 & 更新スクリプト
meetings/ ディレクトリ内のすべてのPDF、DOCX、TXTファイルをスキャン・自動解析し、
最新の経営会議データを取り込んで HTML ポータルおよび data/chronicle.json を更新します。
"""

import os
import glob
import re
import json
import subprocess
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPTS_DIR)
MEETINGS_DIR = os.path.join(PROJECT_ROOT, 'meetings')
HTML_OUTPUT_PATH = os.path.join(PROJECT_ROOT, '日置さん_CFOインテリジェンス_ポータル.html')
DATA_JSON_PATH = os.path.join(PROJECT_ROOT, 'data', 'chronicle.json')

def extract_text_from_pdf(pdf_path):
    try:
        res = subprocess.run(['pdftotext', pdf_path, '-'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return res.stdout
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Namespace for docx
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in tree.iterfind('.//w:p', namespaces):
                texts = [node.text for node in p.iterfind('.//w:t', namespaces) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        print(f"Error reading DOCX {docx_path}: {e}")
        return ""

def extract_text_from_file(file_path):
    lower = file_path.lower()
    if lower.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif lower.endswith('.docx'):
        return extract_text_from_docx(file_path)
    elif lower.endswith('.txt'):
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as fp:
            return fp.read()
    return ""

def parse_meeting_document(file_path, content):
    fname = os.path.basename(file_path)
    if not content.strip():
        return None
        
    m_date = re.search(r'2026[_\-](\d{2})[_\-](\d{2})', fname)
    if m_date:
        date_str = f"2026-{m_date.group(1)}-{m_date.group(2)}"
        display_date = f"2026年{int(m_date.group(1))}月{int(m_date.group(2))}日"
    else:
        mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
        date_str = mtime.strftime("%Y-%m-%d")
        display_date = mtime.strftime("%Y年%m月%d日 (自動検出)")

    summary = ""
    m_ov = re.search(r'概要\s*\n(.*?)(?=\n[^\n]+[：:]|\n次のステップ|\n📖|\n文字起こし|\n添付ファイル|\Z)', content, re.DOTALL)
    if m_ov:
        summary = ' '.join(m_ov.group(1).split()).strip()
    elif '概要' in content:
        parts = content.split('概要', 1)[1]
        summary = ' '.join(parts[:400].split()).strip()
    else:
        clean_lines = [l.strip() for l in content.split('\n') if len(l.strip()) > 10 and not l.startswith('📝') and not 'http' in l]
        summary = ' '.join(clean_lines[:3])

    theme = ""
    headers = re.findall(r'\n([^\n：:]{3,25})\n(?=[●*・]|営業|採用|財務|目標)', content)
    if headers:
        theme = ' ・ '.join(headers[:3])
    else:
        theme = f"{display_date} 経営進捗・意思決定"

    bullets = [l.strip() for l in content.split('\n') if l.strip().startswith(('●', '*', '・', '-'))]
    yusuke_decisions = []
    
    for b in bullets:
        clean_b = re.sub(r'^[●*・\-]\s*', '', b).strip()
        if any(w in clean_b for w in ['Yusuke', '日置', '代表', '方針', '決定', '指示', '規律', '目標', '逆算', 'スピード', '原価', '利益', 'CRM', '見込み']):
            yusuke_decisions.append(clean_b)

    yusuke_dialogues = re.findall(r'Yusuke[：:]\s*(.*?)(?=\n[^\n：:]+[：:]|\Z)', content, re.DOTALL)
    cleaned_dialogues = [' '.join(t.split()).strip() for t in yusuke_dialogues if len(t.strip()) > 15]

    if len(yusuke_decisions) < 2 and cleaned_dialogues:
        for d in cleaned_dialogues[:4]:
            if len(d) > 25:
                yusuke_decisions.append(f"日置発言：「{d[:100]}...」")

    quotes = []
    for d in cleaned_dialogues:
        if any(w in d for w in ['数字', '逆算', '投資家', '原価', '利益', 'マスト', '再現性', 'スピード', '見込み', '3倍', 'CRM', 'チャーン', '解約', '3000社', '着地']):
            if 20 < len(d) < 150:
                quotes.append(d)

    actions = []
    for m in re.finditer(r'\[([^\]]+)\]\s*([^:\n]+)[:：]\s*([^\n\r]+)', content):
        actions.append({
            'assignee': m.group(1).strip(),
            'task': m.group(2).strip(),
            'detail': m.group(3).strip()
        })

    kpis = []
    kpi_patterns = [
        (r'(\d+[\d,]*\s*社)', '社数指標'),
        (r'(\d+[\d,]*\s*件)', '件数目標/実績'),
        (r'(\d+[\d,]*\s*万円|\d+[\d,]*\s*億円)', '金額指標'),
        (r'(\d+(?:\.\d+)?\s*%)', '転換率/比率')
    ]
    found_vals = set()
    for pat, label in kpi_patterns:
        for val in re.findall(pat, content):
            if val not in found_vals and len(val) < 15:
                found_vals.add(val)
                kpis.append({'label': label, 'value': val})
                if len(kpis) >= 4:
                    break
        if len(kpis) >= 4:
            break

    tags = []
    if file_path.lower().endswith('.docx'):
        tags.append('DOCX')
    tag_keywords = [
        ('逆算', '逆算設計'),
        ('調達', '資金調達'),
        ('シリーズA', 'シリーズA'),
        ('黒字', '単月黒字'),
        ('原価', 'ユニットエコノミクス'),
        ('解約', '解約率チャーン'),
        ('チャーン', '解約率チャーン'),
        ('3000社', '3000社目標'),
        ('CRM', 'CRMデータ整合性'),
        ('SFA', 'SFA導入'),
        ('育成', '社内育成'),
        ('派遣', '法務ガバナンス'),
        ('M&A', '新規事業M&A'),
        ('見込み', '見込み管理')
    ]
    for kw, tag_name in tag_keywords:
        if kw in content and tag_name not in tags:
            tags.append(tag_name)
    if not tags:
        tags.append('経営会議')

    return {
        'date': date_str,
        'display_date': display_date,
        'theme': theme,
        'summary': summary or "経営数値の進捗確認と重要意思決定。",
        'yusuke_decisions': yusuke_decisions[:6],
        'quotes': quotes[:3],
        'kpis': kpis[:4],
        'actions': actions[:5],
        'tags': tags[:4],
        'source_file': fname
    }

def main():
    print("==================================================")
    print("🚀 VEXUM CFO Intelligence Portal - 自動同期開始")
    print("==================================================")
    
    files = sorted(
        glob.glob(os.path.join(MEETINGS_DIR, '*.pdf')) + 
        glob.glob(os.path.join(MEETINGS_DIR, '*.docx')) + 
        glob.glob(os.path.join(MEETINGS_DIR, '*.txt'))
    )
    print(f"📁 検出ファイル数: {len(files)} 件 in {MEETINGS_DIR}")
    
    meetings = []
    for f in files:
        fname = os.path.basename(f)
        if fname in ['transcript.txt', 'requirements.txt']:
            if fname == 'transcript.txt':
                content = extract_text_from_file(f)
                rec = parse_meeting_document(f, content)
                if rec:
                    rec['display_date'] = "2026年8月最新 (transcript.txt)"
                    rec['theme'] = "8月着地見込み（13〜18社）・代理店/紹介チャネル多角化"
                    rec['tags'] = ['最新進捗', '代理店戦略', 'ファネル分析']
                    meetings.append(rec)
            continue
            
        content = extract_text_from_file(f)
        rec = parse_meeting_document(f, content)
        if rec:
            meetings.append(rec)
            print(f"  ✓ 解析完了: {fname} -> {rec['display_date']} ({rec['theme'][:25]}...)")

    meetings = sorted(meetings, key=lambda x: x['date'])

    os.makedirs(os.path.dirname(DATA_JSON_PATH), exist_ok=True)
    with open(DATA_JSON_PATH, 'w', encoding='utf-8') as fp:
        json.dump(meetings, fp, ensure_ascii=False, indent=2)
    print(f"💾 JSONデータ保存完了: {DATA_JSON_PATH} (全 {len(meetings)} 会議)")

    import sys
    sys.path.append(SCRIPTS_DIR)
    from generate_portal_lib import generate_html
    generate_html(meetings, HTML_OUTPUT_PATH)
    print(f"🎉 HTMLポータル更新完了: {HTML_OUTPUT_PATH}")
    print("==================================================")

if __name__ == '__main__':
    main()
