'use client'

import { ATSScore, ScoringEngine } from '@ai-engine/scoring-engine'
import { TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface LiveATSScorerProps {
  atsScore: ATSScore | null
}

export function LiveATSScorer({ atsScore }: LiveATSScorerProps) {
  const [scoreColor, setScoreColor] = useState('text-gray-600')
  const [bgColor, setBgColor] = useState('bg-gray-100')

  useEffect(() => {
    if (!atsScore) return

    if (atsScore.overallScore >= 85) {
      setScoreColor('text-green-600')
      setBgColor('bg-green-100')
    } else if (atsScore.overallScore >= 70) {
      setScoreColor('text-blue-600')
      setBgColor('bg-blue-100')
    } else if (atsScore.overallScore >= 50) {
      setScoreColor('text-yellow-600')
      setBgColor('bg-yellow-100')
    } else {
      setScoreColor('text-red-600')
      setBgColor('bg-red-100')
    }
  }, [atsScore])

  if (!atsScore) {
    return <div className="text-center text-gray-500">Loading ATS score...</div>
  }

  const feedback = ScoringEngine.getScoreFeedback(atsScore.overallScore)

  return (
    <div className={`p-4 rounded-lg border ${bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold ${scoreColor} flex items-center gap-2`}>
          <TrendingUp className="w-4 h-4" />
          ATS Score
        </h4>
        <span className={`text-3xl font-bold ${scoreColor}`}>
          {atsScore.overallScore}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">
        {feedback.emoji} {feedback.message}
      </p>

      {/* Score Breakdown */}
      <div className="space-y-2">
        {atsScore.breakdown.map((item) => (
          <div key={item.category} className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{item.category}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className="font-medium w-8 text-right">{item.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}