'use client'

import { Resume } from '@/lib/types/resume-types'

interface MinimalTemplateProps {
    resume: Resume
    isEditable?: boolean
    onEdit?: (section: string, field: string, value: string) => void
}

export function MinimalTemplate({ resume, isEditable = false, onEdit }: MinimalTemplateProps) {
    const formatDate = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        return `${month}/${year}`
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
                className={`${className} outline-none border-b border-transparent hover:border-slate-300 focus:border-slate-500 transition-colors`}
                onBlur={(e: React.FocusEvent<HTMLElement>) => {
                    onEdit?.(section, field, e.currentTarget.textContent || '')
                }}
            >
                {value}
            </Component>
        )
    }

    return (
        <div className="bg-white shadow-2xl max-w-4xl mx-auto p-12" id="resume-template" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header - Simple, Left-aligned */}
            <header className="mb-10">
                <EditableText
                    value={resume.personalInfo.fullName || 'Your Name'}
                    section="personalInfo"
                    field="fullName"
                    className="text-4xl font-light text-slate-900 block"
                    as="h1"
                />

                {/* Contact - Single line, minimal */}
                <div className="mt-2 text-sm text-slate-500 space-x-3">
                    {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                    {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                    {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
                </div>

                {resume.personalInfo.summary && (
                    <EditableText
                        value={resume.personalInfo.summary}
                        section="personalInfo"
                        field="summary"
                        className="text-slate-600 mt-4 leading-relaxed block"
                        as="p"
                    />
                )}
            </header>

            <div className="space-y-8">
                {/* Experience */}
                {resume.experiences.length > 0 && (
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {resume.experiences.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium text-slate-900">{exp.position}</h3>
                                        <span className="text-xs text-slate-400">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">{exp.company}</p>
                                    {exp.description && (
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                                    )}
                                    {exp.achievements.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.achievements.map((a, i) => (
                                                <li key={i} className="text-sm text-slate-600 pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-slate-400">
                                                    {a}
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
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {resume.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium text-slate-900">{edu.degree}, {edu.field}</h3>
                                        <p className="text-sm text-slate-500">{edu.institution}</p>
                                    </div>
                                    <span className="text-xs text-slate-400">{formatDate(edu.endDate)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.flatMap(group => group.skills).map((skill, i) => (
                                <span
                                    key={i}
                                    className="text-sm text-slate-600 px-3 py-1 bg-slate-50 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {resume.projects.map((project) => (
                                <div key={project.id}>
                                    <h3 className="font-medium text-slate-900">{project.name}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                                    {project.technologies.length > 0 && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            {project.technologies.join(' · ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications & Languages - Inline */}
                {((resume.certifications && resume.certifications.length > 0) || (resume.languages && resume.languages.length > 0)) && (
                    <div className="grid grid-cols-2 gap-8">
                        {resume.certifications && resume.certifications.length > 0 && (
                            <section>
                                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Certifications
                                </h2>
                                <div className="space-y-2">
                                    {resume.certifications.map((cert) => (
                                        <p key={cert.id} className="text-sm text-slate-600">
                                            {cert.name}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        )}

                        {resume.languages && resume.languages.length > 0 && (
                            <section>
                                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Languages
                                </h2>
                                <div className="space-y-2">
                                    {resume.languages.map((lang) => (
                                        <p key={lang.id} className="text-sm text-slate-600">
                                            {lang.language} <span className="text-slate-400">({lang.proficiency})</span>
                                        </p>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
