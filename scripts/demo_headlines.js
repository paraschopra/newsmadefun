require('dotenv').config({ path: '.env.local' });
const { fetchAndCacheHeadlines } = require('../lib/newsFetcher');
const { generateFakeHeadline } = require('../lib/headlineGenerator');

async function main() {
  console.log('Fetching real headlines...');
  const headlines = await fetchAndCacheHeadlines();
  for (const h of headlines.slice(0, 3)) {
    console.log(`\nReal: ${h.title}`);
    const fake = await generateFakeHeadline(h.title);
    console.log(`Fake: ${fake}`);
    console.log(`URL: ${h.url}`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 