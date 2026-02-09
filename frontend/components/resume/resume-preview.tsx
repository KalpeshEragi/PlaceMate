'use client'

import { Resume } from '@/lib/types/resume-types'
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Globe,
    Calendar,
    Building2,
    GraduationCap,
    Award,
    FileText,
    Languages,
    Heart
} from 'lucide-react'

interface ResumePreviewProps {
    resume: Resume
    isDark: boolean
}

export function ResumePreview({ resume, isDark }: ResumePreviewProps) {
    const formatDate = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${months[parseInt(month) - 1]} ${year}`
    }

    return (
        <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'
            }`}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white">
                <h1 className="text-4xl font-bold mb-2">{resume.personalInfo.fullName || 'Your Name'}</h1>
                {resume.personalInfo.summary && (
                    <p className="text-blue-100 text-lg max-w-3xl">{resume.personalInfo.summary}</p>
                )}

                {/* Contact Info */}
                <div className="flex flex-wrap gap-6 mt-6 text-sm">
                    {resume.personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{resume.personalInfo.email}</span>
                        </div>
                    )}
                    {resume.personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{resume.personalInfo.phone}</span>
                        </div>
                    )}
                    {resume.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{resume.personalInfo.location}</span>
                        </div>
                    )}
                    {resume.personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            <span>{resume.personalInfo.linkedin}</span>
                        </div>
                    )}
                    {resume.personalInfo.github && (
                        <div className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            <span>{resume.personalInfo.github}</span>
                        </div>
                    )}
                    {resume.personalInfo.portfolio && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{resume.personalInfo.portfolio}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={`px-8 py-8 space-y-8 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {/* Experience */}
                {resume.experiences.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {resume.experiences.map((exp) => (
                                <div key={exp.id} className="border-l-2 border-blue-600 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{exp.position}</h3>
                                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {exp.company} • {exp.location}
                                            </p>
                                        </div>
                                        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {exp.description}
                                        </p>
                                    )}
                                    {exp.achievements.length > 0 && (
                                        <ul className="mt-2 list-disc list-inside space-y-1">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                            <GraduationCap className="w-5 h-5 text-purple-600" />
                            Education
                        </h2>
                        <div className="space-y-4">
                            {resume.education.map((edu) => (
                                <div key={edu.id} className="border-l-2 border-purple-600 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {edu.institution} • {edu.location}
                                            </p>
                                        </div>
                                        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                        </span>
                                    </div>
                                    {edu.gpa && (
                                        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            GPA: {edu.gpa}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Skills
                        </h2>
                        <div className="space-y-3">
                            {resume.skills.map((skillGroup) => (
                                <div key={skillGroup.id}>
                                    <span className="font-medium">{skillGroup.category}: </span>
                                    <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {skillGroup.skills.join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {resume.projects.map((project) => (
                                <div key={project.id} className="border-l-2 border-emerald-600 pl-4">
                                    <h3 className="font-semibold">{project.name}</h3>
                                    <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {project.description}
                                    </p>
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-xs px-2 py-1 rounded ${isDark
                                                            ? 'bg-slate-800 text-slate-300'
                                                            : 'bg-slate-100 text-slate-700'
                                                        }`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {resume.certifications && resume.certifications.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                            <Award className="w-5 h-5 text-amber-600" />
                            Certifications
                        </h2>
                        <div className="space-y-2">
                            {resume.certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between">
                                    <div>
                                        <span className="font-medium">{cert.name}</span>
                                        <span className={`ml-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            - {cert.issuer}
                                        </span>
                                    </div>
                                    <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {formatDate(cert.date)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {resume.languages && resume.languages.length > 0 && (
                    <section>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                            <Languages className="w-5 h-5 text-teal-600" />
                            Languages
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {resume.languages.map((lang) => (
                                <div key={lang.id} className={`px-3 py-1 rounded-full border ${isDark ? 'border-slate-700' : 'border-slate-200'
                                    }`}>
                                    <span className="font-medium">{lang.language}</span>
                                    <span className={`ml-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        ({lang.proficiency})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
