// Main evaluation engine that combines ontology and ruleset
import { Resume, JobContext, ResumeScore, RuleEvaluation, AISuggestion, AIReframe } from '@/lib/types/resume-types'
import {
    detectRoleFromTitle,
    detectSeniority,
    extractAllSkills,
    getMissingRoleSkills,
    analyzeVerbStrength,
    countMetrics,
    findStackCluster,
    getOntology
} from './ontology'
import {
    evaluateATSRules,
    evaluateHRRules,
    evaluateRedFlags,
    evaluateJDMatch,
    getRoleSpecificTips,
    getScoringWeights,
    getVerdictThresholds
} from './ruleset'

/**
 * Calculate score from evaluations
 */
function calculateScore(evaluations: RuleEvaluation[]): number {
    const totalWeight = evaluations.reduce((sum, e) => sum + e.weight, 0)
    const passedWeight = evaluations.filter(e => e.passed).reduce((sum, e) => sum + e.weight, 0)
    return totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 100
}

/**
 * Evaluate entire resume and return comprehensive score
 */
export function evaluateResume(resume: Resume, jobContext?: JobContext): ResumeScore {
    // Get evaluations from all rule categories
    const atsEvals = evaluateATSRules(resume)
    const hrEvals = evaluateHRRules(resume)
    const redFlagEvals = evaluateRedFlags(resume)
    const jdEvals = evaluateJDMatch(resume, jobContext)

    // Calculate individual scores
    const atsScore = calculateScore(atsEvals)
    const hrScore = calculateScore(hrEvals)
    const jdScore = jdEvals.length > 0 ? calculateScore(jdEvals) : 70 // Default if no JD

    // Calculate red flag penalty
    const redFlagPenalty = redFlagEvals
        .filter(e => !e.passed)
        .reduce((sum, e) => sum + e.weight, 0)

    // Calculate final score with weights
    const weights = getScoringWeights()
    let finalScore = Math.round(
        atsScore * weights.ats +
        hrScore * weights.hr +
        jdScore * weights.jd
    ) - Math.min(redFlagPenalty, 20) // Cap red flag penalty at 20

    finalScore = Math.max(0, Math.min(100, finalScore))

    // Determine verdict
    const thresholds = getVerdictThresholds()
    let verdict: 'pass' | 'borderline' | 'fail'
    if (finalScore >= thresholds.pass) {
        verdict = 'pass'
    } else if (finalScore >= thresholds.borderline) {
        verdict = 'borderline'
    } else {
        verdict = 'fail'
    }

    // Combine all evaluations
    const allEvaluations = [...atsEvals, ...hrEvals, ...redFlagEvals, ...jdEvals]

    // Get top fixes (failed rules sorted by weight)
    const failedRules = allEvaluations
        .filter(e => !e.passed && e.suggestion)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)

    const topFixes = failedRules.map(r => r.suggestion as string)

    return {
        ats: atsScore,
        hr: hrScore,
        jd: jdScore,
        final: finalScore,
        verdict,
        evaluations: allEvaluations,
        topFixes
    }
}

/**
 * Generate AI suggestions based on rule evaluations
 */
export function generateSuggestions(
    resume: Resume,
    field: string,
    value: string,
    jobContext?: JobContext
): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    const role = jobContext?.domain || detectRoleFromTitle(jobContext?.position || '')

    // Get score to identify weak areas
    const score = evaluateResume(resume, jobContext)

    // Add suggestions for failed rules relevant to the current field
    for (const evaluation of score.evaluations) {
        if (!evaluation.passed && evaluation.suggestion) {
            // Match to relevant fields
            const isRelevant =
                (field === 'summary' && ['impact', 'language', 'structure'].includes(evaluation.category)) ||
                (field === 'description' && ['impact', 'language'].includes(evaluation.category)) ||
                (field === 'skills' && ['keywords'].includes(evaluation.category)) ||
                (field === 'email' && ['contact'].includes(evaluation.category))

            if (isRelevant) {
                suggestions.push({
                    field,
                    original: value,
                    suggestion: evaluation.suggestion,
                    reason: `Rule ${evaluation.ruleId}: ${evaluation.description}`,
                    keywords: getKeywordsForCategory(evaluation.category, role)
                })
            }
        }
    }

    // Add role-specific tips
    if (role && role !== 'other') {
        const tips = getRoleSpecificTips(role)
        if (tips.length > 0 && suggestions.length < 3) {
            suggestions.push({
                field,
                original: value,
                suggestion: tips[0],
                reason: `Tip for ${role} roles`,
                keywords: []
            })
        }
    }

    // Add general improvement suggestions
    if (value.length > 10) {
        const verbAnalysis = analyzeVerbStrength(value)
        if (verbAnalysis.weak > verbAnalysis.strong) {
            suggestions.push({
                field,
                original: value,
                suggestion: 'Replace weak phrases like "was responsible for" with action verbs like "led", "developed", "optimized"',
                reason: 'Strong action verbs increase impact',
                keywords: ['led', 'developed', 'optimized', 'architected', 'spearheaded']
            })
        }

        const metricsCount = countMetrics(value)
        if (metricsCount < 1 && (field === 'description' || field === 'summary')) {
            suggestions.push({
                field,
                original: value,
                suggestion: 'Add quantified achievements (e.g., "reduced load time by 40%", "managed team of 5")',
                reason: 'Metrics make achievements concrete and memorable',
                keywords: ['40%', '5 team members', '$100K', '10x improvement']
            })
        }
    }

    return suggestions.slice(0, 5)
}

/**
 * Generate AI reframe for text using rule-based improvements
 */
export function generateReframe(
    text: string,
    resume: Resume,
    jobContext?: JobContext
): AIReframe {
    const improvements: string[] = []
    let reframed = text

    // Remove first-person pronouns
    const pronounPattern = /\b(I |I'm |I've |my |me )/gi
    if (pronounPattern.test(reframed)) {
        reframed = reframed.replace(pronounPattern, '')
        improvements.push('Removed first-person pronouns')
    }

    // Replace weak verbs with strong ones
    const weakToStrong: Record<string, string> = {
        'was responsible for': 'Led',
        'helped with': 'Contributed to',
        'worked on': 'Developed',
        'involved in': 'Participated in delivering',
        'participated in': 'Contributed to'
    }

    for (const [weak, strong] of Object.entries(weakToStrong)) {
        if (reframed.toLowerCase().includes(weak)) {
            reframed = reframed.replace(new RegExp(weak, 'gi'), strong)
            improvements.push(`Replaced "${weak}" with "${strong}"`)
        }
    }

    // Add role-specific keywords if missing
    const role = jobContext?.domain || detectRoleFromTitle(jobContext?.position || '')
    if (role && role !== 'other') {
        const ontology = getOntology()
        const roleData = ontology.roles[role]
        if (roleData) {
            const lowerText = reframed.toLowerCase()
            const missingConcepts = roleData.concepts.filter(c => !lowerText.includes(c.toLowerCase()))
            if (missingConcepts.length > 0 && missingConcepts[0]) {
                improvements.push(`Consider mentioning: ${missingConcepts.slice(0, 2).join(', ')}`)
            }
        }
    }

    // If no metrics, suggest adding them
    if (countMetrics(reframed) === 0) {
        improvements.push('Add quantifiable metrics (percentages, numbers, dollar amounts)')
    }

    // Clean up any double spaces
    reframed = reframed.replace(/\s+/g, ' ').trim()

    // Ensure starts with capital letter
    if (reframed.length > 0) {
        reframed = reframed.charAt(0).toUpperCase() + reframed.slice(1)
    }

    return {
        original: text,
        reframed,
        improvements
    }
}

/**
 * Get contextual tips based on current resume state
 */
export function getContextualTips(resume: Resume, jobContext?: JobContext): string[] {
    const tips: string[] = []
    const score = evaluateResume(resume, jobContext)

    // Add tips based on score categories
    if (score.ats < 70) {
        tips.push('Focus on ATS compliance: ensure all sections are complete and use standard keywords')
    }
    if (score.hr < 70) {
        tips.push('Improve HR appeal: add quantified achievements and strong action verbs')
    }
    if (score.jd < 70 && jobContext) {
        tips.push('Tailor your resume: include more skills from the job description')
    }

    // Add role-specific tips
    const role = jobContext?.domain || 'other'
    if (role !== 'other') {
        tips.push(...getRoleSpecificTips(role).slice(0, 2))
    }

    return tips.slice(0, 5)
}

/**
 * Helper to get keywords for a category
 */
function getKeywordsForCategory(category: string, role: string): string[] {
    const ontology = getOntology()

    switch (category) {
        case 'keywords':
            return ontology.skill_taxonomy.core_languages.slice(0, 5)
        case 'impact':
            return ['40%', '2x faster', '$100K saved', '5 team members']
        case 'language':
            return ontology.action_verb_strength.strong.slice(0, 5)
        default:
            if (role && ontology.roles[role]) {
                return ontology.roles[role].primary_skills.slice(0, 5)
            }
            return []
    }
}

/**
 * Extract skills from job description text
 */
export function extractSkillsFromJD(jobDescription: string): { required: string[], preferred: string[] } {
    const ontology = getOntology()
    const jdLower = jobDescription.toLowerCase()
    const allSkills: string[] = []

    // Collect all known skills
    for (const category of Object.values(ontology.skill_taxonomy)) {
        allSkills.push(...category)
    }

    // Find skills mentioned in JD
    const foundSkills = allSkills.filter(skill =>
        jdLower.includes(skill.toLowerCase())
    )

    // Heuristic: skills mentioned before "preferred" or "nice to have" are required
    const preferredIndex = jdLower.indexOf('prefer') !== -1
        ? jdLower.indexOf('prefer')
        : jdLower.indexOf('nice to have') !== -1
            ? jdLower.indexOf('nice to have')
            : jdLower.length

    const required: string[] = []
    const preferred: string[] = []

    for (const skill of foundSkills) {
        const skillIndex = jdLower.indexOf(skill.toLowerCase())
        if (skillIndex < preferredIndex) {
            required.push(skill)
        } else {
            preferred.push(skill)
        }
    }

    return {
        required: [...new Set(required)],
        preferred: [...new Set(preferred)]
    }
}
