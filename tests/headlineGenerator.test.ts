import { generateFakeHeadline, getFakeHeadlineFromCache, __setMockOpenRouterResponse, __clearFakeCache } from '../lib/headlineGenerator';
import * as fs from 'fs';

describe('headlineGenerator service', () => {
  const realHeadline = 'Scientists discover new species in the Amazon rainforest';
  const fakeHeadline = 'Aliens land in the Amazon rainforest, befriend scientists';

  beforeEach(() => {
    // Clean up SQLite DB or mock it before each test
    if (fs.existsSync('headlines_test.db')) fs.unlinkSync('headlines_test.db');
    __clearFakeCache && __clearFakeCache();
  });

  it('generates a plausible fake headline for a given real headline using OpenRouter', async () => {
    // Mock OpenRouter response
    __setMockOpenRouterResponse(fakeHeadline);
    const generated = await generateFakeHeadline(realHeadline);
    expect(generated).toBe(fakeHeadline);
  });

  it('ensures the fake headline is not identical to the real one', async () => {
    __setMockOpenRouterResponse(fakeHeadline);
    const generated = await generateFakeHeadline(realHeadline);
    expect(generated).not.toBe(realHeadline);
  });

  it('stores generated fake headlines in SQLite', async () => {
    __setMockOpenRouterResponse(fakeHeadline);
    await generateFakeHeadline(realHeadline);
    const cached = await getFakeHeadlineFromCache(realHeadline);
    expect(cached).toBe(fakeHeadline);
  });
}); 