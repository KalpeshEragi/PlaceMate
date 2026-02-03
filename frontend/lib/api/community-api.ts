import {
    Community,
    CommunityPost,
    PostComment,
    JoinRequest,
    CommunityMembership
} from '@/lib/types/community-types'

// Storage keys
const COMMUNITIES_KEY = 'placemate_communities'
const POSTS_KEY = 'placemate_community_posts'
const COMMENTS_KEY = 'placemate_post_comments'
const MEMBERSHIPS_KEY = 'placemate_memberships'
const JOIN_REQUESTS_KEY = 'placemate_join_requests'

// Helper to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// Helper to generate secret code
const generateSecretCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

// Mock college PINs (in production, this would be server-side)
const VALID_COLLEGE_PINS: Record<string, string> = {
    'iitb.ac.in': 'IITB2024',
    'nitk.edu.in': 'NITK2024',
    'bits-pilani.ac.in': 'BITS2024',
    'vit.ac.in': 'VIT2024',
    'nitt.edu': 'NITT2024',
    'iitkgp.ac.in': 'IITKGP2024',
    // Default PIN for testing any domain
    'default': 'ADMIN2024'
}

// Initialize with sample communities
const initializeSampleData = () => {
    if (typeof window === 'undefined') return

    const existing = localStorage.getItem(COMMUNITIES_KEY)
    if (!existing) {
        const sampleCommunities: Community[] = [
            {
                id: 'iitb',
                collegeName: 'IIT Bombay',
                emailDomain: 'iitb.ac.in',
                memberCount: 428,
                isVerified: true,
                secretCode: 'IITB8XK2',
                adminId: 'admin1',
                createdAt: new Date().toISOString()
            },
            {
                id: 'nitk',
                collegeName: 'NIT Karnataka',
                emailDomain: 'nitk.edu.in',
                memberCount: 312,
                isVerified: true,
                secretCode: 'NITK4PQ9',
                adminId: 'admin2',
                createdAt: new Date().toISOString()
            },
            {
                id: 'bits',
                collegeName: 'BITS Pilani',
                emailDomain: 'bits-pilani.ac.in',
                memberCount: 567,
                isVerified: true,
                secretCode: 'BITS7MN3',
                adminId: 'admin3',
                createdAt: new Date().toISOString()
            },
            {
                id: 'vit',
                collegeName: 'VIT Vellore',
                emailDomain: 'vit.ac.in',
                memberCount: 892,
                isVerified: true,
                secretCode: 'VIT5XYZ1',
                adminId: 'admin4',
                createdAt: new Date().toISOString()
            }
        ]
        localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(sampleCommunities))
    }
}

export const communityApi = {
    // Initialize sample data
    init() {
        initializeSampleData()
    },

    // Get all public communities (for discovery)
    async getPublicCommunities(search?: string): Promise<Community[]> {
        await new Promise(r => setTimeout(r, 200))
        if (typeof window === 'undefined') return []

        initializeSampleData()
        const stored = localStorage.getItem(COMMUNITIES_KEY)
        let communities: Community[] = stored ? JSON.parse(stored) : []

        if (search) {
            const lowerSearch = search.toLowerCase()
            communities = communities.filter(c =>
                c.collegeName.toLowerCase().includes(lowerSearch) ||
                c.emailDomain.toLowerCase().includes(lowerSearch)
            )
        }

        return communities
    },

    // Get single community by ID
    async getCommunity(id: string): Promise<Community | null> {
        await new Promise(r => setTimeout(r, 100))
        const communities = await this.getPublicCommunities()
        return communities.find(c => c.id === id) || null
    },

    // Get community by email domain
    async getCommunityByDomain(domain: string): Promise<Community | null> {
        const communities = await this.getPublicCommunities()
        return communities.find(c => c.emailDomain === domain) || null
    },

    // Create new community
    async createCommunity(data: {
        collegeName: string
        emailDomain: string
        adminPin: string
        userId: string
        userName: string
    }): Promise<{ success: boolean; community?: Community; error?: string }> {
        await new Promise(r => setTimeout(r, 300))

        // Verify PIN
        const validPin = VALID_COLLEGE_PINS[data.emailDomain] || VALID_COLLEGE_PINS.default
        if (data.adminPin !== validPin) {
            return { success: false, error: 'Invalid College Admin PIN' }
        }

        // Check if community already exists for this domain
        const existing = await this.getCommunityByDomain(data.emailDomain)
        if (existing) {
            return { success: false, error: 'A community already exists for this college domain' }
        }

        // Create community
        const community: Community = {
            id: generateId(),
            collegeName: data.collegeName,
            emailDomain: data.emailDomain,
            memberCount: 1,
            isVerified: true,
            secretCode: generateSecretCode(),
            adminId: data.userId,
            createdAt: new Date().toISOString()
        }

        // Save community
        const communities = await this.getPublicCommunities()
        communities.push(community)
        localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities))

        // Add membership for admin
        await this.addMembership({
            communityId: community.id,
            communityName: community.collegeName,
            userId: data.userId,
            isAdmin: true,
            joinedAt: new Date().toISOString()
        })

        return { success: true, community }
    },

    // Get user's membership
    async getUserMembership(userId: string): Promise<CommunityMembership | null> {
        await new Promise(r => setTimeout(r, 100))
        if (typeof window === 'undefined') return null

        const stored = localStorage.getItem(MEMBERSHIPS_KEY)
        const memberships: CommunityMembership[] = stored ? JSON.parse(stored) : []
        return memberships.find(m => m.userId === userId) || null
    },

    // Add membership
    async addMembership(membership: CommunityMembership): Promise<void> {
        const stored = localStorage.getItem(MEMBERSHIPS_KEY)
        const memberships: CommunityMembership[] = stored ? JSON.parse(stored) : []
        memberships.push(membership)
        localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(memberships))
    },

    // Join community with secret code (direct join)
    async joinWithCode(data: {
        secretCode: string
        userId: string
        userName: string
        userEmail: string
        rollNumber: string
    }): Promise<{ success: boolean; community?: Community; error?: string }> {
        await new Promise(r => setTimeout(r, 300))

        // Normalize the secret code (uppercase, trimmed)
        const normalizedCode = data.secretCode.trim().toUpperCase()

        // Find community by secret code (case-insensitive)
        const communities = await this.getPublicCommunities()
        const community = communities.find(c =>
            c.secretCode.trim().toUpperCase() === normalizedCode
        )

        if (!community) {
            console.log('Available communities:', communities.map(c => ({ name: c.collegeName, code: c.secretCode })))
            console.log('Tried code:', normalizedCode)
            return { success: false, error: `Invalid secret code. Please check the code and try again.` }
        }

        // Check if already a member FIRST (before email domain check)
        const existing = await this.getUserMembership(data.userId)
        if (existing) {
            return { success: false, error: 'You are already a member of a community' }
        }

        // Verify email domain
        const emailDomain = data.userEmail.split('@')[1]?.toLowerCase()
        const communityDomain = community.emailDomain.toLowerCase()
        if (emailDomain !== communityDomain) {
            return { success: false, error: `Your email domain (@${emailDomain}) does not match this community (@${communityDomain})` }
        }

        // Add membership
        await this.addMembership({
            communityId: community.id,
            communityName: community.collegeName,
            userId: data.userId,
            isAdmin: false,
            joinedAt: new Date().toISOString()
        })

        // Update member count
        community.memberCount++
        localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities))

        return { success: true, community }
    },

    // Request to join (needs admin approval)
    async requestJoin(data: {
        communityId: string
        userId: string
        userName: string
        userEmail: string
        rollNumber: string
    }): Promise<{ success: boolean; error?: string }> {
        await new Promise(r => setTimeout(r, 200))

        const stored = localStorage.getItem(JOIN_REQUESTS_KEY)
        const requests: JoinRequest[] = stored ? JSON.parse(stored) : []

        // Check for existing request
        const existing = requests.find(r =>
            r.communityId === data.communityId &&
            r.userId === data.userId &&
            r.status === 'pending'
        )
        if (existing) {
            return { success: false, error: 'You already have a pending request' }
        }

        const request: JoinRequest = {
            id: generateId(),
            communityId: data.communityId,
            userId: data.userId,
            userName: data.userName,
            userEmail: data.userEmail,
            rollNumber: data.rollNumber,
            status: 'pending',
            createdAt: new Date().toISOString()
        }

        requests.push(request)
        localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests))

        return { success: true }
    },

    // Get pending join requests (for admin)
    async getPendingRequests(communityId: string): Promise<JoinRequest[]> {
        await new Promise(r => setTimeout(r, 100))
        const stored = localStorage.getItem(JOIN_REQUESTS_KEY)
        const requests: JoinRequest[] = stored ? JSON.parse(stored) : []
        return requests.filter(r => r.communityId === communityId && r.status === 'pending')
    },

    // Approve/reject join request
    async handleJoinRequest(requestId: string, approve: boolean, community: Community): Promise<void> {
        await new Promise(r => setTimeout(r, 200))

        const stored = localStorage.getItem(JOIN_REQUESTS_KEY)
        const requests: JoinRequest[] = stored ? JSON.parse(stored) : []
        const request = requests.find(r => r.id === requestId)

        if (!request) return

        request.status = approve ? 'approved' : 'rejected'
        localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests))

        if (approve) {
            // Add membership
            await this.addMembership({
                communityId: community.id,
                communityName: community.collegeName,
                userId: request.userId,
                isAdmin: false,
                joinedAt: new Date().toISOString()
            })

            // Update member count
            const communities = await this.getPublicCommunities()
            const comm = communities.find(c => c.id === community.id)
            if (comm) {
                comm.memberCount++
                localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities))
            }
        }
    },

    // ==================== POSTS ====================

    // Get posts for a community
    async getPosts(communityId: string, filters?: {
        type?: string
        company?: string
    }): Promise<CommunityPost[]> {
        await new Promise(r => setTimeout(r, 150))

        const stored = localStorage.getItem(POSTS_KEY)
        let posts: CommunityPost[] = stored ? JSON.parse(stored) : []

        posts = posts.filter(p => p.communityId === communityId)

        if (filters?.type && filters.type !== 'all') {
            posts = posts.filter(p => p.type === filters.type)
        }
        if (filters?.company) {
            posts = posts.filter(p =>
                p.company?.toLowerCase().includes(filters.company!.toLowerCase())
            )
        }

        // Sort by date descending
        return posts.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    },

    // Create a post
    async createPost(data: {
        communityId: string
        title: string
        content: string
        type: CommunityPost['type']
        company?: string
        role?: string
        authorId: string
        authorName: string
    }): Promise<CommunityPost> {
        await new Promise(r => setTimeout(r, 200))

        const post: CommunityPost = {
            id: generateId(),
            communityId: data.communityId,
            title: data.title,
            content: data.content,
            type: data.type,
            company: data.company,
            role: data.role,
            authorId: data.authorId,
            authorName: data.authorName,
            likes: 0,
            likedBy: [],
            commentCount: 0,
            createdAt: new Date().toISOString()
        }

        const stored = localStorage.getItem(POSTS_KEY)
        const posts: CommunityPost[] = stored ? JSON.parse(stored) : []
        posts.push(post)
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts))

        return post
    },

    // Get single post
    async getPost(postId: string): Promise<CommunityPost | null> {
        const stored = localStorage.getItem(POSTS_KEY)
        const posts: CommunityPost[] = stored ? JSON.parse(stored) : []
        return posts.find(p => p.id === postId) || null
    },

    // Toggle like on a post
    async toggleLike(postId: string, userId: string): Promise<CommunityPost | null> {
        await new Promise(r => setTimeout(r, 100))

        const stored = localStorage.getItem(POSTS_KEY)
        const posts: CommunityPost[] = stored ? JSON.parse(stored) : []
        const post = posts.find(p => p.id === postId)

        if (!post) return null

        const likedIndex = post.likedBy.indexOf(userId)
        if (likedIndex === -1) {
            post.likedBy.push(userId)
            post.likes++
        } else {
            post.likedBy.splice(likedIndex, 1)
            post.likes--
        }

        localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
        return post
    },

    // ==================== COMMENTS ====================

    // Get comments for a post
    async getComments(postId: string): Promise<PostComment[]> {
        await new Promise(r => setTimeout(r, 100))

        const stored = localStorage.getItem(COMMENTS_KEY)
        const comments: PostComment[] = stored ? JSON.parse(stored) : []

        return comments
            .filter(c => c.postId === postId)
            .sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
    },

    // Add a comment
    async addComment(data: {
        postId: string
        authorId: string
        authorName: string
        content: string
    }): Promise<PostComment> {
        await new Promise(r => setTimeout(r, 150))

        const comment: PostComment = {
            id: generateId(),
            postId: data.postId,
            authorId: data.authorId,
            authorName: data.authorName,
            content: data.content,
            createdAt: new Date().toISOString()
        }

        const stored = localStorage.getItem(COMMENTS_KEY)
        const comments: PostComment[] = stored ? JSON.parse(stored) : []
        comments.push(comment)
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))

        // Update post comment count
        const postsStored = localStorage.getItem(POSTS_KEY)
        const posts: CommunityPost[] = postsStored ? JSON.parse(postsStored) : []
        const post = posts.find(p => p.id === data.postId)
        if (post) {
            post.commentCount++
            localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
        }

        return comment
    }
}
