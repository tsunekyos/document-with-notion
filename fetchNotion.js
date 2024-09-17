const fs = require('node:fs');
const axios = require('axios');

const [NOTION_SECRET, NOTION_DB_ID] = process.argv.slice(2);

async function fetchNotionPages() {
  if (!NOTION_SECRET || !NOTION_DB_ID) {
    throw new Error('NOTION_SECRET and NOTION_DB_ID must be provided');
  }

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
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
}

(async () => {
  try {
    await fetchNotionPages();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();