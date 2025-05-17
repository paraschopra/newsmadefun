"use client"
import { CheckCircle, XCircle, ArrowRight, Trophy, ExternalLink } from "lucide-react"

type Headline = {
  id: number
  text: string
  isReal: boolean
  fullStory?: string
  source?: string
  url?: string
}

type ResultProps = {
  selected: Headline
  correct: Headline
  onNext: () => void
  isLastRound: boolean
  score: number
  totalRounds: number
}

const Result = ({ selected, correct, onNext, isLastRound, score, totalRounds }: ResultProps) => {
  const isCorrect = selected.isReal === true

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
        <div className="mb-6">
          {isCorrect ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 text-center">Correct!</h2>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-2" />
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 text-center">Incorrect!</h2>
            </div>
          )}
        </div>

        <div className="w-full mb-6 p-5 border-2 rounded-xl bg-blue-50 border-blue-200">
          <h3 className="font-bold text-lg text-blue-800 mb-2">The real headline:</h3>
          <p className="text-gray-800 text-lg mb-4">{correct.text}</p>

          {/* Enhanced source display with link */}
          <div className="flex items-center gap-2 mb-4">
            {correct.source && (
              <div className="px-3 py-1 bg-blue-100 rounded-full text-blue-800 text-sm font-medium">
                {correct.source}
              </div>
            )}

            {correct.url && (
              <a
                href={correct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 rounded-full text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Read Article <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {correct.fullStory && (
            <div className="mt-2">
              <h4 className="font-semibold text-blue-700 mb-1">Full Story:</h4>
              <p className="text-gray-700">{correct.fullStory}</p>
            </div>
          )}
        </div>

        {isLastRound ? (
          <div className="w-full text-center mb-6">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-2">Game Complete!</h3>
            <p className="text-lg text-gray-700 mb-4">
              Your final score: <span className="font-bold text-blue-600">{score}</span> out of {totalRounds}
            </p>
            {score === totalRounds ? (
              <p className="text-green-600 font-medium">Perfect score! You're a news expert!</p>
            ) : score >= Math.floor(totalRounds / 2) ? (
              <p className="text-green-600 font-medium">Well done! You have a good news sense.</p>
            ) : (
              <p className="text-blue-600 font-medium">Keep practicing to improve your fake news detection skills!</p>
            )}
          </div>
        ) : null}

        <button
          onClick={onNext}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full max-w-xs flex items-center justify-center gap-2"
        >
          {isLastRound ? (
            <>Play Again</>
          ) : (
            <>
              Next Round <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Result
