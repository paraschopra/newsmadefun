# Technical Implementation Details

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Railway
- **LLM Integration**: OpenRouter for flexibility between models
- **News API**: NewsAPI.org with daily caching strategy

## Key Components

1. **News Fetcher Service**:
   - Fetches headlines from NewsAPI.org once per day
   - Stores headlines in server-side cache or database
   - Filters and categorizes news
   - Implements scheduler for automatic daily updates

2. **Headline Generator Service**:
   - Takes real headlines and sends to LLM via OpenRouter
   - Implements smart prompting to generate believable false headlines
   - Validates generated headlines (ensure they're false but plausible)
   - Stores generated headlines alongside real ones

3. **Game Engine**:
   - Pairs real and fake headlines
   - Tracks user responses and calculates scores
   - Manages game flow and difficulty
   - Implements spaced repetition for headlines users struggle with

4. **User Management** (Phase 3):
   - Handles authentication with Supabase
   - Manages user profiles and preferences
   - Tracks historical performance
   - Implements privacy controls for user data