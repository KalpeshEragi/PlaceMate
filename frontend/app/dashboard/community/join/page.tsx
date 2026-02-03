'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { communityApi } from '@/lib/api/community-api'
import { Community } from '@/lib/types/community-types'
import { Moon, Sun, ArrowLeft, Users, Mail, Hash, KeyRound, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function JoinCommunityPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Form state
    const [email, setEmail] = useState('')
    const [rollNumber, setRollNumber] = useState('')
    const [secretCode, setSecretCode] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [joinMethod, setJoinMethod] = useState<'code' | 'request'>('code')

    // Success states
    const [joinedCommunity, setJoinedCommunity] = useState<Community | null>(null)
    const [requestSent, setRequestSent] = useState(false)

    // For request method - select community
    const [communities, setCommunities] = useState<Community[]>([])
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true)
        }
        // Set default email from user
        if (user?.email) {
            setEmail(user.email)
        }
    }, [user])

    // Load communities for request method
    useEffect(() => {
        const loadCommunities = async () => {
            const publicCommunities = await communityApi.getPublicCommunities()
            setCommunities(publicCommunities)
        }
        loadCommunities()
    }, [])

    const toggleTheme = () => setIsDark(!isDark)

    const handleDirectJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        if (!email.trim() || !rollNumber.trim() || !secretCode.trim()) {
            setError('All fields are required')
            setSubmitting(false)
            return
        }

        const result = await communityApi.joinWithCode({
            secretCode: secretCode.trim().toUpperCase(),
            userId: user?.id || 'demo-user',
            userName: user?.name || 'Student',
            userEmail: email.trim(),
            rollNumber: rollNumber.trim()
        })

        if (result.success && result.community) {
            setJoinedCommunity(result.community)
        } else {
            setError(result.error || 'Failed to join community')
        }

        setSubmitting(false)
    }

    const handleRequestJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!selectedCommunity) {
            setError('Please select a community')
            return
        }

        if (!email.trim() || !rollNumber.trim()) {
            setError('Email and Roll Number are required')
            return
        }

        // Verify email domain matches
        const emailDomain = email.split('@')[1]
        if (emailDomain !== selectedCommunity.emailDomain) {
            setError(`Your email domain must be @${selectedCommunity.emailDomain}`)
            return
        }

        setSubmitting(true)

        const result = await communityApi.requestJoin({
            communityId: selectedCommunity.id,
            userId: user?.id || 'demo-user',
            userName: user?.name || 'Student',
            userEmail: email.trim(),
            rollNumber: rollNumber.trim()
        })

        if (result.success) {
            setRequestSent(true)
        } else {
            setError(result.error || 'Failed to send join request')
        }

        setSubmitting(false)
    }

    if (!mounted) return null

    // Success: Joined via code
    if (joinedCommunity) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-purple-900' : 'bg-purple-300'}`} />
                    <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-blue-900' : 'bg-blue-300'}`} />
                </div>

                <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
                    <div className={`max-w-md w-full rounded-2xl p-8 border text-center ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Welcome to {joinedCommunity.collegeName}! 🎉
                        </h2>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            You've successfully joined the community. Start connecting with your peers!
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/community')}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            Go to Community
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    // Success: Request sent
    if (requestSent) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-amber-900' : 'bg-amber-300'}`} />
                    <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-orange-900' : 'bg-orange-300'}`} />
                </div>

                <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
                    <div className={`max-w-md w-full rounded-2xl p-8 border text-center ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Request Sent! ⏳
                        </h2>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Your join request has been sent to the community admin. You'll be notified once approved.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/community')}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            Back to Community
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-purple-900' : 'bg-purple-300'}`} />
                <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-blue-900' : 'bg-blue-300'}`} />
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
                                <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Join Community</h1>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Connect with your college</p>
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
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Join Your College Community
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Connect with peers, share experiences, and grow together
                    </p>
                </div>

                {/* Method Toggle */}
                <div className={`flex rounded-xl p-1 mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <button
                        onClick={() => setJoinMethod('code')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${joinMethod === 'code'
                                ? 'bg-purple-600 text-white'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        🔑 Secret Code
                    </button>
                    <button
                        onClick={() => setJoinMethod('request')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${joinMethod === 'request'
                                ? 'bg-purple-600 text-white'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        📋 Request Approval
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={joinMethod === 'code' ? handleDirectJoin : handleRequestJoin}
                    className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}
                >
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Select Community (for request method) */}
                        {joinMethod === 'request' && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Select Community
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {communities.map((comm) => (
                                        <button
                                            key={comm.id}
                                            type="button"
                                            onClick={() => setSelectedCommunity(comm)}
                                            className={`w-full p-3 rounded-xl border text-left transition-colors ${selectedCommunity?.id === comm.id
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : isDark ? 'border-slate-700 bg-slate-800 hover:border-slate-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{comm.collegeName}</p>
                                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{comm.emailDomain}</p>
                                                </div>
                                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {comm.memberCount} members
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* College Email */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                College Email
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.name@college.edu"
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Roll Number */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Roll Number / Student ID
                            </label>
                            <div className="relative">
                                <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    placeholder="e.g., 21BCE1234"
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Secret Code (only for code method) */}
                        {joinMethod === 'code' && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Community Secret Code
                                </label>
                                <div className="relative">
                                    <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="text"
                                        value={secretCode}
                                        onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                                        placeholder="Enter 8-character code"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono tracking-wider ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        maxLength={8}
                                        required
                                    />
                                </div>
                                <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Get this code from your college community admin
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {joinMethod === 'code' ? 'Joining...' : 'Sending Request...'}
                                </>
                            ) : (
                                <>
                                    <Users size={18} />
                                    {joinMethod === 'code' ? 'Join Community' : 'Send Join Request'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
