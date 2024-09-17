const fs = require('node:fs');
const axios = require('axios');
require('dotenv').config();

const NOTION_SECRET = process.env.NOTION_SECRET;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

async function fetchNotionPages() {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
      { page_size: 100 },
      {
        headers: {
          'Authorization': `Bearer ${NOTION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );

    const pages = response.data.results.map(page => ({
      id: page.id,
      title: page.properties.Name.title[0].plain_text,
      url: page.url
    }));

    fs.writeFileSync('page-list.json', JSON.stringify(pages, null, 2));
    console.log('Page list saved to page-list.json');
    console.log(JSON.stringify(pages, null, 2));
  } catch (error) {
    console.error('Error fetching Notion pages:', error.message);
  }
}

fetchNotionPages();