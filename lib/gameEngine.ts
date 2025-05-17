// Pair real and fake headlines for the game
export function pairHeadlines(real: string[], fake: string[]): { real: string, fake: string }[] {
  // Placeholder: pair by index
  return real.map((r, i) => ({ real: r, fake: fake[i] || '' }));
}

// Track user guesses
let guesses: boolean[] = [];
export function trackGuess(isCorrect: boolean) {
  guesses.push(isCorrect);
}

// Get current score
export function getScore() {
  return guesses.filter(Boolean).length;
}

// Move to next round (reset guesses for simplicity)
export function nextRound() {
  guesses = [];
}
