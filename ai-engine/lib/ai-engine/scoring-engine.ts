// File: lib/ai-engine/scoring-engine.ts
// Copy this entire file

import { Resume } from '../types/resume-types'
import { DomainRules } from '../rules/rules-schema'

export interface ATSScore {
  overallScore: number
  keywordMatch: number
  formatCompliance: number
  metricsPresent: number
  skillRelevance: number
  breakdown: {
    category: string
    score: number
    weight: number
  }[]
}

export class ScoringEngine {
  /**
   * Calculate ATS score based on rules
   * Returns a score 0-100 indicating how ATS-friendly the resume is
   */
  static calculateATSScore(
    resume: Resume,
    rules: DomainRules
  ): ATSScore {
    const weights = rules.overallScoringWeights

    // Safely get weights with fallbacks (handle potential property name mismatches)
    const wKeyword = weights.keywordMatch || 0
    const wFormat = weights.formatCompliance || 0
    const wMetrics = weights.metricsPresent || 0
    // Fix: check for both powerWords (code expectation) and powerWordsUsage (json definition)
    const wPowerWords = weights.powerWords || weights.powerWordsUsage || 0
    const wSkill = weights.skillRelevance || 0

    console.log('[ScoringEngine] Starting ATS score calculation...')

    // Calculate individual scores (0-100)
    const keywordScore = this.calculateKeywordMatch(resume, rules)
    const formatScore = this.calculateFormatCompliance(resume)
    const metricsScore = this.calculateMetricsPresent(resume)
    const powerWordScore = this.calculatePowerWordsUsage(resume, rules)
    const skillScore = this.calculateSkillRelevance(resume, rules)

    console.log('[ScoringEngine] Individual scores:', {
      keywordScore,
      formatScore,
      metricsScore,
      powerWordScore,
      skillScore
    })

    // Weighted average
    const totalWeight = wKeyword + wFormat + wMetrics + wPowerWords + wSkill

    // Prevent division by zero if total weight is 0 or NaN result
    const overallScore = totalWeight > 0
      ? Math.round(
        (keywordScore * wKeyword) +
        (formatScore * wFormat) +
        (metricsScore * wMetrics) +
        (powerWordScore * wPowerWords) +
        (skillScore * wSkill)
      )
      : 0

    const result: ATSScore = {
      overallScore: isNaN(overallScore) ? 0 : Math.min(100, Math.max(0, overallScore)),
      keywordMatch: keywordScore,
      formatCompliance: formatScore,
      metricsPresent: metricsScore,
      skillRelevance: skillScore,
      breakdown: [
        { category: 'Keyword Match', score: keywordScore, weight: wKeyword },
        { category: 'Format Compliance', score: formatScore, weight: wFormat },
        { category: 'Metrics Present', score: metricsScore, weight: wMetrics },
        { category: 'Power Words', score: powerWordScore, weight: wPowerWords },
        { category: 'Skill Relevance', score: skillScore, weight: wSkill },
      ]
    }

    console.log('[ScoringEngine] Final ATS Score:', result.overallScore)

    return result
  }

  /**
   * Calculate how well resume matches job description keywords
   * Checks if required skills from the domain are present
   */
  private static calculateKeywordMatch(resume: Resume, rules: DomainRules): number {
    const allText = this.extractAllText(resume).toLowerCase()
    const requiredSkills = rules.experienceLevels.midLevel.rules.requiredSkills.skills

    // Guard against empty required skills
    if (!requiredSkills || requiredSkills.length === 0) return 100

    const matchedSkills = requiredSkills.filter(skill =>
      allText.includes(skill.skill.toLowerCase())
    )

    const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100

    console.log(`[ScoringEngine] Keyword Match: ${matchedSkills.length}/${requiredSkills.length} skills found (${Math.round(matchPercentage)}%)`)

    return Math.round(matchPercentage)
  }

  /**
   * Check if resume follows ATS-safe formatting
   * In real production, you'd parse the actual PDF/DOCX
   * For now, we check common ATS issues
   */
  private static calculateFormatCompliance(resume: Resume): number {
    let score = 100

    // Check for red flags in data structure
    const penalties: { [key: string]: number } = {
      // Personal info missing
      missingContact: !resume.personalInfo.email || !resume.personalInfo.phone ? 10 : 0,

      // Missing sections
      noExperience: resume.experiences.length === 0 ? 20 : 0,
      noEducation: resume.education.length === 0 ? 15 : 0,
      noSkills: resume.skills.length === 0 ? 15 : 0,

      // Empty descriptions
      emptyExperienceDesc: resume.experiences.some(e => !e.description || e.description.length < 10) ? 10 : 0,
    }

    const totalPenalty = Object.values(penalties).reduce((a, b) => a + b, 0)
    const finalScore = Math.max(0, score - totalPenalty)

    console.log('[ScoringEngine] Format Compliance Score:', finalScore, 'Penalties:', penalties)

    return finalScore
  }

  /**
   * Check if resume includes metrics/numbers
   * ATS systems prioritize resumes with quantifiable results
   */
  private static calculateMetricsPresent(resume: Resume): number {
    const experienceText = resume.experiences
      .map(exp => exp.description)
      .join(' ')
      .toLowerCase()

    const projectText = resume.projects
      .map(proj => proj.description)
      .join(' ')
      .toLowerCase()

    const allText = experienceText + ' ' + projectText

    // Look for quantifiable metrics
    const metricsPattern = /(\d+%|\d+\s*(hours?|seconds?|minutes?|days?|weeks?|months?|years?|users?|customers?|projects?|tickets?|requests?|visits?|downloads?))/gi
    const metricsFound = (allText.match(metricsPattern) || []).length

    // Normalize to 0-100
    // Expect at least 5 metrics for a good score
    const score = Math.min(100, (metricsFound / 5) * 100)

    console.log(`[ScoringEngine] Metrics Present: ${metricsFound} metrics found (Score: ${Math.round(score)})`)

    return Math.round(score)
  }

  /**
   * Check usage of power words (strong action verbs)
   * ATS and recruiters value strong verbs
   */
  private static calculatePowerWordsUsage(resume: Resume, rules: DomainRules): number {
    const powerWords = rules.experienceLevels.midLevel.rules.powerWords.verbs

    // Guard against empty power words
    if (!powerWords || powerWords.length === 0) return 100

    const allText = this.extractAllText(resume).toLowerCase()

    const powerWordsFound = powerWords.filter(pw =>
      allText.includes(pw.verb.toLowerCase())
    ).length

    const score = (powerWordsFound / powerWords.length) * 100

    console.log(`[ScoringEngine] Power Words: ${powerWordsFound}/${powerWords.length} found (Score: ${Math.round(score)})`)

    return Math.round(score)
  }

  /**
   * Check skill relevance to domain
   * Critical skills should definitely be present
   */
  private static calculateSkillRelevance(resume: Resume, rules: DomainRules): number {
    const requiredSkills = rules.experienceLevels.midLevel.rules.requiredSkills.skills

    // Guard against empty required skills
    if (!requiredSkills || requiredSkills.length === 0) return 100

    const criticalSkills = requiredSkills.filter(s => s.priority === 'critical')

    const userSkills = resume.skills
      .flatMap(s => s.skills)
      .map(s => s.toLowerCase())

    // Check how many required skills the user has
    const matches = requiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.includes(skill.skill.toLowerCase()) ||
        skill.skill.toLowerCase().includes(userSkill) ||
        (skill.alternatives && skill.alternatives.some(alt =>
          userSkill.includes(alt.toLowerCase())
        ))
      )
    ).length

    // Check if critical skills are present (more important)
    const criticalMatches = criticalSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.includes(skill.skill.toLowerCase()) ||
        skill.skill.toLowerCase().includes(userSkill)
      )
    ).length

    // Score based on critical and overall matches
    const criticalPercentage = criticalSkills.length > 0
      ? (criticalMatches / criticalSkills.length) * 100
      : 100

    const overallPercentage = requiredSkills.length > 0
      ? (matches / requiredSkills.length) * 100
      : 100

    // Critical skills weighted more heavily
    const score = (criticalPercentage * 0.6) + (overallPercentage * 0.4)

    console.log(`[ScoringEngine] Skill Relevance: ${matches}/${requiredSkills.length} matched, ${criticalMatches}/${criticalSkills.length} critical (Score: ${Math.round(score)})`)

    return Math.round(score)
  }

  /**
   * Extract all text from resume for analysis
   */
  private static extractAllText(resume: Resume): string {
    const parts = [
      resume.personalInfo.fullName,
      resume.personalInfo.summary,
      ...resume.experiences.map(e => `${e.company} ${e.position} ${e.description}`),
      ...resume.projects.map(p => `${p.name} ${p.description}`),
      ...resume.skills.flatMap(s => s.skills),
      ...resume.education.map(e => `${e.institution} ${e.degree} ${e.field}`),
    ]
    return parts.filter(Boolean).join(' ')
  }

  /**
   * Get a human-readable feedback message based on score
   */
  static getScoreFeedback(score: number): {
    message: string
    color: string
    emoji: string
  } {
    if (score >= 85) {
      return {
        message: 'Excellent! Your resume is highly optimized for ATS',
        color: 'green',
        emoji: '🎉'
      }
    }
    if (score >= 70) {
      return {
        message: 'Good! Your resume is ATS-friendly, but can be improved',
        color: 'blue',
        emoji: '👍'
      }
    }
    if (score >= 50) {
      return {
        message: 'Fair. Follow the suggestions to improve ATS compatibility',
        color: 'yellow',
        emoji: '⚠️'
      }
    }
    return {
      message: 'Needs improvement. Check the suggestions panel for help',
      color: 'red',
      emoji: '❌'
    }
  }
}