'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { communityApi } from '@/lib/api/community-api'
import { Moon, Sun, ArrowLeft, Plus, Building2, Mail, KeyRound, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateCommunityPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Form state
    const [collegeName, setCollegeName] = useState('')
    const [adminPin, setAdminPin] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [secretCode, setSecretCode] = useState('')

    // Extract email domain
    const userEmail = user?.email || 'student@example.edu'
    const emailDomain = userEmail.split('@')[1] || 'example.edu'

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true)
        }
    }, [])

    const toggleTheme = () => setIsDark(!isDark)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        if (!collegeName.trim()) {
            setError('College name is required')
            setSubmitting(false)
            return
        }

        if (!adminPin.trim()) {
            setError('College Admin PIN is required')
            setSubmitting(false)
            return
        }

        const result = await communityApi.createCommunity({
            collegeName: collegeName.trim(),
            emailDomain,
            adminPin: adminPin.trim(),
            userId: user?.id || 'demo-user',
            userName: user?.name || 'Admin'
        })

        if (result.success && result.community) {
            setSecretCode(result.community.secretCode)
            setSuccess(true)
        } else {
            setError(result.error || 'Failed to create community')
        }

        setSubmitting(false)
    }

    if (!mounted) return null

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-emerald-900' : 'bg-emerald-300'}`} />
                <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-teal-900' : 'bg-teal-300'}`} />
            </div>

            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/community" className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                                <ArrowLeft size={20} className={isDark ? 'text-white' : 'text-slate-700'} />
                            </div>
                            <div>
                                <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Community</h1>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Start your college network</p>
                            </div>
                        </Link>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2.5 rounded-lg transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-white hover:bg-slate-100 text-slate-700'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-xl mx-auto px-6 py-12">
                {success ? (
                    // Success State
                    <div className={`rounded-2xl p-8 border text-center ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Community Created! 🎉
                        </h2>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Your community has been successfully created. Share the secret code with your college peers.
                        </p>

                        <div className={`rounded-xl p-6 mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Community Secret Code
                            </p>
                            <div className={`text-3xl font-mono font-bold tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                {secretCode}
                            </div>
                            <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Students can join using this code
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/dashboard/community')}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            Go to Community
                        </button>
                    </div>
                ) : (
                    // Form State
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Create Your College Community
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Only placement cell officials or authorized admins can create communities
                            </p>
                        </div>

                        <div className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-amber-900/20 border-amber-800/50' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-start gap-3">
                                <Shield className={`w-5 h-5 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                <div>
                                    <h4 className={`font-medium mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Admin PIN Required</h4>
                                    <p className={`text-sm ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>
                                        You need a College Admin PIN provided by your placement cell to create a community.
                                        For testing, use: <code className="font-mono bg-black/10 px-1 rounded">ADMIN2024</code>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}

                            <div className="space-y-5">
                                {/* College Name */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        College Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            value={collegeName}
                                            onChange={(e) => setCollegeName(e.target.value)}
                                            placeholder="e.g., IIT Bombay"
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Domain (read-only) */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        College Email Domain
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            value={emailDomain}
                                            disabled
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'} cursor-not-allowed`}
                                        />
                                    </div>
                                    <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        Auto-extracted from your email. Only users with @{emailDomain} can join.
                                    </p>
                                </div>

                                {/* Admin PIN */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        College Admin PIN
                                    </label>
                                    <div className="relative">
                                        <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            value={adminPin}
                                            onChange={(e) => setAdminPin(e.target.value.toUpperCase())}
                                            placeholder="Enter admin PIN"
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono tracking-wider ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            required
                                        />
                                    </div>
                                    <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        This PIN is provided by your college placement cell
                                    </p>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Community
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </main>
        </div>
    )
}
