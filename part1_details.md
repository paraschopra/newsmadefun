# Progress Update & Next Steps

## What's Done
- **Project structure created**: All required directories and initial files for backend, API, frontend, styles, and tests are in place.
- **TDD workflow established**: Jest is set up, and initial failing tests were written for the newsFetcher service.
- **SQLite-based cache implemented**: `lib/cache.ts` provides a robust, file-based cache using better-sqlite3, with absolute path handling and table creation.
- **newsFetcher service implemented**: `lib/newsFetcher.ts` fetches real headlines from NewsAPI.org (using your API key), caches them in SQLite, and retrieves them as needed.
- **headlineGenerator service implemented**: `lib/headlineGenerator.ts` generates plausible fake headlines using OpenRouter (LLM API, using your API key), ensures fakes are not identical to real headlines, and caches them (currently in-memory, ready for SQLite integration).
- **API routes implemented and tested**: `/api/headlines` and `/api/generate-fake` are implemented with TDD (tests first, handlers next, all tests pass).
- **End-to-end verification script**: A Node.js script (`scripts/demo_headlines.js`) successfully fetches real headlines and generates fake ones using the actual APIs, confirming the backend logic works with real data.
- **Environment issues resolved**: Node version, native module, and permissions issues were debugged and fixed for a smooth local dev experience.
- **Game Engine Logic implemented and tested**: `lib/gameEngine.ts` pairs real and fake headlines, tracks user guesses, calculates score, and manages game flow. All related tests pass.
- **Frontend components implemented and tested**: `Landing`, `Game`, and `Results` React components are implemented in `components/` with TDD. All component tests pass, and components are styled with Tailwind CSS.
- **Frontend-backend integration complete**: The main game flow is now fully wired up in `pages/index.tsx`, connecting frontend components to backend APIs, managing state, and handling user interaction.
- **Game rounds, score, and progress display**: The app now tracks and displays the current round and score on both the Game and Results screens. After all rounds, a Final Results screen summarizes the user's performance and offers a replay option.

## What's Remaining (TDD-driven)
1. **Responsive Design Polish**
   - Ensure all components look great on mobile and desktop.
2. **Deployment Preparation**
   - Set up environment variables for API keys.
   - Prepare for Railway deployment (CI/CD, .env, README updates).

---

# Phase 1: MVP Implementation Plan (Detailed)

## 1. Project Structure

```
/newsmadefun
  /pages
    /api
      headlines.ts         # API route: fetches and caches real headlines
      generate-fake.ts     # API route: generates fake headlines via OpenRouter
  /lib
    newsFetcher.ts         # Service: fetches and caches news (uses SQLite for file-based cache)
    headlineGenerator.ts   # Service: generates fake headlines
    cache.ts               # SQLite-based cache implementation
  /components
    Game.tsx               # Game interface
    Landing.tsx            # Landing page
    Results.tsx            # Results screen
    FinalResults.tsx       # Final results/summary screen
  /tests
    newsFetcher.test.ts
    headlineGenerator.test.ts
    gameEngine.test.ts
  /styles
    tailwind.css
  .env.local               # For API keys
  next.config.js
  tailwind.config.js
  package.json
  README.md
```

## 2. Key Features & Flow

### Backend
- **/api/headlines**: Returns a daily-cached list of real headlines from NewsAPI (caching via SQLite).
- **/api/generate-fake**: Given a real headline, returns a plausible fake headline using OpenRouter.
- **Caching**: Headlines are fetched once per day and cached in SQLite DB.
- **Environment Variables**: API keys for NewsAPI and OpenRouter.

### Frontend
- **Landing Page**: Explains the concept and starts the game.
- **Game Interface**: Shows a pair of headlines (real vs. fake), lets user guess, and displays current round and score.
- **Results Screen**: Shows correct answer, explanation, round, and score, with clear navigation to next round or final results.
- **Final Results Screen**: Shows total score and allows replaying the game.
- **Responsive Design**: Tailwind CSS for mobile/desktop.

### Game Logic
- Fetches a pair (real, fake) from backend.
- Tracks user guesses and score.
- Shows results after each round and a summary at the end.

## 3. TDD Approach

- For each backend and frontend module, write tests first (using Jest and React Testing Library).
- Run tests (they will fail).
- Implement code to make tests pass.

## 4. Step-by-Step Plan

1. Set up Next.js app with Tailwind CSS.
2. Set up environment variables for API keys.
3. Implement newsFetcher service with tests:
   - Test: fetches and caches headlines, only fetches once per day (SQLite).
4. Implement headlineGenerator service with tests:
   - Test: generates plausible fake headline for a given real headline.
5. Implement API routes with tests:
   - Test: /api/headlines returns cached headlines.
   - Test: /api/generate-fake returns a fake headline.
6. Implement frontend components with tests:
   - Test: Game interface displays headline pairs and handles user input.
   - Test: Results screen shows correct answer and explanation.
7. Wire up game flow and state management, including round/score display and final results.
8. Ensure responsive design.
9. Write integration tests for the game flow.
10. Prepare for deployment (Railway, .env, README).

---

**Caching Note:**
- For MVP, SQLite will be used for file-based caching of headlines and generated fakes. 