export interface PersonalInfo {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
    summary: string
}

export interface Experience {
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
}

export interface Education {
    id: string
    institution: string
    degree: string
    field: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
    achievements?: string[]
}

export interface Skill {
    id: string
    category: string
    skills: string[]
}

export interface Project {
    id: string
    name: string
    description: string
    technologies: string[]
    link?: string
    startDate: string
    endDate: string
    highlights: string[]
}

export interface Publication {
    id: string
    title: string
    authors: string[]
    venue: string
    date: string
    link?: string
    description: string
}

export interface Achievement {
    id: string
    title: string
    date: string
    description: string
    issuer?: string
}

export interface Certification {
    id: string
    name: string
    issuer: string
    date: string
    expiryDate?: string
    credentialId?: string
    link?: string
}

export interface Language {
    id: string
    language: string
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic'
}

export interface VolunteerWork {
    id: string
    organization: string
    role: string
    startDate: string
    endDate: string
    current: boolean
    description: string
}

// Job Context for role-specific AI suggestions
export interface JobContext {
    domain: 'frontend' | 'backend' | 'fullstack' | 'devops' | 'other'
    position: string
    jobDescription: string
    requiredSkills: string[]
    preferredSkills: string[]
}

// Rule-based evaluation result
export interface RuleEvaluation {
    ruleId: string
    passed: boolean
    description: string
    suggestion?: string
    weight: number
    category: string
}

// Overall resume score
export interface ResumeScore {
    ats: number
    hr: number
    jd: number
    final: number
    verdict: 'pass' | 'borderline' | 'fail'
    evaluations: RuleEvaluation[]
    topFixes: string[]
}

export interface Resume {
    id: string
    name: string
    template: string
    createdAt: string
    updatedAt: string
    personalInfo: PersonalInfo
    experiences: Experience[]
    education: Education[]
    skills: Skill[]
    projects: Project[]
    publications: Publication[]
    achievements: Achievement[]
    certifications: Certification[]
    languages: Language[]
    volunteerWork: VolunteerWork[]
    jobContext?: JobContext
}

export type ResumeSection =
    | 'personal'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'publications'
    | 'achievements'
    | 'certifications'
    | 'languages'
    | 'volunteer'

export interface AISuggestion {
    field: string
    original: string
    suggestion: string
    reason: string
    keywords?: string[]
}

export interface AIReframe {
    original: string
    reframed: string
    improvements: string[]
}
