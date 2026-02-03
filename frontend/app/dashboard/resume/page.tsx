'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  Plus,
  MoreVertical,
  Download,
  Copy,
  Trash2,
  Edit,
  Calendar,
  Sparkles,
  Moon,
  Sun,
  ArrowRight,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { resumeApi } from '@/lib/api/resume-api'
import { Resume } from '@/lib/types/resume-types'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateResumeDialog } from '@/components/resume/create-resume-dialog'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
    }
    loadResumes()
  }, [])

  const toggleTheme = () => setIsDark(!isDark)

  const loadResumes = async () => {
    try {
      setLoading(true)
      const data = await resumeApi.getAllResumes()
      setResumes(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load resumes',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      await resumeApi.deleteResume(id)
      setResumes(prev => prev.filter(r => r.id !== id))
      toast({
        title: 'Success',
        description: 'Resume deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resume',
        variant: 'destructive'
      })
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const newResume = await resumeApi.duplicateResume(id)
      setResumes(prev => [...prev, newResume])
      toast({
        title: 'Success',
        description: 'Resume duplicated successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate resume',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>PlacMate</h1>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Resume Builder</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                : 'bg-white hover:bg-slate-100 text-slate-700'
            } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Your Resumes
              </h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Create, manage, and optimize with AI assistance
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Resume
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-white/50 border-slate-200'
                } backdrop-blur-xl animate-pulse`}
              >
                <div className={`h-48 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className="p-6">
                  <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-3/4 mb-3`} />
                  <div className={`h-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-1/2`} />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div className={`rounded-2xl p-12 text-center border ${
            isDark
              ? 'bg-slate-900/50 border-slate-800'
              : 'bg-white/50 border-slate-200'
          } backdrop-blur-xl`}>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No Resumes Yet
            </h3>
            <p className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Create your first AI-powered resume. Our intelligent system will help you craft the perfect resume optimized for ATS.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Resume
            </Button>
          </div>
        ) : (
          /* Resume Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className={`group relative rounded-2xl p-8 transition-all duration-300 overflow-hidden border h-96 flex flex-col items-center justify-center ${
                isDark
                  ? 'bg-slate-900/50 border-dashed border-slate-700 hover:border-slate-600 hover:bg-slate-900/80'
                  : 'bg-white/50 border-dashed border-slate-300 hover:border-slate-400 hover:bg-white/70'
              } backdrop-blur-xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900' : 'from-slate-50 to-slate-100'}`} />
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Create New Resume
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Start from scratch or upload existing
                </p>
              </div>
            </button>

            {/* Resume Cards */}
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-900/20'
                    : 'bg-white/50 border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-blue-100'
                } backdrop-blur-xl`}
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 50}ms backwards`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900' : 'from-slate-50 to-slate-100'}`} />

                {/* Resume Preview */}
                <Link href={`/dashboard/resume/builder/${resume.id}`}>
                  <div className={`relative h-48 p-6 cursor-pointer overflow-hidden group-hover:opacity-75 transition-opacity`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
                    <div className="relative z-10 space-y-2">
                      <div className={`h-4 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded w-3/4`} />
                      <div className={`h-3 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded w-1/2`} />
                      <div className={`h-3 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded w-2/3`} />
                      <div className="mt-4 space-y-2">
                        <div className={`h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded`} />
                        <div className={`h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded w-5/6`} />
                        <div className={`h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-300'} rounded w-4/6`} />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Ready
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Resume Info */}
                <div className="relative z-10 p-6 flex flex-col h-full">
                  <div className="flex-1 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg line-clamp-1 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {resume.name}
                        </h3>
                        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(resume.updatedAt)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={`p-2 rounded-lg transition-all ${
                            isDark
                              ? 'hover:bg-slate-800 text-slate-400'
                              : 'hover:bg-slate-200 text-slate-600'
                          }`}>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={`${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/resume/builder/${resume.id}`} className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(resume.id)} className="cursor-pointer">
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(resume.id)}
                            className={`cursor-pointer ${isDark ? 'text-red-400' : 'text-red-600'}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/resume/builder/${resume.id}`} className="flex-1">
                      <button className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}>
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl">
          <CreateResumeDialog onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

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