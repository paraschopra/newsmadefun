import { setCachedHeadlines, getCachedHeadlines as getCache, initCache } from './cache';

initCache();

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchAndCacheHeadlines() {
  const today = getTodayDateString();
  let cached = getCache(today);
  if (cached) return cached;

  // Mock NewsAPI fetch for now
  const headlines = [
    { title: 'Stock market hits record high', url: 'https://news.com/1' },
    { title: 'Scientists discover new species', url: 'https://news.com/2' }
  ];
  setCachedHeadlines(today, headlines);
  return headlines;
}

export function getCachedHeadlines() {
  const today = getTodayDateString();
  return getCache(today);
}
