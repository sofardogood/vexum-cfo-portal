#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import time
import subprocess
import glob

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPTS_DIR)
MEETINGS_DIR = os.path.join(PROJECT_ROOT, 'meetings')

def get_files_fingerprint():
    files = glob.glob(os.path.join(MEETINGS_DIR, '*.pdf')) + glob.glob(os.path.join(MEETINGS_DIR, '*.txt'))
    fingerprint = {}
    for f in files:
        fname = os.path.basename(f)
        if fname in ['requirements.txt']:
            continue
        try:
            mtime = os.path.getmtime(f)
            size = os.path.getsize(f)
            fingerprint[f] = (mtime, size)
        except OSError:
            pass
    return fingerprint

def main():
    print("==================================================")
    print("👀 VEXUM CFO Intelligence - フォルダ常時監視開始")
    print(f"📁 監視フォルダ: {MEETINGS_DIR}")
    print("💡 新しいPDFやTXTファイルが追加されると自動でポータルが更新されます")
    print("   (終了するには Ctrl + C を押してください)")
    print("==================================================")

    last_fp = get_files_fingerprint()
    subprocess.run(['python3', os.path.join(SCRIPTS_DIR, 'update_portal.py')])

    while True:
        try:
            time.sleep(2)
            current_fp = get_files_fingerprint()

            if current_fp != last_fp:
                added = [os.path.basename(f) for f in current_fp if f not in last_fp]
                modified = [os.path.basename(f) for f in current_fp if f in last_fp and current_fp[f] != last_fp[f]]
                deleted = [os.path.basename(f) for f in last_fp if f not in current_fp]

                changes = []
                if added: changes.append(f"新規追加: {', '.join(added)}")
                if modified: changes.append(f"変更: {', '.join(modified)}")
                if deleted: changes.append(f"削除: {', '.join(deleted)}")

                print(f"\n⚡ ファイル変更を検知 ({'; '.join(changes)})")
                print("🔄 ポータルを自動再同期中...")
                subprocess.run(['python3', os.path.join(SCRIPTS_DIR, 'update_portal.py')])
                last_fp = current_fp

        except KeyboardInterrupt:
            print("\n🛑 監視を終了しました。")
            break

if __name__ == '__main__':
    main()
