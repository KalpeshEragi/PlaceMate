import { useState, useEffect, useCallback, useRef } from 'react'
import { Resume, ResumeSection } from '@/lib/types/resume-types'
import { resumeApi } from '@/lib/api/resume-api'

export function useResumeBuilder(resumeId?: string) {
    const [resume, setResume] = useState<Resume | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeSection, setActiveSection] = useState<ResumeSection>('personal')
    const [error, setError] = useState<string | null>(null)

    // Ref to track the debounce timeout - this fixes the duplicate typing issue
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Load resume
    useEffect(() => {
        async function loadResume() {
            if (!resumeId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const data = await resumeApi.getResume(resumeId)
                setResume(data)
                setError(null)
            } catch (err) {
                setError('Failed to load resume')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadResume()
    }, [resumeId])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [])

    // Auto-save functionality
    const saveResume = useCallback(async (updates: Partial<Resume>) => {
        if (!resume) return

        try {
            setSaving(true)
            const updated = await resumeApi.updateResume(resume.id, updates)
            setResume(updated)
            setError(null)
        } catch (err) {
            setError('Failed to save changes')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }, [resume])

    // Update specific section
    const updateSection = useCallback(<K extends keyof Resume>(
        section: K,
        value: Resume[K]
    ) => {
        if (!resume) return

        const updates = { [section]: value }
        setResume(prev => prev ? { ...prev, ...updates } : null)

        // Clear any existing timeout to properly debounce
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        // Auto-save after 1 second of inactivity
        saveTimeoutRef.current = setTimeout(() => {
            saveResume(updates)
        }, 1000)
    }, [resume, saveResume])

    return {
        resume,
        loading,
        saving,
        error,
        activeSection,
        setActiveSection,
        updateSection,
        saveResume
    }
}
