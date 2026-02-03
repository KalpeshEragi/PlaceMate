// Ontology utilities for role detection and skill analysis
import { Resume, JobContext } from '@/lib/types/resume-types'

// Embedded ontology data (from ai-engine/ontology.json)
const ontologyData = {
    roles: {
        frontend: {
            keywords: ["frontend", "front-end", "ui", "ux", "web developer", "react developer", "angular developer", "vue developer"],
            primary_skills: ["React", "Vue", "Angular", "HTML", "CSS", "JavaScript", "TypeScript"],
            concepts: ["Responsive Design", "Accessibility", "Cross-Browser Compatibility", "State Management", "Component Architecture"]
        },
        backend: {
            keywords: ["backend", "back-end", "api", "server", "backend developer", "node developer", "python developer"],
            primary_skills: ["Node.js", "Python", "Java", "PHP", "Go", "C#", ".NET", "Ruby"],
            concepts: ["REST", "GraphQL", "Authentication", "Security", "Database Design", "Microservices"]
        },
        fullstack: {
            keywords: ["full stack", "full-stack", "fullstack", "full stack developer"],
            primary_skills: ["React", "Node.js", "MongoDB", "PostgreSQL", "Express", "Next.js"],
            concepts: ["End-to-End", "System Design", "Deployment", "CI/CD", "DevOps Basics"]
        },
        devops: {
            keywords: ["devops", "sre", "infrastructure", "platform engineer", "cloud engineer"],
            primary_skills: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Jenkins"],
            concepts: ["CI/CD", "Infrastructure as Code", "Monitoring", "Containerization", "Cloud Architecture"]
        }
    },
    skill_taxonomy: {
        core_languages: ["JavaScript", "HTML", "CSS", "Python", "Java", "C#", "SQL", "TypeScript", "Go", "Ruby", "PHP"],
        frontend: ["React", "Angular", "Vue", "Redux", "Tailwind", "Bootstrap", "Webpack", "Vite", "Next.js", "Svelte", "jQuery"],
        backend: ["Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "FastAPI", "NestJS", "Rails"],
        databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQL Server", "Firebase", "Supabase", "DynamoDB"],
        devops: ["Git", "Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "GCP", "GitHub Actions", "CircleCI", "Terraform"],
        emerging_ai: ["LLM", "LangChain", "RAG", "Vector Databases", "OpenAI API", "Hugging Face", "TensorFlow", "PyTorch"],
        security: ["OWASP", "JWT", "OAuth", "Encryption", "SSL/TLS", "CORS", "XSS Prevention", "SQL Injection Prevention"],
        testing: ["Jest", "Mocha", "Cypress", "Selenium", "Playwright", "Pytest", "JUnit", "React Testing Library"]
    },
    stack_clusters: {
        MERN: ["MongoDB", "Express", "React", "Node.js"],
        MEAN: ["MongoDB", "Express", "Angular", "Node.js"],
        LAMP: ["Linux", "Apache", "MySQL", "PHP"],
        Microsoft: ["C#", ".NET", "Azure", "SQL Server"],
        ModernFrontend: ["React", "TypeScript", "Next.js", "Tailwind"],
        PythonStack: ["Python", "Django", "PostgreSQL", "Redis"],
        JAMStack: ["JavaScript", "API", "Markup", "Next.js", "Gatsby", "Netlify"],
        ServerlessAWS: ["AWS Lambda", "DynamoDB", "API Gateway", "S3"]
    },
    seniority_signals: {
        junior: {
            verbs: ["assisted", "learned", "implemented", "fixed", "updated", "helped", "supported", "participated"],
            concepts: ["learning", "mentorship", "entry-level", "training", "internship", "exposure"]
        },
        mid: {
            verbs: ["developed", "built", "designed", "improved", "maintained", "collaborated", "contributed"],
            concepts: ["ownership", "feature development", "bug fixing", "code review", "documentation"]
        },
        senior: {
            verbs: ["architected", "led", "spearheaded", "optimized", "mentored", "established", "drove", "transformed"],
            concepts: ["scalability", "strategy", "leadership", "technical direction", "system design", "cross-functional"]
        }
    },
    soft_skill_proxies: {
        collaboration: ["collaborated", "partnered", "coordinated", "facilitated", "worked with", "cross-functional"],
        communication: ["presented", "documented", "explained", "communicated", "stakeholder", "demo"],
        problem_solving: ["debugged", "diagnosed", "resolved", "troubleshot", "investigated", "identified"],
        leadership: ["led", "mentored", "guided", "coached", "managed", "supervised"]
    },
    action_verb_strength: {
        weak: ["worked on", "was responsible for", "helped with", "involved in", "participated in"],
        moderate: ["developed", "built", "created", "designed", "implemented", "maintained"],
        strong: ["architected", "spearheaded", "transformed", "pioneered", "revolutionized", "optimized", "accelerated"]
    },
    metrics_patterns: [
        "\\d+%",
        "\\d+x",
        "\\$\\d+",
        "\\d+ users",
        "\\d+ team",
        "\\d+ projects",
        "reduced.*\\d+",
        "increased.*\\d+",
        "improved.*\\d+",
        "saved.*\\d+"
    ]
}

export interface Ontology {
    roles: Record<string, {
        keywords: string[]
        primary_skills: string[]
        concepts: string[]
    }>
    skill_taxonomy: Record<string, string[]>
    stack_clusters: Record<string, string[]>
    seniority_signals: Record<string, {
        verbs: string[]
        concepts: string[]
    }>
    soft_skill_proxies: Record<string, string[]>
    action_verb_strength: Record<string, string[]>
    metrics_patterns: string[]
}

const ontology: Ontology = ontologyData as Ontology

/**
 * Detect role type from job title or description
 */
export function detectRoleFromTitle(title: string): JobContext['domain'] {
    const lowerTitle = title.toLowerCase()

    for (const [role, data] of Object.entries(ontology.roles)) {
        for (const keyword of data.keywords) {
            if (lowerTitle.includes(keyword.toLowerCase())) {
                return role as JobContext['domain']
            }
        }
    }

    return 'other'
}

/**
 * Get relevant skills for a role from ontology
 */
export function getRelevantSkills(role: JobContext['domain']): string[] {
    const roleData = ontology.roles[role]
    if (!roleData) return []

    return [
        ...roleData.primary_skills,
        ...(ontology.skill_taxonomy.core_languages || []).slice(0, 5)
    ]
}

/**
 * Detect seniority level from text content
 */
export function detectSeniority(text: string): 'junior' | 'mid' | 'senior' {
    const lowerText = text.toLowerCase()
    let seniorScore = 0
    let juniorScore = 0

    // Check for senior verbs/concepts
    const seniorData = ontology.seniority_signals.senior
    for (const verb of seniorData.verbs) {
        if (lowerText.includes(verb.toLowerCase())) seniorScore++
    }
    for (const concept of seniorData.concepts) {
        if (lowerText.includes(concept.toLowerCase())) seniorScore++
    }

    // Check for junior verbs/concepts
    const juniorData = ontology.seniority_signals.junior
    for (const verb of juniorData.verbs) {
        if (lowerText.includes(verb.toLowerCase())) juniorScore++
    }
    for (const concept of juniorData.concepts) {
        if (lowerText.includes(concept.toLowerCase())) juniorScore++
    }

    if (seniorScore >= 3) return 'senior'
    if (juniorScore >= 3) return 'junior'
    return 'mid'
}

/**
 * Find matching tech stack cluster
 */
export function findStackCluster(skills: string[]): string | null {
    const lowerSkills = skills.map(s => s.toLowerCase())

    for (const [stackName, stackSkills] of Object.entries(ontology.stack_clusters)) {
        const matchCount = stackSkills.filter(s =>
            lowerSkills.some(skill => skill.includes(s.toLowerCase()) || s.toLowerCase().includes(skill))
        ).length

        // If more than half of stack skills match, it's a match
        if (matchCount >= Math.ceil(stackSkills.length / 2)) {
            return stackName
        }
    }

    return null
}

/**
 * Extract all skills from resume
 */
export function extractAllSkills(resume: Resume): string[] {
    const allSkills: string[] = []

    // From skills section
    for (const skillGroup of resume.skills) {
        allSkills.push(...skillGroup.skills)
    }

    // From projects
    for (const project of resume.projects) {
        allSkills.push(...project.technologies)
    }

    return [...new Set(allSkills)]
}

/**
 * Check if user has GitHub or portfolio
 */
export function hasGitHubOrPortfolio(resume: Resume): boolean {
    const { github, portfolio, linkedin } = resume.personalInfo
    return !!(github || portfolio || linkedin)
}

/**
 * Count metrics in text (numbers, percentages, etc.)
 */
export function countMetrics(text: string): number {
    let count = 0
    for (const pattern of ontology.metrics_patterns) {
        const regex = new RegExp(pattern, 'gi')
        const matches = text.match(regex)
        if (matches) count += matches.length
    }
    return count
}

/**
 * Analyze action verb strength
 */
export function analyzeVerbStrength(text: string): {
    weak: number
    moderate: number
    strong: number
    ratio: number
} {
    const lowerText = text.toLowerCase()
    let weak = 0, moderate = 0, strong = 0

    for (const pattern of ontology.action_verb_strength.weak) {
        if (lowerText.includes(pattern.toLowerCase())) weak++
    }
    for (const pattern of ontology.action_verb_strength.moderate) {
        if (lowerText.includes(pattern.toLowerCase())) moderate++
    }
    for (const pattern of ontology.action_verb_strength.strong) {
        if (lowerText.includes(pattern.toLowerCase())) strong++
    }

    const total = weak + moderate + strong
    const ratio = total > 0 ? strong / total : 0

    return { weak, moderate, strong, ratio }
}

/**
 * Get role-specific skills that are missing from resume
 */
export function getMissingRoleSkills(resume: Resume, role: JobContext['domain']): string[] {
    const userSkills = extractAllSkills(resume).map(s => s.toLowerCase())
    const roleSkills = getRelevantSkills(role)

    return roleSkills.filter(skill =>
        !userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
    )
}

/**
 * Get the ontology data
 */
export function getOntology(): Ontology {
    return ontology
}
