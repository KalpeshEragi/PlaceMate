// Ruleset utilities for applying ATS, HR, and JD matching rules
import { Resume, JobContext, RuleEvaluation } from '@/lib/types/resume-types'
import {
    extractAllSkills,
    hasGitHubOrPortfolio,
    countMetrics,
    analyzeVerbStrength,
    findStackCluster
} from './ontology'

// Embedded ruleset data (from ai-engine/ruleset.json)
const rulesetData = {
    ats_rules: [
        {
            id: "ATS_01",
            description: "Must contain core sections",
            check: ["contact", "skills", "experience_or_projects", "education"],
            weight: 10,
            category: "structure",
            suggestion: "Add missing sections: Contact info, Skills, Experience/Projects, and Education are essential for ATS systems"
        },
        {
            id: "ATS_02",
            description: "Professional email required",
            regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            weight: 8,
            category: "contact",
            suggestion: "Use a professional email format (firstname.lastname@domain.com)"
        },
        {
            id: "ATS_03",
            description: "Contact information complete",
            check: ["email", "phone", "location"],
            weight: 7,
            category: "contact",
            suggestion: "Include complete contact information: email, phone, and location"
        },
        {
            id: "ATS_05",
            description: "Skills section has relevant keywords",
            min_skills: 5,
            max_skills: 25,
            weight: 9,
            category: "keywords",
            suggestion: "Include 5-25 relevant technical skills that match the job description"
        }
    ],
    hr_rules: [
        {
            id: "HR_01",
            description: "Quantified impact required",
            check: "metrics_ratio >= 0.3",
            weight: 10,
            category: "impact",
            suggestion: "Add quantified achievements (e.g., 'Improved performance by 40%', 'Managed team of 5')"
        },
        {
            id: "HR_02",
            description: "Action verbs density",
            check: "strong_verb_ratio >= 0.2",
            weight: 8,
            category: "language",
            suggestion: "Start bullet points with strong action verbs (Led, Architected, Optimized, Transformed)"
        },
        {
            id: "HR_03",
            description: "Portfolio or GitHub required for web roles",
            check: "has_github_or_portfolio == true",
            weight: 9,
            category: "credibility",
            suggestion: "Add GitHub profile or portfolio website to showcase your work"
        },
        {
            id: "HR_04",
            description: "Skill credibility check",
            check: "skills_match_experience",
            weight: 7,
            category: "credibility",
            suggestion: "Ensure listed skills are demonstrated in your experience/projects"
        },
        {
            id: "HR_06",
            description: "Professional summary present",
            check: "has_summary",
            min_words: 20,
            max_words: 100,
            weight: 6,
            category: "structure",
            suggestion: "Add a professional summary (20-100 words) highlighting your key strengths"
        }
    ],
    recruiter_red_flags: [
        {
            id: "RF_01",
            description: "Unprofessional email",
            patterns: ["dragon", "coolboy", "ninja", "gamer", "420", "69", "xxx", "hot"],
            penalty: -10,
            suggestion: "Use a professional email address based on your name"
        },
        {
            id: "RF_02",
            description: "Buzzword stuffing",
            check: "skill_count > 30",
            penalty: -6,
            suggestion: "Reduce skills list to most relevant 15-20 skills to avoid appearing unfocused"
        },
        {
            id: "RF_03",
            description: "No measurable achievements",
            check: "metrics_count < 2",
            penalty: -8,
            suggestion: "Add at least 2-3 achievements with measurable impact"
        },
        {
            id: "RF_04",
            description: "First-person pronouns overuse",
            patterns: ["I ", "my ", "me "],
            max_occurrences: 3,
            penalty: -4,
            suggestion: "Remove first-person pronouns (I, my, me) for professional tone"
        },
        {
            id: "RF_05",
            description: "Generic job duties only",
            weak_verb_ratio: 0.5,
            penalty: -6,
            suggestion: "Replace generic duties with specific accomplishments and outcomes"
        }
    ],
    jd_matching_rules: [
        {
            id: "JD_01",
            description: "Required skills overlap",
            check: "required_skill_overlap >= 0.6",
            weight: 10,
            suggestion: "Your resume is missing key required skills"
        },
        {
            id: "JD_02",
            description: "Preferred skills boost",
            check: "preferred_skill_overlap >= 0.3",
            weight: 5,
            suggestion: "Consider adding preferred skills to strengthen your application"
        },
        {
            id: "JD_03",
            description: "Stack cluster match",
            check: "stack_cluster_match == true",
            weight: 7,
            suggestion: "Highlight experience with a recognized tech stack"
        },
        {
            id: "JD_05",
            description: "Role type alignment",
            check: "role_type_match == true",
            weight: 8,
            suggestion: "Tailor your experience descriptions to emphasize role-relevant skills"
        }
    ],
    scoring_formula: {
        weights: { ats: 0.4, hr: 0.3, jd: 0.3 },
        verdict_thresholds: { pass: 75, borderline: 55, fail: 0 }
    },
    role_specific_tips: {
        frontend: [
            "Highlight responsive design and cross-browser compatibility experience",
            "Showcase UI/UX improvements with metrics (load time, user engagement)",
            "Include accessibility (a11y) experience and WCAG compliance",
            "Mention state management libraries (Redux, MobX, Zustand)"
        ],
        backend: [
            "Emphasize API design and performance optimization",
            "Include database expertise and query optimization experience",
            "Highlight security implementation (authentication, authorization)",
            "Mention experience with message queues and caching"
        ],
        fullstack: [
            "Balance frontend and backend experience equally",
            "Show end-to-end project ownership",
            "Include deployment and DevOps experience",
            "Demonstrate understanding of system architecture"
        ],
        devops: [
            "Highlight CI/CD pipeline implementation",
            "Include infrastructure as code experience",
            "Show monitoring and observability expertise",
            "Emphasize cloud platform certifications"
        ]
    }
}

interface ATSRule {
    id: string
    description: string
    check?: string[]
    regex?: string
    max_pages?: Record<string, number>
    min_skills?: number
    max_skills?: number
    weight: number
    category: string
    suggestion: string
}

interface HRRule {
    id: string
    description: string
    check: string
    weight: number
    category: string
    suggestion: string
    min_words?: number
    max_words?: number
}

interface RedFlagRule {
    id: string
    description: string
    patterns?: string[]
    check?: string
    penalty: number
    suggestion: string
    max_occurrences?: number
    weak_verb_ratio?: number
}

interface JDRule {
    id: string
    description: string
    check: string
    weight: number
    suggestion: string
}

interface Ruleset {
    ats_rules: ATSRule[]
    hr_rules: HRRule[]
    recruiter_red_flags: RedFlagRule[]
    jd_matching_rules: JDRule[]
    scoring_formula: {
        weights: Record<string, number>
        verdict_thresholds: Record<string, number>
    }
    role_specific_tips: Record<string, string[]>
}

const ruleset: Ruleset = rulesetData as Ruleset

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

            default:
                passed = true
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
 * Evaluate HR rules
 */
export function evaluateHRRules(resume: Resume): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const text = getResumeText(resume)
    const metricsCount = countMetrics(text)
    const verbAnalysis = analyzeVerbStrength(text)

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

            default:
                passed = true
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
 * Evaluate recruiter red flags
 */
export function evaluateRedFlags(resume: Resume): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []
    const text = getResumeText(resume)
    const email = resume.personalInfo.email.toLowerCase()
    const skills = extractAllSkills(resume)
    const verbAnalysis = analyzeVerbStrength(text)

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

            default:
                passed = true
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
 * Evaluate JD matching rules
 */
export function evaluateJDMatch(resume: Resume, jobContext?: JobContext): RuleEvaluation[] {
    const evaluations: RuleEvaluation[] = []

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
    return ruleset.role_specific_tips[role] || []
}

/**
 * Get scoring weights
 */
export function getScoringWeights() {
    return ruleset.scoring_formula.weights
}

/**
 * Get verdict thresholds
 */
export function getVerdictThresholds() {
    return ruleset.scoring_formula.verdict_thresholds
}
