import { Resume, AISuggestion, AIReframe, JobContext } from '@/lib/types/resume-types'
import {
    evaluateResume,
    generateSuggestions,
    generateReframe,
    extractSkillsFromJD
} from '@/lib/ai-engine/evaluator'

// Mock API - Replace with actual backend calls
const STORAGE_KEY = 'placemate_resumes'

export const resumeApi = {
    // Get all resumes for a user
    async getAllResumes(): Promise<Resume[]> {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    },

    // Get single resume by ID
    async getResume(id: string): Promise<Resume | null> {
        const resumes = await this.getAllResumes()
        return resumes.find(r => r.id === id) || null
    },

    // Create new resume
    async createResume(resume: Partial<Resume>): Promise<Resume> {
        const resumes = await this.getAllResumes()
        const newResume: Resume = {
            id: Date.now().toString(),
            name: resume.name || 'Untitled Resume',
            template: resume.template || 'modern',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            personalInfo: resume.personalInfo || {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                summary: ''
            },
            experiences: resume.experiences || [],
            education: resume.education || [],
            skills: resume.skills || [],
            projects: resume.projects || [],
            publications: resume.publications || [],
            achievements: resume.achievements || [],
            certifications: resume.certifications || [],
            languages: resume.languages || [],
            volunteerWork: resume.volunteerWork || [],
            jobContext: resume.jobContext
        }
        resumes.push(newResume)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
        return newResume
    },

    // Update existing resume
    async updateResume(id: string, updates: Partial<Resume>): Promise<Resume> {
        const resumes = await this.getAllResumes()
        const index = resumes.findIndex(r => r.id === id)
        if (index === -1) throw new Error('Resume not found')

        resumes[index] = {
            ...resumes[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
        return resumes[index]
    },

    // Delete resume
    async deleteResume(id: string): Promise<void> {
        const resumes = await this.getAllResumes()
        const filtered = resumes.filter(r => r.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    // Duplicate resume
    async duplicateResume(id: string): Promise<Resume> {
        const original = await this.getResume(id)
        if (!original) throw new Error('Resume not found')

        return this.createResume({
            ...original,
            name: `${original.name} (Copy)`,
            id: undefined
        })
    },

    // Parse uploaded resume (mock - needs backend integration)
    async parseUploadedResume(file: File): Promise<Partial<Resume>> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock parsed data - In production, this would call backend AI service
        return {
            name: file.name.replace(/\.(pdf|docx)$/i, ''),
            personalInfo: {
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 234 567 8900',
                location: 'San Francisco, CA',
                summary: 'Experienced software engineer with 5+ years in full-stack development.'
            },
            experiences: [
                {
                    id: '1',
                    company: 'Tech Corp',
                    position: 'Senior Software Engineer',
                    location: 'San Francisco, CA',
                    startDate: '2020-01',
                    endDate: '2024-12',
                    current: false,
                    description: 'Led development of cloud-based applications',
                    achievements: [
                        'Improved system performance by 40%',
                        'Mentored 5 junior developers'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'University of California',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    location: 'Berkeley, CA',
                    startDate: '2015-09',
                    endDate: '2019-05',
                    gpa: '3.8'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Programming Languages',
                    skills: ['JavaScript', 'Python', 'Java', 'TypeScript']
                },
                {
                    id: '2',
                    category: 'Frameworks',
                    skills: ['React', 'Node.js', 'Django', 'Next.js']
                }
            ]
        }
    },

    // Get AI suggestions using rule-based evaluation engine
    async getAISuggestions(
        field: string,
        value: string,
        context?: { resume?: Resume; jobContext?: JobContext }
    ): Promise<AISuggestion[]> {
        // Simulate slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 200))

        if (!context?.resume || value.length < 10) {
            return []
        }

        // Use the rule-based evaluation engine
        return generateSuggestions(
            context.resume,
            field,
            value,
            context.jobContext
        )
    },

    // Get AI reframe using rule-based improvements
    async getAIReframe(
        text: string,
        context?: { resume?: Resume; jobContext?: JobContext }
    ): Promise<AIReframe> {
        // Simulate slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 300))

        if (!context?.resume) {
            // Fallback basic reframe
            return {
                original: text,
                reframed: text
                    .replace(/I /g, '')
                    .replace(/my /g, ''),
                improvements: ['Removed first-person pronouns']
            }
        }

        // Use the rule-based evaluation engine
        return generateReframe(text, context.resume, context.jobContext)
    },

    // Get resume score using evaluation engine
    async getResumeScore(resume: Resume, jobContext?: JobContext) {
        await new Promise(resolve => setTimeout(resolve, 100))
        return evaluateResume(resume, jobContext)
    },

    // Extract skills from job description
    async parseJobDescription(jobDescription: string) {
        await new Promise(resolve => setTimeout(resolve, 100))
        return extractSkillsFromJD(jobDescription)
    }
}

