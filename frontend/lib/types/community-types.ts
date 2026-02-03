// Community Types for the College Community Forum

export interface Community {
    id: string
    collegeName: string
    emailDomain: string
    memberCount: number
    isVerified: boolean
    secretCode: string
    adminId: string
    createdAt: string
}

export interface CommunityPost {
    id: string
    communityId: string
    title: string
    content: string
    type: 'interview' | 'internship' | 'hackathon' | 'referral' | 'general'
    company?: string
    role?: string
    authorId: string
    authorName: string
    likes: number
    likedBy: string[]
    commentCount: number
    createdAt: string
}

export interface PostComment {
    id: string
    postId: string
    authorId: string
    authorName: string
    content: string
    createdAt: string
}

export interface JoinRequest {
    id: string
    communityId: string
    userId: string
    userName: string
    userEmail: string
    rollNumber: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
}

export interface CommunityMembership {
    communityId: string
    communityName: string
    userId: string
    isAdmin: boolean
    joinedAt: string
}

export type PostType = CommunityPost['type']

export const POST_TYPES: { value: PostType; label: string; emoji: string }[] = [
    { value: 'interview', label: 'Interview', emoji: '🎯' },
    { value: 'internship', label: 'Internship', emoji: '💼' },
    { value: 'hackathon', label: 'Hackathon', emoji: '🚀' },
    { value: 'referral', label: 'Referral', emoji: '🤝' },
    { value: 'general', label: 'General', emoji: '💬' }
]
