// File: lib/ai-engine/unified-rules.ts
// Unified rules loader that bridges the comprehensive JSON rules with the frontend format

import atsRulesData from '../rules/ats_rules.json'
import hrRulesData from '../rules/hr_rules.json'
import webDevRulesData from '../rules/web-developer.json'

// Types for the flattened format expected by frontend
export interface FlatATSRule {
  id: string
  description: string
  check?: string[]
  regex?: string
  min_skills?: number
  max_skills?: number
  weight: number
  category: string
  suggestion: string
  implementation?: string[]
  rationale?: string
}

export interface FlatHRRule {
  id: string
  description: string
  check: string
  weight: number
  category: string
  suggestion: string
  min_words?: number
  max_words?: number
  implementation?: string[]
  rationale?: string
}

export interface RedFlagRule {
  id: string
  description: string
  patterns?: string[]
  check?: string
  penalty: number
  suggestion: string
  max_occurrences?: number
  weak_verb_ratio?: number
  severity?: string
}

export interface JDMatchRule {
  id: string
  description: string
  check: string
  weight: number
  suggestion: string
}

export interface DomainSkill {
  ruleId: string
  skill: string
  context: string
  priority: string
  weight: number
  implementation: string[]
  variations?: string[]
  relatedSkills?: string[]
}

export interface ExperienceLevelExpectations {
  level: string
  yearsRequired: string
  criticalSkills: string[]
  niceToHave: string[]
  focusAreas: string[]
  commonMistakes: string[]
}

export interface RoleVariant {
  role: string
  focusSkills: string[]
  secondarySkills: string[]
  keyMetrics: string[]
}

export interface DomainRulesFlat {
  name: string
  description: string
  coreSkills: DomainSkill[]
  frontendSkills: DomainSkill[]
  backendSkills: DomainSkill[]
  modernSkills: DomainSkill[]
  experienceLevels: {
    entryLevel: ExperienceLevelExpectations
    midLevel: ExperienceLevelExpectations
    senior: ExperienceLevelExpectations
  }
  roleVariants: {
    frontend: RoleVariant
    backend: RoleVariant
    fullStack: RoleVariant
  }
  highValueKeywords: Array<{
    keyword: string
    priority: string
    variations: string[]
    context: string
  }>
  redFlags: Array<{
    flag: string
    severity: string
    reason: string
    solution: string
  }>
  trendingSkills: Array<{
    skill: string
    trend: string
    rationale: string
    implementation: string
  }>
  decliningSkills: Array<{
    skill: string
    status: string
    rationale: string
    recommendation: string
  }>
}

export interface UnifiedRuleset {
  ats_rules: FlatATSRule[]
  hr_rules: FlatHRRule[]
  recruiter_red_flags: RedFlagRule[]
  jd_matching_rules: JDMatchRule[]
  scoring_formula: {
    weights: { ats: number; hr: number; jd: number }
    verdict_thresholds: { pass: number; borderline: number; fail: number }
  }
  role_specific_tips: Record<string, string[]>
  domain_rules: Record<string, DomainRulesFlat>
  action_verbs: {
    leadership: string[]
    creation: string[]
    improvement: string[]
    analysis: string[]
    collaboration: string[]
  }
  metric_types: Array<{
    type: string
    examples: string[]
    priority: string
  }>
}

/**
 * Flatten the nested ATS rules into the format expected by frontend
 */
function flattenATSRules(): FlatATSRule[] {
  const flatRules: FlatATSRule[] = []
  const atsRules = (atsRulesData as any).atsRules

  // Process critical rules
  if (atsRules.criticalRules) {
    // Keyword Matching rules
    if (atsRules.criticalRules.keywordMatching?.rules) {
      for (const rule of atsRules.criticalRules.keywordMatching.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          weight: Math.round(rule.weight * 10),
          category: 'keywords',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Format Compliance rules
    if (atsRules.criticalRules.formatCompliance?.rules) {
      for (const rule of atsRules.criticalRules.formatCompliance.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          weight: Math.round(rule.weight * 10),
          category: 'format',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Content Structure rules
    if (atsRules.criticalRules.contentStructure?.rules) {
      for (const rule of atsRules.criticalRules.contentStructure.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          weight: Math.round(rule.weight * 10),
          category: 'structure',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }
  }

  // Process medium priority rules
  if (atsRules.mediumPriorityRules?.optimization?.rules) {
    for (const rule of atsRules.mediumPriorityRules.optimization.rules) {
      flatRules.push({
        id: rule.ruleId,
        description: rule.rule,
        weight: Math.round(rule.weight * 10),
        category: 'optimization',
        suggestion: rule.implementation?.join('. ') || '',
        implementation: rule.implementation,
        rationale: rule.rationale
      })
    }
  }

  // Add legacy format rules for backwards compatibility
  flatRules.push({
    id: 'ATS_01',
    description: 'Must contain core sections',
    check: ['contact', 'skills', 'experience_or_projects', 'education'],
    weight: 10,
    category: 'structure',
    suggestion: 'Add missing sections: Contact info, Skills, Experience/Projects, and Education are essential for ATS systems'
  })

  flatRules.push({
    id: 'ATS_02',
    description: 'Professional email required',
    regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    weight: 8,
    category: 'contact',
    suggestion: 'Use a professional email format (firstname.lastname@domain.com)'
  })

  flatRules.push({
    id: 'ATS_03',
    description: 'Contact information complete',
    check: ['email', 'phone', 'location'],
    weight: 7,
    category: 'contact',
    suggestion: 'Include complete contact information: email, phone, and location'
  })

  flatRules.push({
    id: 'ATS_05',
    description: 'Skills section has relevant keywords',
    min_skills: 5,
    max_skills: 25,
    weight: 9,
    category: 'keywords',
    suggestion: 'Include 5-25 relevant technical skills that match the job description'
  })

  return flatRules
}

/**
 * Flatten the nested HR rules into the format expected by frontend
 */
function flattenHRRules(): FlatHRRule[] {
  const flatRules: FlatHRRule[] = []
  const hrRules = (hrRulesData as any).hrRules

  // Process critical rules
  if (hrRules.criticalRules) {
    // Impact Quantification
    if (hrRules.criticalRules.impactQuantification?.rules) {
      for (const rule of hrRules.criticalRules.impactQuantification.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          check: 'metrics_present',
          weight: Math.round(rule.weight * 10),
          category: 'impact',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Portfolio Presence
    if (hrRules.criticalRules.portfolioPresence?.rules) {
      for (const rule of hrRules.criticalRules.portfolioPresence.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          check: 'has_portfolio',
          weight: Math.round(rule.weight * 10),
          category: 'credibility',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Professionalism
    if (hrRules.criticalRules.professionalism?.rules) {
      for (const rule of hrRules.criticalRules.professionalism.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          check: 'professionalism_check',
          weight: Math.round(rule.weight * 10),
          category: 'professionalism',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Experience Presentation
    if (hrRules.criticalRules.experiencePresentation?.rules) {
      for (const rule of hrRules.criticalRules.experiencePresentation.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          check: 'experience_quality',
          weight: Math.round(rule.weight * 10),
          category: 'experience',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }

    // Soft Skills Indication
    if (hrRules.criticalRules.softSkillsIndication?.rules) {
      for (const rule of hrRules.criticalRules.softSkillsIndication.rules) {
        flatRules.push({
          id: rule.ruleId,
          description: rule.rule,
          check: 'soft_skills_present',
          weight: Math.round(rule.weight * 10),
          category: 'soft_skills',
          suggestion: rule.implementation?.join('. ') || '',
          implementation: rule.implementation,
          rationale: rule.rationale
        })
      }
    }
  }

  // Add legacy format rules for backwards compatibility
  flatRules.push({
    id: 'HR_01',
    description: 'Quantified impact required',
    check: 'metrics_ratio >= 0.3',
    weight: 10,
    category: 'impact',
    suggestion: "Add quantified achievements (e.g., 'Improved performance by 40%', 'Managed team of 5')"
  })

  flatRules.push({
    id: 'HR_02',
    description: 'Action verbs density',
    check: 'strong_verb_ratio >= 0.2',
    weight: 8,
    category: 'language',
    suggestion: 'Start bullet points with strong action verbs (Led, Architected, Optimized, Transformed)'
  })

  flatRules.push({
    id: 'HR_03',
    description: 'Portfolio or GitHub required for web roles',
    check: 'has_github_or_portfolio == true',
    weight: 9,
    category: 'credibility',
    suggestion: 'Add GitHub profile or portfolio website to showcase your work'
  })

  flatRules.push({
    id: 'HR_04',
    description: 'Skill credibility check',
    check: 'skills_match_experience',
    weight: 7,
    category: 'credibility',
    suggestion: 'Ensure listed skills are demonstrated in your experience/projects'
  })

  flatRules.push({
    id: 'HR_06',
    description: 'Professional summary present',
    check: 'has_summary',
    min_words: 20,
    max_words: 100,
    weight: 6,
    category: 'structure',
    suggestion: 'Add a professional summary (20-100 words) highlighting your key strengths'
  })

  return flatRules
}

/**
 * Extract red flags from HR rules
 */
function extractRedFlags(): RedFlagRule[] {
  const redFlags: RedFlagRule[] = []
  const hrRules = (hrRulesData as any).hrRules

  if (hrRules.redFlagsToAvoid?.flags) {
    for (const flag of hrRules.redFlagsToAvoid.flags) {
      redFlags.push({
        id: flag.flagId,
        description: flag.flag,
        penalty: Math.round(flag.weight * -10),
        suggestion: flag.solution,
        severity: flag.severity
      })
    }
  }

  // Add legacy format red flags
  redFlags.push({
    id: 'RF_01',
    description: 'Unprofessional email',
    patterns: ['dragon', 'coolboy', 'ninja', 'gamer', '420', '69', 'xxx', 'hot'],
    penalty: -10,
    suggestion: 'Use a professional email address based on your name'
  })

  redFlags.push({
    id: 'RF_02',
    description: 'Buzzword stuffing',
    check: 'skill_count > 30',
    penalty: -6,
    suggestion: 'Reduce skills list to most relevant 15-20 skills to avoid appearing unfocused'
  })

  redFlags.push({
    id: 'RF_03',
    description: 'No measurable achievements',
    check: 'metrics_count < 2',
    penalty: -8,
    suggestion: 'Add at least 2-3 achievements with measurable impact'
  })

  redFlags.push({
    id: 'RF_04',
    description: 'First-person pronouns overuse',
    patterns: ['I ', 'my ', 'me '],
    max_occurrences: 3,
    penalty: -4,
    suggestion: 'Remove first-person pronouns (I, my, me) for professional tone'
  })

  redFlags.push({
    id: 'RF_05',
    description: 'Generic job duties only',
    weak_verb_ratio: 0.5,
    penalty: -6,
    suggestion: 'Replace generic duties with specific accomplishments and outcomes'
  })

  return redFlags
}

/**
 * Extract action verbs from HR rules
 */
function extractActionVerbs(): UnifiedRuleset['action_verbs'] {
  const hrRules = (hrRulesData as any).hrRules
  const verbsByStrength = hrRules.criticalRules?.impactQuantification?.rules?.find(
    (r: any) => r.verbsByStrength
  )?.verbsByStrength

  if (verbsByStrength) {
    return {
      leadership: verbsByStrength.leadership || [],
      creation: verbsByStrength.creation || [],
      improvement: verbsByStrength.improvement || [],
      analysis: verbsByStrength.analysis || [],
      collaboration: verbsByStrength.collaboration || []
    }
  }

  // Fallback default verbs
  return {
    leadership: ['Architected', 'Led', 'Mentored', 'Spearheaded', 'Directed', 'Championed'],
    creation: ['Built', 'Developed', 'Designed', 'Created', 'Engineered', 'Established'],
    improvement: ['Optimized', 'Enhanced', 'Improved', 'Streamlined', 'Refactored', 'Modernized'],
    analysis: ['Analyzed', 'Identified', 'Diagnosed', 'Evaluated', 'Assessed', 'Investigated'],
    collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Integrated', 'Aligned']
  }
}

/**
 * Extract metric types from HR rules
 */
function extractMetricTypes(): UnifiedRuleset['metric_types'] {
  const hrRules = (hrRulesData as any).hrRules
  const metricTypes = hrRules.criticalRules?.impactQuantification?.rules?.find(
    (r: any) => r.metricTypes
  )?.metricTypes

  if (metricTypes) {
    return metricTypes.map((mt: any) => ({
      type: mt.type,
      examples: mt.examples,
      priority: mt.priority
    }))
  }

  // Fallback default metric types
  return [
    {
      type: 'Performance Metrics',
      examples: ['Reduced load time by X%', 'Improved Lighthouse score from X to Y'],
      priority: 'very high'
    },
    {
      type: 'User Impact',
      examples: ['Increased user engagement by X%', 'Reduced bounce rate by X%'],
      priority: 'high'
    },
    {
      type: 'Business Impact',
      examples: ['Generated X% increase in revenue', 'Saved X hours/week through automation'],
      priority: 'high'
    }
  ]
}

/**
 * Flatten domain-specific rules (web-developer.json)
 */
function flattenDomainRules(): Record<string, DomainRulesFlat> {
  const webDevRules = (webDevRulesData as any).webDevRules
  
  const extractSkills = (skillsArray: any[]): DomainSkill[] => {
    if (!skillsArray) return []
    return skillsArray.map((s: any) => ({
      ruleId: s.ruleId,
      skill: s.skill,
      context: s.context,
      priority: s.priority,
      weight: s.weight,
      implementation: s.implementation || [],
      variations: s.variations,
      relatedSkills: s.relatedSkills
    }))
  }

  const extractExperienceLevel = (level: any): ExperienceLevelExpectations => {
    return {
      level: level.level || '',
      yearsRequired: level.yearsRequired || '',
      criticalSkills: level.criticalSkills || [],
      niceToHave: level.niceToHave || [],
      focusAreas: level.focusAreas || [],
      commonMistakes: level.commonMistakes || []
    }
  }

  const extractRoleVariant = (variant: any): RoleVariant => {
    return {
      role: variant.role || '',
      focusSkills: variant.focusSkills || [],
      secondarySkills: variant.secondarySkills || [],
      keyMetrics: variant.keyMetrics || []
    }
  }

  return {
    'web-developer': {
      name: 'Web Developer',
      description: webDevRules.description || 'Web development skills and rules',
      coreSkills: extractSkills(webDevRules.coreSkillsMatrix?.universal?.skills),
      frontendSkills: extractSkills(webDevRules.coreSkillsMatrix?.frontendSpecialization?.frameworks),
      backendSkills: extractSkills(webDevRules.coreSkillsMatrix?.backendSpecialization?.technologies),
      modernSkills: extractSkills(webDevRules.coreSkillsMatrix?.modernWebDevelopmentSkills?.skills),
      experienceLevels: {
        entryLevel: extractExperienceLevel(webDevRules.experienceLevelSpecifics?.entryLevel || {}),
        midLevel: extractExperienceLevel(webDevRules.experienceLevelSpecifics?.midLevel || {}),
        senior: extractExperienceLevel(webDevRules.experienceLevelSpecifics?.senior || {})
      },
      roleVariants: {
        frontend: extractRoleVariant(webDevRules.roleVariants?.frontend || {}),
        backend: extractRoleVariant(webDevRules.roleVariants?.backend || {}),
        fullStack: extractRoleVariant(webDevRules.roleVariants?.fullStack || {})
      },
      highValueKeywords: webDevRules.keywordOptimization?.highValueKeywords?.keywords || [],
      redFlags: webDevRules.redFlagsSpecific?.webDevelopmentRedFlags || [],
      trendingSkills: webDevRules.trendingSkills2025_2026?.emergingHighValue || [],
      decliningSkills: webDevRules.trendingSkills2025_2026?.decliningSkills || []
    }
  }
}

/**
 * Generate role-specific tips from domain rules
 */
function generateRoleSpecificTips(): Record<string, string[]> {
  const tips: Record<string, string[]> = {
    frontend: [],
    backend: [],
    fullstack: [],
    devops: []
  }

  const domainRules = flattenDomainRules()
  const webDev = domainRules['web-developer']

  if (webDev) {
    // Frontend tips
    tips.frontend = [
      ...webDev.roleVariants.frontend.focusSkills.slice(0, 2),
      `Key metrics to highlight: ${webDev.roleVariants.frontend.keyMetrics.slice(0, 2).join(', ')}`,
      'Include accessibility (a11y) experience and WCAG compliance',
      'Showcase UI/UX improvements with performance metrics'
    ]

    // Backend tips
    tips.backend = [
      ...webDev.roleVariants.backend.focusSkills.slice(0, 2),
      `Key metrics to highlight: ${webDev.roleVariants.backend.keyMetrics.slice(0, 2).join(', ')}`,
      'Highlight security implementation experience',
      'Include database optimization and scaling experience'
    ]

    // Full-stack tips
    tips.fullstack = [
      ...webDev.roleVariants.fullStack.focusSkills.slice(0, 2),
      'Balance frontend and backend experience equally',
      'Show end-to-end project ownership',
      'Include deployment and DevOps experience'
    ]

    // DevOps tips (general)
    tips.devops = [
      'Highlight CI/CD pipeline implementation',
      'Include infrastructure as code experience (Terraform, Ansible)',
      'Show monitoring and observability expertise',
      'Emphasize cloud platform certifications and experience'
    ]
  }

  return tips
}

/**
 * Get JD matching rules
 */
function getJDMatchingRules(): JDMatchRule[] {
  return [
    {
      id: 'JD_01',
      description: 'Required skills overlap',
      check: 'required_skill_overlap >= 0.6',
      weight: 10,
      suggestion: 'Your resume is missing key required skills'
    },
    {
      id: 'JD_02',
      description: 'Preferred skills boost',
      check: 'preferred_skill_overlap >= 0.3',
      weight: 5,
      suggestion: 'Consider adding preferred skills to strengthen your application'
    },
    {
      id: 'JD_03',
      description: 'Stack cluster match',
      check: 'stack_cluster_match == true',
      weight: 7,
      suggestion: 'Highlight experience with a recognized tech stack'
    },
    {
      id: 'JD_05',
      description: 'Role type alignment',
      check: 'role_type_match == true',
      weight: 8,
      suggestion: 'Tailor your experience descriptions to emphasize role-relevant skills'
    }
  ]
}

// Cache for unified ruleset
let cachedRuleset: UnifiedRuleset | null = null

/**
 * Get the complete unified ruleset
 * This is the main export that the frontend should use
 */
export function getUnifiedRuleset(): UnifiedRuleset {
  if (cachedRuleset) {
    return cachedRuleset
  }

  cachedRuleset = {
    ats_rules: flattenATSRules(),
    hr_rules: flattenHRRules(),
    recruiter_red_flags: extractRedFlags(),
    jd_matching_rules: getJDMatchingRules(),
    scoring_formula: {
      weights: { ats: 0.4, hr: 0.3, jd: 0.3 },
      verdict_thresholds: { pass: 75, borderline: 55, fail: 0 }
    },
    role_specific_tips: generateRoleSpecificTips(),
    domain_rules: flattenDomainRules(),
    action_verbs: extractActionVerbs(),
    metric_types: extractMetricTypes()
  }

  return cachedRuleset
}

/**
 * Get rules for a specific domain
 */
export function getDomainRules(domain: string): DomainRulesFlat | null {
  const ruleset = getUnifiedRuleset()
  return ruleset.domain_rules[domain] || null
}

/**
 * Get all skills for a domain organized by category
 */
export function getDomainSkills(domain: string): {
  core: DomainSkill[]
  frontend: DomainSkill[]
  backend: DomainSkill[]
  modern: DomainSkill[]
} | null {
  const domainRules = getDomainRules(domain)
  if (!domainRules) return null

  return {
    core: domainRules.coreSkills,
    frontend: domainRules.frontendSkills,
    backend: domainRules.backendSkills,
    modern: domainRules.modernSkills
  }
}

/**
 * Get experience level expectations
 */
export function getExperienceLevelExpectations(
  domain: string,
  level: 'entryLevel' | 'midLevel' | 'senior'
): ExperienceLevelExpectations | null {
  const domainRules = getDomainRules(domain)
  if (!domainRules) return null

  return domainRules.experienceLevels[level]
}

/**
 * Get role variant information
 */
export function getRoleVariantInfo(
  domain: string,
  variant: 'frontend' | 'backend' | 'fullStack'
): RoleVariant | null {
  const domainRules = getDomainRules(domain)
  if (!domainRules) return null

  return domainRules.roleVariants[variant]
}

/**
 * Get high-value keywords for ATS optimization
 */
export function getHighValueKeywords(domain: string): Array<{
  keyword: string
  priority: string
  variations: string[]
  context: string
}> {
  const domainRules = getDomainRules(domain)
  if (!domainRules) return []

  return domainRules.highValueKeywords
}

/**
 * Get domain-specific red flags
 */
export function getDomainRedFlags(domain: string): Array<{
  flag: string
  severity: string
  reason: string
  solution: string
}> {
  const domainRules = getDomainRules(domain)
  if (!domainRules) return []

  return domainRules.redFlags
}

/**
 * Get trending skills for 2025-2026
 */
export function getTrendingSkills(domain: string): {
  emerging: Array<{ skill: string; trend: string; rationale: string; implementation: string }>
  declining: Array<{ skill: string; status: string; rationale: string; recommendation: string }>
} {
  const domainRules = getDomainRules(domain)
  if (!domainRules) {
    return { emerging: [], declining: [] }
  }

  return {
    emerging: domainRules.trendingSkills,
    declining: domainRules.decliningSkills
  }
}

/**
 * Get strong action verbs by category
 */
export function getActionVerbs(): UnifiedRuleset['action_verbs'] {
  return getUnifiedRuleset().action_verbs
}

/**
 * Get metric examples by type
 */
export function getMetricExamples(): UnifiedRuleset['metric_types'] {
  return getUnifiedRuleset().metric_types
}

/**
 * Clear the cached ruleset (useful for testing or hot-reloading)
 */
export function clearRulesetCache(): void {
  cachedRuleset = null
}

/**
 * Get all available domains
 */
export function getAvailableDomains(): string[] {
  return Object.keys(getUnifiedRuleset().domain_rules)
}

/**
 * Check if rules are loaded correctly
 */
export function validateRulesLoaded(): {
  valid: boolean
  errors: string[]
  stats: {
    atsRulesCount: number
    hrRulesCount: number
    redFlagsCount: number
    domainCount: number
  }
} {
  const errors: string[] = []
  const ruleset = getUnifiedRuleset()

  if (ruleset.ats_rules.length === 0) {
    errors.push('No ATS rules loaded')
  }
  if (ruleset.hr_rules.length === 0) {
    errors.push('No HR rules loaded')
  }
  if (ruleset.recruiter_red_flags.length === 0) {
    errors.push('No red flag rules loaded')
  }
  if (Object.keys(ruleset.domain_rules).length === 0) {
    errors.push('No domain rules loaded')
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      atsRulesCount: ruleset.ats_rules.length,
      hrRulesCount: ruleset.hr_rules.length,
      redFlagsCount: ruleset.recruiter_red_flags.length,
      domainCount: Object.keys(ruleset.domain_rules).length
    }
  }
}
