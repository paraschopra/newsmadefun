// A simple in-memory cache for fake headlines

interface HeadlineCache {
  [realHeadline: string]: {
    fakeHeadline: string
    timestamp: number
  }
}

// In-memory cache for fake headlines
// In a production app, you might use Redis or another persistent store
const fakeHeadlineCache: HeadlineCache = {}

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

/**
 * Get a fake headline from the cache
 * @param realHeadline The real headline used as the key
 * @returns The cached fake headline or null if not found
 */
export function getCachedFakeHeadline(realHeadline: string): string | null {
  const cacheKey = normalizeHeadline(realHeadline)
  const cachedItem = fakeHeadlineCache[cacheKey]

  if (!cachedItem) {
    return null
  }

  // Check if the cache entry has expired
  if (Date.now() - cachedItem.timestamp > CACHE_EXPIRATION) {
    // Remove expired entry
    delete fakeHeadlineCache[cacheKey]
    return null
  }

  return cachedItem.fakeHeadline
}

/**
 * Store a fake headline in the cache
 * @param realHeadline The real headline used as the key
 * @param fakeHeadline The fake headline to cache
 */
export function cacheFakeHeadline(realHeadline: string, fakeHeadline: string): void {
  const cacheKey = normalizeHeadline(realHeadline)
  fakeHeadlineCache[cacheKey] = {
    fakeHeadline,
    timestamp: Date.now(),
  }
}

/**
 * Clean up expired cache entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupCache(): void {
  const now = Date.now()

  Object.keys(fakeHeadlineCache).forEach((key) => {
    if (now - fakeHeadlineCache[key].timestamp > CACHE_EXPIRATION) {
      delete fakeHeadlineCache[key]
    }
  })
}

/**
 * Normalize a headline for consistent cache keys
 * @param headline The headline to normalize
 * @returns Normalized headline for use as a cache key
 */
function normalizeHeadline(headline: string): string {
  return headline.toLowerCase().trim().replace(/\s+/g, " ")
}

// Clean up expired cache entries every hour
setInterval(cleanupCache, 60 * 60 * 1000)
