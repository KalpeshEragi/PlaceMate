// File: lib/ai-engine/suggestion-generator.ts
// Copy this entire file

import { DomainRules, PowerWord, SkillRule, MetricExample } from '../rules/rules-schema'
import { Resume } from '../types/resume-types'

export interface Suggestion {
  type: 'improvement' | 'warning' | 'tip'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  suggestion: string
  example?: string
  applySuggestion?: string // The improved version
}

export class SuggestionGenerator {
  /**
   * Generate suggestions for a resume field
   * Called when user focuses on or types in a field
   * 
   * @param fieldValue The actual text the user typed
   * @param fieldName The name of the field (e.g., 'description', 'summary')
   * @param fieldSection The section it belongs to (e.g., 'experience', 'personal')
   * @param rules The domain rules to check against
   */
  static generateFieldSuggestions(
    fieldValue: string,
    fieldName: string,
    fieldSection: string,
    rules: DomainRules
  ): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Get the appropriate experience level (default to mid-level)
    const levelRules = rules.experienceLevels.midLevel

    // Route to specific analyzers based on field
    if (fieldSection === 'experience' && fieldName === 'description') {
      suggestions.push(
        ...this.analyzeBulletPoint(fieldValue, levelRules.rules.powerWords.verbs)
      )
      suggestions.push(
        ...this.checkForMetrics(fieldValue, levelRules.rules.metricsFramework)
      )
      suggestions.push(
        ...this.checkForPassiveLanguage(fieldValue)
      )
    }

    if (fieldSection === 'personal' && fieldName === 'summary') {
      suggestions.push(
        ...this.analyzeSummary(fieldValue, levelRules.rules.requiredSkills.skills)
      )
    }

    if (fieldSection === 'skills') {
      suggestions.push(
        ...this.analyzeSkills(fieldValue, levelRules.rules.requiredSkills.skills)
      )
    }

    if (fieldSection === 'projects' && fieldName === 'description') {
      suggestions.push(
        ...this.analyzeProjectDescription(fieldValue, levelRules.rules.metricsFramework)
      )
    }

    // Remove duplicates
    const uniqueSuggestions = Array.from(
      new Map(suggestions.map(s => [s.message, s])).values()
    )

    return uniqueSuggestions
  }

  /**
   * Generate high-level suggestions for the entire resume
   * Checks for structural issues, missing sections, and skill gaps
   */
  static generateGlobalSuggestions(
    resume: Resume,
    rules: DomainRules
  ): Suggestion[] {
    const suggestions: Suggestion[] = []
    const levelRules = rules.experienceLevels.midLevel

    // 1. Check Contact Info
    if (!resume.personalInfo.email || !resume.personalInfo.phone || !resume.personalInfo.location) {
      suggestions.push({
        type: 'warning',
        severity: 'high',
        message: '📞 Incomplete Contact Info',
        suggestion: 'Add email, phone, and location so recruiters can reach you.'
      })
    }

    if (!resume.personalInfo.linkedin && !resume.personalInfo.github && !resume.personalInfo.portfolio) {
      suggestions.push({
        type: 'improvement',
        severity: 'medium',
        message: '🌐 Missing Online Presence',
        suggestion: 'Add links to LinkedIn, GitHub, or your Portfolio to showcase your work.'
      })
    }

    // 2. Check Summary
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50) {
      suggestions.push({
        type: 'improvement',
        severity: 'medium',
        message: '📝 Short Professional Summary',
        suggestion: 'Write a stronger summary (2-3 sentences) highlighting your key years of experience and top skills.'
      })
    }

    // 3. Check Experience
    if (resume.experiences.length === 0) {
      suggestions.push({
        type: 'warning',
        severity: 'critical',
        message: '💼 No Experience Listed',
        suggestion: 'Add at least one internship, job, or freelance role. Experience is crucial.'
      })
    } else {
      // Check for quantifiable results in experience
      const hasMetrics = resume.experiences.some(exp => /\d+%|\d+/.test(exp.description));
      if (!hasMetrics) {
        suggestions.push({
          type: 'improvement',
          severity: 'high',
          message: '📊 Missing Quantifiable Results',
          suggestion: 'Try to add numbers to your experience descriptions (e.g., "Increased sales by 20%").'
        })
      }
    }

    // 4. Check Projects
    if (resume.projects.length === 0) {
      suggestions.push({
        type: 'tip',
        severity: 'medium',
        message: '🚀 No Projects Listed',
        suggestion: 'Adding personal projects demonstrates passion and practical skills, especially for technical roles.'
      })
    }

    // 5. Skill Gap Analysis
    const userSkills = resume.skills.flatMap(s => s.skills).map(s => s.toLowerCase());
    const requiredSkills = levelRules.rules.requiredSkills.skills;

    // Find missing critical skills
    const missingCritical = requiredSkills
      .filter(s => s.priority === 'critical')
      .filter(s => !userSkills.some(us => us.includes(s.skill.toLowerCase())));

    if (missingCritical.length > 0) {
      suggestions.push({
        type: 'warning',
        severity: 'high',
        message: '⚠️ Missing Critical Skills',
        suggestion: `Your profile is missing core skills for this role: ${missingCritical.map(s => s.skill).slice(0, 3).join(', ')}.`
      })
    }

    // Suggest "Nice to Have" if critical are present
    if (missingCritical.length === 0) {
      const niceToHave = levelRules.rules.niceToHaveSkills?.skills || [];
      const missingNiceToHave = niceToHave.filter(s => !userSkills.some(us => us.includes(s.skill.toLowerCase())));

      if (missingNiceToHave.length > 0) {
        suggestions.push({
          type: 'tip',
          severity: 'low',
          message: '💡 Level Up Your Profile',
          suggestion: `Consider learning: ${missingNiceToHave.map(s => s.skill).slice(0, 2).join(', ')} to stand out.`
        })
      }
    }

    return suggestions
  }

  /**
   * Analyze a single bullet point from experience
   * Checks for weak verbs, length, etc.
   */
  private static analyzeBulletPoint(
    text: string,
    powerWords: PowerWord[]
  ): Suggestion[] {
    const suggestions: Suggestion[] = []
    const lowerText = text.toLowerCase()

    // Check if using weak verbs
    const weakVerbs = ['responsible', 'worked', 'helped', 'did', 'made', 'involved', 'was']
    const foundWeakVerb = weakVerbs.find(verb => lowerText.startsWith(verb) || lowerText.includes(` ${verb} `))

    if (foundWeakVerb) {
      const strongVerbs = powerWords
        .filter(w => w.strength === 'very high' || w.strength === 'high')
        .slice(0, 5)
        .map(w => w.verb)

      const improved = text.replace(
        new RegExp(`^${foundWeakVerb}`, 'i'),
        strongVerbs[0] || 'Developed'
      )

      suggestions.push({
        type: 'improvement',
        severity: 'high',
        message: '⚠️ Weak action verb detected',
        suggestion: `Start with a stronger action verb like: ${strongVerbs.join(', ')}`,
        example: `Bad: "Responsible for developing websites"\nGood: "Architected responsive websites"`,
        applySuggestion: improved
      })
    }

    // Check length
    if (text.length < 20) {
      suggestions.push({
        type: 'warning',
        severity: 'medium',
        message: '📝 Bullet point too short',
        suggestion: 'Add more details about what you accomplished and the impact. Aim for at least 15-20 words.'
      })
    }

    if (text.length > 200) {
      suggestions.push({
        type: 'tip',
        severity: 'low',
        message: '📏 Bullet point is quite long',
        suggestion: 'Consider breaking into 2 shorter bullet points for readability'
      })
    }

    return suggestions
  }

  /**
   * Check if the text includes metrics (numbers, percentages)
   */
  private static checkForMetrics(text: string, metricsFramework: { category: string; importance: number; metricTypes: MetricExample[] }): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Look for numbers, percentages, or quantifiable results
    const metricsPattern = /(\d+%|\d+\s*(hours?|seconds?|minutes?|days?|weeks?|months?|years?|users?|customers?|projects?|tickets?|requests?|transactions?|visits?|clicks?|downloads?|reviews?))/gi
    const hasMetrics = metricsPattern.test(text)

    if (!hasMetrics) {
      suggestions.push({
        type: 'improvement',
        severity: 'high',
        message: '📊 Missing quantifiable metrics',
        suggestion: 'Add numbers/percentages to show impact. Examples: "increased by X%", "saved X hours", "served X users", "improved load time by X seconds"',
        example: `Bad: "Improved website performance"\nGood: "Improved website load time by 40%, reducing bounce rate by 15%"`
      })
    }

    return suggestions
  }

  /**
   * Check for passive voice
   */
  private static checkForPassiveLanguage(text: string): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Simple passive voice patterns
    const passivePatterns = [
      { pattern: /was\s+\w+ed/, replacement: 'Use active voice' },
      { pattern: /were\s+\w+ed/, replacement: 'Use active voice' },
      { pattern: /being\s+\w+ed/, replacement: 'Use active voice' }
    ]

    const hasPassive = passivePatterns.some(p => p.pattern.test(text))

    if (hasPassive) {
      suggestions.push({
        type: 'improvement',
        severity: 'medium',
        message: '🎯 Passive voice detected',
        suggestion: 'Use active voice to show what YOU did, not what happened to you',
        example: `Bad: "The website was improved by our team"\nGood: "Led the team in improving the website, increasing user retention by 20%"`
      })
    }

    return suggestions
  }

  /**
   * Analyze professional summary
   */
  private static analyzeSummary(text: string, requiredSkills: SkillRule[]): Suggestion[] {
    const suggestions: Suggestion[] = []
    const lowerText = text.toLowerCase()

    // Check if it mentions any required skills
    const skillsMentioned = requiredSkills.filter(skill =>
      lowerText.includes(skill.skill.toLowerCase())
    ).length

    const criticalSkills = requiredSkills.filter(s => s.priority === 'critical').length

    if (skillsMentioned < 2) {
      suggestions.push({
        type: 'improvement',
        severity: 'high',
        message: '🛠️ Missing key technical skills',
        suggestion: `Include at least 2-3 key technical skills in your summary. Critical skills: ${requiredSkills
          .filter(s => s.priority === 'critical')
          .slice(0, 3)
          .map(s => s.skill)
          .join(', ')}`,
        example: 'Example: "Skilled Full-Stack Developer with 5+ years of experience in React, Node.js, and MongoDB"'
      })
    }

    // Check if it has years of experience mentioned
    if (!/\d+\+?\s*(years?|yrs?)/i.test(text)) {
      suggestions.push({
        type: 'tip',
        severity: 'low',
        message: '💡 Consider mentioning years of experience',
        suggestion: 'Add your years of experience to establish credibility and relevance'
      })
    }

    // Check length
    if (text.length < 50) {
      suggestions.push({
        type: 'warning',
        severity: 'medium',
        message: '📝 Summary is too brief',
        suggestion: 'Expand your summary to 2-4 sentences. Include experience level, key skills, and career focus.'
      })
    }

    return suggestions
  }

  /**
   * Analyze skills section
   */
  private static analyzeSkills(text: string, requiredSkills: SkillRule[]): Suggestion[] {
    const suggestions: Suggestion[] = []
    const skillsText = text.split(',').map(s => s.trim().toLowerCase()).filter(s => s)

    // Check if critical skills are present
    const criticalSkills = requiredSkills.filter(s => s.priority === 'critical')
    const missingCritical = criticalSkills.filter(skill =>
      !skillsText.some(s =>
        s.includes(skill.skill.toLowerCase()) ||
        skill.alternatives?.some(alt => s.includes(alt.toLowerCase()))
      )
    )

    if (missingCritical.length > 0) {
      suggestions.push({
        type: 'warning',
        severity: 'high',
        message: '⚠️ Missing critical skills',
        suggestion: `Add these essential skills: ${missingCritical.slice(0, 5).map(s => s.skill).join(', ')}`,
      })
    }

    // Check number of skills
    if (skillsText.length < 5) {
      suggestions.push({
        type: 'tip',
        severity: 'low',
        message: '📊 Consider adding more skills',
        suggestion: 'Aim for 8-12 core skills across different categories'
      })
    }

    return suggestions
  }

  /**
   * Analyze project description
   */
  private static analyzeProjectDescription(text: string, metricsFramework: { category: string; importance: number; metricTypes: MetricExample[] }): Suggestion[] {
    const suggestions: Suggestion[] = []

    // For projects, metrics are important to show impact
    const metricsPattern = /(\d+%|\d+\s*(users?|visits?|downloads?|stars?|likes?|views?))/gi
    const hasMetrics = metricsPattern.test(text)

    if (!hasMetrics) {
      suggestions.push({
        type: 'improvement',
        severity: 'medium',
        message: '📈 Add project metrics',
        suggestion: 'Include usage stats, performance improvements, or user engagement numbers if applicable',
        example: `Bad: "Built an e-commerce platform"\nGood: "Built an e-commerce platform used by 10k+ users with 99.9% uptime"`
      })
    }

    // Check if technologies are mentioned
    if (!/[A-Z]+[\w\s]*(\,|$)/g.test(text)) {
      suggestions.push({
        type: 'tip',
        severity: 'low',
        message: '🔧 Mention technologies used',
        suggestion: 'Specify which technologies, languages, or frameworks you used in this project'
      })
    }

    return suggestions
  }
}