'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog'
import { FileUp, FileText, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { resumeApi } from '@/lib/api/resume-api'
import { useToast } from '@/hooks/use-toast'

interface CreateResumeDialogProps {
    onClose?: () => void
}

export function CreateResumeDialog({ onClose }: CreateResumeDialogProps) {
    const [uploading, setUploading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleCreateFromScratch = async () => {
        try {
            const resume = await resumeApi.createResume({
                name: 'New Resume',
                template: 'modern'
            })
            router.push(`/dashboard/resume/builder/${resume.id}`)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create resume',
                variant: 'destructive'
            })
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.name.match(/\.(pdf|docx)$/i)) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF or DOCX file',
                variant: 'destructive'
            })
            return
        }

        try {
            setUploading(true)
            toast({
                title: 'Uploading...',
                description: 'AI is parsing your resume'
            })

            const parsedData = await resumeApi.parseUploadedResume(file)
            const resume = await resumeApi.createResume(parsedData)

            toast({
                title: 'Success!',
                description: 'Resume parsed and created successfully'
            })

            router.push(`/dashboard/resume/builder/${resume.id}`)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to parse resume',
                variant: 'destructive'
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
                <DialogDescription>Choose how you'd like to get started</DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Create from Scratch */}
                <Card
                    className="border-2 hover:border-primary transition-all cursor-pointer group"
                    onClick={handleCreateFromScratch}
                >
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Start from Scratch</h3>
                            <p className="text-sm text-muted-foreground">
                                Build your resume step-by-step with AI-powered suggestions at every stage
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                AI Guided
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                ATS Optimized
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Resume */}
                <Card className="border-2 hover:border-primary transition-all cursor-pointer group">
                    <CardContent className="p-8 text-center space-y-4">
                        <label htmlFor="resume-upload" className="cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                <FileUp className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2 mt-4">Upload Existing Resume</h3>
                                <p className="text-sm text-muted-foreground">
                                    Import your current resume and let AI enhance and optimize it
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">
                                    PDF/DOCX
                                </span>
                                <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">
                                    AI Parsing
                                </span>
                            </div>
                        </label>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.docx"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Upload className="w-4 h-4 animate-bounce" />
                                Parsing your resume...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
