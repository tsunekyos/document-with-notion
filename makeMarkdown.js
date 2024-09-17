const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require('node:fs').promises;
const path = require('node:path');
require('dotenv').config();

// 設定
const CONFIG = {
  OUTPUT_DIR: 'notion',
  PAGE_LIST_FILE: 'page-list.json'
};

// Notionクライアントの初期化
const notion = new Client({ auth: process.env.NOTION_SECRET });
const n2m = new NotionToMarkdown({ 
  notionClient: notion,
  config: { separateChildPage: true }
});

// ディレクトリの存在確認と作成
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
    console.log(`Directory ${dirPath} already exists.`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Directory ${dirPath} created successfully.`);
    } else {
      throw error;
    }
  }
}

// Markdownコンテンツの抽出
function extractMarkdownContent(mdString) {
  if (typeof mdString === 'string') {
    try {
      const parsedContent = JSON.parse(mdString);
      return parsedContent.parent || parsedContent;
    } catch (error) {
      return mdString;
    }
  } else if (typeof mdString === 'object') {
    return mdString.parent || JSON.stringify(mdString, null, 2);
  }
  return String(mdString);
}

// ページリストの読み込み
async function loadPageList(filePath) {
  const pageListData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(pageListData);
}

// 単一ページの処理
async function processPage(page) {
  console.log(`Processing page: ${page.title}`);
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);
  const contentToWrite = extractMarkdownContent(mdString);
  const finalContent = typeof contentToWrite === 'string' ? contentToWrite : JSON.stringify(contentToWrite, null, 2);
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${page.id}.md`);
  await fs.writeFile(filePath, finalContent);
  console.log(`Markdown saved for page: ${page.title}`);
}

// メイン処理
async function main() {
  try {
    await ensureDirectoryExists(CONFIG.OUTPUT_DIR);
    const pageList = await loadPageList(CONFIG.PAGE_LIST_FILE);

    const results = await Promise.allSettled(pageList.map(processPage));

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Error processing page ${pageList[index].title}:`, result.reason);
      }
    });

    console.log('All pages processed');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// プログラムの実行
main().catch(error => console.error('Unhandled error:', error));