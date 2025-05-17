import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { getCachedFakeHeadline, cacheFakeHeadline } from "@/lib/headline-cache"

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const clientIp = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    const { realHeadline } = await request.json()

    if (!realHeadline) {
      return NextResponse.json({ error: "Missing realHeadline in request body" }, { status: 400 })
    }

    // Check if we have a cached fake headline for this real headline
    const cachedFakeHeadline = getCachedFakeHeadline(realHeadline)
    if (cachedFakeHeadline) {
      // Return the cached headline without consuming rate limit or API credits
      return NextResponse.json({ fakeHeadline: cachedFakeHeadline })
    }

    // Check rate limit - 20 requests per hour for OpenAI
    // This is more strict than headlines because OpenAI API is more expensive
    const rateLimitResult = checkRateLimit(`openai_${clientIp}`, {
      limit: 20,
      windowInSeconds: 60 * 60, // 1 hour
      identifier: "openai_api",
    })

    // If rate limited, return 429 Too Many Requests
    if (rateLimitResult.isRateLimited) {
      // Generate a fallback fake headline
      const fallbackHeadline = generateMockFakeHeadline(realHeadline)

      // Cache the fallback headline too
      cacheFakeHeadline(realHeadline, fallbackHeadline)

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetAt: rateLimitResult.resetTime,
          fakeHeadline: fallbackHeadline,
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

    // Call OpenAI API from the server
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates believable but false news headlines.",
          },
          {
            role: "user",
            content: `Create a believable but false news headline that is similar to this real headline: "${realHeadline}". Make it sound plausible but change key facts. Only return the headline text with no additional explanation. Don't use quotation marks.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const fakeHeadline = data.choices[0]?.message?.content?.trim()

    if (!fakeHeadline) {
      throw new Error("No valid response from OpenAI")
    }

    // Cache the generated fake headline
    cacheFakeHeadline(realHeadline, fakeHeadline)

    // Add rate limit headers to the response
    return NextResponse.json(
      { fakeHeadline },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(rateLimitResult.resetTime.getTime() / 1000).toString(),
        },
      },
    )
  } catch (error) {
    console.error("Error in generate-fake API route:", error)
    // Generate a fallback fake headline
    const fallbackHeadline = generateMockFakeHeadline(request.body?.realHeadline || "")

    // Cache the fallback headline too
    if (request.body?.realHeadline) {
      cacheFakeHeadline(request.body.realHeadline, fallbackHeadline)
    }

    return NextResponse.json({ fakeHeadline: fallbackHeadline }, { status: 200 })
  }
}

// Mock data function for fallback
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
