'use client'

import { useState, useRef } from 'react'
import { Resume } from '@/lib/types/resume-types'
import { Button } from '@/components/ui/button'
import { ModernTemplate } from './templates/modern-template'
import { ClassicTemplate } from './templates/classic-template'
import { MinimalTemplate } from './templates/minimal-template'
import { TemplateType } from './template-selector'
import { Download, Save, ArrowLeft, Edit3, Eye } from 'lucide-react'

interface TemplateEditViewProps {
    resume: Resume
    selectedTemplate: TemplateType
    isDark: boolean
    onSave: (updates: Partial<Resume>) => void
    onBack: () => void
    onDownload: () => void
    isSaving?: boolean
}

export function TemplateEditView({
    resume,
    selectedTemplate,
    isDark,
    onSave,
    onBack,
    onDownload,
    isSaving = false
}: TemplateEditViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [localResume, setLocalResume] = useState<Resume>(resume)
    const templateRef = useRef<HTMLDivElement>(null)

    const handleEdit = (section: string, field: string, value: string) => {
        setLocalResume(prev => {
            if (section === 'personalInfo') {
                return {
                    ...prev,
                    personalInfo: {
                        ...prev.personalInfo,
                        [field]: value
                    }
                }
            }
            return prev
        })
    }

    const handleSave = () => {
        onSave(localResume)
    }

    const renderTemplate = () => {
        const props = {
            resume: localResume,
            isEditable: isEditing,
            onEdit: handleEdit
        }

        switch (selectedTemplate) {
            case 'modern':
                return <ModernTemplate {...props} />
            case 'classic':
                return <ClassicTemplate {...props} />
            case 'minimal':
                return <MinimalTemplate {...props} />
            default:
                return <ModernTemplate {...props} />
        }
    }

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-xl border ${isDark
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-white/50 border-slate-200'
                }`}>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className={isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Change Template
                    </Button>

                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                        Template: <span className="capitalize">{selectedTemplate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''} ${isEditing ? 'ring-2 ring-blue-600' : ''
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isSaving}
                        className={isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>

                    <Button
                        onClick={onDownload}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Editing hint */}
            {isEditing && (
                <div className={`text-center py-2 px-4 rounded-lg text-sm ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                    💡 Click on any text in the template to edit it directly
                </div>
            )}

            {/* Template Render */}
            <div
                ref={templateRef}
                className={`transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-600 ring-offset-4 rounded-lg' : ''}`}
            >
                {renderTemplate()}
            </div>
        </div>
    )
}
