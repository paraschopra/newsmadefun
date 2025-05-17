# NewsMadeFun

## Test-Driven Development (TDD) Approach

This project follows a TDD workflow:
- For each backend and frontend module, tests are written first (using Jest and React Testing Library).
- Tests are run and expected to fail initially.
- Implementation is then written to make the tests pass.

### Initial Test Files
- `/tests/newsFetcher.test.ts` — Tests for the newsFetcher service (fetching and caching headlines with SQLite)
- `/tests/headlineGenerator.test.ts` — Tests for the headlineGenerator service (generating fake headlines)
- `/tests/gameEngine.test.ts` — Tests for the game engine logic (pairing, scoring, flow)

News made fun. 

Fetch headlines of the day. And provide headlines and their believable yet false variations (generated through LLM) to the user. One by one, user has to choose which one is true/false (e.g. Nifty climbed 2% or it declined 0.5%). Clicking on any will tell you which one is right, and more details (the full news).