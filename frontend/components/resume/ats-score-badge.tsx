'use client'

import { ATSScore } from '@ai-engine/scoring-engine'
import { TrendingUp } from 'lucide-react'

interface ATSScoreBadgeProps {
    score: number
    compact?: boolean
    isDark?: boolean
}

export function ATSScoreBadge({ score, compact = false, isDark = false }: ATSScoreBadgeProps) {
    // Determine color based on score
    const getScoreColor = () => {
        if (score >= 85) return 'from-green-600 to-emerald-600'
        if (score >= 70) return 'from-blue-600 to-cyan-600'
        if (score >= 50) return 'from-yellow-600 to-orange-600'
        return 'from-red-600 to-pink-600'
    }

    const getScoreText = () => {
        if (score >= 85) return 'Excellent'
        if (score >= 70) return 'Good'
        if (score >= 50) return 'Fair'
        return 'Needs Work'
    }

    if (compact) {
        return (
            <div className={`flex items-center gap-1.5 bg-gradient-to-r ${getScoreColor()} text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{score}</span>
            </div>
        )
    }

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getScoreColor()} flex items-center justify-center`}>
                    <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>ATS Score</p>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getScoreText()}</p>
                </div>
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                {score}
            </span>
        </div>
    )
}
