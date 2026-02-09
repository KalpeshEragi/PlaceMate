// Ruleset utilities for applying ATS, HR, and JD matching rules
// Updated to use the unified rules loader from ai-engine
import { Resume, JobContext, RuleEvaluation } from '@/lib/types/resume-types'
import {
    extractAllSkills,
    hasGitHubOrPortfolio,
    countMetrics,
    analyzeVerbStrength,
    findStackCluster
} from './ontology'

// Import unified rules from ai-engine
// Note: These are dynamically loaded from the comprehensive JSON rule files
import {
    getUnifiedRuleset,
    getDomainRules,
    getDomainRedFlags,
    getActionVerbs,
    getMetricExamples,
    getTrendingSkills,
    type UnifiedRuleset,
    type FlatATSRule,
    type FlatHRRule,
    type RedFlagRule,
    type JDMatchRule
} from './unified-rules-bridge'

// Re-export types for use by other modules
export type { FlatATSRule as ATSRule, FlatHRRule as HRRule, RedFlagRule, JDMatchRule }

// Cache for the ruleset
let cachedRuleset: UnifiedRuleset | null = null

/**
 * Get the unified ruleset (with caching)
 */
function getRuleset(): UnifiedRuleset {
    if (!cachedRuleset) {
        cachedRuleset = getUnifiedRuleset()
    }
    return cachedRuleset
}

/**
 * Get all text content from resume for analysis
 */
function getResumeText(resume: Resume): string {
    const parts: string[] = []

    parts.push(resume.personalInfo.summary)
    for (const exp of resume.experiences) {
        parts.push(exp.description)
        parts.push(exp.achievements.join(' '))
    }
    for (const proj of resume.projects) {
        parts.push(proj.description)
        parts.push(proj.highlights.join(' '))
    }

    return parts.join(' ')
}

/**
 * Evaluate ATS rules
 */
export function evaluateATSRules(resume: Resume): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const skills = extractAllSkills(resume)
    const ruleset = getRuleset()

    for (const rule of ruleset.ats_rules) {
        let passed = true
        let suggestion = rule.suggestion

        switch (rule.id) {
            case 'ATS_01': // Core sections
                const hasContact = !!(resume.personalInfo.email && resume.personalInfo.phone)
                const hasSkills = skills.length > 0
                const hasExperience = resume.experiences.length > 0 || resume.projects.length > 0
                const hasEducation = resume.education.length > 0
                passed = hasContact && hasSkills && hasExperience && hasEducation
                break

            case 'ATS_02': // Email format
                if (rule.regex) {
                    const emailRegex = new RegExp(rule.regex)
                    passed = emailRegex.test(resume.personalInfo.email || '')
                }
                break

            case 'ATS_03': // Contact complete
                passed = !!(
                    resume.personalInfo.email &&
                    resume.personalInfo.phone &&
                    resume.personalInfo.location
                )
                break

            case 'ATS_05': // Skills count
                const skillCount = skills.length
                passed = skillCount >= (rule.min_skills || 0) && skillCount <= (rule.max_skills || 100)
                if (!passed) {
                    suggestion = skillCount < (rule.min_skills || 0)
                        ? `Add more relevant skills (currently ${skillCount}, recommended 5-25)`
                        : `Consider reducing skills list (currently ${skillCount}, recommended max 25)`
                }
                break

            // Handle comprehensive ATS rules from the new rule files
            default:
                if (rule.id.startsWith('ATS-KW')) {
                    // Keyword matching rules
                    passed = checkKeywordRule(resume, rule)
                } else if (rule.id.startsWith('ATS-FMT')) {
                    // Format compliance rules - generally pass if basic structure is correct
                    passed = true
                } else if (rule.id.startsWith('ATS-CNT')) {
                    // Content structure rules
                    passed = checkContentStructureRule(resume, rule)
                } else if (rule.id.startsWith('ATS-OPT')) {
                    // Optimization rules
                    passed = true // These are advisory
                } else {
                    passed = true
                }
        }

        evaluations.push({
            ruleId: rule.id,
            passed,
            description: rule.description,
            suggestion: passed ? undefined : suggestion,
            weight: rule.weight,
            category: rule.category
        })
    }

    return evaluations
}

/**
 * Check keyword-related ATS rules
 */
function checkKeywordRule(resume: Resume, rule: FlatATSRule): boolean {
    const text = getResumeText(resume).toLowerCase()
    const skills = extractAllSkills(resume)

    // Check if resume has reasonable keyword density
    if (rule.id === 'ATS-KW-001') {
        // Require at least some skills to match
        return skills.length >= 5
    }
    if (rule.id === 'ATS-KW-002') {
        // Check for job title in summary
        const summary = resume.personalInfo.summary?.toLowerCase() || ''
        const hasRoleKeywords = ['developer', 'engineer', 'designer', 'architect', 'lead', 'manager']
            .some(kw => summary.includes(kw))
        return hasRoleKeywords
    }
    if (rule.id === 'ATS-KW-003') {
        // Check for spelled-out technical terms
        return true // Advisory rule
    }
    if (rule.id === 'ATS-KW-004') {
        // Tailoring check - assume user is tailoring
        return skills.length > 0
    }

    return true
}

/**
 * Check content structure ATS rules
 */
function checkContentStructureRule(resume: Resume, rule: FlatATSRule): boolean {
    if (rule.id === 'ATS-CNT-001') {
        // Dedicated skills section
        return extractAllSkills(resume).length >= 5
    }
    if (rule.id === 'ATS-CNT-002') {
        // Contact in main body
        return !!(resume.personalInfo.email && resume.personalInfo.phone)
    }
    if (rule.id === 'ATS-CNT-003') {
        // Resume length - hard to check without word count
        return true
    }
    if (rule.id === 'ATS-CNT-004') {
        // Professional summary with keywords
        const summary = resume.personalInfo.summary || ''
        const wordCount = summary.trim().split(/\s+/).filter(Boolean).length
        return wordCount >= 20 && wordCount <= 100
    }

    return true
}

/**
 * Evaluate HR rules
 */
export function evaluateHRRules(resume: Resume): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const text = getResumeText(resume)
    const metricsCount = countMetrics(text)
    const verbAnalysis = analyzeVerbStrength(text)
    const ruleset = getRuleset()

    for (const rule of ruleset.hr_rules) {
        let passed = true
        let suggestion = rule.suggestion

        switch (rule.id) {
            case 'HR_01': // Quantified impact
                // Consider passed if we have at least 2 metrics
                passed = metricsCount >= 2
                if (!passed) {
                    suggestion = `Add quantified achievements (e.g., "Improved performance by 40%"). Currently found: ${metricsCount} metrics`
                }
                break

            case 'HR_02': // Action verbs
                passed = verbAnalysis.ratio >= 0.2 || verbAnalysis.strong >= 2
                if (!passed) {
                    suggestion = `Use stronger action verbs. Found ${verbAnalysis.strong} strong verbs vs ${verbAnalysis.weak} weak ones`
                }
                break

            case 'HR_03': // GitHub/Portfolio
                passed = hasGitHubOrPortfolio(resume)
                break

            case 'HR_04': // Skills credibility
                // Check if skills appear in experience/projects
                const skills = extractAllSkills(resume)
                const textLower = text.toLowerCase()
                const mentionedSkills = skills.filter(s => textLower.includes(s.toLowerCase()))
                passed = mentionedSkills.length >= skills.length * 0.3
                break

            case 'HR_06': // Professional summary
                const summaryWords = (resume.personalInfo.summary || '').trim().split(/\s+/).filter(Boolean)
                passed = summaryWords.length >= (rule.min_words || 0) && summaryWords.length <= (rule.max_words || 200)
                if (!passed) {
                    suggestion = summaryWords.length < (rule.min_words || 0)
                        ? `Add a professional summary (20-100 words). Currently: ${summaryWords.length} words`
                        : `Shorten your summary (max 100 words). Currently: ${summaryWords.length} words`
                }
                break

            // Handle comprehensive HR rules from the new rule files
            default:
                if (rule.id.startsWith('HR-IMP')) {
                    // Impact quantification rules
                    passed = metricsCount >= 2
                } else if (rule.id.startsWith('HR-PORT')) {
                    // Portfolio presence rules
                    passed = hasGitHubOrPortfolio(resume)
                } else if (rule.id.startsWith('HR-PROF')) {
                    // Professionalism rules
                    passed = checkProfessionalismRule(resume, rule)
                } else if (rule.id.startsWith('HR-EXP')) {
                    // Experience presentation rules
                    passed = checkExperienceRule(resume, rule)
                } else if (rule.id.startsWith('HR-SOFT')) {
                    // Soft skills rules
                    passed = checkSoftSkillsRule(resume, text)
                } else {
                    passed = true
                }
        }

        evaluations.push({
            ruleId: rule.id,
            passed,
            description: rule.description,
            suggestion: passed ? undefined : suggestion,
            weight: rule.weight,
            category: rule.category
        })
    }

    return evaluations
}

/**
 * Check professionalism rules
 */
function checkProfessionalismRule(resume: Resume, rule: FlatHRRule): boolean {
    if (rule.id === 'HR-PROF-001') {
        // LinkedIn profile
        const links = resume.personalInfo.links || []
        return links.some(link => link.toLowerCase().includes('linkedin'))
    }
    if (rule.id === 'HR-PROF-002') {
        // Professional email
        const email = resume.personalInfo.email?.toLowerCase() || ''
        const unprofessionalPatterns = ['dragon', 'coolboy', 'ninja', 'gamer', '420', '69', 'xxx']
        return !unprofessionalPatterns.some(p => email.includes(p))
    }
    if (rule.id === 'HR-PROF-003') {
        // Error-free writing - can't check automatically
        return true
    }
    return true
}

/**
 * Check experience presentation rules
 */
function checkExperienceRule(resume: Resume, rule: FlatHRRule): boolean {
    if (rule.id === 'HR-EXP-001') {
        // 3-5 bullets per role
        return resume.experiences.length > 0
    }
    if (rule.id === 'HR-EXP-002') {
        // Reverse chronological - assume correct
        return true
    }
    if (rule.id === 'HR-EXP-003') {
        // Relevant experience prioritization
        return resume.experiences.length > 0 || resume.projects.length > 0
    }
    if (rule.id === 'HR-EXP-004') {
        // Company context - advisory
        return true
    }
    return true
}

/**
 * Check soft skills rules
 */
function checkSoftSkillsRule(resume: Resume, text: string): boolean {
    const textLower = text.toLowerCase()
    const collaborationKeywords = ['collaborated', 'partnered', 'coordinated', 'team', 'cross-functional']
    return collaborationKeywords.some(kw => textLower.includes(kw))
}

/**
 * Evaluate recruiter red flags
 */
export function evaluateRedFlags(resume: Resume): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const text = getResumeText(resume)
    const email = resume.personalInfo.email?.toLowerCase() || ''
    const skills = extractAllSkills(resume)
    const verbAnalysis = analyzeVerbStrength(text)
    const ruleset = getRuleset()

    for (const rule of ruleset.recruiter_red_flags) {
        let passed = true // passed means NO red flag detected
        let suggestion = rule.suggestion

        switch (rule.id) {
            case 'RF_01': // Unprofessional email
                if (rule.patterns) {
                    passed = !rule.patterns.some(p => email.includes(p.toLowerCase()))
                }
                break

            case 'RF_02': // Buzzword stuffing
                passed = skills.length <= 30
                if (!passed) {
                    suggestion = `Too many skills listed (${skills.length}). Focus on your top 15-20 most relevant skills`
                }
                break

            case 'RF_03': // No measureable achievements
                const metricsCount = countMetrics(text)
                passed = metricsCount >= 2
                break

            case 'RF_04': // First person pronouns
                const pronounMatches = text.match(/\b(I |I'm|my |me )/gi) || []
                passed = pronounMatches.length <= (rule.max_occurrences || 3)
                if (!passed) {
                    suggestion = `Found ${pronounMatches.length} first-person pronouns. Remove them for professional tone`
                }
                break

            case 'RF_05': // Generic duties
                passed = verbAnalysis.weak / (verbAnalysis.weak + verbAnalysis.moderate + verbAnalysis.strong + 1) < 0.5
                break

            // Handle comprehensive red flags from HR rules
            default:
                if (rule.id.startsWith('HR-RED')) {
                    passed = checkHRRedFlag(resume, rule, text)
                } else {
                    passed = true
                }
        }

        evaluations.push({
            ruleId: rule.id,
            passed,
            description: rule.description,
            suggestion: passed ? undefined : suggestion,
            weight: Math.abs(rule.penalty),
            category: 'red_flag'
        })
    }

    return evaluations
}

/**
 * Check HR-specific red flags from comprehensive rules
 */
function checkHRRedFlag(resume: Resume, rule: RedFlagRule, text: string): boolean {
    const textLower = text.toLowerCase()

    switch (rule.id) {
        case 'HR-RED-001': // Objective statement
            return !textLower.includes('objective:') && !textLower.includes('career objective')
        case 'HR-RED-002': // Buzzword heavy
            const genericBuzzwords = ['hard worker', 'team player', 'detail-oriented', 'self-starter']
            const buzzwordCount = genericBuzzwords.filter(b => textLower.includes(b)).length
            return buzzwordCount < 2
        case 'HR-RED-003': // Irrelevant personal info
            return true // Can't check automatically
        case 'HR-RED-004': // Duties vs achievements
            const metricsCount = countMetrics(text)
            return metricsCount >= 2
        case 'HR-RED-005': // Inconsistent formatting
            return true // Can't check automatically
        case 'HR-RED-006': // Outdated skills
            const outdatedSkills = ['jquery', 'angularjs', 'flash', 'silverlight', 'bower']
            const hasOutdated = extractAllSkills(resume).some(s =>
                outdatedSkills.includes(s.toLowerCase())
            )
            return !hasOutdated
        case 'HR-RED-007': // Job hopping
            return true // Would need dates analysis
        case 'HR-RED-008': // Lack of progression
            return true // Would need career history analysis
        case 'HR-RED-009': // Pronouns
            const pronouns = text.match(/\b(I |I'm|my |me )/gi) || []
            return pronouns.length <= 3
        case 'HR-RED-010': // Skills without experience
            const skills = extractAllSkills(resume)
            const mentionedInExp = skills.filter(s => textLower.includes(s.toLowerCase()))
            return mentionedInExp.length >= skills.length * 0.3
        default:
            return true
    }
}

/**
 * Evaluate JD matching rules
 */
export function evaluateJDMatch(resume: Resume, jobContext?: JobContext): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const ruleset = getRuleset()

    if (!jobContext) {
        // Return empty evaluations if no job context provided
        return evaluations
    }

    const userSkills = extractAllSkills(resume).map(s => s.toLowerCase())
    const requiredSkills = jobContext.requiredSkills.map(s => s.toLowerCase())
    const preferredSkills = jobContext.preferredSkills.map(s => s.toLowerCase())

    for (const rule of ruleset.jd_matching_rules) {
        let passed = true
        let suggestion = rule.suggestion

        switch (rule.id) {
            case 'JD_01': // Required skills overlap
                const requiredMatches = requiredSkills.filter(rs =>
                    userSkills.some(us => us.includes(rs) || rs.includes(us))
                )
                const requiredRatio = requiredSkills.length > 0
                    ? requiredMatches.length / requiredSkills.length
                    : 1
                passed = requiredRatio >= 0.6
                if (!passed) {
                    const missing = requiredSkills.filter(rs =>
                        !userSkills.some(us => us.includes(rs) || rs.includes(us))
                    )
                    suggestion = `Missing required skills: ${missing.slice(0, 5).join(', ')}`
                }
                break

            case 'JD_02': // Preferred skills
                const preferredMatches = preferredSkills.filter(ps =>
                    userSkills.some(us => us.includes(ps) || ps.includes(us))
                )
                const preferredRatio = preferredSkills.length > 0
                    ? preferredMatches.length / preferredSkills.length
                    : 0.5
                passed = preferredRatio >= 0.3
                if (!passed) {
                    const missing = preferredSkills.filter(ps =>
                        !userSkills.some(us => us.includes(ps) || ps.includes(us))
                    )
                    suggestion = `Consider adding preferred skills: ${missing.slice(0, 3).join(', ')}`
                }
                break

            case 'JD_03': // Stack cluster match
                const stackCluster = findStackCluster(userSkills)
                passed = stackCluster !== null
                if (!passed) {
                    suggestion = 'Consider grouping your skills around a known tech stack (MERN, MEAN, etc.)'
                }
                break

            case 'JD_05': // Role type alignment
                passed = jobContext.domain !== 'other'
                break

            default:
                passed = true
        }

        evaluations.push({
            ruleId: rule.id,
            passed,
            description: rule.description,
            suggestion: passed ? undefined : suggestion,
            weight: rule.weight,
            category: 'jd_match'
        })
    }

    return evaluations
}

/**
 * Get role-specific tips from ruleset
 */
export function getRoleSpecificTips(role: JobContext['domain']): string[] {
    const ruleset = getRuleset()
    return ruleset.role_specific_tips[role] || []
}

/**
 * Get scoring weights
 */
export function getScoringWeights() {
    return getRuleset().scoring_formula.weights
}

/**
 * Get verdict thresholds
 */
export function getVerdictThresholds() {
    return getRuleset().scoring_formula.verdict_thresholds
}

/**
 * Get action verbs by category (new feature from comprehensive rules)
 */
export function getActionVerbsByCategory(): Record<string, string[]> {
    return getActionVerbs()
}

/**
 * Get metric examples by type (new feature from comprehensive rules)
 */
export function getMetricExamplesByType(): Array<{ type: string; examples: string[]; priority: string }> {
    return getMetricExamples()
}

/**
 * Get domain-specific red flags (new feature from comprehensive rules)
 */
export function getDomainSpecificRedFlags(domain: string): Array<{
    flag: string
    severity: string
    reason: string
    solution: string
}> {
    return getDomainRedFlags(domain)
}

/**
 * Get trending and declining skills for a domain (new feature from comprehensive rules)
 */
export function getSkillTrends(domain: string): {
    emerging: Array<{ skill: string; trend: string; rationale: string; implementation: string }>
    declining: Array<{ skill: string; status: string; rationale: string; recommendation: string }>
} {
    return getTrendingSkills(domain)
}

/**
 * Check if a skill is trending up or down
 */
export function getSkillTrendStatus(domain: string, skill: string): 'emerging' | 'declining' | 'stable' {
    const trends = getTrendingSkills(domain)
    const skillLower = skill.toLowerCase()

    const isEmerging = trends.emerging.some(t => t.skill.toLowerCase().includes(skillLower))
    if (isEmerging) return 'emerging'

    const isDeclining = trends.declining.some(t => t.skill.toLowerCase().includes(skillLower))
    if (isDeclining) return 'declining'

    return 'stable'
}
