import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  // If GitHub credentials are provided, fetch from GitHub API
  if (token && owner && repo) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/chronicle.json?ref=${branch}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Vexum-CFO-Portal'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        const json = await res.json();
        const content = Buffer.from(json.content, 'base64').toString('utf-8');
        const data = JSON.parse(content);
        return NextResponse.json({ success: true, source: 'github', data });
      }
    } catch (e: any) {
      console.error('Error fetching from GitHub:', e);
    }
  }

  // Fallback to local file
  try {
    const filePath = path.join(process.cwd(), 'data', 'chronicle.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, source: 'local', data });
    }
  } catch (e: any) {
    console.error('Error reading local file:', e);
  }

  return NextResponse.json({ success: false, data: [] }, { status: 500 });
}
