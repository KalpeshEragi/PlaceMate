'use client'

import { Resume } from '@/lib/types/resume-types'

interface ClassicTemplateProps {
    resume: Resume
    isEditable?: boolean
    onEdit?: (section: string, field: string, value: string) => void
}

export function ClassicTemplate({ resume, isEditable = false, onEdit }: ClassicTemplateProps) {
    const formatDate = (date: string) => {
        if (!date) return ''
        const [year, month] = date.split('-')
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
                className={`${className} outline-none border-b border-transparent hover:border-slate-400 focus:border-slate-600 transition-colors`}
                onBlur={(e: React.FocusEvent<HTMLElement>) => {
                    onEdit?.(section, field, e.currentTarget.textContent || '')
                }}
            >
                {value}
            </Component>
        )
    }

    return (
        <div className="bg-white shadow-2xl max-w-4xl mx-auto p-10" id="resume-template" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header - Centered, Traditional */}
            <header className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                <EditableText
                    value={resume.personalInfo.fullName || 'YOUR NAME'}
                    section="personalInfo"
                    field="fullName"
                    className="text-3xl font-bold tracking-wide text-slate-900 uppercase block"
                    as="h1"
                />

                {/* Contact Line */}
                <div className="mt-3 text-sm text-slate-600 flex items-center justify-center flex-wrap gap-x-4 gap-y-1">
                    {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                    {resume.personalInfo.phone && (
                        <>
                            <span className="text-slate-400">|</span>
                            <span>{resume.personalInfo.phone}</span>
                        </>
                    )}
                    {resume.personalInfo.location && (
                        <>
                            <span className="text-slate-400">|</span>
                            <span>{resume.personalInfo.location}</span>
                        </>
                    )}
                    {resume.personalInfo.linkedin && (
                        <>
                            <span className="text-slate-400">|</span>
                            <span>{resume.personalInfo.linkedin}</span>
                        </>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {resume.personalInfo.summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Professional Summary
                    </h2>
                    <EditableText
                        value={resume.personalInfo.summary}
                        section="personalInfo"
                        field="summary"
                        className="text-slate-700 leading-relaxed block"
                        as="p"
                    />
                </section>
            )}

            {/* Experience */}
            {resume.experiences.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Professional Experience
                    </h2>
                    <div className="space-y-5">
                        {resume.experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{exp.position}</h3>
                                        <p className="text-slate-600 italic">{exp.company}, {exp.location}</p>
                                    </div>
                                    <span className="text-sm text-slate-600 italic">
                                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="mt-2 text-slate-700">{exp.description}</p>
                                )}
                                {exp.achievements.length > 0 && (
                                    <ul className="mt-2 list-disc list-outside ml-5 space-y-1 text-slate-700">
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
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {resume.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800">{edu.degree} in {edu.field}</h3>
                                    <p className="text-slate-600 italic">{edu.institution}, {edu.location}</p>
                                    {edu.gpa && <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-slate-600 italic">
                                    {formatDate(edu.endDate)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Skills
                    </h2>
                    <div className="space-y-2">
                        {resume.skills.map((skillGroup) => (
                            <p key={skillGroup.id} className="text-slate-700">
                                <span className="font-semibold">{skillGroup.category}:</span>{' '}
                                {skillGroup.skills.join(', ')}
                            </p>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {resume.projects.map((project) => (
                            <div key={project.id}>
                                <h3 className="font-bold text-slate-800">{project.name}</h3>
                                <p className="text-slate-700 mt-1">{project.description}</p>
                                {project.technologies.length > 0 && (
                                    <p className="text-sm text-slate-600 mt-1">
                                        <span className="italic">Technologies: </span>
                                        {project.technologies.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Certifications
                    </h2>
                    <div className="space-y-2">
                        {resume.certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between">
                                <span className="text-slate-700">{cert.name} – {cert.issuer}</span>
                                <span className="text-sm text-slate-600 italic">{formatDate(cert.date)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {resume.languages && resume.languages.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
                        Languages
                    </h2>
                    <p className="text-slate-700">
                        {resume.languages.map((lang) => `${lang.language} (${lang.proficiency})`).join(' • ')}
                    </p>
                </section>
            )}
        </div>
    )
}
