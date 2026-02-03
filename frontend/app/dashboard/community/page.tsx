'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { communityApi } from '@/lib/api/community-api'
import { Community, CommunityMembership, CommunityPost, POST_TYPES } from '@/lib/types/community-types'
import {
  Moon, Sun, Search, Users, Plus, ArrowRight, Shield,
  Heart, MessageCircle, Filter, Building2, Briefcase,
  ChevronDown, X, Send
} from 'lucide-react'
import Link from 'next/link'

export default function CommunityPage() {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // State for membership check
  const [membership, setMembership] = useState<CommunityMembership | null>(null)
  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)

  // State for discovery view
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // State for member view
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
    }
  }, [])

  // Check membership and load data
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      communityApi.init()

      // Check if user is in a community
      const userMembership = await communityApi.getUserMembership(user.id || 'demo-user')
      setMembership(userMembership)

      if (userMembership) {
        // Load community and posts
        const comm = await communityApi.getCommunity(userMembership.communityId)
        setCommunity(comm)
        if (comm) {
          const communityPosts = await communityApi.getPosts(comm.id)
          setPosts(communityPosts)
        }
      } else {
        // Load public communities for discovery
        const publicCommunities = await communityApi.getPublicCommunities()
        setCommunities(publicCommunities)
      }

      setLoading(false)
    }

    if (mounted) {
      loadData()
    }
  }, [user, mounted])

  // Search communities
  useEffect(() => {
    const searchCommunities = async () => {
      if (!membership) {
        const results = await communityApi.getPublicCommunities(searchQuery)
        setCommunities(results)
      }
    }

    const debounce = setTimeout(searchCommunities, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, membership])

  // Filter posts
  useEffect(() => {
    const filterPosts = async () => {
      if (community) {
        const filtered = await communityApi.getPosts(community.id, {
          type: typeFilter !== 'all' ? typeFilter : undefined,
          company: companyFilter || undefined
        })
        setPosts(filtered)
      }
    }
    filterPosts()
  }, [typeFilter, companyFilter, community])

  const toggleTheme = () => setIsDark(!isDark)

  if (!mounted) return null

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading community...</p>
        </div>
      </div>
    )
  }

  // =============== DISCOVERY VIEW (Not in any community) ===============
  if (!membership) {
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
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Community</h1>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>College Network</p>
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
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              🏫 Join Your College Community
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Connect with peers, share placement experiences, interview tips, and grow together with your college network.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <Link
              href="/dashboard/community/join"
              className={`group relative rounded-2xl p-8 border transition-all duration-300 overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-purple-500/50' : 'bg-white/50 border-slate-200 hover:border-purple-400'} hover:shadow-xl backdrop-blur-xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Join Community</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enter your college secret code to join an existing community
                </p>
                <div className="flex items-center gap-2 text-purple-500 font-medium">
                  <span>Get Started</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/community/create"
              className={`group relative rounded-2xl p-8 border transition-all duration-300 overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50' : 'bg-white/50 border-slate-200 hover:border-emerald-400'} hover:shadow-xl backdrop-blur-xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center mb-4">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Community</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Start a new community for your college (requires admin PIN)
                </p>
                <div className="flex items-center gap-2 text-emerald-500 font-medium">
                  <span>Create Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`relative rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search communities by college name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>

          {/* Public Communities */}
          <div>
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Explore Communities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {communities.map((comm) => (
                <div
                  key={comm.id}
                  className={`rounded-xl p-6 border transition-all ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    {comm.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <Shield size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{comm.collegeName}</h4>
                  <p className={`text-sm mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{comm.emailDomain}</p>
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Users size={14} />
                    <span>{comm.memberCount} members</span>
                  </div>
                </div>
              ))}
            </div>

            {communities.length === 0 && (
              <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No communities found. Be the first to create one!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // =============== MEMBER VIEW (Inside a community) ===============
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
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {community?.collegeName}
                </h1>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {community?.memberCount} members • {community?.isVerified && '✓ Verified'}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {membership.isAdmin && (
              <Link
                href="/dashboard/community/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Create Post
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-white hover:bg-slate-100 text-slate-700'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className={`rounded-xl p-4 mb-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Filters:</span>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                All
              </button>
              {POST_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setTypeFilter(type.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === type.value
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>

            {/* Company Filter */}
            <div className={`relative rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Filter by company..."
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className={`pl-9 pr-4 py-1.5 rounded-lg bg-transparent focus:outline-none text-sm w-40 ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isDark={isDark}
              userId={user?.id || 'demo-user'}
              onClick={() => setSelectedPost(post)}
              onLike={async () => {
                const updated = await communityApi.toggleLike(post.id, user?.id || 'demo-user')
                if (updated) {
                  setPosts(posts.map(p => p.id === post.id ? updated : p))
                }
              }}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className={`text-center py-16 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No posts yet</h3>
            <p className="mb-4">Be the first to share something with your community!</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
            >
              <Plus size={18} />
              Create First Post
            </button>
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {showCreatePost && community && (
        <CreatePostModal
          isDark={isDark}
          community={community}
          user={user}
          onClose={() => setShowCreatePost(false)}
          onCreated={async () => {
            const newPosts = await communityApi.getPosts(community.id)
            setPosts(newPosts)
            setShowCreatePost(false)
          }}
        />
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          isDark={isDark}
          post={selectedPost}
          user={user}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            const updated = await communityApi.toggleLike(selectedPost.id, user?.id || 'demo-user')
            if (updated) {
              setPosts(posts.map(p => p.id === selectedPost.id ? updated : p))
              setSelectedPost(updated)
            }
          }}
        />
      )}
    </div>
  )
}

// ==================== COMPONENTS ====================

function PostCard({ post, isDark, userId, onClick, onLike }: {
  post: CommunityPost
  isDark: boolean
  userId: string
  onClick: () => void
  onLike: () => void
}) {
  const typeConfig = POST_TYPES.find(t => t.value === post.type)
  const isLiked = post.likedBy.includes(userId)

  return (
    <div
      className={`rounded-xl p-5 border transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'} hover:shadow-lg`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${post.type === 'interview' ? 'bg-blue-500/20 text-blue-500' :
            post.type === 'internship' ? 'bg-emerald-500/20 text-emerald-500' :
              post.type === 'hackathon' ? 'bg-purple-500/20 text-purple-500' :
                post.type === 'referral' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-slate-500/20 text-slate-500'
          }`}>
          {typeConfig?.emoji} {typeConfig?.label}
        </span>
      </div>

      <h4 className={`font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {post.title}
      </h4>

      {(post.company || post.role) && (
        <div className={`flex items-center gap-2 text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {post.company && (
            <span className="flex items-center gap-1">
              <Building2 size={14} /> {post.company}
            </span>
          )}
          {post.role && (
            <span className="flex items-center gap-1">
              <Briefcase size={14} /> {post.role}
            </span>
          )}
        </div>
      )}

      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          By {post.authorName}
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            {post.likes}
          </button>
          <span className={`flex items-center gap-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <MessageCircle size={16} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  )
}

function CreatePostModal({ isDark, community, user, onClose, onCreated }: {
  isDark: boolean
  community: Community
  user: any
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<CommunityPost['type']>('general')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSubmitting(true)
    await communityApi.createPost({
      communityId: community.id,
      title: title.trim(),
      content: content.trim(),
      type,
      company: company.trim() || undefined,
      role: role.trim() || undefined,
      authorId: user?.id || 'demo-user',
      authorName: user?.name || 'Anonymous'
    })
    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Post</h3>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${type === t.value
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              required
            />
          </div>

          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Company (optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Role (optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., SDE-1"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience, tips, or questions..."
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

function PostDetailModal({ isDark, post, user, onClose, onLike }: {
  isDark: boolean
  post: CommunityPost
  user: any
  onClose: () => void
  onLike: () => void
}) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const typeConfig = POST_TYPES.find(t => t.value === post.type)
  const isLiked = post.likedBy.includes(user?.id || 'demo-user')

  useEffect(() => {
    const loadComments = async () => {
      const postComments = await communityApi.getComments(post.id)
      setComments(postComments)
      setLoading(false)
    }
    loadComments()
  }, [post.id])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    const comment = await communityApi.addComment({
      postId: post.id,
      authorId: user?.id || 'demo-user',
      authorName: user?.name || 'Anonymous',
      content: newComment.trim()
    })
    setComments([...comments, comment])
    setNewComment('')
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl p-6 my-8 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${post.type === 'interview' ? 'bg-blue-500/20 text-blue-500' :
              post.type === 'internship' ? 'bg-emerald-500/20 text-emerald-500' :
                post.type === 'hackathon' ? 'bg-purple-500/20 text-purple-500' :
                  post.type === 'referral' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-slate-500/20 text-slate-500'
            }`}>
            {typeConfig?.emoji} {typeConfig?.label}
          </span>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          </button>
        </div>

        {/* Title & Meta */}
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {post.title}
        </h2>
        <div className={`flex items-center gap-4 text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <span>By {post.authorName}</span>
          {post.company && <span className="flex items-center gap-1"><Building2 size={14} /> {post.company}</span>}
          {post.role && <span className="flex items-center gap-1"><Briefcase size={14} /> {post.role}</span>}
        </div>

        {/* Content */}
        <div className={`prose max-w-none mb-6 ${isDark ? 'prose-invert' : ''}`}>
          <p className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-6 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-600 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            {post.likes} likes
          </button>
          <span className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <MessageCircle size={20} />
            {comments.length} comments
          </span>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Comments</h4>

          {loading ? (
            <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>Loading comments...</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {comment.authorName}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {comment.content}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          )}

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
