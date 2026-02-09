'use client'

import { Resume } from '@/lib/types/resume-types'
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

interface ModernTemplateProps {
    resume: Resume
    isEditable?: boolean
    onEdit?: (section: string, field: string, value: string) => void
}

export function ModernTemplate({ resume, isEditable = false, onEdit }: ModernTemplateProps) {
    const formatDate = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${months[parseInt(month) - 1]} ${year}`
    }

    const EditableText = ({
        value,
        section,
        field,
        className = '',
        as: Component = 'span'
    }: {
        value: string;
        section: string;
        field: string;
        className?: string;
        as?: any;
    }) => {
        if (!isEditable) return <Component className={className}>{value}</Component>

        return (
            <Component
                contentEditable
                suppressContentEditableWarning
                className={`${className} outline-none border-b border-transparent hover:border-blue-400 focus:border-blue-600 transition-colors`}
                onBlur={(e: React.FocusEvent<HTMLElement>) => {
                    onEdit?.(section, field, e.currentTarget.textContent || '')
                }}
            >
                {value}
            </Component>
        )
    }

    return (
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto" id="resume-template">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white">
                <EditableText
                    value={resume.personalInfo.fullName || 'Your Name'}
                    section="personalInfo"
                    field="fullName"
                    className="text-4xl font-bold block mb-2"
                    as="h1"
                />
                <EditableText
                    value={resume.personalInfo.summary || 'Professional summary goes here...'}
                    section="personalInfo"
                    field="summary"
                    className="text-blue-100 text-lg max-w-3xl block"
                    as="p"
                />

                {/* Contact Row */}
                <div className="flex flex-wrap gap-6 mt-6 text-sm">
                    {resume.personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <EditableText value={resume.personalInfo.email} section="personalInfo" field="email" />
                        </div>
                    )}
                    {resume.personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <EditableText value={resume.personalInfo.phone} section="personalInfo" field="phone" />
                        </div>
                    )}
                    {resume.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <EditableText value={resume.personalInfo.location} section="personalInfo" field="location" />
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
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-3 gap-0">
                {/* Left Column - Skills & Languages */}
                <div className="bg-slate-50 p-6 space-y-6">
                    {/* Skills */}
                    {resume.skills.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Skills</h3>
                            <div className="space-y-3">
                                {resume.skills.map((skillGroup) => (
                                    <div key={skillGroup.id}>
                                        <p className="font-medium text-sm text-slate-700">{skillGroup.category}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {skillGroup.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {resume.languages && resume.languages.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Languages</h3>
                            <div className="space-y-2">
                                {resume.languages.map((lang) => (
                                    <div key={lang.id} className="text-sm">
                                        <span className="font-medium text-slate-700">{lang.language}</span>
                                        <span className="text-slate-500 ml-2">- {lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {resume.certifications && resume.certifications.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Certifications</h3>
                            <div className="space-y-2">
                                {resume.certifications.map((cert) => (
                                    <div key={cert.id} className="text-sm">
                                        <p className="font-medium text-slate-700">{cert.name}</p>
                                        <p className="text-slate-500 text-xs">{cert.issuer} • {formatDate(cert.date)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - Experience, Education, Projects */}
                <div className="col-span-2 p-6 space-y-6">
                    {/* Experience */}
                    {resume.experiences.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b-2 border-blue-600 pb-1 inline-block">
                                Experience
                            </h3>
                            <div className="space-y-5">
                                {resume.experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{exp.position}</h4>
                                                <p className="text-blue-600 text-sm">{exp.company} • {exp.location}</p>
                                            </div>
                                            <span className="text-sm text-slate-500 whitespace-nowrap">
                                                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="mt-2 text-slate-600 text-sm">{exp.description}</p>
                                        )}
                                        {exp.achievements.length > 0 && (
                                            <ul className="mt-2 list-disc list-inside text-sm text-slate-600">
                                                {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
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
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b-2 border-purple-600 pb-1 inline-block">
                                Education
                            </h3>
                            <div className="space-y-4">
                                {resume.education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{edu.degree} in {edu.field}</h4>
                                                <p className="text-purple-600 text-sm">{edu.institution}</p>
                                            </div>
                                            <span className="text-sm text-slate-500">
                                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                            </span>
                                        </div>
                                        {edu.gpa && <p className="text-sm text-slate-500 mt-1">GPA: {edu.gpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {resume.projects.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b-2 border-emerald-600 pb-1 inline-block">
                                Projects
                            </h3>
                            <div className="space-y-4">
                                {resume.projects.map((project) => (
                                    <div key={project.id}>
                                        <h4 className="font-semibold text-slate-800">{project.name}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                                        {project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {project.technologies.map((tech, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
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
                </div>
            </div>
        </div>
    )
}
