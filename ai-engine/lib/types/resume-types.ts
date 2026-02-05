// Shared Resume types for AI Engine
// These mirror the types from frontend for decoupling

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
}
