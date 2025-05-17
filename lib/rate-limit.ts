// A simple in-memory rate limiter

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting
// In a production app, you'd use Redis or another distributed store
const rateLimitStore: RateLimitStore = {}

export interface RateLimitConfig {
  // Maximum number of requests allowed within the window
  limit: number
  // Time window in seconds
  windowInSeconds: number
  // Optional identifier for the rate limit (useful for logging)
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
  isRateLimited: boolean
}

/**
 * Check if a request should be rate limited
 * @param key Unique identifier for the client (usually IP address)
 * @param config Rate limit configuration
 * @returns Result of the rate limit check
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowInSeconds * 1000

  // Initialize or get the rate limit data for this key
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs,
    }
  }

  // Increment the count
  rateLimitStore[key].count++

  // Check if the rate limit has been exceeded
  const isRateLimited = rateLimitStore[key].count > config.limit

  // Calculate remaining requests
  const remaining = Math.max(0, config.limit - rateLimitStore[key].count)

  return {
    success: !isRateLimited,
    limit: config.limit,
    remaining,
    resetTime: new Date(rateLimitStore[key].resetTime),
    isRateLimited,
  }
}

/**
 * Clean up expired rate limit entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimits(): void {
  const now = Date.now()

  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}

// Clean up expired rate limits every hour
setInterval(cleanupRateLimits, 60 * 60 * 1000)
