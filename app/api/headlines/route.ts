import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

// Available news categories
export const NEWS_CATEGORIES = [
  { id: "general", name: "General" },
  { id: "business", name: "Business" },
  { id: "entertainment", name: "Entertainment" },
  { id: "health", name: "Health" },
  { id: "science", name: "Science" },
  { id: "sports", name: "Sports" },
  { id: "technology", name: "Technology" },
]

export async function GET(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const clientIp = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    // Check rate limit - 30 requests per hour for headlines
    const rateLimitResult = checkRateLimit(`headlines_${clientIp}`, {
      limit: 30,
      windowInSeconds: 60 * 60, // 1 hour
      identifier: "headlines_api",
    })

    // If rate limited, return 429 Too Many Requests
    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetAt: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.floor(rateLimitResult.resetTime.getTime() / 1000).toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Get parameters from query
    const { searchParams } = new URL(request.url)
    const count = searchParams.get("count") || "50" // Default to 50 headlines
    const category = searchParams.get("category") || "general" // Default to general news

    // Validate category
    if (!NEWS_CATEGORIES.some((c) => c.id === category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Call NewsAPI from the server with category parameter
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}&pageSize=${count}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour (3600 seconds)
    )

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.articles || data.articles.length === 0) {
      // Return fallback data
      return NextResponse.json(getMockHeadlines(Number.parseInt(count), category))
    }

    // Process and return the articles
    const articles = data.articles.map((article: any) => ({
      title: article.title?.replace(/\s*-\s*[^-]*$/, "") || "Untitled Article", // Remove source suffix
      description: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      url: article.url,
      category: category,
    }))

    // Add rate limit headers to the response
    return NextResponse.json(articles, {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": Math.floor(rateLimitResult.resetTime.getTime() / 1000).toString(),
      },
    })
  } catch (error) {
    console.error("Error in headlines API route:", error)
    // Return fallback data
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "general"
    return NextResponse.json(getMockHeadlines(50, category), { status: 200 })
  }
}

// Mock data function for fallback - expanded with more headlines and categories
function getMockHeadlines(count: number, category = "general") {
  // Base headlines for all categories
  const generalHeadlines = [
    {
      title: "Global stock markets rally as inflation fears ease",
      description:
        "Stock markets worldwide saw significant gains today as new economic data suggested inflation pressures may be moderating.",
      source: "Financial Times",
      url: "https://ft.example.com/markets-rally",
      category: "general",
    },
    {
      title: "Major diplomatic breakthrough in peace talks",
      description: "Negotiators have reached a tentative agreement after months of tense discussions.",
      source: "World News",
      url: "https://worldnews.example.com/peace-talks",
      category: "general",
    },
    // More general headlines...
  ]

  // Category-specific headlines
  const categoryHeadlines = {
    business: [
      {
        title: "Tech giant unveils revolutionary AI assistant that can understand emotions",
        description:
          "The new AI system can detect and respond to human emotions through voice analysis and facial recognition.",
        source: "Tech Today",
        url: "https://techtoday.example.com/ai-emotions",
        category: "business",
      },
      {
        title: "Major automaker announces all electric vehicle lineup by 2030",
        description:
          "One of the world's largest automobile manufacturers has committed to producing only electric vehicles by 2030.",
        source: "Auto News",
        url: "https://autonews.example.com/electric-2030",
        category: "business",
      },
      // More business headlines...
    ],
    entertainment: [
      {
        title: "Surprise sequel announced for blockbuster movie franchise",
        description: "Fans were shocked by the unexpected announcement of a new installment in the popular series.",
        source: "Entertainment Weekly",
        url: "https://ew.example.com/movie-sequel",
        category: "entertainment",
      },
      {
        title: "Music streaming service introduces revolutionary audio quality upgrade",
        description: "The platform now offers studio-quality sound that surpasses CD quality for premium subscribers.",
        source: "Music Today",
        url: "https://musictoday.example.com/streaming-quality",
        category: "entertainment",
      },
      // More entertainment headlines...
    ],
    health: [
      {
        title: "Scientists discover potential cure for common cold in unexpected plant",
        description:
          "Researchers have identified a compound in a rare tropical plant that shows promising results in neutralizing rhinoviruses.",
        source: "Science Daily",
        url: "https://sciencedaily.example.com/cold-cure",
        category: "health",
      },
      {
        title: "New study links regular exercise to improved brain function in older adults",
        description:
          "Research published today shows that adults over 65 who exercise regularly have better cognitive function.",
        source: "Health Journal",
        url: "https://healthjournal.example.com/exercise-brain",
        category: "health",
      },
      // More health headlines...
    ],
    science: [
      {
        title: "Researchers develop biodegradable plastic alternative from algae",
        description:
          "A team of environmental scientists has created a fully biodegradable plastic alternative using common algae.",
        source: "Environmental Science Today",
        url: "https://envscience.example.com/algae-plastic",
        category: "science",
      },
      {
        title: "Space telescope captures stunning images of distant galaxy formation",
        description:
          "Astronomers have released breathtaking new images showing galaxy formation in the early universe.",
        source: "Astronomy Now",
        url: "https://astronomynow.example.com/galaxy-formation",
        category: "science",
      },
      // More science headlines...
    ],
    sports: [
      {
        title: "Underdog team pulls off stunning upset in championship game",
        description:
          "In a shocking turn of events, the lowest-ranked team in the tournament defeated the reigning champions.",
        source: "Sports Center",
        url: "https://sportscenter.example.com/championship-upset",
        category: "sports",
      },
      {
        title: "Star athlete breaks decades-old world record",
        description:
          "The record, which had stood for over 30 years, was finally broken during yesterday's international competition.",
        source: "Athletics Weekly",
        url: "https://athletics.example.com/world-record",
        category: "sports",
      },
      // More sports headlines...
    ],
    technology: [
      {
        title: "Revolutionary quantum computing breakthrough promises to transform data processing",
        description:
          "Scientists have achieved stable quantum entanglement at room temperature, a major step toward practical quantum computers.",
        source: "Tech Review",
        url: "https://techreview.example.com/quantum-breakthrough",
        category: "technology",
      },
      {
        title: "New AI algorithm detects early signs of crop disease from satellite imagery",
        description:
          "Agricultural researchers have developed an AI system that can identify early signs of crop disease from satellite images.",
        source: "Farming Technology",
        url: "https://farmtech.example.com/ai-crop-disease",
        category: "technology",
      },
      // More technology headlines...
    ],
  }

  // Select headlines based on category
  let headlines = generalHeadlines
  if (category !== "general" && categoryHeadlines[category as keyof typeof categoryHeadlines]) {
    headlines = categoryHeadlines[category as keyof typeof categoryHeadlines]
  }

  // Generate more mock headlines if we don't have enough
  while (headlines.length < count) {
    const baseHeadline = headlines[headlines.length % headlines.length]
    headlines.push({
      ...baseHeadline,
      title: `${baseHeadline.title} - ${Math.random().toString(36).substring(7)}`, // Make title unique
    })
  }

  // Shuffle and return requested number of headlines
  return headlines.sort(() => 0.5 - Math.random()).slice(0, count)
}
