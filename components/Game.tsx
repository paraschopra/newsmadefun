"use client"

import { useState } from "react"
import { Loader2, Newspaper } from "lucide-react"
import { NEWS_CATEGORIES } from "@/lib/news-service"

type Headline = {
  id: number
  text: string
  isReal: boolean
}

type GameProps = {
  headlines: Headline[]
  onSubmit: (selectedId: number | null) => void
  round: number
  totalRounds: number
  score: number
  loading?: boolean
  category?: string
}

const Game = ({ headlines, onSubmit, round, totalRounds, score, loading = false, category = "general" }: GameProps) => {
  const [selected, setSelected] = useState<number | null>(null)

  // Find the category name for display
  const categoryName = NEWS_CATEGORIES.find((c) => c.id === category)?.name || "General"

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-blue-700">Loading headlines...</h2>
          <p className="text-gray-600 mt-2">Preparing your next challenge</p>
        </div>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(selected)
      }}
    >
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
        <div className="flex justify-between w-full mb-4">
          <div className="px-4 py-2 bg-blue-100 rounded-lg text-blue-800 font-medium">
            Round {round} of {totalRounds}
          </div>
          <div className="px-4 py-2 bg-blue-100 rounded-lg text-blue-800 font-medium">Score: {score}</div>
        </div>

        {/* Display current category */}
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <span className="text-blue-600 font-medium">{categoryName} News</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">Which headline is real?</h2>

        <div className="flex flex-col gap-4 mb-8 w-full">
          {headlines.map((h) => (
            <label
              key={h.id}
              className={`flex items-center gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all duration-150 shadow-sm hover:shadow-md bg-gray-50 hover:bg-blue-50 text-base sm:text-lg font-medium w-full
                ${selected === h.id ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200"}`}
            >
              <input
                type="radio"
                name="headline"
                value={h.id}
                checked={selected === h.id}
                onChange={() => setSelected(h.id)}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="flex-1">{h.text}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full max-w-xs disabled:opacity-50"
          disabled={selected === null}
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default Game
