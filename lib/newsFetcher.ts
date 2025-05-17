import { setCachedHeadlines, getCachedHeadlines as getCache, initCache } from './cache';
import axios from 'axios';

initCache();

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchAndCacheHeadlines() {
  const today = getTodayDateString();
  let cached = getCache(today);
  if (cached) return cached;

  // Fetch from NewsAPI.org
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) throw new Error('NEWSAPI_KEY not set in environment');
  const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${apiKey}`;
  const response = await axios.get(url);
  const articles = response.data.articles || [];
  const headlines = articles.map((a: any) => ({ title: a.title, url: a.url }));
  setCachedHeadlines(today, headlines);
  return headlines;
}

export function getCachedHeadlines() {
  const today = getTodayDateString();
  return getCache(today);
}
