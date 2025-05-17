// This service handles fetching real headlines and generating fake ones

export type NewsCategory = {
  id: string
  name: string
}

export const NEWS_CATEGORIES = [
  { id: "general", name: "General" },
  { id: "business", name: "Business" },
  { id: "entertainment", name: "Entertainment" },
  { id: "health", name: "Health" },
  { id: "science", name: "Science" },
  { id: "sports", name: "Sports" },
  { id: "technology", name: "Technology" },
]

type NewsItem = {
  title: string
  description: string
  source: string
  url?: string
  category?: string
}

// Function to fetch real headlines from our internal API
export async function fetchHeadlines(count = 50, category = "general"): Promise<NewsItem[]> {
  try {
    // Call our internal API route with category parameter
    const response = await fetch(`/api/headlines?count=${count}&category=${category}`)

    // Handle rate limiting
    if (response.status === 429) {
      const data = await response.json()
      console.warn(`Rate limit exceeded for headlines API. Reset at ${data.resetAt}`)
      // Return fallback data when rate limited
      return getMockHeadlines(count, category)
    }

    if (!response.ok) {
      throw new Error(`Headlines API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching headlines:", error)
    // Return fallback data
    return getMockHeadlines(count, category)
  }
}

// Function to generate a fake headline based on a real one using our internal API
export async function generateFakeHeadline(realHeadline: string): Promise<string> {
  try {
    // Call our internal API route instead of directly calling OpenAI
    const response = await fetch("/api/generate-fake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ realHeadline }),
    })

    // Even if rate limited, the API returns a fallback fake headline
    const data = await response.json()

    // If we got a rate limit error but still have a fallback headline
    if (response.status === 429 && data.fakeHeadline) {
      console.warn(`Rate limit exceeded for OpenAI API. Reset at ${data.resetAt}`)
      return data.fakeHeadline
    }

    if (!response.ok) {
      throw new Error(`Generate fake API responded with status: ${response.status}`)
    }

    return data.fakeHeadline
  } catch (error) {
    console.error("Error generating fake headline:", error)
    return generateMockFakeHeadline(realHeadline)
  }
}

// Mock data functions (kept as fallbacks)
function getMockHeadlines(count: number, category = "general"): NewsItem[] {
  // This is a simplified version - the full implementation is in the API route
  const headlines = [
    {
      title: "Tech giant unveils revolutionary AI assistant that can understand emotions",
      description:
        "The new AI system can detect and respond to human emotions through voice analysis and facial recognition, marking a significant breakthrough in human-computer interaction.",
      source: "Tech Today",
      category: "technology",
    },
    {
      title: "Scientists discover potential cure for common cold in unexpected plant",
      description:
        "Researchers have identified a compound in a rare tropical plant that shows promising results in neutralizing rhinoviruses, the most common cause of the common cold.",
      source: "Science Daily",
      category: "health",
    },
    {
      title: "Global stock markets rally as inflation fears ease",
      description:
        "Stock markets worldwide saw significant gains today as new economic data suggested inflation pressures may be moderating, easing concerns about aggressive interest rate hikes.",
      source: "Financial Times",
      category: "business",
    },
  ]

  // Filter by category if not general
  const filteredHeadlines = category === "general" ? headlines : headlines.filter((h) => h.category === category)

  // Use all headlines if filtering resulted in too few
  const headlinesToUse = filteredHeadlines.length > 0 ? filteredHeadlines : headlines

  // Generate more if needed
  const result = [...headlinesToUse]
  while (result.length < count) {
    result.push({ ...headlinesToUse[result.length % headlinesToUse.length] })
  }

  // Shuffle and return requested number of headlines
  return result.sort(() => 0.5 - Math.random()).slice(0, count)
}

function generateMockFakeHeadline(realHeadline: string): string {
  // This function creates a fake headline by inverting or changing key aspects of the real headline

  // Simple transformations for demo purposes
  if (realHeadline.includes("unveils")) {
    return realHeadline.replace("unveils", "cancels development of")
  }

  if (realHeadline.includes("discover")) {
    return realHeadline.replace("discover", "disprove existence of")
  }

  if (realHeadline.includes("rally")) {
    return realHeadline.replace("rally", "plunge").replace("ease", "worsen")
  }

  if (realHeadline.includes("improved")) {
    return realHeadline.replace("improved", "decreased")
  }

  if (realHeadline.includes("announces")) {
    return realHeadline.replace("announces", "delays").replace("by 2030", "indefinitely")
  }

  // Default transformation if no specific pattern is matched
  return realHeadline
    .replace(/increase|growth|rise/gi, "decline")
    .replace(/decline|fall|drop/gi, "surge")
    .replace(/success|successful/gi, "failure")
    .replace(/approve|approved/gi, "reject")
    .replace(/positive|good/gi, "negative")
}
