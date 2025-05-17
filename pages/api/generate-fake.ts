import { generateFakeHeadline } from '../../lib/headlineGenerator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let realHeadline = req.body?.realHeadline;
  if (!realHeadline) {
    // Try to parse body if not already parsed (for test compatibility)
    try {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      await new Promise(resolve => req.on('end', resolve));
      realHeadline = JSON.parse(data).realHeadline;
    } catch {
      res.status(400).json({ error: 'Missing realHeadline' });
      return;
    }
  }
  if (!realHeadline) {
    res.status(400).json({ error: 'Missing realHeadline' });
    return;
  }
  const fakeHeadline = await generateFakeHeadline(realHeadline);
  res.status(200).json({ fakeHeadline });
}
