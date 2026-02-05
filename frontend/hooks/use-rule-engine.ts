// File: hooks/use-rule-engine.ts
// Copy this entire file

'use client'

import { useEffect, useState, useCallback } from 'react'
import { RuleEngine } from '@ai-engine/rule-engine'
import { Suggestion } from '@ai-engine/suggestion-generator'
import { ATSScore } from '@ai-engine/scoring-engine'
import { Resume } from '@/lib/types/resume-types'

interface UseRuleEngineOptions {
  domain?: string
  autoInitialize?: boolean
}

/**
 * React hook for using the rule engine
 * 
 * Usage:
 * const { suggestions, globalSuggestions, atsScore, getFieldSuggestions, refreshSuggestions, getATSScore } = useRuleEngine('web-developer')
 * 
 * When user focuses on a field:
 * const suggestions = getFieldSuggestions(fieldValue, fieldName, fieldSection)
 * 
 * To update global suggestions (e.g. after adding a skill):
 * refreshSuggestions(resume)
 * 
 * To get ATS score:
 * const score = getATSScore(resume)
 */
export const useRuleEngine = (options: UseRuleEngineOptions = {}) => {
  const { domain = 'web-developer', autoInitialize = true } = options

  const [engine, setEngine] = useState<RuleEngine | null>(null)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [globalSuggestions, setGlobalSuggestions] = useState<Suggestion[]>([])
  const [atsScore, setATSScore] = useState<ATSScore | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentDomain, setCurrentDomain] = useState<string>(domain)

  /**
   * Initialize the engine when domain changes
   */
  useEffect(() => {
    if (!autoInitialize) return

    const initEngine = async () => {
      try {
        console.log(`[useRuleEngine] Initializing engine for domain: ${domain}`)
        setLoading(true)
        setError(null)

        const newEngine = new RuleEngine()
        await newEngine.initialize(domain)

        setEngine(newEngine)
        setCurrentDomain(domain)

        console.log('[useRuleEngine] Engine initialized successfully')
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize rule engine'
        setError(errorMessage)
        console.error('[useRuleEngine] Initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initEngine()
  }, [domain, autoInitialize])

  /**
   * Get suggestions for a field
   * Call this when user focuses on or types in a field
   */
  const getFieldSuggestions = useCallback(
    (
      fieldValue: string,
      fieldName: string,
      fieldSection: string
    ): Suggestion[] => {
      if (!engine) {
        console.warn('[useRuleEngine] Engine not initialized yet')
        return []
      }

      try {
        const newSuggestions = engine.getSuggestions(
          fieldValue,
          fieldName,
          fieldSection
        )
        setSuggestions(newSuggestions)
        return newSuggestions
      } catch (err) {
        console.error('[useRuleEngine] Error getting suggestions:', err)
        return []
      }
    },
    [engine]
  )

  /**
   * Calculate ATS score for the resume
   * Call this whenever resume changes (debounce for performance)
   */
  const getATSScore = useCallback(
    (resume: Resume): ATSScore | null => {
      if (!engine) {
        console.warn('[useRuleEngine] Engine not initialized yet')
        return null
      }

      try {
        const score = engine.calculateScore(resume)
        setATSScore(score)
        return score
      } catch (err) {
        console.error('[useRuleEngine] Error calculating ATS score:', err)
        return null
      }
    },
    [engine]
  )

  /**
   * Refresh global suggestions based on current resume state
   */
  const refreshSuggestions = useCallback(
    (resume: Resume) => {
      if (!engine) return

      try {
        const newGlobalSuggestions = engine.getGlobalSuggestions(resume)
        setGlobalSuggestions(newGlobalSuggestions)
      } catch (err) {
        console.error('[useRuleEngine] Error refreshing global suggestions:', err)
      }
    },
    [engine]
  )

  /**
   * Change domain dynamically
   */
  const changeDomain = useCallback(async (newDomain: string) => {
    try {
      console.log(`[useRuleEngine] Changing domain to: ${newDomain}`)
      setLoading(true)
      setError(null)

      const newEngine = new RuleEngine()
      await newEngine.initialize(newDomain)

      setEngine(newEngine)
      setCurrentDomain(newDomain)
      setSuggestions([])
      setATSScore(null)

      console.log('[useRuleEngine] Domain changed successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to change domain'
      setError(errorMessage)
      console.error('[useRuleEngine] Domain change error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get the currently loaded rules (for debugging)
   */
  const getRules = useCallback(() => {
    if (!engine) return null
    try {
      return engine.getRules()
    } catch {
      return null
    }
  }, [engine])

  /**
   * Get required skills for current domain
   */
  const getRequiredSkills = useCallback(() => {
    if (!engine) return []
    try {
      return engine.getRequiredSkills()
    } catch {
      return []
    }
  }, [engine])

  /**
   * Get power words for current domain
   */
  const getPowerWords = useCallback(() => {
    if (!engine) return []
    try {
      return engine.getPowerWords()
    } catch {
      return []
    }
  }, [engine])

  /**
   * Get red flags to avoid
   */
  const getRedFlags = useCallback(() => {
    if (!engine) return []
    try {
      return engine.getRedFlags()
    } catch {
      return []
    }
  }, [engine])

  return {
    // Status
    engine,
    loading,
    error,
    currentDomain,

    // Scores and suggestions
    suggestions,
    globalSuggestions,
    atsScore,

    // Methods
    getFieldSuggestions,
    refreshSuggestions,
    getATSScore,
    changeDomain,

    // Advanced methods for debugging
    getRules,
    getRequiredSkills,
    getPowerWords,
    getRedFlags,

    // Check if initialized
    isInitialized: engine?.isInitialized() ?? false,
  }
}