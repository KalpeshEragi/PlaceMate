// Bridge file to connect frontend with ai-engine unified rules
// This file embeds the rule data inline to avoid cross-package import issues
// The rules are synchronized with the JSON files in ai-engine/lib/rules/

// Types for the flattened format
export interface FlatATSRule {
    id: string
    description: string
    check?: string[]
    regex?: string
    min_skills?: number
    max_skills?: number
    weight: number
    category: string
    suggestion: string
    implementation?: string[]
    rationale?: string
}

export interface FlatHRRule {
    id: string
    description: string
    check: string
    weight: number
    category: string
    suggestion: string
    min_words?: number
    max_words?: number
    implementation?: string[]
    rationale?: string
}

export interface RedFlagRule {
    id: string
    description: string
    patterns?: string[]
    check?: string
    penalty: number
    suggestion: string
    max_occurrences?: number
    weak_verb_ratio?: number
    severity?: string
}

export interface JDMatchRule {
    id: string
    description: string
    check: string
    weight: number
    suggestion: string
}

export interface DomainSkill {
    ruleId: string
    skill: string
    context: string
    priority: string
    weight: number
    implementation: string[]
    variations?: string[]
    relatedSkills?: string[]
}

export interface ExperienceLevelExpectations {
    level: string
    yearsRequired: string
    criticalSkills: string[]
    niceToHave: string[]
    focusAreas: string[]
    commonMistakes: string[]
}

export interface RoleVariant {
    role: string
    focusSkills: string[]
    secondarySkills: string[]
    keyMetrics: string[]
}

export interface DomainRulesFlat {
    name: string
    description: string
    coreSkills: DomainSkill[]
    frontendSkills: DomainSkill[]
    backendSkills: DomainSkill[]
    modernSkills: DomainSkill[]
    experienceLevels: {
        entryLevel: ExperienceLevelExpectations
        midLevel: ExperienceLevelExpectations
        senior: ExperienceLevelExpectations
    }
    roleVariants: {
        frontend: RoleVariant
        backend: RoleVariant
        fullStack: RoleVariant
    }
    highValueKeywords: Array<{
        keyword: string
        priority: string
        variations: string[]
        context: string
    }>
    redFlags: Array<{
        flag: string
        severity: string
        reason: string
        solution: string
    }>
    trendingSkills: Array<{
        skill: string
        trend: string
        rationale: string
        implementation: string
    }>
    decliningSkills: Array<{
        skill: string
        status: string
        rationale: string
        recommendation: string
    }>
}

export interface UnifiedRuleset {
    ats_rules: FlatATSRule[]
    hr_rules: FlatHRRule[]
    recruiter_red_flags: RedFlagRule[]
    jd_matching_rules: JDMatchRule[]
    scoring_formula: {
        weights: { ats: number; hr: number; jd: number }
        verdict_thresholds: { pass: number; borderline: number; fail: number }
    }
    role_specific_tips: Record<string, string[]>
    domain_rules: Record<string, DomainRulesFlat>
    action_verbs: {
        leadership: string[]
        creation: string[]
        improvement: string[]
        analysis: string[]
        collaboration: string[]
    }
    metric_types: Array<{
        type: string
        examples: string[]
        priority: string
    }>
}

// ============================================================================
// EMBEDDED RULES DATA
// Synchronized from ai-engine/lib/rules/*.json
// Last updated: 2026-02-05
// ============================================================================

/**
 * ATS Rules - Comprehensive rules for ATS optimization
 * Source: ai-engine/lib/rules/ats_rules.json
 */
const atsRulesEmbedded: FlatATSRule[] = [
    // Critical - Keyword Matching
    {
        id: 'ATS-KW-001',
        description: 'Exact keyword matching from job description',
        weight: 10,
        category: 'keywords',
        suggestion: 'Mirror technical skills exactly as listed in job description. Include full technology names (not just abbreviations). Use both full terms and acronyms where applicable.',
        rationale: 'ATS relies on exact or near-exact keyword matching. Resumes without job description keywords are filtered out before human review.'
    },
    {
        id: 'ATS-KW-002',
        description: 'Include exact job titles',
        weight: 9,
        category: 'keywords',
        suggestion: 'Use target job title in professional summary. Match job title terminology in headline. Include variations if applicable.',
        rationale: 'Exact job title inclusion significantly increases interview likelihood'
    },
    {
        id: 'ATS-KW-003',
        description: 'Spell out technical terms fully',
        weight: 9,
        category: 'keywords',
        suggestion: "First mention: 'HyperText Markup Language (HTML)'. Spell out frameworks: 'React.js' not just 'React'.",
        rationale: 'Abbreviated web development terms reduce ATS scores. ATS may not recognize abbreviations.'
    },
    {
        id: 'ATS-KW-004',
        description: 'Tailor resume for each job application',
        weight: 10,
        category: 'keywords',
        suggestion: 'Extract keywords from job description. Adjust skills section to match job requirements. Modify professional summary to align with role.',
        rationale: 'Customizing resumes for each role is mandatory for ATS success. Generic resumes are rejected.'
    },
    // Critical - Format Compliance
    {
        id: 'ATS-FMT-001',
        description: 'Simple, chronological or hybrid format only',
        weight: 10,
        category: 'format',
        suggestion: 'Use single-column layout. Chronological or hybrid resume format. Avoid creative designs, graphics, images, logos. No text boxes, tables for content.',
        rationale: 'Complex elements like graphics, tables, and multi-column layouts confuse ATS parsers'
    },
    {
        id: 'ATS-FMT-002',
        description: 'Standard section headers',
        weight: 9,
        category: 'format',
        suggestion: "Use standard headers: 'Professional Summary', 'Work Experience', 'Skills', 'Education', 'Projects'. Avoid creative headers.",
        rationale: 'Clear section headings are critical for ATS parsing and content categorization'
    },
    {
        id: 'ATS-FMT-003',
        description: 'Common, legible fonts',
        weight: 9,
        category: 'format',
        suggestion: 'Use: Arial, Calibri, Times New Roman, Helvetica, Georgia. Font size: 10-12pt for body, 14-16pt for headers.',
        rationale: 'Standard fonts are essential for ATS parsing. Uncommon fonts cause text extraction failures.'
    },
    {
        id: 'ATS-FMT-004',
        description: 'File format: PDF or DOCX only',
        weight: 9,
        category: 'format',
        suggestion: 'Submit as .pdf or .docx. Ensure PDF is text-based (not scanned image). Test by copying text from PDF.',
        rationale: 'ATS rejects resumes from unsupported file formats. PDF and DOCX are universally compatible.'
    },
    // Content Structure
    {
        id: 'ATS-CNT-001',
        description: 'Dedicated skills section required',
        weight: 9,
        category: 'structure',
        suggestion: "Create clear 'Skills' or 'Technical Skills' section. List skills explicitly. Organize by category (Frontend, Backend, Tools, etc.).",
        rationale: 'ATS algorithms specifically look for skills sections. Skills buried in narrative are often missed.'
    },
    {
        id: 'ATS-CNT-002',
        description: 'Contact information in main body',
        weight: 9,
        category: 'structure',
        suggestion: 'Place name, email, phone, LinkedIn at top of main document. Avoid placing only in header/footer. Include clickable LinkedIn URL.',
        rationale: 'Contact info in headers/footers may not be parsed by ATS'
    },
    {
        id: 'ATS-CNT-004',
        description: 'Professional summary with keywords',
        weight: 8,
        category: 'structure',
        suggestion: 'Include 2-4 sentences with top keywords. Mention exact job title. Reference key technologies. Include years of experience.',
        rationale: 'ATS heavily weighs summary section for keyword matching'
    },
    // Legacy rules for backwards compatibility
    {
        id: 'ATS_01',
        description: 'Must contain core sections',
        check: ['contact', 'skills', 'experience_or_projects', 'education'],
        weight: 10,
        category: 'structure',
        suggestion: 'Add missing sections: Contact info, Skills, Experience/Projects, and Education are essential for ATS systems'
    },
    {
        id: 'ATS_02',
        description: 'Professional email required',
        regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        weight: 8,
        category: 'contact',
        suggestion: 'Use a professional email format (firstname.lastname@domain.com)'
    },
    {
        id: 'ATS_03',
        description: 'Contact information complete',
        check: ['email', 'phone', 'location'],
        weight: 7,
        category: 'contact',
        suggestion: 'Include complete contact information: email, phone, and location'
    },
    {
        id: 'ATS_05',
        description: 'Skills section has relevant keywords',
        min_skills: 5,
        max_skills: 25,
        weight: 9,
        category: 'keywords',
        suggestion: 'Include 5-25 relevant technical skills that match the job description'
    }
]

/**
 * HR Rules - Human Recruiter evaluation rules
 * Source: ai-engine/lib/rules/hr_rules.json
 */
const hrRulesEmbedded: FlatHRRule[] = [
    // Impact Quantification
    {
        id: 'HR-IMP-001',
        description: 'Quantify achievements with metrics',
        check: 'metrics_present',
        weight: 10,
        category: 'impact',
        suggestion: "Include specific percentages, numbers, or time improvements. Format: '[Action Verb] [What] resulting in [Quantified Impact]'. Examples: 'Reduced page load time by 45%'.",
        rationale: 'Recruiters prioritize candidates who demonstrate measurable impact. Generic statements lack credibility.'
    },
    {
        id: 'HR-IMP-002',
        description: 'Use strong action verbs',
        check: 'strong_verbs',
        weight: 9,
        category: 'language',
        suggestion: "Start bullets with powerful action verbs. Avoid: 'Responsible for', 'Worked on'. Use: 'Built', 'Architected', 'Optimized', 'Led'.",
        rationale: 'Action verbs demonstrate ownership and impact. Weak verbs suggest passive involvement.'
    },
    {
        id: 'HR-IMP-003',
        description: 'Demonstrate problem-solving context',
        check: 'problem_solution',
        weight: 8,
        category: 'impact',
        suggestion: "Show problem → solution → result. Format: 'Addressed [problem] by [solution], resulting in [impact]'.",
        rationale: "Recruiters want to understand the 'why' behind work, not just the 'what'"
    },
    // Portfolio Presence
    {
        id: 'HR-PORT-001',
        description: 'Include GitHub profile link',
        check: 'has_portfolio',
        weight: 9,
        category: 'credibility',
        suggestion: 'Include GitHub URL in contact section. Ensure profile has recent activity. Pin 3-5 best repositories. Include README files.',
        rationale: 'GitHub presence is critical for technical validation. Recruiters use it to verify coding ability.'
    },
    {
        id: 'HR-PORT-002',
        description: 'Portfolio projects section for junior developers',
        check: 'has_projects',
        weight: 9,
        category: 'credibility',
        suggestion: 'Include 2-4 substantial projects. Provide live demo links and GitHub repo links. Describe technology stack.',
        rationale: 'Portfolio projects are vital for candidates without extensive work experience'
    },
    // Professionalism
    {
        id: 'HR-PROF-001',
        description: 'LinkedIn profile optimization',
        check: 'professionalism_check',
        weight: 8,
        category: 'professionalism',
        suggestion: 'Include LinkedIn URL in contact section. Ensure profile is complete and updated. Profile photo (professional, current).',
        rationale: 'LinkedIn profiles are standard contact detail. Recruiters verify candidates on LinkedIn.'
    },
    {
        id: 'HR-PROF-002',
        description: 'Professional email address',
        check: 'email_professional',
        weight: 7,
        category: 'professionalism',
        suggestion: 'Format: firstname.lastname@provider.com. Avoid nicknames, numbers (unless necessary). Use: Gmail, Outlook, professional domain.',
        rationale: 'Unprofessional email addresses create negative first impression'
    },
    // Experience Presentation
    {
        id: 'HR-EXP-001',
        description: '3-5 bullet points per role',
        check: 'experience_quality',
        weight: 8,
        category: 'experience',
        suggestion: 'Entry-level: 3-4 bullets per role. Mid-level: 4-5 bullets. Senior: 5-7 bullets. Prioritize most impactful achievements first.',
        rationale: 'Too few bullets suggest minimal contribution; too many create fatigue'
    },
    {
        id: 'HR-EXP-002',
        description: 'Reverse chronological order',
        check: 'chronological',
        weight: 9,
        category: 'experience',
        suggestion: 'List most recent role first. Include dates in MM/YYYY format.',
        rationale: 'Recruiters expect most recent experience first. Non-standard order is confusing.'
    },
    // Soft Skills
    {
        id: 'HR-SOFT-001',
        description: 'Demonstrate collaboration and teamwork',
        check: 'soft_skills_present',
        weight: 8,
        category: 'soft_skills',
        suggestion: "Use collaborative action verbs: 'Collaborated', 'Partnered', 'Coordinated'. Mention cross-functional work.",
        rationale: 'Technical skills alone are insufficient. Recruiters seek team players.'
    },
    // Legacy rules
    {
        id: 'HR_01',
        description: 'Quantified impact required',
        check: 'metrics_ratio >= 0.3',
        weight: 10,
        category: 'impact',
        suggestion: "Add quantified achievements (e.g., 'Improved performance by 40%', 'Managed team of 5')"
    },
    {
        id: 'HR_02',
        description: 'Action verbs density',
        check: 'strong_verb_ratio >= 0.2',
        weight: 8,
        category: 'language',
        suggestion: 'Start bullet points with strong action verbs (Led, Architected, Optimized, Transformed)'
    },
    {
        id: 'HR_03',
        description: 'Portfolio or GitHub required for web roles',
        check: 'has_github_or_portfolio == true',
        weight: 9,
        category: 'credibility',
        suggestion: 'Add GitHub profile or portfolio website to showcase your work'
    },
    {
        id: 'HR_04',
        description: 'Skill credibility check',
        check: 'skills_match_experience',
        weight: 7,
        category: 'credibility',
        suggestion: 'Ensure listed skills are demonstrated in your experience/projects'
    },
    {
        id: 'HR_06',
        description: 'Professional summary present',
        check: 'has_summary',
        min_words: 20,
        max_words: 100,
        weight: 6,
        category: 'structure',
        suggestion: 'Add a professional summary (20-100 words) highlighting your key strengths'
    }
]

/**
 * Red Flag Rules - Immediate rejection triggers
 * Source: ai-engine/lib/rules/hr_rules.json (redFlagsToAvoid section)
 */
const redFlagsEmbedded: RedFlagRule[] = [
    {
        id: 'HR-RED-001',
        description: 'Objective statements instead of professional summary',
        penalty: -8,
        suggestion: 'Replace with professional summary highlighting skills and value proposition',
        severity: 'high'
    },
    {
        id: 'HR-RED-002',
        description: 'Generic, buzzword-heavy descriptions',
        penalty: -8,
        suggestion: 'Demonstrate these qualities through specific examples and metrics',
        severity: 'high'
    },
    {
        id: 'HR-RED-004',
        description: 'Duties-focused rather than achievement-focused',
        penalty: -9,
        suggestion: "Transform 'Responsible for X' into 'Achieved Y by doing X'",
        severity: 'high'
    },
    {
        id: 'HR-RED-006',
        description: 'Outdated or irrelevant skills prominently featured',
        penalty: -7,
        suggestion: 'Prioritize modern, in-demand skills; archive or remove obsolete technologies',
        severity: 'medium'
    },
    {
        id: 'HR-RED-009',
        description: "Pronouns ('I', 'me', 'my') in bullets",
        penalty: -5,
        suggestion: 'Start bullets with action verbs, omit pronouns',
        severity: 'low'
    },
    {
        id: 'HR-RED-010',
        description: 'Skills listed without any experience demonstrating them',
        penalty: -8,
        suggestion: 'Only list skills you\'ve actually used in projects or work experience',
        severity: 'high'
    },
    // Legacy rules
    {
        id: 'RF_01',
        description: 'Unprofessional email',
        patterns: ['dragon', 'coolboy', 'ninja', 'gamer', '420', '69', 'xxx', 'hot'],
        penalty: -10,
        suggestion: 'Use a professional email address based on your name'
    },
    {
        id: 'RF_02',
        description: 'Buzzword stuffing',
        check: 'skill_count > 30',
        penalty: -6,
        suggestion: 'Reduce skills list to most relevant 15-20 skills to avoid appearing unfocused'
    },
    {
        id: 'RF_03',
        description: 'No measurable achievements',
        check: 'metrics_count < 2',
        penalty: -8,
        suggestion: 'Add at least 2-3 achievements with measurable impact'
    },
    {
        id: 'RF_04',
        description: 'First-person pronouns overuse',
        patterns: ['I ', 'my ', 'me '],
        max_occurrences: 3,
        penalty: -4,
        suggestion: 'Remove first-person pronouns (I, my, me) for professional tone'
    },
    {
        id: 'RF_05',
        description: 'Generic job duties only',
        weak_verb_ratio: 0.5,
        penalty: -6,
        suggestion: 'Replace generic duties with specific accomplishments and outcomes'
    }
]

/**
 * JD Matching Rules
 */
const jdMatchingRulesEmbedded: JDMatchRule[] = [
    {
        id: 'JD_01',
        description: 'Required skills overlap',
        check: 'required_skill_overlap >= 0.6',
        weight: 10,
        suggestion: 'Your resume is missing key required skills'
    },
    {
        id: 'JD_02',
        description: 'Preferred skills boost',
        check: 'preferred_skill_overlap >= 0.3',
        weight: 5,
        suggestion: 'Consider adding preferred skills to strengthen your application'
    },
    {
        id: 'JD_03',
        description: 'Stack cluster match',
        check: 'stack_cluster_match == true',
        weight: 7,
        suggestion: 'Highlight experience with a recognized tech stack'
    },
    {
        id: 'JD_05',
        description: 'Role type alignment',
        check: 'role_type_match == true',
        weight: 8,
        suggestion: 'Tailor your experience descriptions to emphasize role-relevant skills'
    }
]

/**
 * Action Verbs by Category
 * Source: ai-engine/lib/rules/hr_rules.json
 */
const actionVerbsEmbedded = {
    leadership: ['Architected', 'Led', 'Mentored', 'Spearheaded', 'Directed', 'Championed'],
    creation: ['Built', 'Developed', 'Designed', 'Created', 'Engineered', 'Established'],
    improvement: ['Optimized', 'Enhanced', 'Improved', 'Streamlined', 'Refactored', 'Modernized'],
    analysis: ['Analyzed', 'Identified', 'Diagnosed', 'Evaluated', 'Assessed', 'Investigated'],
    collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Integrated', 'Aligned']
}

/**
 * Metric Type Examples
 * Source: ai-engine/lib/rules/hr_rules.json
 */
const metricTypesEmbedded = [
    {
        type: 'Performance Metrics',
        examples: ['Reduced load time by X%', 'Improved Lighthouse score from X to Y', 'Decreased response time by X seconds'],
        priority: 'very high'
    },
    {
        type: 'User Impact',
        examples: ['Increased user engagement by X%', 'Reduced bounce rate by X%', 'Boosted conversion rate by X%'],
        priority: 'high'
    },
    {
        type: 'Business Impact',
        examples: ['Generated X% increase in revenue', 'Reduced support tickets by X%', 'Saved X hours/week through automation'],
        priority: 'high'
    },
    {
        type: 'Scale/Scope',
        examples: ['Built features serving X+ users', 'Handled X+ API requests per day', 'Led team of X developers'],
        priority: 'medium'
    }
]

/**
 * Role-specific tips
 */
const roleSpecificTipsEmbedded: Record<string, string[]> = {
    frontend: [
        'Highlight responsive design and cross-browser compatibility experience',
        'Showcase UI/UX improvements with metrics (load time, user engagement)',
        'Include accessibility (a11y) experience and WCAG compliance',
        'Mention state management libraries (Redux, MobX, Zustand)'
    ],
    backend: [
        'Emphasize API design and performance optimization',
        'Include database expertise and query optimization experience',
        'Highlight security implementation (authentication, authorization)',
        'Mention experience with message queues and caching'
    ],
    fullstack: [
        'Balance frontend and backend experience equally',
        'Show end-to-end project ownership',
        'Include deployment and DevOps experience',
        'Demonstrate understanding of system architecture'
    ],
    devops: [
        'Highlight CI/CD pipeline implementation',
        'Include infrastructure as code experience',
        'Show monitoring and observability expertise',
        'Emphasize cloud platform certifications'
    ]
}

/**
 * Domain-specific rules for web development
 * Source: ai-engine/lib/rules/web-developer.json
 */
const webDevDomainRulesEmbedded: DomainRulesFlat = {
    name: 'Web Developer',
    description: 'Domain-specific rules for web development roles including Frontend, Backend, and Full-Stack positions',
    coreSkills: [
        { ruleId: 'WEB-CORE-001', skill: 'HTML', context: 'Fundamental markup language', priority: 'critical', weight: 0.95, implementation: ["List in skills section as 'HTML5' or 'HTML'"] },
        { ruleId: 'WEB-CORE-002', skill: 'CSS', context: 'Styling and responsive design', priority: 'critical', weight: 0.95, implementation: ["List in skills section as 'CSS3' or 'CSS'"] },
        { ruleId: 'WEB-CORE-003', skill: 'JavaScript', context: 'Core language for interactivity', priority: 'critical', weight: 0.95, implementation: ["List as 'JavaScript (ES6+)' or 'JavaScript'"] },
        { ruleId: 'WEB-CORE-004', skill: 'TypeScript', context: 'Type-safe JavaScript', priority: 'high', weight: 0.85, implementation: ['List prominently in skills section'] },
        { ruleId: 'WEB-CORE-005', skill: 'Responsive Design', context: 'Mobile-first compatibility', priority: 'critical', weight: 0.85, implementation: ["List as 'Responsive Design'"] },
        { ruleId: 'WEB-CORE-006', skill: 'Git', context: 'Version control', priority: 'critical', weight: 0.85, implementation: ["List as 'Git' and/or 'GitHub'"] }
    ],
    frontendSkills: [
        { ruleId: 'WEB-FE-001', skill: 'React.js', context: 'Most in-demand frontend framework', priority: 'very high', weight: 0.90, implementation: ["List as 'React.js' or 'React'"], relatedSkills: ['React Hooks', 'Redux', 'React Router'] },
        { ruleId: 'WEB-FE-002', skill: 'Next.js', context: 'React framework for production', priority: 'high', weight: 0.85, implementation: ["List as 'Next.js'"], relatedSkills: ['Server-Side Rendering', 'Static Site Generation'] },
        { ruleId: 'WEB-FE-003', skill: 'Vue.js', context: 'Progressive JavaScript framework', priority: 'high', weight: 0.80, implementation: ["List as 'Vue.js' or 'Vue'"], relatedSkills: ['Vuex', 'Vue Router'] },
        { ruleId: 'WEB-FE-005', skill: 'Tailwind CSS', context: 'Utility-first CSS framework', priority: 'high', weight: 0.80, implementation: ["List as 'Tailwind CSS'"] }
    ],
    backendSkills: [
        { ruleId: 'WEB-BE-001', skill: 'Node.js', context: 'JavaScript runtime for server-side', priority: 'very high', weight: 0.90, implementation: ["List as 'Node.js'"], relatedSkills: ['Express.js', 'Nest.js'] },
        { ruleId: 'WEB-BE-003', skill: 'Databases', context: 'Data persistence', priority: 'critical', weight: 0.90, implementation: ['List specific databases used'] },
        { ruleId: 'WEB-BE-004', skill: 'API Development', context: 'REST and GraphQL', priority: 'very high', weight: 0.85, implementation: ["List as 'REST API', 'GraphQL'"] },
        { ruleId: 'WEB-BE-005', skill: 'Cloud Platforms', context: 'AWS, Azure, GCP', priority: 'high', weight: 0.80, implementation: ["List specific platforms: 'AWS', 'Azure'"] }
    ],
    modernSkills: [
        { ruleId: 'WEB-MOD-001', skill: 'Testing', context: 'Quality assurance', priority: 'high', weight: 0.75, implementation: ["List testing frameworks: 'Jest', 'Cypress'"] },
        { ruleId: 'WEB-MOD-002', skill: 'Performance Optimization', context: 'Core Web Vitals', priority: 'high', weight: 0.80, implementation: ["Mention 'Core Web Vitals', 'Lighthouse Score'"] },
        { ruleId: 'WEB-MOD-004', skill: 'AI-Assisted Development', context: 'Modern development workflow', priority: 'medium', weight: 0.65, implementation: ["Mention 'GitHub Copilot', 'ChatGPT'"] }
    ],
    experienceLevels: {
        entryLevel: {
            level: 'Entry-Level / Junior',
            yearsRequired: '0-2 years',
            criticalSkills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Git'],
            niceToHave: ['React or Vue.js', 'Node.js basics', 'Tailwind CSS'],
            focusAreas: ['Portfolio projects (2-4 required)', 'GitHub profile with recent activity', 'Learning ability'],
            commonMistakes: ['Listing skills never used', 'Tutorial projects without customization', 'No live demos']
        },
        midLevel: {
            level: 'Mid-Level',
            yearsRequired: '3-7 years',
            criticalSkills: ['Modern framework (React, Vue, Angular)', 'Backend basics', 'Database experience', 'Testing'],
            niceToHave: ['TypeScript', 'Cloud platforms', 'CI/CD pipelines'],
            focusAreas: ['Quantified business impact', 'Strategic thinking', 'Cross-functional collaboration'],
            commonMistakes: ['Task-focused rather than impact-focused bullets', 'No metrics', 'Lack of soft skills']
        },
        senior: {
            level: 'Senior / Staff / Lead',
            yearsRequired: '7+ years',
            criticalSkills: ['Full-stack proficiency', 'System design', 'API architecture', 'Security best practices'],
            niceToHave: ['Microservices', 'Kubernetes', 'Technical leadership'],
            focusAreas: ['Technical leadership', 'System architecture decisions', 'Significant business impact'],
            commonMistakes: ['Individual contributor focus only', 'No leadership examples', 'Missing architectural thinking']
        }
    },
    roleVariants: {
        frontend: {
            role: 'Frontend Developer',
            focusSkills: ['HTML, CSS, JavaScript', 'React.js or Vue.js', 'TypeScript', 'Responsive Design'],
            secondarySkills: ['Basic backend knowledge', 'API consumption', 'State management'],
            keyMetrics: ['Page load time improvements', 'Core Web Vitals scores', 'User engagement increases']
        },
        backend: {
            role: 'Backend Developer',
            focusSkills: ['Node.js or Python', 'Databases (SQL and NoSQL)', 'API development', 'Authentication'],
            secondarySkills: ['Microservices', 'Message queues', 'Caching strategies'],
            keyMetrics: ['API response time improvements', 'System uptime', 'Request handling capacity']
        },
        fullStack: {
            role: 'Full-Stack Developer',
            focusSkills: ['HTML, CSS, JavaScript', 'React.js or Vue.js', 'Node.js or Python', 'Databases'],
            secondarySkills: ['TypeScript', 'Docker', 'Testing', 'CI/CD'],
            keyMetrics: ['End-to-end feature delivery', 'Full-stack performance', 'Deployment frequency']
        }
    },
    highValueKeywords: [
        { keyword: 'JavaScript', priority: 'critical', variations: ['JavaScript', 'JS', 'ECMAScript', 'ES6+'], context: 'Must appear in skills and experience' },
        { keyword: 'React', priority: 'very high', variations: ['React', 'React.js', 'ReactJS'], context: 'Most in-demand frontend framework' },
        { keyword: 'Node.js', priority: 'very high', variations: ['Node.js', 'Node', 'NodeJS'], context: 'Most in-demand backend technology' },
        { keyword: 'TypeScript', priority: 'high', variations: ['TypeScript', 'TS'], context: 'Emerging standard for type safety' }
    ],
    redFlags: [
        { flag: 'Listing outdated technologies prominently', severity: 'high', reason: 'Signals not current with modern development', solution: 'Prioritize modern frameworks' },
        { flag: 'No framework experience for mid-level+', severity: 'critical', reason: 'Modern web development requires framework knowledge', solution: 'Learn React, Vue, or Angular' },
        { flag: 'Web developer with no portfolio/GitHub', severity: 'high', reason: 'Portfolio expected for demonstrating work', solution: 'Create GitHub profile, upload projects' }
    ],
    trendingSkills: [
        { skill: 'AI-assisted development', trend: 'Growing rapidly', rationale: 'AI tools becoming standard', implementation: 'Mention GitHub Copilot, ChatGPT usage' },
        { skill: 'TypeScript', trend: 'Near-universal adoption', rationale: 'TypeScript emerging as standard', implementation: 'List TypeScript prominently' },
        { skill: 'Next.js', trend: 'Rapidly growing', rationale: 'Next.js becoming standard for React', implementation: 'Show Next.js projects with SSR/SSG' }
    ],
    decliningSkills: [
        { skill: 'jQuery', status: 'Legacy maintenance only', rationale: 'Modern frameworks have replaced jQuery', recommendation: "List only if maintaining legacy; don't emphasize" },
        { skill: 'AngularJS (1.x)', status: 'Obsolete', rationale: 'Replaced by Angular (2+)', recommendation: 'Replace with modern Angular or learn React/Vue' }
    ]
}

// Cache for unified ruleset
let cachedRuleset: UnifiedRuleset | null = null

/**
 * Get the complete unified ruleset
 */
export function getUnifiedRuleset(): UnifiedRuleset {
    if (cachedRuleset) {
        return cachedRuleset
    }

    cachedRuleset = {
        ats_rules: atsRulesEmbedded,
        hr_rules: hrRulesEmbedded,
        recruiter_red_flags: redFlagsEmbedded,
        jd_matching_rules: jdMatchingRulesEmbedded,
        scoring_formula: {
            weights: { ats: 0.4, hr: 0.3, jd: 0.3 },
            verdict_thresholds: { pass: 75, borderline: 55, fail: 0 }
        },
        role_specific_tips: roleSpecificTipsEmbedded,
        domain_rules: { 'web-developer': webDevDomainRulesEmbedded },
        action_verbs: actionVerbsEmbedded,
        metric_types: metricTypesEmbedded
    }

    return cachedRuleset
}

/**
 * Get rules for a specific domain
 */
export function getDomainRules(domain: string): DomainRulesFlat | null {
    const ruleset = getUnifiedRuleset()
    return ruleset.domain_rules[domain] || null
}

/**
 * Get domain-specific red flags
 */
export function getDomainRedFlags(domain: string): Array<{
    flag: string
    severity: string
    reason: string
    solution: string
}> {
    const domainRules = getDomainRules(domain)
    if (!domainRules) return []
    return domainRules.redFlags
}

/**
 * Get action verbs by category
 */
export function getActionVerbs(): UnifiedRuleset['action_verbs'] {
    return getUnifiedRuleset().action_verbs
}

/**
 * Get metric examples
 */
export function getMetricExamples(): UnifiedRuleset['metric_types'] {
    return getUnifiedRuleset().metric_types
}

/**
 * Get trending skills for a domain
 */
export function getTrendingSkills(domain: string): {
    emerging: Array<{ skill: string; trend: string; rationale: string; implementation: string }>
    declining: Array<{ skill: string; status: string; rationale: string; recommendation: string }>
} {
    const domainRules = getDomainRules(domain)
    if (!domainRules) {
        return { emerging: [], declining: [] }
    }
    return {
        emerging: domainRules.trendingSkills,
        declining: domainRules.decliningSkills
    }
}

/**
 * Clear the cached ruleset
 */
export function clearRulesetCache(): void {
    cachedRuleset = null
}
