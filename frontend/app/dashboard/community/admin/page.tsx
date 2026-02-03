'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { communityApi } from '@/lib/api/community-api'
import { Community, CommunityMembership, JoinRequest } from '@/lib/types/community-types'
import {
    Moon, Sun, ArrowLeft, Shield, Users, CheckCircle, XCircle,
    Copy, Check, Mail, Hash, Clock, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    const [membership, setMembership] = useState<CommunityMembership | null>(null)
    const [community, setCommunity] = useState<Community | null>(null)
    const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true)
        }
    }, [])

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                router.push('/dashboard/community')
                return
            }

            // Check if user is admin
            const userMembership = await communityApi.getUserMembership(user.id || 'demo-user')
            if (!userMembership || !userMembership.isAdmin) {
                router.push('/dashboard/community')
                return
            }

            setMembership(userMembership)

            // Load community
            const comm = await communityApi.getCommunity(userMembership.communityId)
            setCommunity(comm)

            if (comm) {
                // Load pending requests
                const requests = await communityApi.getPendingRequests(comm.id)
                setPendingRequests(requests)
            }

            setLoading(false)
        }

        if (mounted) {
            loadData()
        }
    }, [user, mounted, router])

    const toggleTheme = () => setIsDark(!isDark)

    const copySecretCode = async () => {
        if (community?.secretCode) {
            await navigator.clipboard.writeText(community.secretCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleRequest = async (requestId: string, approve: boolean) => {
        if (!community) return

        setProcessingId(requestId)
        await communityApi.handleJoinRequest(requestId, approve, community)

        // Refresh pending requests
        const requests = await communityApi.getPendingRequests(community.id)
        setPendingRequests(requests)
        setProcessingId(null)
    }

    if (!mounted) return null

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading admin panel...</p>
                </div>
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
                                <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Panel</h1>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{community?.collegeName}</p>
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
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
                {/* Community Info Card */}
                <div className={`rounded-2xl p-6 border mb-8 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {community?.collegeName}
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {community?.memberCount} members • {community?.emailDomain}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                            <CheckCircle size={14} /> Verified
                        </span>
                    </div>

                    {/* Secret Code Section */}
                    <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Community Secret Code
                                </p>
                                <p className={`text-2xl font-mono font-bold tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {community?.secretCode}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Share this with students to let them join directly
                                </p>
                            </div>
                            <button
                                onClick={copySecretCode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${copied
                                        ? 'bg-emerald-500 text-white'
                                        : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} /> Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Pending Join Requests
                        </h3>
                        {pendingRequests.length > 0 && (
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium">
                                {pendingRequests.length} pending
                            </span>
                        )}
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No pending requests</p>
                            <p className="text-sm">New join requests will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {request.userName}
                                            </h4>
                                            <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <span className="flex items-center gap-1">
                                                    <Mail size={14} /> {request.userEmail}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Hash size={14} /> {request.rollNumber}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} /> {new Date(request.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleRequest(request.id, true)}
                                                disabled={processingId === request.id}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleRequest(request.id, false)}
                                                disabled={processingId === request.id}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                    }`}
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className={`rounded-xl p-5 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Users size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {community?.memberCount}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Total Members</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl p-5 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Clock size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {pendingRequests.length}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Pending Requests</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl p-5 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle size={20} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Active
                                </p>
                                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Community Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
