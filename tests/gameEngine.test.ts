import { pairHeadlines, trackGuess, getScore, nextRound } from '../lib/gameEngine';

describe('gameEngine logic', () => {
  it('pairs real and fake headlines for the game', () => {
    nextRound(); // reset state
    const real = ['Real 1', 'Real 2'];
    const fake = ['Fake 1', 'Fake 2'];
    const pairs = pairHeadlines(real, fake);
    expect(pairs).toEqual([
      { real: 'Real 1', fake: 'Fake 1' },
      { real: 'Real 2', fake: 'Fake 2' }
    ]);
  });

  it('tracks user guesses and calculates score', () => {
    nextRound(); // reset state
    trackGuess(true);
    trackGuess(false);
    trackGuess(true);
    expect(getScore()).toBe(2);
  });

  it('manages game flow (next round, results)', () => {
    nextRound(); // reset state
    trackGuess(true);
    trackGuess(true);
    expect(getScore()).toBe(2);
    nextRound();
    expect(getScore()).toBe(0);
  });
}); 