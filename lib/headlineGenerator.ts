let mockOpenRouterResponse = '';
const fakeCache: Record<string, string> = {};

export function __setMockOpenRouterResponse(response: string) {
  mockOpenRouterResponse = response;
}

export function __clearFakeCache() {
  for (const key in fakeCache) delete fakeCache[key];
}

export async function generateFakeHeadline(realHeadline: string): Promise<string> {
  // Simulate OpenRouter call
  const fake = mockOpenRouterResponse || (realHeadline + ' (fake)');
  fakeCache[realHeadline] = fake;
  return fake;
}

export async function getFakeHeadlineFromCache(realHeadline: string): Promise<string | undefined> {
  return fakeCache[realHeadline];
}
