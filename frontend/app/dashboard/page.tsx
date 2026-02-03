'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { Moon, Sun, ArrowRight, FileText, Video, Zap, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
    }
  }, [])

  if (!mounted) return null

  const toggleTheme = () => setIsDark(!isDark)

  const stats = [
    {
      label: 'Resumes Built',
      value: '3',
      subtext: 'AI-optimized versions',
      icon: FileText,
      gradient: 'from-blue-600 to-blue-400',
      bgGradient: isDark ? 'from-blue-900/30 to-blue-800/30' : 'from-blue-50 to-blue-100/50',
    },
    {
      label: 'College Feed',
      value: '428',
      subtext: 'students + live posts',
      icon: Zap,
      gradient: 'from-purple-600 to-purple-400',
      bgGradient: isDark ? 'from-purple-900/30 to-purple-800/30' : 'from-purple-50 to-purple-100/50',
    },
    {
      label: 'Interview Practice',
      value: '8',
      subtext: 'sessions with AI analysis',
      icon: Video,
      gradient: 'from-emerald-600 to-emerald-400',
      bgGradient: isDark ? 'from-emerald-900/30 to-emerald-800/30' : 'from-emerald-50 to-emerald-100/50',
    },
    {
      label: 'Your Network',
      value: '24',
      subtext: 'connections from college',
      icon: TrendingUp,
      gradient: 'from-orange-600 to-orange-400',
      bgGradient: isDark ? 'from-orange-900/30 to-orange-800/30' : 'from-orange-50 to-orange-100/50',
    },
  ]

  const features = [
    {
      title: '⚡ AI Resume Builder',
      description: 'AI-powered resume builder that analyzes job descriptions, optimizes for ATS, suggests improvements, and generates multiple resume variations. Get noticed by recruiters.',
      icon: FileText,
      href: '/dashboard/resume',
      badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      highlights: ['ATS Optimization', 'AI Content Generation', 'Job Matching', 'Real-time Feedback', 'Multiple Templates'],
    },
    {
      title: '🎬 AI Interview Coach',
      description: 'Practice interviews with advanced AI that analyzes your posture, voice tone, facial expressions, and confidence. Get detailed feedback and improvement suggestions after each session.',
      icon: Video,
      href: '/dashboard/interview',
      badge: 'AI Powered',
      badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      highlights: ['Posture Detection', 'Voice Tone Analysis', 'Expression Recognition', 'Eye Contact Tracking', 'Confidence Scoring', 'Detailed Reports'],
    },
    {
      title: '💬 College Network Feed',
      description: 'One unified feed where your college community shares everything - placement experiences, hackathon results, interview questions, company reviews, tips & tricks. Direct messaging with seniors.',
      icon: Zap,
      href: '/dashboard/feed',
      badge: 'College Focused',
      badgeColor: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      highlights: ['Real Stories', 'Interview Q&A', 'Hackathon Posts', 'Company Reviews', 'Direct Messaging', 'Admin Pinned Updates'],
    },
  ]

  const recentPosts = [
    {
      title: '✨ Got offer from Google! Here\'s how I prepared',
      author: 'Priya S. (4th Year, CSE)',
      likes: 234,
      comments: 67,
      type: 'Success Story',
      color: 'from-emerald-600 to-emerald-400',
    },
    {
      title: '🚀 HackNova 2024 - Our journey to top 10',
      author: 'Dev Club',
      likes: 156,
      comments: 45,
      type: 'Hackathon',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: '🎯 Amazon Interview Questions - DSA Focus',
      author: 'Arjun K. (3rd Year, ECE)',
      likes: 89,
      comments: 34,
      type: 'Interview Tips',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: '📍 Placement Timeline & Eligibility Criteria',
      author: 'Admin',
      likes: 567,
      comments: 123,
      type: 'Important',
      color: 'from-red-600 to-red-400',
    },
  ]

  const featureIdeas = [
    {
      icon: '📊',
      title: 'Placement Analytics',
      description: 'See which companies hired from your college, salary ranges, cutoffs, and packages. Data-driven prep.',
    },
    {
      icon: '⭐',
      title: 'Resume Reviews',
      description: 'Get your resume reviewed by seniors who got placed. Peer feedback from people who know your standards.',
    },
    {
      icon: '🤝',
      title: 'Mentorship Matching',
      description: 'Auto-match with seniors based on your goals. Structured 1-on-1 guidance for placements.',
    },
    {
      icon: '📅',
      title: 'Interview Scheduler',
      description: 'Book mock interviews with seniors. They conduct, you practice real peer-to-peer interviews.',
    },
    {
      icon: '🏆',
      title: 'Leaderboards',
      description: 'Gamified learning. Top contributors, most helpful posts, interview champions get recognition.',
    },
    {
      icon: '📁',
      title: 'Resource Library',
      description: 'Curated coding problems, interview guides, company profiles - all shared by your community.',
    },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors ${isDark ? 'bg-blue-900' : 'bg-blue-300'}`} />
        <div className={`absolute -bottom-32 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors ${isDark ? 'bg-purple-900' : 'bg-purple-300'}`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>PlacMate</h1>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>College Placement Platform</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all ${isDark
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
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome back, {user?.name || 'Student'}
              </h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {user?.college || 'Your College'} • Build resumes, ace interviews, learn from peers
              </p>
            </div>
            <div className={`inline-flex px-4 py-2 rounded-full items-center gap-2 w-fit ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium">Community Active</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden border ${isDark
                    ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    : 'bg-white/50 border-slate-200 hover:border-slate-300'
                  } hover:shadow-lg backdrop-blur-xl cursor-pointer`}
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 50}ms backwards`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </h3>
                  <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {stat.subtext}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* All Features Equal */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className={`group relative rounded-2xl p-8 transition-all duration-300 overflow-hidden border ${isDark
                      ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      : 'bg-white/50 border-slate-200 hover:border-slate-300'
                    } hover:shadow-lg cursor-pointer backdrop-blur-xl h-full flex flex-col`}
                  style={{
                    animation: `slideUp 0.5s ease-out ${(4 + index) * 50}ms backwards`,
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900' : 'from-slate-50 to-slate-100'}`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                      </div>
                      {feature.badge && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h4 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm mb-6 flex-grow ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {feature.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {feature.highlights.map((highlight, i) => (
                        <span key={i} className={`text-xs font-medium px-2 py-1 rounded-lg ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 font-medium text-blue-600 mt-auto">
                      <span className="text-sm">Get Started</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* College Feed Preview */}
        <div className={`rounded-2xl p-8 border mb-12 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'} backdrop-blur-xl`}
          style={{
            animation: `slideUp 0.5s ease-out 350ms backwards`,
          }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              🔥 Trending in College Network
            </h3>
            <Link href="/dashboard/feed" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                    : 'bg-slate-100/50 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {post.title}
                  </h4>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${post.type === 'Important' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                      post.type === 'Success Story' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                        post.type === 'Interview Tips' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                          'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                    }`}>
                    {post.type}
                  </span>
                </div>
                <div className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  By {post.author}
                </div>
                <div className={`text-xs flex items-center gap-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Ideas */}
        <div className={`rounded-2xl p-8 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'} backdrop-blur-xl`}
          style={{
            animation: `slideUp 0.5s ease-out 400ms backwards`,
          }}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles size={24} /> Upcoming Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureIdeas.map((idea, index) => (
              <div key={index} className={`p-5 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <h4 className={`font-bold mb-2 text-lg`}>{idea.icon} {idea.title}</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {idea.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

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
