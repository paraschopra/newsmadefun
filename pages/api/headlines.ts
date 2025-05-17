import { fetchAndCacheHeadlines } from '../../lib/newsFetcher';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const headlines = await fetchAndCacheHeadlines();
  // Return only the titles for now, as the test expects array of strings
  res.status(200).json(headlines.map(h => h.title));
}
