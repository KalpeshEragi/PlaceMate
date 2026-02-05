// File: app/dashboard/resume/builder/[id]/page.tsx
// Updated to use the new useRuleEngine hook

'use client'

import { use, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    User,
    Briefcase,
    GraduationCap,
    Code,
    FolderGit,
    Award,
    FileText,
    Globe,
    Heart,
    ArrowLeft,
    Plus,
    Trash2,
    Moon,
    Sun,
    Eye,
    Download,
    Sparkles,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { useResumeBuilder } from '@/hooks/use-resume-builder'
import { useRuleEngine } from '@/hooks/use-rule-engine'

import { AISuggestionPanel } from '@/components/resume/ai-suggestion-panel'
import { GlobalSuggestionsPanel } from '@/components/resume/global-suggestions-panel'
import { Experience, Education, Skill, Project, Publication, Achievement, Certification, Language, VolunteerWork } from '@/lib/types/resume-types'

export default function ResumeBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { resume, loading, saving, activeSection, setActiveSection, updateSection } = useResumeBuilder(id)

    // Get domain from jobContext or default to 'web-developer'
    const domain = resume?.jobContext?.domain || 'web-developer'
    const { suggestions, globalSuggestions, atsScore, getFieldSuggestions, getATSScore, refreshSuggestions } = useRuleEngine({ domain })

    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [activeField, setActiveField] = useState<{ section: string; field: string; value: string }>({
        section: '',
        field: '',
        value: ''
    })

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true)
        }
    }, [])

    // Update ATS score and global suggestions when resume changes (debounced)
    useEffect(() => {
        if (!resume) return

        const timer = setTimeout(() => {
            getATSScore(resume)
            refreshSuggestions(resume)
        }, 1000)

        return () => clearTimeout(timer)
    }, [resume, getATSScore, refreshSuggestions])

    const toggleTheme = () => setIsDark(!isDark)

    if (loading) {
        return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading resume...</p>
            </div>
        </div>
    }

    if (!resume) {
        return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="text-center">
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Resume not found</h2>
                <Link href="/dashboard/resume">
                    <Button className="bg-blue-600 hover:bg-blue-700">Back to Resumes</Button>
                </Link>
            </div>
        </div>
    }

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'projects', label: 'Projects', icon: FolderGit },
        { id: 'publications', label: 'Publications', icon: FileText },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'languages', label: 'Languages', icon: Globe },
        { id: 'volunteer', label: 'Volunteer', icon: Heart },
    ]

    const handleFieldFocus = (section: string, field: string, value: string) => {
        setActiveField({ section, field, value })
        // Get AI suggestions for the focused field
        if (value && value.trim().length > 0) {
            getFieldSuggestions(value, field, section)
        }
    }

    if (!mounted) return null

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors ${isDark ? 'bg-blue-900' : 'bg-blue-300'}`} />
                <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors ${isDark ? 'bg-purple-900' : 'bg-purple-300'}`} />
            </div>

            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/resume">
                                <button className={`p-2.5 rounded-lg transition-all ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                    : 'bg-white hover:bg-slate-100 text-slate-600'
                                    } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{resume.name}</h1>
                                <p className={`text-xs flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {saving ? (
                                        <>
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            All changes saved
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className={`${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200'}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button variant="outline" size="sm" className={`${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200'}`}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-lg transition-all ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                                    : 'bg-white hover:bg-slate-100 text-slate-700'
                                    } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - Sections */}
                    <div className="col-span-2">
                        <div className={`sticky top-24 rounded-2xl p-4 border backdrop-blur-xl ${isDark
                            ? 'bg-slate-900/50 border-slate-800'
                            : 'bg-white/50 border-slate-200'
                            }`}>
                            <div className="space-y-2">
                                {sections.map(section => {
                                    const Icon = section.icon
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id as any)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm font-medium ${activeSection === section.id
                                                ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg`
                                                : `${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="line-clamp-1">{section.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Center - Form (all sections same as before) */}
                    <div className="col-span-6 space-y-6">
                        {/* Personal Info Section */}
                        {activeSection === 'personal' && (
                            <div className={`rounded-2xl p-8 border backdrop-blur-xl ${isDark
                                ? 'bg-slate-900/50 border-slate-800'
                                : 'bg-white/50 border-slate-200'
                                }`}>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Personal Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Full Name</Label>
                                            <Input
                                                value={resume.personalInfo.fullName}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, fullName: e.target.value })}
                                                onFocus={(e) => handleFieldFocus('personal', 'fullName', e.target.value)}
                                                placeholder="John Doe"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Email</Label>
                                            <Input
                                                value={resume.personalInfo.email}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, email: e.target.value })}
                                                onFocus={(e) => handleFieldFocus('personal', 'email', e.target.value)}
                                                placeholder="john@example.com"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Phone</Label>
                                            <Input
                                                value={resume.personalInfo.phone}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, phone: e.target.value })}
                                                placeholder="+1 234 567 8900"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Location</Label>
                                            <Input
                                                value={resume.personalInfo.location}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, location: e.target.value })}
                                                placeholder="San Francisco, CA"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>LinkedIn</Label>
                                            <Input
                                                value={resume.personalInfo.linkedin || ''}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, linkedin: e.target.value })}
                                                placeholder="linkedin.com/in/username"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>GitHub</Label>
                                            <Input
                                                value={resume.personalInfo.github || ''}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, github: e.target.value })}
                                                placeholder="github.com/username"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Portfolio</Label>
                                            <Input
                                                value={resume.personalInfo.portfolio || ''}
                                                onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, portfolio: e.target.value })}
                                                placeholder="yoursite.com"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Professional Summary</Label>
                                        <Textarea
                                            value={resume.personalInfo.summary}
                                            onChange={(e) => updateSection('personalInfo', { ...resume.personalInfo, summary: e.target.value })}
                                            onFocus={(e) => handleFieldFocus('personal', 'summary', e.target.value)}
                                            placeholder="Brief overview of your professional background..."
                                            rows={4}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        {activeSection === 'experience' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Experience</h2>
                                    <Button
                                        onClick={() => {
                                            const newExp: Experience = {
                                                id: Date.now().toString(),
                                                company: '',
                                                position: '',
                                                location: '',
                                                startDate: '',
                                                endDate: '',
                                                current: false,
                                                description: '',
                                                achievements: []
                                            }
                                            updateSection('experiences', [...resume.experiences, newExp])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Experience
                                    </Button>
                                </div>

                                {resume.experiences.map((exp, index) => (
                                    <div key={exp.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('experiences', resume.experiences.filter(e => e.id !== exp.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Company</Label>
                                                    <Input
                                                        value={exp.company}
                                                        onChange={(e) => {
                                                            const updated = [...resume.experiences]
                                                            updated[index] = { ...exp, company: e.target.value }
                                                            updateSection('experiences', updated)
                                                        }}
                                                        placeholder="Company Name"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Position</Label>
                                                    <Input
                                                        value={exp.position}
                                                        onChange={(e) => {
                                                            const updated = [...resume.experiences]
                                                            updated[index] = { ...exp, position: e.target.value }
                                                            updateSection('experiences', updated)
                                                        }}
                                                        placeholder="Software Engineer"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Location</Label>
                                                <Input
                                                    value={exp.location}
                                                    onChange={(e) => {
                                                        const updated = [...resume.experiences]
                                                        updated[index] = { ...exp, location: e.target.value }
                                                        updateSection('experiences', updated)
                                                    }}
                                                    placeholder="San Francisco, CA"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Start Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={exp.startDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.experiences]
                                                            updated[index] = { ...exp, startDate: e.target.value }
                                                            updateSection('experiences', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>End Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={exp.endDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.experiences]
                                                            updated[index] = { ...exp, endDate: e.target.value }
                                                            updateSection('experiences', updated)
                                                        }}
                                                        disabled={exp.current}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updated = [...resume.experiences]
                                                        updated[index] = { ...exp, description: e.target.value }
                                                        updateSection('experiences', updated)
                                                    }}
                                                    onFocus={(e) => handleFieldFocus('experience', 'description', e.target.value)}
                                                    placeholder="Describe your responsibilities and achievements..."
                                                    rows={4}
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education Section */}
                        {activeSection === 'education' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Education</h2>
                                    <Button
                                        onClick={() => {
                                            const newEdu: Education = {
                                                id: Date.now().toString(),
                                                institution: '',
                                                degree: '',
                                                field: '',
                                                location: '',
                                                startDate: '',
                                                endDate: '',
                                                gpa: ''
                                            }
                                            updateSection('education', [...resume.education, newEdu])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Education
                                    </Button>
                                </div>

                                {resume.education.map((edu, index) => (
                                    <div key={edu.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('education', resume.education.filter(e => e.id !== edu.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Institution</Label>
                                                    <Input
                                                        value={edu.institution}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, institution: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        placeholder="University Name"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Degree</Label>
                                                    <Input
                                                        value={edu.degree}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, degree: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        placeholder="Bachelor of Science"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Field of Study</Label>
                                                    <Input
                                                        value={edu.field}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, field: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        placeholder="Computer Science"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>GPA</Label>
                                                    <Input
                                                        value={edu.gpa || ''}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, gpa: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        placeholder="3.8"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Start Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={edu.startDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, startDate: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>End Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={edu.endDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, endDate: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills Section */}
                        {activeSection === 'skills' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Skills</h2>
                                    <Button
                                        onClick={() => {
                                            const newSkill: Skill = {
                                                id: Date.now().toString(),
                                                category: '',
                                                skills: []
                                            }
                                            updateSection('skills', [...resume.skills, newSkill])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Skill Category
                                    </Button>
                                </div>

                                {resume.skills.map((skill, index) => (
                                    <div key={skill.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('skills', resume.skills.filter(s => s.id !== skill.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category</Label>
                                                <Input
                                                    value={skill.category}
                                                    onChange={(e) => {
                                                        const updated = [...resume.skills]
                                                        updated[index] = { ...skill, category: e.target.value }
                                                        updateSection('skills', updated)
                                                    }}
                                                    placeholder="Programming Languages"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Skills (comma separated)</Label>
                                                <Input
                                                    value={skill.skills.join(', ')}
                                                    onChange={(e) => {
                                                        const updated = [...resume.skills]
                                                        updated[index] = { ...skill, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                                                        updateSection('skills', updated)
                                                    }}
                                                    placeholder="JavaScript, Python, TypeScript"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Projects Section */}
                        {activeSection === 'projects' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Projects</h2>
                                    <Button
                                        onClick={() => {
                                            const newProject: Project = {
                                                id: Date.now().toString(),
                                                name: '',
                                                description: '',
                                                technologies: [],
                                                link: '',
                                                startDate: '',
                                                endDate: '',
                                                highlights: []
                                            }
                                            updateSection('projects', [...resume.projects, newProject])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Project
                                    </Button>
                                </div>

                                {resume.projects.map((project, index) => (
                                    <div key={project.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('projects', resume.projects.filter(p => p.id !== project.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Project Name</Label>
                                                <Input
                                                    value={project.name}
                                                    onChange={(e) => {
                                                        const updated = [...resume.projects]
                                                        updated[index] = { ...project, name: e.target.value }
                                                        updateSection('projects', updated)
                                                    }}
                                                    placeholder="My Awesome Project"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={project.description}
                                                    onChange={(e) => {
                                                        const updated = [...resume.projects]
                                                        updated[index] = { ...project, description: e.target.value }
                                                        updateSection('projects', updated)
                                                    }}
                                                    placeholder="Describe your project..."
                                                    rows={3}
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Technologies (comma separated)</Label>
                                                <Input
                                                    value={project.technologies.join(', ')}
                                                    onChange={(e) => {
                                                        const updated = [...resume.projects]
                                                        updated[index] = { ...project, technologies: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                                                        updateSection('projects', updated)
                                                    }}
                                                    placeholder="React, Node.js, MongoDB"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Live Link</Label>
                                                    <Input
                                                        value={project.link || ''}
                                                        onChange={(e) => {
                                                            const updated = [...resume.projects]
                                                            updated[index] = { ...project, link: e.target.value }
                                                            updateSection('projects', updated)
                                                        }}
                                                        placeholder="https://myproject.com"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Start Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={project.startDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.projects]
                                                            updated[index] = { ...project, startDate: e.target.value }
                                                            updateSection('projects', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>End Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={project.endDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.projects]
                                                            updated[index] = { ...project, endDate: e.target.value }
                                                            updateSection('projects', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Publications Section */}
                        {activeSection === 'publications' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Publications</h2>
                                    <Button
                                        onClick={() => {
                                            const newPub: Publication = {
                                                id: Date.now().toString(),
                                                title: '',
                                                authors: [],
                                                venue: '',
                                                date: '',
                                                link: '',
                                                description: ''
                                            }
                                            updateSection('publications', [...(resume.publications || []), newPub])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Publication
                                    </Button>
                                </div>

                                {(resume.publications || []).map((pub, index) => (
                                    <div key={pub.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('publications', (resume.publications || []).filter(p => p.id !== pub.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Title</Label>
                                                <Input
                                                    value={pub.title}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.publications || [])]
                                                        updated[index] = { ...pub, title: e.target.value }
                                                        updateSection('publications', updated)
                                                    }}
                                                    placeholder="Publication Title"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Venue/Journal</Label>
                                                    <Input
                                                        value={pub.venue}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.publications || [])]
                                                            updated[index] = { ...pub, venue: e.target.value }
                                                            updateSection('publications', updated)
                                                        }}
                                                        placeholder="Journal/Conference Name"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={pub.date}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.publications || [])]
                                                            updated[index] = { ...pub, date: e.target.value }
                                                            updateSection('publications', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Link</Label>
                                                <Input
                                                    value={pub.link || ''}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.publications || [])]
                                                        updated[index] = { ...pub, link: e.target.value }
                                                        updateSection('publications', updated)
                                                    }}
                                                    placeholder="https://doi.org/..."
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Achievements Section */}
                        {activeSection === 'achievements' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Achievements</h2>
                                    <Button
                                        onClick={() => {
                                            const newAch: Achievement = {
                                                id: Date.now().toString(),
                                                title: '',
                                                issuer: '',
                                                date: '',
                                                description: ''
                                            }
                                            updateSection('achievements', [...(resume.achievements || []), newAch])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Achievement
                                    </Button>
                                </div>

                                {(resume.achievements || []).map((ach, index) => (
                                    <div key={ach.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('achievements', (resume.achievements || []).filter(a => a.id !== ach.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Title</Label>
                                                <Input
                                                    value={ach.title}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.achievements || [])]
                                                        updated[index] = { ...ach, title: e.target.value }
                                                        updateSection('achievements', updated)
                                                    }}
                                                    placeholder="Achievement Title"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Issuer</Label>
                                                    <Input
                                                        value={ach.issuer || ''}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.achievements || [])]
                                                            updated[index] = { ...ach, issuer: e.target.value }
                                                            updateSection('achievements', updated)
                                                        }}
                                                        placeholder="Organization Name"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={ach.date || ''}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.achievements || [])]
                                                            updated[index] = { ...ach, date: e.target.value }
                                                            updateSection('achievements', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={ach.description || ''}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.achievements || [])]
                                                        updated[index] = { ...ach, description: e.target.value }
                                                        updateSection('achievements', updated)
                                                    }}
                                                    placeholder="Describe your achievement..."
                                                    rows={2}
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Certifications Section */}
                        {activeSection === 'certifications' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Certifications</h2>
                                    <Button
                                        onClick={() => {
                                            const newCert: Certification = {
                                                id: Date.now().toString(),
                                                name: '',
                                                issuer: '',
                                                date: '',
                                                expiryDate: '',
                                                credentialId: '',
                                                link: ''
                                            }
                                            updateSection('certifications', [...(resume.certifications || []), newCert])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Certification
                                    </Button>
                                </div>

                                {(resume.certifications || []).map((cert, index) => (
                                    <div key={cert.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('certifications', (resume.certifications || []).filter(c => c.id !== cert.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Certification Name</Label>
                                                <Input
                                                    value={cert.name}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.certifications || [])]
                                                        updated[index] = { ...cert, name: e.target.value }
                                                        updateSection('certifications', updated)
                                                    }}
                                                    placeholder="AWS Solutions Architect"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Issuer</Label>
                                                    <Input
                                                        value={cert.issuer}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.certifications || [])]
                                                            updated[index] = { ...cert, issuer: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        placeholder="Amazon Web Services"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date Obtained</Label>
                                                    <Input
                                                        type="month"
                                                        value={cert.date}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.certifications || [])]
                                                            updated[index] = { ...cert, date: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Credential URL</Label>
                                                <Input
                                                    value={cert.link || ''}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.certifications || [])]
                                                        updated[index] = { ...cert, link: e.target.value }
                                                        updateSection('certifications', updated)
                                                    }}
                                                    placeholder="https://credential.url"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Languages Section */}
                        {activeSection === 'languages' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Languages</h2>
                                    <Button
                                        onClick={() => {
                                            const newLang: Language = {
                                                id: Date.now().toString(),
                                                language: '',
                                                proficiency: 'Intermediate'
                                            }
                                            updateSection('languages', [...(resume.languages || []), newLang])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Language
                                    </Button>
                                </div>

                                {(resume.languages || []).map((lang, index) => (
                                    <div key={lang.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('languages', (resume.languages || []).filter(l => l.id !== lang.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Language</Label>
                                                    <Input
                                                        value={lang.language}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.languages || [])]
                                                            updated[index] = { ...lang, language: e.target.value }
                                                            updateSection('languages', updated)
                                                        }}
                                                        placeholder="English"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Proficiency</Label>
                                                    <select
                                                        value={lang.proficiency}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.languages || [])]
                                                            updated[index] = { ...lang, proficiency: e.target.value as Language['proficiency'] }
                                                            updateSection('languages', updated)
                                                        }}
                                                        className={`w-full px-3 py-2 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                                    >
                                                        <option value="Native">Native</option>
                                                        <option value="Fluent">Fluent</option>
                                                        <option value="Professional">Professional</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Basic">Basic</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Volunteer Section */}
                        {activeSection === 'volunteer' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Volunteer Work</h2>
                                    <Button
                                        onClick={() => {
                                            const newVol: VolunteerWork = {
                                                id: Date.now().toString(),
                                                organization: '',
                                                role: '',
                                                startDate: '',
                                                endDate: '',
                                                current: false,
                                                description: ''
                                            }
                                            updateSection('volunteerWork', [...(resume.volunteerWork || []), newVol])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Volunteer Work
                                    </Button>
                                </div>

                                {(resume.volunteerWork || []).map((vol, index) => (
                                    <div key={vol.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('volunteerWork', (resume.volunteerWork || []).filter(v => v.id !== vol.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Organization</Label>
                                                    <Input
                                                        value={vol.organization}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.volunteerWork || [])]
                                                            updated[index] = { ...vol, organization: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        placeholder="Organization Name"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Role</Label>
                                                    <Input
                                                        value={vol.role}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.volunteerWork || [])]
                                                            updated[index] = { ...vol, role: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        placeholder="Volunteer Role"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Start Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={vol.startDate}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.volunteerWork || [])]
                                                            updated[index] = { ...vol, startDate: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>End Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={vol.endDate || ''}
                                                        onChange={(e) => {
                                                            const updated = [...(resume.volunteerWork || [])]
                                                            updated[index] = { ...vol, endDate: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={vol.description || ''}
                                                    onChange={(e) => {
                                                        const updated = [...(resume.volunteerWork || [])]
                                                        updated[index] = { ...vol, description: e.target.value }
                                                        updateSection('volunteerWork', updated)
                                                    }}
                                                    placeholder="Describe your volunteer work..."
                                                    rows={3}
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - AI Suggestions (UPDATED) */}
                    <div className="col-span-4">
                        <div className={`sticky top-24 rounded-2xl p-4 border backdrop-blur-xl ${isDark
                            ? 'bg-slate-900/50 border-slate-800'
                            : 'bg-white/50 border-slate-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Assistant</h3>
                            </div>

                            {/* Updated to pass domain and new props */}
                            {/* Conditionally render field suggestions or global suggestions */}
                            {suggestions.length > 0 ? (
                                <AISuggestionPanel
                                    field={activeField.field}
                                    value={activeField.value}
                                    resume={resume}
                                    jobContext={resume?.jobContext}
                                    domain={domain}
                                    isDark={isDark}
                                    onApply={(suggestion) => {
                                        // Apply the suggestion
                                        if (activeField.section === 'personal' && activeField.field === 'summary') {
                                            updateSection('personalInfo', {
                                                ...resume.personalInfo,
                                                summary: suggestion
                                            })
                                        }
                                        setActiveField(prev => ({ ...prev, value: suggestion }))
                                    }}
                                />
                            ) : (
                                <GlobalSuggestionsPanel
                                    suggestions={globalSuggestions}
                                    atsScore={atsScore}
                                    isDark={isDark}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
            `}</style>
        </div>
    )
}