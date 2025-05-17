import React, { useState } from 'react';

type Headline = {
  id: number;
  text: string;
  isReal: boolean;
};

type GameProps = {
  headlines: Headline[];
  onSubmit: (selectedId: number | null) => void;
};

const Game = ({ headlines, onSubmit }: GameProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen bg-white p-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(selected);
      }}
    >
      <h2 className="text-2xl font-semibold mb-6">Which headline is real?</h2>
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        {headlines.map(h => (
          <label key={h.id} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="headline"
              value={h.id}
              checked={selected === h.id}
              onChange={() => setSelected(h.id)}
              className="accent-blue-600"
            />
            <span>{h.text}</span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        disabled={selected === null}
      >
        Submit
      </button>
    </form>
  );
};

export default Game; 