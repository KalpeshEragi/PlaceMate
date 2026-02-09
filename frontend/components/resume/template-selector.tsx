'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'

export type TemplateType = 'modern' | 'classic' | 'minimal'

interface TemplateSelectorProps {
    selectedTemplate: TemplateType
    onSelectTemplate: (template: TemplateType) => void
    isDark: boolean
}

const templates: { id: TemplateType; name: string; description: string; features: string[] }[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean, contemporary design with accent colors and modern typography',
        features: ['Colorful header', 'Two-column layout', 'Skills badges']
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional, formal resume layout preferred by corporate recruiters',
        features: ['Serif fonts', 'Conservative layout', 'Time-tested format']
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple, text-focused design that puts content first',
        features: ['Clean whitespace', 'Sans-serif fonts', 'ATS-friendly']
    }
]

export function TemplateSelector({ selectedTemplate, onSelectTemplate, isDark }: TemplateSelectorProps) {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Choose Your Template
                </h2>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Select a design that best represents your professional style
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => {
                    const isSelected = selectedTemplate === template.id
                    return (
                        <Card
                            key={template.id}
                            onClick={() => onSelectTemplate(template.id)}
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${isSelected
                                    ? 'ring-2 ring-blue-600 ring-offset-2 shadow-xl'
                                    : 'hover:shadow-lg'
                                } ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}
                        >
                            <CardContent className="p-0">
                                {/* Template Preview Thumbnail */}
                                <div className={`relative h-48 ${template.id === 'modern'
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                                        : template.id === 'classic'
                                            ? 'bg-gradient-to-br from-slate-700 to-slate-900'
                                            : 'bg-gradient-to-br from-slate-100 to-slate-300'
                                    }`}>
                                    {/* Mini Preview */}
                                    <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
                                        {template.id === 'modern' && (
                                            <div className="h-full">
                                                <div className="h-1/3 bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                                                    <div className="h-3 w-20 bg-white/50 rounded mb-1"></div>
                                                    <div className="h-2 w-32 bg-white/30 rounded"></div>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        )}
                                        {template.id === 'classic' && (
                                            <div className="h-full p-2">
                                                <div className="text-center border-b border-slate-200 pb-2 mb-2">
                                                    <div className="h-3 w-24 bg-slate-800 rounded mx-auto mb-1"></div>
                                                    <div className="h-2 w-32 bg-slate-300 rounded mx-auto"></div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="h-2 w-16 bg-slate-400 rounded"></div>
                                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        )}
                                        {template.id === 'minimal' && (
                                            <div className="h-full p-3">
                                                <div className="h-3 w-24 bg-slate-700 rounded mb-2"></div>
                                                <div className="h-2 w-full bg-slate-100 rounded mb-3"></div>
                                                <div className="space-y-1">
                                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected checkmark */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Template Info */}
                                <div className="p-4">
                                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {template.name}
                                    </h3>
                                    <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {template.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {template.features.map((feature, i) => (
                                            <span
                                                key={i}
                                                className={`text-xs px-2 py-1 rounded-full ${isDark
                                                        ? 'bg-slate-700 text-slate-300'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
