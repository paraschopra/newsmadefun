import axios from 'axios';

const fakeCache: Record<string, string> = {};

export async function generateFakeHeadline(realHeadline: string): Promise<string> {
  if (fakeCache[realHeadline]) return fakeCache[realHeadline];

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in environment');

  const prompt = `Given the real news headline: "${realHeadline}", generate a plausible but fake news headline on a similar topic that is not true.`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative news generator.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 60
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const fake = response.data.choices?.[0]?.message?.content?.trim() || (realHeadline + ' (fake)');
  fakeCache[realHeadline] = fake;
  return fake;
}

export async function getFakeHeadlineFromCache(realHeadline: string): Promise<string | undefined> {
  return fakeCache[realHeadline];
}
