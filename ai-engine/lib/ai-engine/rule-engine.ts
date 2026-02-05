// File: lib/ai-engine/rule-engine.ts
// Copy this entire file

import { RuleLoader } from './rule-loader'
import { ScoringEngine, ATSScore } from './scoring-engine'
import { SuggestionGenerator, Suggestion } from './suggestion-generator'
import { DomainRules } from '../rules/rules-schema'
import { Resume } from '../types/resume-types'

/**
 * Main Rule Engine
 * 
 * This is the main class that orchestrates:
 * - Loading rules for different domains
 * - Generating suggestions based on rules
 * - Calculating ATS scores
 * 
 * Usage:
 * const engine = new RuleEngine()
 * await engine.initialize('web-developer')
 * const suggestions = engine.getSuggestions('my text', 'description', 'experience')
 * const score = engine.calculateScore(resume)
 */
export class RuleEngine {
  private rules: DomainRules | null = null
  private currentDomain: string | null = null

  /**
   * Initialize the rule engine for a specific domain
   * 
   * @param domain The domain to initialize (e.g., 'web-developer', 'data-scientist')
   * @throws Error if domain rules cannot be loaded
   */
  async initialize(domain: string): Promise<void> {
    try {
      console.log(`[RuleEngine] Initializing for domain: ${domain}`)

      this.currentDomain = domain
      this.rules = await RuleLoader.loadRules(domain)

      console.log(`[RuleEngine] Successfully initialized for domain: ${domain}`)
    } catch (error) {
      console.error(`[RuleEngine] Failed to initialize:`, error)
      throw error
    }
  }

  /**
   * Get suggestions for a specific field
   * Call this when user focuses on or edits a field
   * 
   * @param fieldValue The text the user entered
   * @param fieldName The field name (e.g., 'description')
   * @param fieldSection The section (e.g., 'experience')
   * @returns Array of suggestions
   */
  getSuggestions(
    fieldValue: string,
    fieldName: string,
    fieldSection: string
  ): Suggestion[] {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }

    if (!fieldValue || fieldValue.trim().length === 0) {
      return []
    }

    try {
      const suggestions = SuggestionGenerator.generateFieldSuggestions(
        fieldValue,
        fieldName,
        fieldSection,
        this.rules
      )

      console.log(`[RuleEngine] Generated ${suggestions.length} suggestions for ${fieldSection}.${fieldName}`)

      return suggestions
    } catch (error) {
      console.error('[RuleEngine] Error generating suggestions:', error)
      return []
    }
  }

  /**
   * Get global suggestions for the entire resume
   * Call this when resume structure updates (e.g. adding a skill)
   */
  getGlobalSuggestions(resume: Resume): Suggestion[] {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }

    try {
      const suggestions = SuggestionGenerator.generateGlobalSuggestions(
        resume,
        this.rules
      )
      console.log(`[RuleEngine] Generated ${suggestions.length} global suggestions`)
      return suggestions
    } catch (error) {
      console.error('[RuleEngine] Error generating global suggestions:', error)
      return []
    }
  }

  /**
   * Calculate ATS score for the entire resume
   * 
   * @param resume The resume to score
   * @returns ATSScore object with breakdown
   */
  calculateScore(resume: Resume): ATSScore {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }

    try {
      return ScoringEngine.calculateATSScore(resume, this.rules)
    } catch (error) {
      console.error('[RuleEngine] Error calculating score:', error)
      // Return a default score with 0
      return {
        overallScore: 0,
        keywordMatch: 0,
        formatCompliance: 0,
        metricsPresent: 0,
        skillRelevance: 0,
        breakdown: []
      }
    }
  }

  /**
   * Get the current rules
   * Useful for debugging or advanced features
   */
  getRules(): DomainRules {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.rules
  }

  /**
   * Get the current domain
   */
  getDomain(): string {
    if (!this.currentDomain) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.currentDomain
  }

  /**
   * Check if engine is initialized
   */
  isInitialized(): boolean {
    return this.rules !== null && this.currentDomain !== null
  }

  /**
   * Get required skills for current domain
   */
  getRequiredSkills() {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.rules.experienceLevels.midLevel.rules.requiredSkills.skills
  }

  /**
   * Get power words for current domain
   */
  getPowerWords() {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.rules.experienceLevels.midLevel.rules.powerWords.verbs
  }

  /**
   * Get red flags to avoid
   */
  getRedFlags() {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.rules.experienceLevels.midLevel.rules.redFlags.flags
  }

  /**
   * Get resume structure guidelines
   */
  getStructureGuidelines() {
    if (!this.rules) {
      throw new Error('Rule engine not initialized. Call initialize() first.')
    }
    return this.rules.experienceLevels.midLevel.rules.resumeStructure.sections
  }
}