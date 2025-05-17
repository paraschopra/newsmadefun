import React from 'react';

interface FinalResultsProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

const FinalResults = ({ score, total, onPlayAgain }: FinalResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">Game Over!</h2>
      <div className="mb-6 text-xl text-gray-800">Your Score: <span className="font-bold">{score} / {total}</span></div>
      <button
        onClick={onPlayAgain}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Play Again
      </button>
    </div>
  );
};

export default FinalResults; 