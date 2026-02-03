'use client'

import { use, useState } from 'react'
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
import { AISuggestionPanel } from '@/components/resume/ai-suggestion-panel'
import { Experience, Education, Skill, Project, Publication, Achievement, Certification, Language, VolunteerWork } from '@/lib/types/resume-types'

export default function ResumeBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { resume, loading, saving, activeSection, setActiveSection, updateSection } = useResumeBuilder(id)
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [activeField, setActiveField] = useState<{ section: string; field: string; value: string }>({
        section: '',
        field: '',
        value: ''
    })

    useState(() => {
        setMounted(true)
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true)
        }
    })

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
    }

    const handleApplySuggestion = (newValue: string) => {
        console.log('Applying suggestion:', newValue)
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

                    {/* Center - Form */}
                    <div className="col-span-6 space-y-6">
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

                        {/* Education Section - condensed for brevity */}
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
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>GPA (Optional)</Label>
                                                    <Input
                                                        value={edu.gpa || ''}
                                                        onChange={(e) => {
                                                            const updated = [...resume.education]
                                                            updated[index] = { ...edu, gpa: e.target.value }
                                                            updateSection('education', updated)
                                                        }}
                                                        placeholder="3.8 / 4.0"
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
                                        Add Category
                                    </Button>
                                </div>

                                {resume.skills.map((skillGroup, index) => (
                                    <div key={skillGroup.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-4">
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category</Label>
                                                    <Input
                                                        value={skillGroup.category}
                                                        onChange={(e) => {
                                                            const updated = [...resume.skills]
                                                            updated[index] = { ...skillGroup, category: e.target.value }
                                                            updateSection('skills', updated)
                                                        }}
                                                        placeholder="e.g., Programming Languages"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => updateSection('skills', resume.skills.filter(s => s.id !== skillGroup.id))}
                                                    className={`p-2 rounded-lg transition-all mt-8 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Skills (comma separated)</Label>
                                                <Input
                                                    value={skillGroup.skills.join(', ')}
                                                    onChange={(e) => {
                                                        const updated = [...resume.skills]
                                                        updated[index] = { ...skillGroup, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                                                        updateSection('skills', updated)
                                                    }}
                                                    placeholder="JavaScript, Python, React"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {skillGroup.skills.map((skill, i) => (
                                                    <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium ${isDark
                                                        ? 'bg-blue-600/20 text-blue-300'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Other sections follow similar pattern - showing Projects for example */}
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
                                                    placeholder="Project Name"
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
                                                    onFocus={(e) => handleFieldFocus('projects', 'description', e.target.value)}
                                                    placeholder="Brief description..."
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
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Project Link (Optional)</Label>
                                                <Input
                                                    value={project.link || ''}
                                                    onChange={(e) => {
                                                        const updated = [...resume.projects]
                                                        updated[index] = { ...project, link: e.target.value }
                                                        updateSection('projects', updated)
                                                    }}
                                                    placeholder="https://github.com/username/project"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
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
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Research & Publications</h2>
                                    <Button
                                        onClick={() => {
                                            const newPub: Publication = {
                                                id: Date.now().toString(),
                                                title: '',
                                                authors: [],
                                                venue: '',
                                                date: '',
                                                description: ''
                                            }
                                            updateSection('publications', [...resume.publications, newPub])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Publication
                                    </Button>
                                </div>

                                {resume.publications.map((pub, index) => (
                                    <div key={pub.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('publications', resume.publications.filter(p => p.id !== pub.id))}
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
                                                        const updated = [...resume.publications]
                                                        updated[index] = { ...pub, title: e.target.value }
                                                        updateSection('publications', updated)
                                                    }}
                                                    placeholder="Publication Title"
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Authors (comma separated)</Label>
                                                <Input
                                                    value={pub.authors.join(', ')}
                                                    onChange={(e) => {
                                                        const updated = [...resume.publications]
                                                        updated[index] = { ...pub, authors: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                                                        updateSection('publications', updated)
                                                    }}
                                                    placeholder="John Doe, Jane Smith"
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Venue/Conference</Label>
                                                    <Input
                                                        value={pub.venue}
                                                        onChange={(e) => {
                                                            const updated = [...resume.publications]
                                                            updated[index] = { ...pub, venue: e.target.value }
                                                            updateSection('publications', updated)
                                                        }}
                                                        placeholder="IEEE Conference 2024"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={pub.date}
                                                        onChange={(e) => {
                                                            const updated = [...resume.publications]
                                                            updated[index] = { ...pub, date: e.target.value }
                                                            updateSection('publications', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={pub.description}
                                                    onChange={(e) => {
                                                        const updated = [...resume.publications]
                                                        updated[index] = { ...pub, description: e.target.value }
                                                        updateSection('publications', updated)
                                                    }}
                                                    placeholder="Brief description of the publication..."
                                                    rows={3}
                                                    autoComplete="off"
                                                    autoCorrect="off"
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
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Achievements & Awards</h2>
                                    <Button
                                        onClick={() => {
                                            const newAchievement: Achievement = {
                                                id: Date.now().toString(),
                                                title: '',
                                                date: '',
                                                description: ''
                                            }
                                            updateSection('achievements', [...resume.achievements, newAchievement])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Achievement
                                    </Button>
                                </div>

                                {resume.achievements.map((achievement, index) => (
                                    <div key={achievement.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('achievements', resume.achievements.filter(a => a.id !== achievement.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Achievement Title</Label>
                                                    <Input
                                                        value={achievement.title}
                                                        onChange={(e) => {
                                                            const updated = [...resume.achievements]
                                                            updated[index] = { ...achievement, title: e.target.value }
                                                            updateSection('achievements', updated)
                                                        }}
                                                        placeholder="First Place in Hackathon"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={achievement.date}
                                                        onChange={(e) => {
                                                            const updated = [...resume.achievements]
                                                            updated[index] = { ...achievement, date: e.target.value }
                                                            updateSection('achievements', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={achievement.description}
                                                    onChange={(e) => {
                                                        const updated = [...resume.achievements]
                                                        updated[index] = { ...achievement, description: e.target.value }
                                                        updateSection('achievements', updated)
                                                    }}
                                                    placeholder="Brief description of the achievement..."
                                                    rows={3}
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Issuer (Optional)</Label>
                                                <Input
                                                    value={achievement.issuer || ''}
                                                    onChange={(e) => {
                                                        const updated = [...resume.achievements]
                                                        updated[index] = { ...achievement, issuer: e.target.value }
                                                        updateSection('achievements', updated)
                                                    }}
                                                    placeholder="Organization name"
                                                    autoComplete="off"
                                                    autoCorrect="off"
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
                                                date: ''
                                            }
                                            updateSection('certifications', [...resume.certifications, newCert])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Certification
                                    </Button>
                                </div>

                                {resume.certifications.map((cert, index) => (
                                    <div key={cert.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('certifications', resume.certifications.filter(c => c.id !== cert.id))}
                                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Certification Name</Label>
                                                    <Input
                                                        value={cert.name}
                                                        onChange={(e) => {
                                                            const updated = [...resume.certifications]
                                                            updated[index] = { ...cert, name: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        placeholder="AWS Certified Solutions Architect"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Issuer</Label>
                                                    <Input
                                                        value={cert.issuer}
                                                        onChange={(e) => {
                                                            const updated = [...resume.certifications]
                                                            updated[index] = { ...cert, issuer: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        placeholder="Amazon Web Services"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date Obtained</Label>
                                                    <Input
                                                        type="month"
                                                        value={cert.date}
                                                        onChange={(e) => {
                                                            const updated = [...resume.certifications]
                                                            updated[index] = { ...cert, date: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Expiry Date (Optional)</Label>
                                                    <Input
                                                        type="month"
                                                        value={cert.expiryDate || ''}
                                                        onChange={(e) => {
                                                            const updated = [...resume.certifications]
                                                            updated[index] = { ...cert, expiryDate: e.target.value }
                                                            updateSection('certifications', updated)
                                                        }}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Credential ID (Optional)</Label>
                                                <Input
                                                    value={cert.credentialId || ''}
                                                    onChange={(e) => {
                                                        const updated = [...resume.certifications]
                                                        updated[index] = { ...cert, credentialId: e.target.value }
                                                        updateSection('certifications', updated)
                                                    }}
                                                    placeholder="ABC123XYZ"
                                                    autoComplete="off"
                                                    autoCorrect="off"
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
                                            updateSection('languages', [...resume.languages, newLang])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Language
                                    </Button>
                                </div>

                                {resume.languages.map((lang, index) => (
                                    <div key={lang.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="flex items-end gap-4">
                                            <div className="flex-1">
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Language</Label>
                                                <Input
                                                    value={lang.language}
                                                    onChange={(e) => {
                                                        const updated = [...resume.languages]
                                                        updated[index] = { ...lang, language: e.target.value }
                                                        updateSection('languages', updated)
                                                    }}
                                                    placeholder="English, Spanish, etc."
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Proficiency</Label>
                                                <select
                                                    value={lang.proficiency}
                                                    onChange={(e) => {
                                                        const updated = [...resume.languages]
                                                        updated[index] = { ...lang, proficiency: e.target.value as any }
                                                        updateSection('languages', updated)
                                                    }}
                                                    className={`w-full p-2 rounded-md border transition-all ${isDark
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-white border-slate-200'
                                                        }`}
                                                >
                                                    <option value="Native">Native</option>
                                                    <option value="Fluent">Fluent</option>
                                                    <option value="Professional">Professional</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Basic">Basic</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={() => updateSection('languages', resume.languages.filter(l => l.id !== lang.id))}
                                                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Volunteer Work Section */}
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
                                            updateSection('volunteerWork', [...resume.volunteerWork, newVol])
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Volunteer Work
                                    </Button>
                                </div>

                                {resume.volunteerWork.map((vol, index) => (
                                    <div key={vol.id} className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark
                                        ? 'bg-slate-900/50 border-slate-800'
                                        : 'bg-white/50 border-slate-200'
                                        }`}>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => updateSection('volunteerWork', resume.volunteerWork.filter(v => v.id !== vol.id))}
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
                                                            const updated = [...resume.volunteerWork]
                                                            updated[index] = { ...vol, organization: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        placeholder="Organization Name"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Role</Label>
                                                    <Input
                                                        value={vol.role}
                                                        onChange={(e) => {
                                                            const updated = [...resume.volunteerWork]
                                                            updated[index] = { ...vol, role: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        placeholder="Volunteer Coordinator"
                                                        autoComplete="off"
                                                        autoCorrect="off"
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
                                                            const updated = [...resume.volunteerWork]
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
                                                        value={vol.endDate}
                                                        onChange={(e) => {
                                                            const updated = [...resume.volunteerWork]
                                                            updated[index] = { ...vol, endDate: e.target.value }
                                                            updateSection('volunteerWork', updated)
                                                        }}
                                                        disabled={vol.current}
                                                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
                                                <Textarea
                                                    value={vol.description}
                                                    onChange={(e) => {
                                                        const updated = [...resume.volunteerWork]
                                                        updated[index] = { ...vol, description: e.target.value }
                                                        updateSection('volunteerWork', updated)
                                                    }}
                                                    placeholder="Describe your volunteer work..."
                                                    rows={3}
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - AI Suggestions */}
                    <div className="col-span-4">
                        <div className={`sticky top-24 rounded-2xl p-4 border backdrop-blur-xl ${isDark
                            ? 'bg-slate-900/50 border-slate-800'
                            : 'bg-white/50 border-slate-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Assistant</h3>
                            </div>
                            <AISuggestionPanel
                                field={activeField.field}
                                value={activeField.value}
                                resume={resume}
                                jobContext={resume?.jobContext}
                                onApply={(suggestion) => {
                                    // Apply the suggestion by updating the corresponding section
                                    if (activeField.section === 'summary' && resume) {
                                        updateSection('personalInfo', {
                                            ...resume.personalInfo,
                                            summary: suggestion
                                        })
                                    }
                                    setActiveField(prev => ({ ...prev, value: suggestion }))
                                }}
                            />
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