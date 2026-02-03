import { useState, useEffect, useCallback, useRef } from 'react'
import { AISuggestion, AIReframe, Resume, JobContext, ResumeScore } from '@/lib/types/resume-types'
import { resumeApi } from '@/lib/api/resume-api'

export function useAISuggestions(
    field: string,
    value: string,
    resume: Resume | null,
    jobContext?: JobContext
) {
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
    const [reframe, setReframe] = useState<AIReframe | null>(null)
    const [score, setScore] = useState<ResumeScore | null>(null)
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const scoreDebounceRef = useRef<NodeJS.Timeout | null>(null)

    // Fetch suggestions when field/value changes
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        if (!value || value.length < 10 || !resume) {
            setSuggestions([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const results = await resumeApi.getAISuggestions(field, value, {
                    resume,
                    jobContext
                })
                setSuggestions(results)
            } catch (error) {
                console.error('Failed to get suggestions:', error)
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [field, value, resume, jobContext])

    // Fetch resume score when resume changes
    useEffect(() => {
        if (scoreDebounceRef.current) {
            clearTimeout(scoreDebounceRef.current)
        }

        if (!resume) {
            setScore(null)
            return
        }

        scoreDebounceRef.current = setTimeout(async () => {
            try {
                const newScore = await resumeApi.getResumeScore(resume, jobContext)
                setScore(newScore)
            } catch (error) {
                console.error('Failed to get resume score:', error)
            }
        }, 1000)

        return () => {
            if (scoreDebounceRef.current) {
                clearTimeout(scoreDebounceRef.current)
            }
        }
    }, [resume, jobContext])

    // Function to fetch reframe on demand
    const fetchReframe = useCallback(async () => {
        if (!value || value.length < 10 || !resume) {
            return
        }

        setLoading(true)
        try {
            const result = await resumeApi.getAIReframe(value, {
                resume,
                jobContext
            })
            setReframe(result)
        } catch (error) {
            console.error('Failed to reframe:', error)
        } finally {
            setLoading(false)
        }
    }, [value, resume, jobContext])

    // Refetch reframe
    const refetchReframe = useCallback(() => {
        fetchReframe()
    }, [fetchReframe])

    return {
        suggestions,
        reframe,
        score,
        loading,
        refetchReframe
    }
}
