'use client'

import { useAISuggestions } from '@/hooks/use-ai-suggestions'
import { Resume, JobContext, ResumeScore } from '@/lib/types/resume-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Sparkles, RefreshCw, CheckCircle, AlertTriangle, XCircle, Target, FileCheck, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AISuggestionPanelProps {
    field: string
    value: string
    resume: Resume | null
    jobContext?: JobContext
    onApply: (suggestion: string) => void
}

function ScoreIndicator({ score, label, icon: Icon }: { score: number; label: string; icon: React.ElementType }) {
    const getColor = (s: number) => {
        if (s >= 75) return 'text-green-500'
        if (s >= 55) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", getColor(score))} />
            <div className="flex-1">
                <div className="text-xs text-gray-500">{label}</div>
                <div className={cn("text-sm font-semibold", getColor(score))}>{score}%</div>
            </div>
        </div>
    )
}

function VerdictBadge({ verdict }: { verdict: ResumeScore['verdict'] }) {
    const config = {
        pass: { label: 'Ready to Apply', icon: CheckCircle, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        borderline: { label: 'Needs Work', icon: AlertTriangle, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        fail: { label: 'Major Issues', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    }

    const { label, icon: Icon, className } = config[verdict]

    return (
        <Badge className={cn("flex items-center gap-1", className)}>
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    )
}

export function AISuggestionPanel({ field, value, resume, jobContext, onApply }: AISuggestionPanelProps) {
    const { suggestions, reframe, score, loading, refetchReframe } = useAISuggestions(field, value, resume, jobContext)

    return (
        <div className="space-y-4">
            {/* Resume Score Card */}
            {score && (
                <Card className="border-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-500" />
                                Resume Score
                            </CardTitle>
                            <VerdictBadge verdict={score.verdict} />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="mb-3">
                            <div className="text-3xl font-bold text-center">{score.final}%</div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        score.final >= 75 ? "bg-green-500" :
                                            score.final >= 55 ? "bg-yellow-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${score.final}%` }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                            <ScoreIndicator score={score.ats} label="ATS" icon={FileCheck} />
                            <ScoreIndicator score={score.hr} label="HR Appeal" icon={Users} />
                            <ScoreIndicator score={score.jd} label="JD Match" icon={Target} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Fixes */}
            {score && score.topFixes.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Top Fixes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ul className="space-y-2">
                            {score.topFixes.slice(0, 3).map((fix, i) => (
                                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-yellow-500 font-bold">{i + 1}.</span>
                                    {fix}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Auto-Reframe */}
            {reframe && value.length >= 20 && (
                <Card className="border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Auto-Reframe
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={refetchReframe}
                                disabled={loading}
                            >
                                <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                            {reframe.reframed}
                        </p>
                        {reframe.improvements.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {reframe.improvements.slice(0, 3).map((imp, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                        {imp}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onApply(reframe.reframed)}
                        >
                            Apply Reframe
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            Suggestions for {field}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                        {suggestions.map((suggestion, i) => (
                            <div key={i} className="p-2 bg-gray-50 dark:bg-gray-800 rounded space-y-1">
                                <p className="text-xs text-gray-500">{suggestion.reason}</p>
                                <p className="text-sm">{suggestion.suggestion}</p>
                                {suggestion.keywords && suggestion.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {suggestion.keywords.map((kw, j) => (
                                            <Badge key={j} variant="outline" className="text-xs">
                                                {kw}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Pro Tips */}
            {!suggestions.length && !score && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-500" />
                            Pro Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <li>• Start bullet points with strong action verbs</li>
                            <li>• Quantify achievements with numbers when possible</li>
                            <li>• Add your GitHub and portfolio links</li>
                            <li>• Tailor skills to match the job description</li>
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-4">
                    <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Analyzing...</span>
                </div>
            )}
        </div>
    )
}
