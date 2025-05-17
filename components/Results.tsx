import React from 'react';

type ResultsProps = {
  isCorrect: boolean;
  realHeadline: string;
  fakeHeadline: string;
  explanation: string;
  onNext: () => void;
  round: number;
  totalRounds: number;
  score: number;
  isLastRound: boolean;
};

const Results = ({ isCorrect, realHeadline, fakeHeadline, explanation, onNext, round, totalRounds, score, isLastRound }: ResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Correct!' : 'Incorrect!'}</h2>
      <div className="mb-2 text-gray-700">Round {round} of {totalRounds}</div>
      <div className="mb-2 text-gray-700">Current Score: <span className="font-bold">{score}</span></div>
      <div className="mb-6 w-full max-w-xl">
        <div className="mb-2">
          <span className="font-semibold">Real Headline:</span> {realHeadline}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Fake Headline:</span> {fakeHeadline}
        </div>
      </div>
      <div className="mb-8 text-gray-700 max-w-xl text-center">
        {explanation}
      </div>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        {isLastRound ? 'See Final Results' : 'Next Round'}
      </button>
    </div>
  );
};

export default Results; 