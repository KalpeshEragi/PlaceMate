'use client'

import { useEffect } from 'react'
import { useRuleEngine } from '@/hooks/use-rule-engine'
import { Sparkles } from 'lucide-react'
import { LiveATSScorer } from './live-ats-score'
import { JobContext } from '@/lib/types/resume-types'

interface AISuggestionPanelProps {
  field: string
  value: string
  resume: any
  jobContext?: JobContext
  domain?: string
  isDark?: boolean
  onApply: (suggestion: string) => void
}

export function AISuggestionPanel({
  field,
  value,
  resume,
  jobContext,
  domain = 'web-developer',
  isDark = false,
  onApply,
}: AISuggestionPanelProps) {
  const { suggestions, atsScore, getFieldSuggestions, getATSScore } =
    useRuleEngine({ domain })

  // Update suggestions when field/value changes
  useEffect(() => {
    if (field && value) {
      getFieldSuggestions(value, field, 'experience')
    }
  }, [field, value, getFieldSuggestions])

  // Calculate ATS score when resume changes
  useEffect(() => {
    if (resume) {
      getATSScore(resume)
    }
  }, [resume, getATSScore])

  return (
    <div className="space-y-4">
      {/* ATS Score */}
      <LiveATSScorer atsScore={atsScore} />

      {/* Suggestions */}
      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <h4 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            Suggestions ({suggestions.length})
          </h4>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-slate-200'
                  } ${suggestion.severity === 'critical' || suggestion.severity === 'high'
                    ? 'border-l-4 border-l-red-500'
                    : suggestion.severity === 'medium'
                      ? 'border-l-4 border-l-yellow-500'
                      : 'border-l-4 border-l-blue-500'
                  }`}
              >
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${suggestion.type === 'warning'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : suggestion.type === 'improvement'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                  >
                    {suggestion.type.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {suggestion.severity}
                  </span>
                </div>

                {/* Message */}
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {suggestion.message}
                </p>

                {/* Suggestion Text */}
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {suggestion.suggestion}
                </p>

                {/* Example if provided */}
                {suggestion.example && (
                  <div className={`mt-2 p-2 rounded text-xs font-mono whitespace-pre-wrap ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-600'
                    }`}>
                    {suggestion.example}
                  </div>
                )}

                {/* Apply Button if applySuggestion is available */}
                {suggestion.applySuggestion && (
                  <button
                    onClick={() => onApply(suggestion.applySuggestion!)}
                    className="mt-2 w-full px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Apply Suggestion
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`text-center py-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Focus on a text field to get AI suggestions</p>
          <p className="text-xs mt-1 opacity-70">Try editing your Summary or Experience descriptions</p>
        </div>
      )}
    </div>
  )
}