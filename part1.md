# Phase 1: MVP (Minimum Viable Product)

## Frontend (Next.js + React + Tailwind CSS)
- Simple landing page explaining the concept
- Game interface showing one headline pair at a time (real vs. AI-generated)
- Results screen with explanation and link to original article
- Basic responsive design for mobile and desktop

## Backend (Next.js API routes)
- API route to fetch headlines from newsapi.org
- Implement caching system to fetch new headlines only once per day
- Integration with OpenRouter to generate false headlines
- Simple algorithm to ensure false headlines are believable but incorrect
- Store headlines in local storage or server-side cache

## Deployment
- Setting up Railway deployment with CI/CD pipeline
- Environment configuration for API keys (NewsAPI and OpenRouter)