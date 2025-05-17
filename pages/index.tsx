import React, { useState, useEffect } from 'react';
import Landing from '../components/Landing';
import Game from '../components/Game';
import Results from '../components/Results';
import FinalResults from '../components/FinalResults';

// Types
interface Headline {
  id: number;
  text: string;
  isReal: boolean;
}

type GameStage = 'landing' | 'game' | 'results' | 'final';

const NUM_ROUNDS = 5;

const fetchHeadlines = async (): Promise<string[]> => {
  const res = await fetch('/api/headlines');
  if (!res.ok) throw new Error('Failed to fetch headlines');
  return res.json();
};

const fetchFakeHeadline = async (realHeadline: string): Promise<string> => {
  const res = await fetch('/api/generate-fake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ realHeadline }),
  });
  if (!res.ok) throw new Error('Failed to generate fake headline');
  const data = await res.json();
  return data.fakeHeadline;
};

const getHeadlinePair = async (realHeadline: string, idStart: number): Promise<Headline[]> => {
  const fake = await fetchFakeHeadline(realHeadline);
  // Randomize order
  const pair = [
    { id: idStart, text: realHeadline, isReal: true },
    { id: idStart + 1, text: fake, isReal: false },
  ];
  return Math.random() > 0.5 ? pair : pair.reverse();
};

const IndexPage = () => {
  const [stage, setStage] = useState<GameStage>('landing');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [currentPair, setCurrentPair] = useState<Headline[]>([]);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; real: string; fake: string }>({ isCorrect: false, real: '', fake: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start game: fetch headlines
  const startGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchHeadlines();
      setHeadlines(fetched.slice(0, NUM_ROUNDS));
      setRound(0);
      setScore(0);
      setStage('game');
    } catch (e) {
      setError('Failed to load headlines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load headline pair for current round
  useEffect(() => {
    const loadPair = async () => {
      if (stage !== 'game' || !headlines[round]) return;
      setLoading(true);
      try {
        const pair = await getHeadlinePair(headlines[round], round * 2);
        setCurrentPair(pair);
      } catch (e) {
        setError('Failed to generate headline pair.');
      } finally {
        setLoading(false);
      }
    };
    if (stage === 'game' && headlines.length > 0 && round < NUM_ROUNDS) {
      loadPair();
    }
  }, [stage, round, headlines]);

  // Handle user guess
  const handleSubmit = (selectedId: number | null) => {
    if (selectedId == null) return;
    const selected = currentPair.find(h => h.id === selectedId);
    const real = currentPair.find(h => h.isReal)!;
    const fake = currentPair.find(h => !h.isReal)!;
    const isCorrect = selected?.isReal || false;
    if (isCorrect) setScore(s => s + 1);
    setLastResult({ isCorrect, real: real.text, fake: fake.text });
    setStage('results');
  };

  // Next round or finish
  const handleNext = () => {
    if (round + 1 < NUM_ROUNDS) {
      setRound(r => r + 1);
      setStage('game');
    } else {
      setStage('final');
    }
  };

  // Render
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Reload</button>
      </div>
    );
  }
  if (stage === 'landing') {
    return <Landing onStart={startGame} />;
  }
  if (stage === 'game') {
    return <Game headlines={currentPair} onSubmit={handleSubmit} round={round + 1} totalRounds={NUM_ROUNDS} score={score} />;
  }
  if (stage === 'results') {
    return (
      <Results
        isCorrect={lastResult.isCorrect}
        realHeadline={lastResult.real}
        fakeHeadline={lastResult.fake}
        explanation={lastResult.isCorrect ? 'You picked the real headline!' : 'You picked the fake headline.'}
        onNext={handleNext}
        round={round + 1}
        totalRounds={NUM_ROUNDS}
        score={score}
        isLastRound={round + 1 === NUM_ROUNDS}
      />
    );
  }
  if (stage === 'final') {
    return <FinalResults score={score} total={NUM_ROUNDS} onPlayAgain={() => startGame()} />;
  }
  return null;
};

export default IndexPage; 