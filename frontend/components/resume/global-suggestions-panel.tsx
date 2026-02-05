'use client'

import { Suggestion } from '@ai-engine/suggestion-generator'
import { ATSScore } from '@ai-engine/scoring-engine'
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react'
import { LiveATSScorer } from './live-ats-score'

interface GlobalSuggestionsPanelProps {
    suggestions: Suggestion[]
    atsScore: ATSScore | null
    isDark?: boolean
}

export function GlobalSuggestionsPanel({
    suggestions,
    atsScore,
    isDark = false
}: GlobalSuggestionsPanelProps) {
    return (
        <div className="space-y-6">
            {/* ATS Score */}
            <LiveATSScorer atsScore={atsScore} />

            {/* Global Suggestions */}
            <div className="space-y-3">
                <h4 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Proactive Recommendations
                </h4>

                {suggestions.length === 0 ? (
                    <div className={`p-4 rounded-lg border text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Great job! No major issues found.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border transition-all hover:shadow-md ${isDark
                                    ? 'bg-slate-800/50 border-slate-700'
                                    : 'bg-white border-slate-200'
                                    } ${suggestion.severity === 'critical'
                                        ? 'border-l-4 border-l-red-500'
                                        : suggestion.severity === 'high'
                                            ? 'border-l-4 border-l-orange-500'
                                            : suggestion.severity === 'medium'
                                                ? 'border-l-4 border-l-yellow-500'
                                                : 'border-l-4 border-l-blue-500'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {suggestion.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                        {suggestion.type === 'improvement' && <Lightbulb className="w-4 h-4 text-yellow-500" />}
                                        {suggestion.type === 'tip' && <Sparkles className="w-4 h-4 text-blue-500" />}
                                    </div>
                                    <div>
                                        <h5 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {suggestion.message}
                                        </h5>
                                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {suggestion.suggestion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
